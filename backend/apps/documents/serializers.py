from rest_framework import serializers
from apps.documents.models import DemandeDocument, PieceJustificative, TypeDocument


class PieceJustificativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PieceJustificative
        fields = ["id", "fichier", "nom_original", "uploaded_at"]


class DemandeReadSerializer(serializers.ModelSerializer):
    """Lecture demande — exposé sur GET /demandes/."""
    duree_traitement = serializers.ReadOnlyField()
    est_verifiable = serializers.ReadOnlyField()
    est_pret = serializers.ReadOnlyField()
    pieces_justificatives = PieceJustificativeSerializer(many=True, read_only=True)

    class Meta:
        model = DemandeDocument
        fields = [
            "id", "reference", "type_document", "statut",
            "blockchain_tx_hash", "blockchain_network",
            "qr_code_token", "document_genere", "duree_traitement",
            "est_verifiable", "est_pret",
            "pieces_justificatives",
            "created_at", "updated_at", "completed_at"
        ]


class DemandeWriteSerializer(serializers.ModelSerializer):
    """Écriture demande — POST /demandes/."""
    pieces_fichiers = serializers.ListField(
        child=serializers.FileField(),
        write_only=True, 
        required=False
    )

    class Meta:
        model = DemandeDocument
        fields = ["type_document", "pieces_fichiers"]

    def validate_pieces_fichiers(self, fichiers: list) -> list:
        """Vérifie le format et la taille de chaque pièce uploadée."""
        for fichier in fichiers:
            if fichier.content_type not in PieceJustificative.FORMATS_ACCEPTES:
                raise serializers.ValidationError(
                    f"Format non accepté : {fichier.content_type}. "
                    f"Acceptés : PDF, JPEG, PNG."
                )
            if fichier.size > 5 * 1024 * 1024:  # 5 Mo max
                raise serializers.ValidationError(
                    "Chaque pièce ne doit pas dépasser 5 Mo."
                )
        return fichiers

    def create(self, validated_data):
        from apps.documents.services import creer_demande
        pieces_fichiers = validated_data.pop('pieces_fichiers', [])
        citoyen = self.context['request'].user
        return creer_demande(
            citoyen_id=citoyen.id,
            type_document=validated_data['type_document'],
            pieces_data=pieces_fichiers
        )
