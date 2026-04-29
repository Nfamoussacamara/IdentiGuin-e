from __future__ import annotations
import uuid
from typing import Any, Dict, Optional
from django.db import transaction
from apps.accounts.models import CitoyenUser


def inscrire_citoyen(data: Dict[str, Any]) -> CitoyenUser:
    """
    Orchestre la création d'un nouveau compte citoyen dans le système.
    
    Cette fonction garantit que la création de l'utilisateur et l'attribution
    de son numéro citoyen unique sont effectuées de manière atomique.
    
    Args:
        data (Dict[str, Any]): Dictionnaire contenant les informations du citoyen
                               (email, password, nom, prénom, etc.).
                               
    Returns:
        CitoyenUser: L'instance du citoyen créé.
        
    Note:
        La vérification NaissanceChain sera déclenchée en Phase 2 via Celery.
    """
    # Extraction sécurisée du mot de passe pour hachage
    password = data.pop('password')
    
    with transaction.atomic():
        # Création de l'utilisateur avec le numéro national unique
        citoyen = CitoyenUser.objects.create_user(
            **data,
            numero_citoyen=_generer_numero_citoyen()
        )
        # Hachage sécurisé du mot de passe (standard Django)
        citoyen.set_password(password)
        citoyen.save()
        
    return citoyen


def _generer_numero_citoyen() -> str:
    """
    Génère un Identifiant National Unique (INU) pour le citoyen.
    
    Format : GN-XXXXXXXX (où XXXXXXXX est une portion d'UUID hexadécimal).
    
    Returns:
        str: Le numéro citoyen généré.
    """
    return f"GN-{uuid.uuid4().hex[:8].upper()}"


def get_profil_citoyen(citoyen_id: int) -> CitoyenUser:
    """
    Récupère les informations détaillées d'un citoyen.
    
    Optimise la requête en préchargeant les demandes de documents associées
    pour éviter les futurs problèmes de performance N+1 dans l'UI.
    
    Args:
        citoyen_id (int): L'identifiant unique (PK) du citoyen.
        
    Returns:
        CitoyenUser: L'instance du citoyen avec ses relations préchargées.
    """
    return (
        CitoyenUser.objects
        .prefetch_related("demandes")
        .get(pk=citoyen_id)
    )
