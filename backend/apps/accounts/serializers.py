from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from apps.accounts.models import CitoyenUser


class CitoyenReadSerializer(serializers.ModelSerializer):
    """Lecture profil citoyen — exposé sur GET /auth/me/."""
    nom_complet = serializers.ReadOnlyField()
    profil_complet = serializers.ReadOnlyField()

    class Meta:
        model = CitoyenUser
        fields = [
            "id", "numero_citoyen", "nom_complet", "email",
            "first_name", "last_name", "nin", "genre", "taille",
            "pere_nom_complet", "mere_nom_complet",
            "adresse", "region", "prefecture", "commune", "quartier", "secteur",
            "profession", "photo",
            "date_naissance", "lieu_naissance", "numero_registre_naissance",
            "telephone", "est_verifie_naissancechain",
            "profil_complet", "created_at"
        ]


class CitoyenWriteSerializer(serializers.ModelSerializer):
    """Écriture inscription citoyen — POST /auth/inscription/."""
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CitoyenUser
        fields = [
            "email", "first_name", "last_name", "password",
            "date_naissance", "lieu_naissance",
            "numero_registre_naissance", "telephone"
        ]

    def validate_nin(self, valeur: str) -> str:
        """Vérifie l'unicité du NIN s'il est fourni."""
        if valeur and CitoyenUser.objects.filter(nin=valeur).exclude(pk=self.instance.pk if self.instance else None).exists():
            raise serializers.ValidationError(_("Ce NIN est déjà utilisé."))
        return valeur

    def validate_numero_registre_naissance(self, valeur: str) -> str:
        """Vérifie l'unicité du numéro de registre avant création."""
        if CitoyenUser.objects.filter(
            numero_registre_naissance=valeur
        ).exists():
            raise serializers.ValidationError(
                _("Ce numéro de registre est déjà associé à un compte.")
            )
        return valeur

    def create(self, validated_data):
        """Délègue la création au service pour inclure la logique métier."""
        from apps.accounts.services import inscrire_citoyen
        return inscrire_citoyen(validated_data)


class CitoyenUpdateSerializer(serializers.ModelSerializer):
    """Mise à jour complète du profil — PATCH /auth/me/."""
    class Meta:
        model = CitoyenUser
        fields = [
            "first_name", "last_name", "nin", "genre", "taille",
            "pere_nom_complet", "mere_nom_complet",
            "adresse", "region", "prefecture", "commune", "quartier", "secteur",
            "profession", "telephone", "photo"
        ]

    def validate_nin(self, valeur: str) -> str:
        """Vérifie l'unicité du NIN s'il est fourni."""
        if valeur and CitoyenUser.objects.filter(nin=valeur).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError(_("Ce NIN est déjà utilisé."))
        return valeur
