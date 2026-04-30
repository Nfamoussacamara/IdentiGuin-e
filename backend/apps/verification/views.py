from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.documents.models import DemandeDocument
from apps.documents.serializers import DemandeReadSerializer

class VerifierDocumentView(APIView):
    """
    Permet de vérifier l'authenticité d'un document via sa référence ou son hash blockchain.
    Accessible publiquement pour garantir la transparence.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        query = request.query_params.get('q', None)
        if not query:
            return Response(
                {"detail": "Veuillez fournir une référence ou un hash."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Recherche par référence ou par hash blockchain
        document = DemandeDocument.objects.filter(
            reference=query
        ).first() or DemandeDocument.objects.filter(
            blockchain_tx_hash=query
        ).first()

        if not document:
            return Response(
                {"detail": "Document non trouvé dans le registre officiel."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = DemandeReadSerializer(document)
        return Response(serializer.data)
