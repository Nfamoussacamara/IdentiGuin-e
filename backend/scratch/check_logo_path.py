import os
import sys
import django
from django.conf import settings

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

base_public = os.path.join(settings.BASE_DIR, '..', 'front', 'public')
logo_path = os.path.join(base_public, "logo.png")

print(f"BASE_DIR: {settings.BASE_DIR}")
print(f"Looking for logo at: {os.path.abspath(logo_path)}")
print(f"File exists: {os.path.exists(logo_path)}")
