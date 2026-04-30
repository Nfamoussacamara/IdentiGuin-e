
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from weasyprint import HTML
from apps.documents.models import DemandeDocument, TypeDocument
from apps.documents.generators import DocumentGenerator

def test_pdf_gen():
    # Try to find a completed CNI request
    demande = DemandeDocument.objects.filter(type_document=TypeDocument.CNI).first()
    if not demande:
        print("No CNI request found to test.")
        return

    print(f"Testing PDF generation for {demande.reference}...")
    try:
        pdf_content = DocumentGenerator.generer_pdf(demande)
        with open("test_cni_gen.pdf", "wb") as f:
            f.write(pdf_content)
        print("Successfully generated test_cni_gen.pdf")
    except Exception as e:
        print(f"Error generating PDF: {e}")

if __name__ == "__main__":
    test_pdf_gen()
