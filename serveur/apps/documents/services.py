from __future__ import annotations
from typing import Any
from django.db import transaction
from django.utils import timezone
from apps.documents.models import DemandeDocument, StatutDemande, PieceJustificative
from apps.blockchain.services import NaissanceChainService
from utils.generators import generer_reference_demande


def creer_demande(
    citoyen_id: int,
    type_document: str,
    pieces_data: list[Any]
) -> DemandeDocument:
    """
    Crée une demande de document et déclenche le pipeline automatisé.
    """
    from apps.accounts.models import CitoyenUser

    citoyen = CitoyenUser.objects.get(pk=citoyen_id)

    if not citoyen.profil_complet:
        raise ValueError(
            "Le profil citoyen doit être complet avant de soumettre une demande."
        )

    with transaction.atomic():
        demande = DemandeDocument.objects.create(
            citoyen=citoyen,
            type_document=type_document,
            reference=generer_reference_demande(),
        )
        _attacher_pieces_justificatives(demande, pieces_data)

    # TODO: Déclencher Celery ici : pipeline_traitement_document.delay(demande.pk)
    # Pour l'instant on peut appeler en synchrone pour tester le flux de base
    traiter_demande_automatiquement(demande.id)

    return demande


def traiter_demande_automatiquement(demande_id: int) -> None:
    """
    Orchestre le pipeline complet de traitement d'une demande.
    """
    demande = (
        DemandeDocument.objects
        .select_related("citoyen")
        .get(pk=demande_id)
    )

    # 1. Vérification NaissanceChain
    _mettre_a_jour_statut(demande, StatutDemande.VERIFICATION_EN_COURS)
    tx_hash = NaissanceChainService.enregistrer(demande)
    demande.blockchain_tx_hash = tx_hash

    # 2. Signature
    _mettre_a_jour_statut(demande, StatutDemande.SIGNATURE)
    signature = NaissanceChainService.signer_document(demande)

    # 3. Finalisation (Dans le futur : Génération PDF ici)
    _mettre_a_jour_statut(demande, StatutDemande.PRET)
    demande.completed_at = timezone.now()
    demande.save(update_fields=["completed_at", "blockchain_tx_hash"])


def _mettre_a_jour_statut(demande: DemandeDocument, nouveau_statut: str) -> None:
    demande.statut = nouveau_statut
    demande.save(update_fields=["statut", "updated_at"])


def _attacher_pieces_justificatives(demande: DemandeDocument, pieces_data: list[Any]) -> None:
    PieceJustificative.objects.bulk_create([
        PieceJustificative(
            demande=demande,
            fichier=piece,
            nom_original=piece.name
        )
        for piece in pieces_data
    ])
