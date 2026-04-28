from django.urls import path
from apps.verification.views import VerifierDocumentView

app_name = "verification"

urlpatterns = [
    path('rechercher/', VerifierDocumentView.as_view(), name='rechercher'),
]
