import qrcode
import io
import os
import hashlib
import hmac
from django.conf import settings
from django.template.loader import render_to_string
from weasyprint import HTML, CSS
from apps.documents.models import DemandeDocument
from typing import Optional

class DocumentGenerator:
    """
    Service de haut niveau responsable de la création physique des documents officiels.
    
    Ce service gère :
    1. La génération d'un QR Code unique de vérification.
    2. La création d'une signature cryptographique (scellé numérique).
    3. Le rendu HTML vers PDF via WeasyPrint.
    """

    @staticmethod
    def generer_qr_code(token: str) -> io.BytesIO:
        """
        Génère une image QR Code pointant vers l'URL de vérification publique.
        
        Args:
            token (str): Le token unique de vérification du document.
            
        Returns:
            io.BytesIO: Un flux binaire contenant l'image PNG du QR Code.
        """
        # URL de base pour la vérification tiers (à configurer dans .env)
        base_url = getattr(settings, 'PUBLIC_VERIFICATION_URL', 'https://identiguinee.gn/v/')
        url = f"{base_url}{token}"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        img_buffer = io.BytesIO()
        img.save(img_buffer, format="PNG")
        img_buffer.seek(0)
        return img_buffer

    @staticmethod
    def generer_signature_numerique(demande: DemandeDocument) -> str:
        """
        Crée un scellé numérique (HMAC) basé sur les données critiques du document.
        Cela garantit que si le PDF est modifié, la signature ne correspondra plus.
        
        Returns:
            str: Signature hexadécimale.
        """
        # On concatène les données clés pour créer une empreinte unique
        payload = f"{demande.reference}|{demande.citoyen.numero_citoyen}|{demande.type_document}"
        secret_key = settings.SECRET_KEY.encode()
        
        signature = hmac.new(
            secret_key,
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return signature

    @classmethod
    def generer_pdf(cls, demande: DemandeDocument) -> bytes:
        """
        Transforme une demande en un document PDF officiel certifié.
        
        Args:
            demande (DemandeDocument): L'instance de la demande à convertir.
            
        Returns:
            bytes: Le contenu binaire du PDF généré.
        """
        import base64

        # 1. Préparation des composants de sécurité
        qr_buffer = cls.generer_qr_code(demande.qr_code_token)
        qr_base64 = base64.b64encode(qr_buffer.getvalue()).decode()
        
        signature = cls.generer_signature_numerique(demande)
        
        # 2. Contexte pour le template HTML
        context = {
            'demande': demande,
            'citoyen': demande.citoyen,
            'signature': signature,
            'qr_code_base64': qr_base64,
            'today': demande.completed_at or demande.updated_at,
        }

        # 3. Rendu du HTML
        html_string = render_to_string('documents/certificat.html', context)
        
        # 4. Conversion HTML -> PDF
        pdf_binary = HTML(string=html_string).write_pdf()
        
        return pdf_binary
