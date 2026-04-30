from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.accounts.serializers import CitoyenReadSerializer, CitoyenWriteSerializer, CitoyenUpdateSerializer


class InscriptionView(generics.CreateAPIView):
    """
    Endpoint d'inscription pour les nouveaux citoyens.
    """
    serializer_class = CitoyenWriteSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Retourne le profil lu après création
        read_serializer = CitoyenReadSerializer(serializer.instance)
        headers = self.get_success_headers(serializer.data)
        return Response(
            read_serializer.data, 
            status=status.HTTP_201_CREATED, 
            headers=headers
        )


class ProfilMeView(generics.RetrieveUpdateAPIView):
    """
    Accès et modification du profil du citoyen connecté.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CitoyenUpdateSerializer
        return CitoyenReadSerializer

    def get_object(self):
        return self.request.user
