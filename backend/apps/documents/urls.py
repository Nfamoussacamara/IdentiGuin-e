from django.urls import path
from apps.documents.views import DemandeListCreateView, DemandeDetailView, DashboardStatsView

app_name = "documents"

urlpatterns = [
    path('', DemandeListCreateView.as_view(), name='liste_demandes'),
    path('stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('<str:reference>/', DemandeDetailView.as_view(), name='detail_demande'),
]
