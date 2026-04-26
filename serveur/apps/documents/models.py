from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
import uuid
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


class DemandeManager(models.Manager):
    """Manager custom pour les querysets de demandes."""

    def avec_citoyen(self) -> models.QuerySet:
        """Précharge le citoyen associé via select_related."""
        return self.select_related("citoyen")

    def en_cours(self) -> models.QuerySet:
        """Retourne les demandes non finalisées."""
        return self.exclude(
            statut__in=[StatutDemande.PRET, StatutDemande.REJETE]
        )


class DemandeDocument(models.Model):
    """
    Représente une demande de document officiel par un citoyen guinéen.
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

    objects = DemandeManager()

    class Meta:
        verbose_name = _("Demande de document")
        verbose_name_plural = _("Demandes de documents")
        ordering = ["-created_at"]

    @property
    def duree_traitement(self):
        """Calcule la durée entre création et complétion."""
        if self.completed_at and self.created_at:
            return self.completed_at - self.created_at
        return None

    @property
    def est_verifiable(self) -> bool:
        """Vrai si le document possède un hash blockchain valide."""
        return bool(self.blockchain_tx_hash and self.statut == StatutDemande.PRET)

    @property
    def est_pret(self) -> bool:
        """Vrai si le document est prêt au téléchargement."""
        return self.statut == StatutDemande.PRET

    def __str__(self) -> str:
        return f"{self.reference} — {self.get_type_document_display()}"


class PieceJustificative(models.Model):
    """Fichier justificatif uploadé associé à une demande."""
    FORMATS_ACCEPTES = ["application/pdf", "image/jpeg", "image/png"]

    demande = models.ForeignKey(
        DemandeDocument, on_delete=models.CASCADE,
        related_name="pieces_justificatives"
    )
    fichier = models.FileField(upload_to="documents/pieces/%Y/%m/")
    nom_original = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Pièce justificative")
        ordering = ["uploaded_at"]
