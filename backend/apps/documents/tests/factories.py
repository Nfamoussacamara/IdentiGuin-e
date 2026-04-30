import factory
from factory.django import DjangoModelFactory
from apps.accounts.models import CitoyenUser
from apps.documents.models import DemandeDocument, TypeDocument, StatutDemande
from django.utils import timezone

class CitoyenFactory(DjangoModelFactory):
    """Générateur de citoyens pour les tests."""
    class Meta:
        model = CitoyenUser
        django_get_or_create = ('email',)

    email = factory.Faker('email')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    date_naissance = factory.Faker('date_of_birth', minimum_age=18)
    lieu_naissance = factory.Faker('city')
    numero_registre_naissance = factory.Sequence(lambda n: f"REG-{n:05d}")
    numero_citoyen = factory.Sequence(lambda n: f"TEST-CIT-{n:04d}")

class DemandeFactory(DjangoModelFactory):
    """Générateur de demandes de documents pour les tests."""
    class Meta:
        model = DemandeDocument

    citoyen = factory.SubFactory(CitoyenFactory)
    type_document = TypeDocument.CNI
    statut = StatutDemande.RECUE
    reference = factory.Sequence(lambda n: f"REQ-TEST-{n:04d}")
