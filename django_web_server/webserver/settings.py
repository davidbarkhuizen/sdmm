import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

config = json.load(open(BASE_DIR + '/../config.json'))

# -----------------------------------------------------------

SECRET_KEY = config['django_secret_key']
APPLICATION_ENTRY_POINT = config['application_entry_point']
SITE_DATA_IMPORT_ROOT_FOLDER = config['site_data_import_root_folder']

DEBUG = True
TEMPLATE_DEBUG = True

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

ALLOWED_HOSTS = []
ROOT_URLCONF = 'webserver.urls'
WSGI_APPLICATION = 'webserver.wsgi.application'

# DIRECTORIES -------------------------------------------------------

MEDIA_ROOT = '/var/www/sdmm/media/'
MEDIA_URL = '/media/'

# django 1.6
TEMPLATE_DIRS = [os.path.join(BASE_DIR, 'templates')]

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'server' # da sjit
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

DATABASES = {
    'default': {
        'ENGINE': config['db_engine'],
        'NAME': config['db_name'],
        'USER' : config['db_user'],
        'PASSWORD' : config['db_password'],
        'HOST' : config['db_host']
    }
}