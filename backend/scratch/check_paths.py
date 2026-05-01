import os
from django.conf import settings
import django

# Setup django for settings access if needed, but we can just mock it or use absolute paths for testing
base_dir = r"d:\IdentiGuinéeV2\backend"
base_public = os.path.join(base_dir, '..', 'front', 'public')

paths = {
    "sig_auth": os.path.join(base_public, "signature_directeur-removebg-preview.png"),
    "logo_cedao": os.path.join(base_public, "CEDEAO_Logo.svg"),
    "logo_afrique_ouest": os.path.join(base_public, "logo_afrique_ouest.png"),
    "logo_identiguinee_hardcoded": r"D:\IdentiGuinéeV2\front\public\logo.png",
    "logo_identiguinee_dynamic": os.path.join(base_public, "logo.png"),
    "image_identite": os.path.join(base_public, "image_identite_fixed.png")
}

for name, path in paths.items():
    exists = os.path.exists(path)
    print(f"{name}: {exists} - {path}")
