
import os
import django
import sys

# Ajout du chemin pour trouver les apps
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

try:
    django.setup()
    print("Django setup OK")
except Exception as e:
    print(f"Erreur Django setup: {e}")
    sys.exit(1)

try:
    from weasyprint import HTML
    print("WeasyPrint import OK")
except Exception as e:
    print(f"Erreur import WeasyPrint: {e}")
    sys.exit(1)

from apps.documents.models import DemandeDocument, TypeDocument
from apps.documents.generators import DocumentGenerator

def test_cni_generation():
    # On cherche une demande CNI existante
    demande = DemandeDocument.objects.filter(type_document=TypeDocument.CNI).first()
    
    if not demande:
        print("Aucune demande CNI trouvée en base pour le test.")
        # On pourrait en créer une, mais on va d'abord voir si on peut charger WeasyPrint
        return

    print(f"Tentative de génération pour : {demande.reference}")
    try:
        pdf_content = DocumentGenerator.generer_pdf(demande)
        output_path = "verif_cni_weasyprint.pdf"
        with open(output_path, "wb") as f:
            f.write(pdf_content)
        print(f"SUCCÈS : Fichier généré dans {os.path.abspath(output_path)}")
    except Exception as e:
        print(f"ÉCHEC de la génération : {e}")

if __name__ == "__main__":
    test_cni_generation()
