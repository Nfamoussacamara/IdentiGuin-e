from typing import Optional, Any
from rest_framework import status

class IdentiGuineeError(Exception):
    """
    Exception de base pour toutes les erreurs métier du projet IdentiGuinée.
    
    Cette classe permet d'uniformiser le formatage des erreurs renvoyées par l'API.
    Chaque exception métier doit hériter de celle-ci pour être capturée par le
    handler d'exceptions centralisé.
    
    Attributes:
        message (str): Description lisible de l'erreur (pour l'UI).
        code (str): Code d'erreur unique formaté en majuscules (ex: 'AUTH_001').
        status_code (int): Code de statut HTTP associé (ex: 400, 403, 503).
        details (Optional[Any]): Dictionnaire ou liste contenant des détails techniques.
    """
    def __init__(
        self, 
        message: str, 
        code: str = "BUSINESS_ERROR", 
        status_code: int = status.HTTP_400_BAD_REQUEST,
        details: Optional[Any] = None
    ):
        self.message = message
        self.code = code.upper()
        self.status_code = status_code
        self.details = details or {}
        # Appel du constructeur de Exception avec le message pour la stack trace
        super().__init__(self.message)

class ProfileIncompleteError(IdentiGuineeError):
    """
    Exception levée lorsqu'un citoyen tente de demander un document
    sans avoir rempli toutes les informations obligatoires de son profil.
    
    Code d'erreur : ACCOUNTS_PROFILE_INCOMPLETE
    Status : 403 Forbidden
    """
    def __init__(self, message: str = "Le profil citoyen doit être complété (nom, prénom, registre naissance) avant toute demande."):
        super().__init__(
            message=message,
            code="ACCOUNTS_PROFILE_INCOMPLETE",
            status_code=status.HTTP_403_FORBIDDEN
        )

class BlockchainServiceError(IdentiGuineeError):
    """
    Exception levée en cas d'échec critique lors de l'interaction avec
    le service NaissanceChain (timeout, erreur de signature, etc.).
    
    Code d'erreur : BLOCKCHAIN_SERVICE_UNAVAILABLE
    Status : 503 Service Unavailable
    """
    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            message=message,
            code="BLOCKCHAIN_SERVICE_UNAVAILABLE",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            details=details
        )

class DocumentNotFoundError(IdentiGuineeError):
    """
    Exception levée lorsqu'un document ou une référence de demande
    n'existe pas dans le système.
    
    Code d'erreur : DOCUMENT_NOT_FOUND
    Status : 404 Not Found
    """
    def __init__(self, reference: str):
        super().__init__(
            message=f"La demande de document avec la référence {reference} est introuvable.",
            code="DOCUMENT_NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND
        )
