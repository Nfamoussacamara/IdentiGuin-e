from rest_framework import generics, permissions
from apps.documents.models import DemandeDocument
from apps.documents.serializers import DemandeReadSerializer, DemandeWriteSerializer


class DemandeListCreateView(generics.ListCreateAPIView):
    """
    Lister ses demandes ou en créer une nouvelle.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DemandeWriteSerializer
        return DemandeReadSerializer

    def get_queryset(self):
        return (
            DemandeDocument.objects
            .filter(citoyen=self.request.user)
            .select_related("citoyen")
        )

    def perform_create(self, serializer):
        serializer.save()


class DemandeDetailView(generics.RetrieveAPIView):
    """
    Détail d'une demande spécifique.
    """
    serializer_class = DemandeReadSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'reference'

    def get_queryset(self):
        return DemandeDocument.objects.filter(citoyen=self.request.user)


class DashboardStatsView(generics.GenericAPIView):
    """
    Retourne les statistiques de demandes pour le tableau de bord du citoyen.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        from rest_framework.response import Response
        from django.db.models import Count
        
        stats = (
            DemandeDocument.objects
            .filter(citoyen=request.user)
            .values('statut')
            .annotate(total=Count('statut'))
        )
        
        # Formatage propre pour le frontend
        result = {
            "SOUMIS": 0,
            "EN_TRAITEMENT": 0,
            "REJETE": 0,
            "ACCEPTE": 0
        }
        
        for item in stats:
            result[item['statut']] = item['total']
            
        return Response(result)
