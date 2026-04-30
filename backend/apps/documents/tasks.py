from celery import shared_task
from django.db import DatabaseError
from apps.documents.services import traiter_demande_automatiquement
import logging

# Configuration du logger pour suivre l'exécution des tâches en arrière-plan
logger = logging.getLogger(__name__)

@shared_task(
    bind=True, 
    max_retries=3, 
    default_retry_delay=60, # Attendre 1 minute avant de réessayer en cas d'erreur
    name="documents.pipeline_traitement"
)
def pipeline_traitement_document_task(self, demande_id: int) -> None:
    """
    Tâche Celery orchestrant le traitement complet d'une demande de document.
    
    Cette tâche est exécutée de manière asynchrone pour ne pas bloquer l'utilisateur.
    Elle fait appel à la couche service pour la logique métier pure.
    
    Args:
        demande_id (int): L'identifiant unique de la demande à traiter.
        
    Note:
        En cas d'erreur de base de données ou de service indisponible (ex: Blockchain),
        la tâche sera re-tentée automatiquement jusqu'à 3 fois.
    """
    logger.info(f"Démarrage du traitement asynchrone pour la demande ID: {demande_id}")
    
    try:
        # Appel de la logique métier centralisée dans services.py
        traiter_demande_automatiquement(demande_id)
        logger.info(f"Traitement réussi pour la demande ID: {demande_id}")
        
    except (DatabaseError, Exception) as exc:
        # En cas d'erreur, on logue et on déclenche un retry
        logger.error(f"Échec du traitement pour la demande {demande_id}: {exc}")
        
        # On ne réessaie que si c'est une erreur potentiellement temporaire
        # (ex: perte de connexion DB, timeout API blockchain)
        raise self.retry(exc=exc)
