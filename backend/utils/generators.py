import uuid
from datetime import datetime

def generer_reference_demande() -> str:
    """
    Génère une référence lisible : REQ-YYYY-XXXXX
    """
    annee = datetime.now().year
    suffixe = uuid.uuid4().hex[:5].upper()
    return f"REQ-{annee}-{suffixe}"
