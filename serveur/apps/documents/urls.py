from django.urls import path
from apps.documents.views import DemandeListCreateView, DemandeDetailView

app_name = "documents"

urlpatterns = [
    path('', DemandeListCreateView.as_view(), name='liste_demandes'),
    path('<str:reference>/', DemandeDetailView.as_view(), name='detail_demande'),
]
