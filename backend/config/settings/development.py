from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*']

# Database (SQLite for development)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Cors Headers
CORS_ALLOW_ALL_ORIGINS = True
