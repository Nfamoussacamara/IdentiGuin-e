import pytest
from unittest.mock import patch
from apps.documents.services import creer_demande
from apps.documents.models import StatutDemande
from apps.documents.tests.factories import CitoyenFactory

@pytest.mark.django_db
@patch('apps.documents.tasks.pipeline_traitement_document_task.delay')
class TestDocumentService:
    """
    Suite de tests pour valider la robustesse de la couche service Document.
    """

    def test_creer_demande_succes(self, mock_celery_task):
        """
        Vérifie qu'une demande est correctement créée et qu'elle 
        déclenche bien le pipeline asynchrone.
        """
        # 1. Préparation
        citoyen = CitoyenFactory()

        # 2. Exécution
        demande = creer_demande(citoyen.id, 'CNI', [])

        # 3. Vérifications
        assert demande.id is not None
        assert demande.citoyen == citoyen
        assert demande.statut == StatutDemande.RECUE
        mock_celery_task.assert_called_once_with(demande.id)

    def test_creer_demande_id_citoyen_inexistant(self, mock_celery_task):
        """
        Vérifie que le service échoue si l'ID du citoyen n'existe pas.
        """
        from django.core.exceptions import ObjectDoesNotExist
        with pytest.raises(ObjectDoesNotExist):
            creer_demande(9999, 'CNI', [])
