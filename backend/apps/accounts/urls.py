from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from apps.accounts.views import InscriptionView, ProfilMeView, TokenObtainPairView

app_name = "accounts"

urlpatterns = [
    # Auth
    path('inscription/', InscriptionView.as_view(), name='inscription'),
    path('connexion/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profil
    path('me/', ProfilMeView.as_view(), name='me'),
]
