
import os
import django
import sys
import datetime
from django.core.files.base import ContentFile

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.accounts.models import CitoyenUser
from apps.documents.models import DemandeDocument, TypeDocument, StatutDemande
from apps.documents.generators import DocumentGenerator

def create_mock_cni():
    print("--- Démarrage du Test de Génération Haute Fidélité ---")
    
    # Nettoyage préalable (ordre important : d'abord les demandes, ensuite le citoyen)
    DemandeDocument.objects.filter(reference="CNI-TEST-2026-0001").delete()
    CitoyenUser.objects.filter(email="test.cni@identiguinee.gn").delete()

    # 1. Création ou récupération d'un citoyen test
    email = "test.cni@identiguinee.gn"
    citoyen, created = CitoyenUser.objects.get_or_create(
        email=email,
        defaults={
            'username': 'testcni',
            'first_name': 'Mamadou',
            'last_name': 'DIALLO',
            'date_naissance': datetime.date(1995, 5, 15),
            'lieu_naissance': 'Conakry',
            'numero_registre_naissance': 'REG-1995-12345',
            'nin': '1950515123456',
            'genre': 'M',
            'taille': 1.75,
            'profession': 'Ingénieur Logiciel',
            'region': 'Conakry',
            'prefecture': 'Conakry',
            'commune': 'Ratoma',
            'quartier': 'Kipé',
            'secteur': 'Secteur 2',
            'est_verifie_naissancechain': True
        }
    )
    
    if created:
        citoyen.set_password('password123')
        citoyen.save()
        print(f"Citoyen de test créé : {citoyen.email}")
    else:
        print(f"Citoyen de test récupéré : {citoyen.email}")

    # 2. Création d'une demande CNI
    demande = DemandeDocument.objects.create(
        citoyen=citoyen,
        type_document=TypeDocument.CNI,
        reference="CNI-TEST-2026-0001",
        statut=StatutDemande.PRET,
        blockchain_tx_hash="0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        completed_at=timezone.now() if hasattr(django.utils.timezone, 'now') else datetime.datetime.now()
    )
    print(f"Demande CNI créée : {demande.reference}")

    # 3. Génération du PDF
    try:
        print("Génération du PDF avec WeasyPrint...")
        pdf_content = DocumentGenerator.generer_pdf(demande)
        
        output_file = "CARTE_IDENTITE_TEST.pdf"
        with open(output_file, "wb") as f:
            f.write(pdf_content)
        
        print(f"✅ SUCCÈS ! La carte a été générée : {os.path.abspath(output_file)}")
        print("Tu peux maintenant ouvrir ce fichier pour voir le résultat final.")
        
    except Exception as e:
        print(f"❌ ERREUR lors de la génération : {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    from django.utils import timezone
    create_mock_cni()
