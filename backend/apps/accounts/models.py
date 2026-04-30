from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid


class CitoyenManager(UserManager):
    """Manager custom pour les querysets citoyens fréquents."""

    def avec_demandes(self) -> models.QuerySet:
        """
        Retourne les citoyens avec leurs demandes préchargées.
        Applique prefetch_related pour éviter le N+1.
        """
        return self.prefetch_related("demandes")

    def verifies(self) -> models.QuerySet:
        """Retourne uniquement les citoyens vérifiés NaissanceChain."""
        return self.filter(est_verifie_naissancechain=True)


class CitoyenUser(AbstractUser):
    """
    Modèle utilisateur étendu représentant un citoyen guinéen.
    Remplace le User Django standard via AUTH_USER_MODEL.

    Attributes:
        numero_citoyen: Identifiant unique national auto-généré (UUID tronqué).
        date_naissance: Date de naissance du citoyen.
        lieu_naissance: Ville/région de naissance.
        numero_registre_naissance: Clé de croisement avec NaissanceChain.
        telephone: Numéro de téléphone guinéen.
        est_verifie_naissancechain: True si croisement NaissanceChain réussi.
        created_at: Horodatage de création du compte.
        updated_at: Horodatage de dernière modification.
    """

    GENRE_CHOICES = [
        ('M', _('Masculin')),
        ('F', _('Féminin')),
    ]

    numero_citoyen = models.CharField(
        max_length=20, unique=True, editable=False,
        verbose_name=_("Numéro citoyen")
    )
    nin = models.CharField(
        max_length=15, unique=True, null=True, blank=True,
        verbose_name=_("NIN (Numéro d'Identification National)")
    )
    genre = models.CharField(
        max_length=1, choices=GENRE_CHOICES, blank=True,
        verbose_name=_("Genre")
    )
    taille = models.DecimalField(
        max_digits=3, decimal_places=2, null=True, blank=True,
        verbose_name=_("Taille (m)")
    )
    
    # Filiation
    pere_nom_complet = models.CharField(
        max_length=255, blank=True, verbose_name=_("Nom complet du père")
    )
    mere_nom_complet = models.CharField(
        max_length=255, blank=True, verbose_name=_("Nom complet de la mère")
    )

    # Localisation détaillée
    adresse = models.TextField(blank=True, verbose_name=_("Adresse de domicile"))
    region = models.CharField(max_length=100, blank=True, verbose_name=_("Région"))
    prefecture = models.CharField(max_length=100, blank=True, verbose_name=_("Préfecture"))
    commune = models.CharField(max_length=100, blank=True, verbose_name=_("Commune / Sous-préfecture"))
    quartier = models.CharField(max_length=100, blank=True, verbose_name=_("Quartier / District"))
    secteur = models.CharField(max_length=100, blank=True, verbose_name=_("Secteur / Village"))
    
    profession = models.CharField(
        max_length=100, blank=True, verbose_name=_("Profession")
    )
    photo = models.ImageField(
        upload_to="citoyens/photos/", null=True, blank=True,
        verbose_name=_("Photo d'identité")
    )

    date_naissance = models.DateField(
        null=True, blank=True,
        verbose_name=_("Date de naissance")
    )
    lieu_naissance = models.CharField(
        max_length=100, blank=True,
        verbose_name=_("Lieu de naissance")
    )
    numero_registre_naissance = models.CharField(
        max_length=50, unique=True, null=True, blank=True,
        verbose_name=_("Numéro registre de naissance")
    )
    telephone = models.CharField(
        max_length=15, blank=True,
        verbose_name=_("Téléphone")
    )
    est_verifie_naissancechain = models.BooleanField(
        default=False,
        verbose_name=_("Vérifié NaissanceChain")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CitoyenManager()

    email = models.EmailField(_("email address"), unique=True)
    username = models.CharField(
        _("username"),
        max_length=150,
        unique=True,
        help_text=_("Optionnel. 150 caractères ou moins."),
        blank=True,
        null=True
    )
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "username", 
        "first_name", 
        "last_name", 
        "date_naissance", 
        "lieu_naissance", 
        "numero_registre_naissance"
    ]

    class Meta:
        verbose_name = _("Citoyen")
        verbose_name_plural = _("Citoyens")
        ordering = ["-created_at"]

    @property
    def nom_complet(self) -> str:
        """Retourne le prénom et le nom formatés en titre."""
        return f"{self.first_name} {self.last_name}".strip().title()

    @property
    def profil_complet(self) -> bool:
        """
        Vérifie que tous les champs obligatoires sont renseignés
        avant de permettre une demande de document.
        """
        champs_requis = [
            self.first_name, self.last_name,
            self.date_naissance, self.lieu_naissance,
            self.numero_registre_naissance,
            self.nin, self.genre, self.taille,
            self.pere_nom_complet, self.mere_nom_complet,
            self.commune
        ]
        return all(champs_requis)

    @property
    def nom_masque(self) -> str:
        """
        Retourne le nom partiellement masqué pour les tiers.
        Exemple : 'Mamadou D***'
        """
        if not self.last_name:
            return self.first_name
        return f"{self.first_name} {self.last_name[0]}***"

    def __str__(self) -> str:
        return f"{self.nom_complet} ({self.numero_citoyen})"
