from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
import uuid
from typing import Optional
from apps.accounts.models import CitoyenUser


class TypeDocument(models.TextChoices):
    CNI            = "CNI",            _("Carte Nationale d'Identité")
    EXTRAIT_NAIS   = "EXTRAIT_NAIS",   _("Extrait de Naissance")
    PASSEPORT      = "PASSEPORT",      _("Passeport")
    CERT_RESIDENCE = "CERT_RESIDENCE", _("Certificat de Résidence")


class StatutDemande(models.TextChoices):
    RECUE                 = "RECUE",        _("Demande reçue")
    VERIFICATION_EN_COURS = "VERIFICATION", _("Vérification NaissanceChain")
    SIGNATURE             = "SIGNATURE",    _("Signature cryptographique")
    PRET                  = "PRET",         _("Prêt au téléchargement")
    REJETE                = "REJETE",       _("Rejeté")


from apps.documents.managers import DemandeManager

class DemandeDocument(models.Model):
    """
    Entité centrale représentant une demande de document officiel.
    
    Cette classe gère le cycle de vie d'une demande, depuis sa réception
    jusqu'à sa certification finale (génération PDF et ancrage blockchain).
    
    Attributes:
        reference (str): Identifiant unique lisible (ex: REQ-2026-0001).
        citoyen (CitoyenUser): Le citoyen propriétaire de la demande.
        type_document (str): Le type de document demandé (CNI, Passeport, etc.).
        statut (str): État actuel de la demande (RECUE, SIGNATURE, PRET, etc.).
        blockchain_tx_hash (str): Empreinte immuable stockée sur NaissanceChain.
        document_genere (FileField): Le fichier PDF certifié final.
        qr_code_token (UUID): Jeton unique pour la vérification publique par QR Code.
    """
    reference = models.CharField(
        max_length=25, unique=True, editable=False,
        verbose_name=_("Référence")
    )
    citoyen = models.ForeignKey(
        CitoyenUser, on_delete=models.PROTECT,
        related_name="demandes",
        verbose_name=_("Citoyen")
    )
    type_document = models.CharField(
        max_length=20, choices=TypeDocument.choices,
        verbose_name=_("Type de document")
    )
    statut = models.CharField(
        max_length=20, choices=StatutDemande.choices,
        default=StatutDemande.RECUE,
        verbose_name=_("Statut")
    )
    blockchain_tx_hash = models.CharField(
        max_length=100, blank=True,
        verbose_name=_("Hash transaction blockchain")
    )
    blockchain_network = models.CharField(
        max_length=50, default="NaissanceChain",
        verbose_name=_("Réseau blockchain")
    )
    document_genere = models.FileField(
        upload_to="documents/certifies/%Y/%m/",
        null=True, blank=True,
        verbose_name=_("Document certifié")
    )
    qr_code_token = models.UUIDField(
        default=uuid.uuid4, unique=True, editable=False,
        verbose_name=_("Token QR code")
    )
    motif_rejet = models.TextField(
        blank=True, verbose_name=_("Motif de rejet")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(
        null=True, blank=True,
        verbose_name=_("Complété le")
    )

    # Association du manager personnalisé pour optimiser les performances
    objects = DemandeManager()

    class Meta:
        verbose_name = _("Demande de document")
        verbose_name_plural = _("Demandes de documents")
        ordering = ["-created_at"]

    @property
    def duree_traitement(self) -> Optional[timezone.timedelta]:
        """
        Calcule le temps écoulé entre la soumission et la certification.
        
        Returns:
            Optional[timedelta]: Durée de traitement ou None si non complété.
        """
        if self.completed_at and self.created_at:
            return self.completed_at - self.created_at
        return None

    @property
    def est_verifiable(self) -> bool:
        """
        Vérifie si le document possède les éléments nécessaires à une preuve blockchain.
        """
        return bool(self.blockchain_tx_hash and self.statut == StatutDemande.PRET)

    @property
    def est_pret(self) -> bool:
        """Indique si le citoyen peut télécharger son document."""
        return self.statut == StatutDemande.PRET

    def __str__(self) -> str:
        return f"{self.reference} — {self.get_type_document_display()}"


class PieceJustificative(models.Model):
    """
    Représente un fichier justificatif (scan d'acte, photo) lié à une demande.
    
    Attributes:
        demande (DemandeDocument): La demande parente.
        fichier (FileField): Le fichier physique stocké sur le serveur/cloud.
        nom_original (str): Le nom original du fichier lors de l'upload.
    """
    FORMATS_ACCEPTES = ["application/pdf", "image/jpeg", "image/png"]

    demande = models.ForeignKey(
        DemandeDocument, on_delete=models.CASCADE,
        related_name="pieces_justificatives"
    )
    fichier = models.FileField(
        upload_to="documents/pieces/%Y/%m/",
        verbose_name=_("Fichier")
    )
    nom_original = models.CharField(
        max_length=255, 
        verbose_name=_("Nom original")
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Pièce justificative")
        verbose_name_plural = _("Pièces justificatives")
        ordering = ["uploaded_at"]
