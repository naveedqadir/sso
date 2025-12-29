from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.conf import settings


def home(request):
    """Home page view."""
    return render(request, 'home.html', {
        'user': request.user,
        'nextjs_app_url': 'http://localhost:3000',
    })


@login_required
def profile(request):
    """Protected profile page - requires authentication."""
    return render(request, 'profile.html', {
        'user': request.user,
    })


def logout_view(request):
    """Logout and redirect to Keycloak logout."""
    logout(request)
    
    # Build Keycloak logout URL for proper SSO logout (use public URL for browser redirect)
    keycloak_public_url = getattr(settings, 'KEYCLOAK_PUBLIC_URL', settings.KEYCLOAK_SERVER_URL)
    keycloak_logout_url = (
        f"{keycloak_public_url}/realms/{settings.KEYCLOAK_REALM}"
        f"/protocol/openid-connect/logout"
        f"?post_logout_redirect_uri=http://localhost:8000/"
        f"&client_id={settings.KEYCLOAK_CLIENT_ID}"
    )
    
    return redirect(keycloak_logout_url)
