"""
Django settings for backend project with Keycloak SSO.
"""

from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-dev-key-change-in-production')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

# Parse ALLOWED_HOSTS from environment or use defaults
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Keycloak Configuration
# KEYCLOAK_SERVER_URL: Used for backend token exchange (Docker internal network)
# KEYCLOAK_PUBLIC_URL: Used for browser redirects (localhost for browser access)
KEYCLOAK_SERVER_URL = os.environ.get('KEYCLOAK_SERVER_URL', 'http://localhost:8080')
KEYCLOAK_PUBLIC_URL = os.environ.get('KEYCLOAK_PUBLIC_URL', 'http://localhost:8080')
KEYCLOAK_REALM = os.environ.get('KEYCLOAK_REALM', 'sso-demo')
KEYCLOAK_CLIENT_ID = os.environ.get('KEYCLOAK_CLIENT_ID', 'django-app')
KEYCLOAK_CLIENT_SECRET = os.environ.get('KEYCLOAK_CLIENT_SECRET', 'django-client-secret')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    # Allauth apps
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.openid_connect',
    # Local apps
    'core',
]

SITE_ID = 1

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
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

WSGI_APPLICATION = 'backend.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Authentication Backends
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# Allauth Configuration
ACCOUNT_EMAIL_VERIFICATION = 'none'
ACCOUNT_LOGIN_METHODS = {'username', 'email'}
SOCIALACCOUNT_AUTO_SIGNUP = True
SOCIALACCOUNT_LOGIN_ON_GET = True

# Login/Logout URLs
LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'

# Keycloak OIDC Provider Configuration
# We use explicit endpoints to handle Docker networking:
# - server_url uses internal Docker hostname for backend calls
# - But the issuer will be localhost:8080 (what Keycloak reports)
SOCIALACCOUNT_PROVIDERS = {
    'openid_connect': {
        'APPS': [
            {
                'provider_id': 'keycloak',
                'name': 'Keycloak',
                'client_id': KEYCLOAK_CLIENT_ID,
                'secret': KEYCLOAK_CLIENT_SECRET,
                'settings': {
                    # Use internal URL for server-side OIDC discovery and token calls
                    'server_url': f'{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM}/.well-known/openid-configuration',
                },
            }
        ],
        'OAUTH_PKCE_ENABLED': True,
    }
}
