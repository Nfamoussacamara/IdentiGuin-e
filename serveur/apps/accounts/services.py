from __future__ import annotations
import uuid
from typing import Any
from django.db import transaction
from apps.accounts.models import CitoyenUser


def inscrire_citoyen(data: dict[str, Any]) -> CitoyenUser:
    """
    Crée un compte citoyen et déclenche la vérification NaissanceChain.
    Opération atomique.
    """
    password = data.pop('password')
    
    with transaction.atomic():
        # On génère un username par défaut basé sur l'email si nécessaire,
        # ou on laisse vide car notre modèle le permet.
        citoyen = CitoyenUser.objects.create_user(
            **data,
            numero_citoyen=_generer_numero_citoyen()
        )
        citoyen.set_password(password)
        citoyen.save()
        
    # TODO: Déclencher la vérification NaissanceChain asynchrone ici (Phase 2)
    return citoyen


def _generer_numero_citoyen() -> str:
    """
    Génère un numéro citoyen unique au format GN-XXXXXXXX.
    """
    return f"GN-{uuid.uuid4().hex[:8].upper()}"


def get_profil_citoyen(citoyen_id: int) -> CitoyenUser:
    """
    Récupère le profil complet d'un citoyen avec ses demandes préchargées.
    """
    return (
        CitoyenUser.objects
        .prefetch_related("demandes")
        .get(pk=citoyen_id)
    )
