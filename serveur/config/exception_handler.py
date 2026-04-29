from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from apps.common.exceptions import IdentiGuineeError

def custom_exception_handler(exc, context):
    """
    Handler d'exceptions global pour Django REST Framework.
    
    Cette fonction intercepte toutes les exceptions levées lors du traitement
    d'une requête API et les transforme en une réponse JSON standardisée.
    
    Format de réponse :
    {
        "status": "error",
        "code": "CODE_ERREUR",
        "message": "Message lisible",
        "details": { ... }
    }
    """
    # 1. Appel du handler par défaut de DRF pour capturer les erreurs standards (404, 401, etc.)
    response = exception_handler(exc, context)

    # 2. Cas particulier : Capture de nos exceptions métier personnalisées (Haut Niveau)
    if isinstance(exc, IdentiGuineeError):
        return Response({
            "status": "error",
            "code": exc.code,
            "message": exc.message,
            "details": exc.details
        }, status=exc.status_code)

    # 3. Si DRF ne gère pas l'exception (ex: Erreurs Python brutes non capturées)
    if response is None:
        return Response({
            "status": "error",
            "code": "INTERNAL_SERVER_ERROR",
            "message": "Une erreur interne inattendue est survenue.",
            "details": str(exc) if hasattr(exc, 'message') else {}
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # 4. Normalisation des erreurs DRF standards (Validation 400, Auth 401, etc.)
    custom_data = {
        "status": "error",
        "code": getattr(exc, 'default_code', 'API_ERROR').upper(),
        "message": response.data.get('detail', "Une erreur est survenue lors du traitement."),
        "details": response.data
    }

    # Simplification du code pour les erreurs de validation de formulaire
    if response.status_code == 400:
        custom_data["code"] = "VALIDATION_ERROR"
        custom_data["message"] = "Les données soumises sont invalides ou incomplètes."

    response.data = custom_data
    return response
