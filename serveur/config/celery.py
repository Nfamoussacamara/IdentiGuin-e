import os
from celery import Celery

# 1. Définition du module de réglages par défaut pour le programme 'celery'.
# On pointe vers le fichier de configuration Django.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')

app = Celery('identiguinee')

# 2. Utilisation d'une chaîne de caractères ici signifie que le worker n'a pas 
# à sérialiser l'objet de configuration lors de l'utilisation de Windows.
# Le préfixe 'CELERY_' permet d'isoler les réglages Celery dans settings.py.
app.config_from_object('django.conf:settings', namespace='CELERY')

# 3. Chargement automatique des tâches (tasks.py) de toutes les applications Django enregistrées.
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    """
    Tâche de test pour vérifier la bonne connexion entre Celery et Django.
    """
    print(f'Request: {self.request!r}')
