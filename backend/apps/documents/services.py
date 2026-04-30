from __future__ import annotations
from typing import Any, List, Optional
from django.db import transaction
from django.utils import timezone
from apps.documents.models import DemandeDocument, StatutDemande, PieceJustificative
from apps.blockchain.services import NaissanceChainService
from apps.common.exceptions import ProfileIncompleteError
from utils.generators import generer_reference_demande


def creer_demande(
    citoyen_id: int,
    type_document: str,
    pieces_data: List[Any]
) -> DemandeDocument:
    """
    Crée une nouvelle demande de document pour un citoyen.
    
    Cette fonction orchestre la création initiale de la demande, l'attachement
    des pièces justificatives et le déclenchement du pipeline de traitement.
    
    Args:
        citoyen_id (int): L'ID de l'utilisateur (CitoyenUser) faisant la demande.
        type_document (str): Le code du type de document (ex: 'CNI', 'PASSEPORT').
        pieces_data (List[Any]): Liste des fichiers (fichiers uploadés via DRF).
        
    Returns:
        DemandeDocument: L'instance de la demande créée avec succès.
        
    Raises:
        ProfileIncompleteError: Si le citoyen n'a pas rempli tous les champs requis.
    """
    from apps.accounts.models import CitoyenUser

    # 1. Récupération du citoyen (fail early)
    citoyen = CitoyenUser.objects.get(pk=citoyen_id)

    # 2. Vérification métier : Le profil doit être complet (Règle de validation centrale)
    if not citoyen.profil_complet:
        raise ProfileIncompleteError()

    # 3. Transaction atomique pour garantir l'intégrité des données
    with transaction.atomic():
        # Création de l'entité principale
        demande = DemandeDocument.objects.create(
            citoyen=citoyen,
            type_document=type_document,
            reference=generer_reference_demande(),
        )
        
        # Attachement des fichiers justificatifs
        _attacher_pieces_justificatives(demande, pieces_data)

    # 4. Déclenchement du pipeline de traitement asynchrone (Haut Niveau)
    # L'utilisation de .delay() délègue l'exécution à un worker Celery.
    # Cela permet de rendre la main instantanément à l'utilisateur.
    from apps.documents.tasks import pipeline_traitement_document_task
    pipeline_traitement_document_task.delay(demande.id)

    return demande


def traiter_demande_automatiquement(demande_id: int) -> None:
    """
    Orchestre le cycle de vie complet de validation et génération du document.
    
    Le pipeline suit les étapes suivantes :
    1. Validation via NaissanceChain (croisement de données).
    2. Signature cryptographique du document.
    3. Passage au statut 'PRET' pour le citoyen.
    
    Args:
        demande_id (int): L'ID de la demande à traiter.
    """
    # Récupération optimisée avec select_related pour éviter le N+1 sur le citoyen
    demande = (
        DemandeDocument.objects
        .select_related("citoyen")
        .get(pk=demande_id)
    )

    # --- ÉTAPE 1 : Validation Blockchain ---
    _mettre_a_jour_statut(demande, StatutDemande.VERIFICATION_EN_COURS)
    
    # Appel au service blockchain pour enregistrer l'empreinte de la demande
    tx_hash = NaissanceChainService.enregistrer(demande)
    demande.blockchain_tx_hash = tx_hash

    # --- ÉTAPE 2 : Signature Cryptographique ---
    _mettre_a_jour_statut(demande, StatutDemande.SIGNATURE)
    
    # Simulation de signature (Phase 1) - Sera remplacée par une signature HMAC réelle
    NaissanceChainService.signer_document(demande)

    # --- ÉTAPE 3 : Finalisation & Génération PDF ---
    _mettre_a_jour_statut(demande, StatutDemande.PRET)
    
    # Génération physique du document PDF certifié
    from apps.documents.generators import DocumentGenerator
    from django.core.files.base import ContentFile
    
    pdf_content = DocumentGenerator.generer_pdf(demande)
    
    # Enregistrement du fichier PDF dans le champ FileField du modèle
    # Le nom du fichier est basé sur la référence unique pour une traçabilité parfaite.
    filename = f"CERT_{demande.reference}.pdf"
    demande.document_genere.save(filename, ContentFile(pdf_content), save=False)
    
    # Enregistrement de la date de fin de traitement
    demande.completed_at = timezone.now()
    demande.save(update_fields=["completed_at", "blockchain_tx_hash", "document_genere"])


def _mettre_a_jour_statut(demande: DemandeDocument, nouveau_statut: str) -> None:
    """Met à jour le statut d'une demande de manière atomique."""
    demande.statut = nouveau_statut
    demande.save(update_fields=["statut", "updated_at"])


def _attacher_pieces_justificatives(demande: DemandeDocument, pieces_data: List[Any]) -> None:
    """
    Crée les enregistrements pour les fichiers uploadés associés à une demande.
    Utilise bulk_create pour minimiser les requêtes SQL.
    """
    PieceJustificative.objects.bulk_create([
        PieceJustificative(
            demande=demande,
            fichier=piece,
            nom_original=piece.name
        )
        for piece in pieces_data
    ])
