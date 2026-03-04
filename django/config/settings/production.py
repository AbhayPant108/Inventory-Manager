# from .base import *
# # import environ    install django-environ (later)

# # Initialize environment variables
# # env = environ.Env()

# # Ensure DEBUG is strictly off
# DEBUG = False

# # Load secrets from environment variables
# SECRET_KEY = env('DJANGO_SECRET_KEY')
# ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', default=['api.yourdomain.com'])

# # Load database configuration from a standard DATABASE_URL string
# # e.g., postgres://user:password@hostname:port/dbname
# DATABASES = {
#     'default': env.db('DATABASE_URL')
# }

# # Additional production settings (e.g., secure cookies, CORS, static file storage)
# SECURE_BROWSER_XSS_FILTER = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True