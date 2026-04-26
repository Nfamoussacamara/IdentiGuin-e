import hmac
import hashlib
from decouple import config

def generer_signature_hmac(payload: str) -> str:
    """
    Génère une signature HMAC-SHA256 sécurisée.
    Utilise la clé secrète définie dans le .env.
    """
    secret = config('SIGNATURE_SECRET_KEY', default='default-secret-do-not-use-in-prod').encode()
    return hmac.new(secret, payload.encode(), hashlib.sha256).hexdigest()
