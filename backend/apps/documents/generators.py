import qrcode
import io
import os
import hashlib
import hmac
import datetime
from django.conf import settings
from django.template.loader import render_to_string
from weasyprint import HTML, CSS
from apps.documents.models import DemandeDocument, TypeDocument
from utils.mrz import MRZGenerator
from typing import Optional
import base64

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

    @staticmethod
    def _image_to_base64(file_path: str) -> str:
        """Lit un fichier image et le retourne en base64."""
        try:
            with open(file_path, "rb") as f:
                return base64.b64encode(f.read()).decode()
        except FileNotFoundError:
            import logging
            logging.error(f"Fichier image non trouvé pour base64 : {file_path}")
            return ""
        except Exception as e:
            import logging
            logging.error(f"Erreur lors de la conversion de l'image {file_path} : {e}")
            return ""

    @classmethod
    def generer_pdf(cls, demande: DemandeDocument) -> bytes:
        """
        Transforme une demande en un document PDF officiel certifié.
        Gère spécifiquement le format Carte pour la CNI.
        """
        # 1. Préparation des composants communs
        qr_buffer = cls.generer_qr_code(demande.qr_code_token)
        qr_base64 = base64.b64encode(qr_buffer.getvalue()).decode()
        signature_hmac = cls.generer_signature_numerique(demande)
        
        context = {
            'demande': demande,
            'citoyen': demande.citoyen,
            'signature_hmac': signature_hmac,
            'qr_code_base64': qr_base64,
            'today': demande.completed_at or demande.updated_at,
        }

        # 2. Logique spécifique au type de document
        template_name = 'documents/certificat.html'
        
        if demande.type_document == TypeDocument.CNI:
            template_name = 'documents/cni_card.html'
            
            # Chemins vers les assets officiels fournis
            base_public = os.path.join(settings.BASE_DIR, '..', 'front', 'public')
            sig_auth_path = os.path.join(base_public, "signature_directeur-removebg-preview.png")
            logo_cedao_path = os.path.join(base_public, "CEDEAO_Logo.svg")
            logo_afrique_ouest_path = os.path.join(base_public, "logo_afrique_ouest.png")
            logo_identiguinee_path = os.path.join(base_public, "logo.png")
            image_identite_path = os.path.join(base_public, "image_identite_fixed.png")

            # Calcul de la date d'expiration (5 ans après émission)
            emission_date = demande.completed_at or demande.updated_at
            expiration_date = emission_date + datetime.timedelta(days=365*5)

            # Encodage des images pour le template
            context.update({
                'signature_auth_base64': cls._image_to_base64(sig_auth_path),
                'logo_cedao_svg': cls._image_to_base64(logo_cedao_path),
                'logo_afrique_ouest_base64': cls._image_to_base64(logo_afrique_ouest_path),
                'logo_identiguinee_base64': cls._image_to_base64(logo_identiguinee_path),
                'image_identite_base64': cls._image_to_base64(image_identite_path),
                'exp_date': expiration_date,
            })

            # Photo du citoyen
            if demande.citoyen.photo:
                demande.citoyen.photo.seek(0)
                context['photo_base64'] = base64.b64encode(demande.citoyen.photo.read()).decode()
                demande.citoyen.photo.seek(0) # Reset pointer

            # Génération de la Zone MRZ
            mrz_lines = MRZGenerator.generate_td1(
                doc_number=demande.reference[-9:], # Simulation numéro de doc
                birth_date=demande.citoyen.date_naissance,
                sex=demande.citoyen.genre,
                expiry_date=expiration_date,
                nationality="GIN",
                last_name=demande.citoyen.last_name,
                first_names=demande.citoyen.first_name,
                optional_data1=demande.citoyen.nin or ""
            )
            context['mrz'] = mrz_lines

        # 3. Rendu du HTML
        html_string = render_to_string(template_name, context)

        # DEBUG: Sauvegarde du HTML pour inspection
        with open(os.path.join(settings.BASE_DIR, "debug_card.html"), "w", encoding="utf-8") as f:
            f.write(html_string)
        
        # 4. Conversion HTML -> PDF via WeasyPrint (Le plus puissant support CSS)
        try:
            return HTML(string=html_string).write_pdf()
        except Exception as e:
            # Fallback ou log en cas d'erreur WeasyPrint (souvent lié à GTK+ sur Windows)
            import logging
            logging.error(f"Erreur WeasyPrint : {e}")
            raise
