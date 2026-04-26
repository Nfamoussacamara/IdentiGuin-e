from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Handler centralisé DRF. Toute erreur API retourne un format unifié.
    """
    # Appel de l'handler par défaut de DRF pour obtenir la réponse standard
    response = exception_handler(exc, context)

    # Si DRF ne gère pas l'exception (ex: erreur 500 brute)
    if response is None:
        return Response({
            "status": "error",
            "code": "INTERNAL_SERVER_ERROR",
            "message": "Une erreur interne est survenue sur le serveur.",
            "details": str(exc) if hasattr(exc, 'message') else {}
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Formatage de la réponse pour l'unifier selon le cahier des charges
    custom_data = {
        "status": "error",
        "code": getattr(exc, 'default_code', 'API_ERROR').upper(),
        "message": response.data.get('detail', "Une erreur est survenue lors de la requête."),
        "details": response.data
    }

    # Si c'est une erreur de validation (400), on nettoie les détails
    if response.status_code == 400:
        custom_data["code"] = "VALIDATION_ERROR"
        custom_data["message"] = "Les données soumises sont invalides."

    response.data = custom_data
    return response
