from pathlib import Path
from decouple import config
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='django-insecure-default-key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

# Application definition
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'django_filters',
    'drf_spectacular',
]

LOCAL_APPS = [
    'apps.accounts',
    'apps.documents',
    'apps.blockchain',
    'apps.verification',
    'apps.dashboard',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # On définit le dossier global des templates (Haut Niveau)
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/
LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = 'accounts.CitoyenUser'

# DRF Settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'EXCEPTION_HANDLER': 'config.exception_handler.custom_exception_handler',
}

# SimpleJWT Settings
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=config('JWT_ACCESS_TOKEN_LIFETIME_MINUTES', default=60, cast=int)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=config('JWT_REFRESH_TOKEN_LIFETIME_DAYS', default=7, cast=int)),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# Spectacular Settings
# --- DOCUMENTATION : OpenAPI 3.1 (Phase 4) ---
# Configuration de drf-spectacular pour générer une documentation interactive et précise.
SPECTACULAR_SETTINGS = {
    'TITLE': 'IdentiGuinée V2 API',
    'DESCRIPTION': (
        'Plateforme nationale de délivrance de documents d\'identité certifiés par Blockchain.\n\n'
        'Cette API permet aux citoyens de demander leurs documents et aux institutions '
        'de vérifier l\'authenticité via NaissanceChain.'
    ),
    'VERSION': '2.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'CONTACT': {
        'name': 'Équipe Technique IdentiGuinée',
        'email': 'tech@identiguinee.gn',
    },
    'LICENSE': {
        'name': 'Proprietary',
    },
    # Utilisation de Redoc et Swagger UI
    'SWAGGER_UI_SETTINGS': {
        'deepLinking': True,
        'persistAuthorization': True,
        'displayOperationId': True,
    },
}

# --- SÉCURITÉ : Rate Limiting (Phase 4) ---
# Utilisation de django-ratelimit pour protéger les endpoints sensibles.
# On utilise le cache Redis pour une performance maximale et une persistance des compteurs.
RATELIMIT_CACHE = 'default'
RATELIMIT_ENABLE = True
RATELIMIT_USE_CACHE = 'default'
# Message d'erreur personnalisé en cas de dépassement (Haut Niveau)
RATELIMIT_VIEW = 'apps.common.views.ratelimit_error'

# --- CONFIGURATION CELERY & REDIS ---
# URL du broker (Redis est utilisé pour stocker la file d'attente des tâches)
CELERY_BROKER_URL = config('CELERY_BROKER_URL', default='redis://localhost:6379/0')

# URL du backend de résultats (Redis stocke ici le résultat/statut des tâches)
CELERY_RESULT_BACKEND = config('CELERY_RESULT_BACKEND', default='redis://localhost:6379/0')

# Format de sérialisation des données (JSON est le standard sécurisé)
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

# Fuseau horaire des tâches (synchronisé avec Django)
CELERY_TIMEZONE = TIME_ZONE

# Sécurité : Si une tâche échoue, elle peut être re-tentée automatiquement
# (configuré au niveau de la tâche elle-même avec @shared_task)
CELERY_TASK_ALWAYS_EAGER = config('CELERY_TASK_ALWAYS_EAGER', default=False, cast=bool)
