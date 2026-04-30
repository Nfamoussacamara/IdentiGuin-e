from django.http import JsonResponse
from rest_framework import status
from django.utils.translation import gettext_lazy as _

def ratelimit_error(request, exception=None):
    """
    Vue globale appelée lorsqu'un utilisateur dépasse son quota de requêtes.
    
    Retourne un format JSON standardisé conforme aux normes de notre API,
    permettant au frontend de gérer l'affichage de l'attente.
    """
    return JsonResponse(
        {
            "status": "error",
            "code": "TOO_MANY_REQUESTS",
            "message": _("Vous avez envoyé trop de requêtes. Veuillez patienter avant de réessayer."),
            "details": None
        },
        status=status.HTTP_429_TOO_MANY_REQUESTS
    )
