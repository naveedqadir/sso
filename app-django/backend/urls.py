"""
URL configuration for backend project with Keycloak SSO.
"""
from django.contrib import admin
from django.urls import path, include
from core import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('', views.home, name='home'),
    path('profile/', views.profile, name='profile'),
    path('logout/', views.logout_view, name='logout'),
]
