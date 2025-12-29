# 🔐 SSO Demo — Keycloak + Django + Next.js

A minimal, production-ready demonstration of **Single Sign-On (SSO)** using Keycloak as the Identity Provider with two modern web applications.

[![Docker](https://img.shields.io/badge/Docker-required-blue.svg)](https://www.docker.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-green.svg)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Testing SSO](#testing-sso)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)
- [Next Steps](#next-steps)
- [Resources](#resources)
- [License](#license)

## Overview

This project demonstrates a complete SSO implementation with:

- **Keycloak** ([http://localhost:8080](http://localhost:8080)) — Open-source Identity and Access Management
- **Django App** ([http://localhost:8000](http://localhost:8000)) — Backend application using [`django-allauth`](https://django-allauth.readthedocs.io/)
- **Next.js App** ([http://localhost:3000](http://localhost:3000)) — Frontend application using [`NextAuth.js`](https://next-auth.js.org/)

Users authenticate once with Keycloak and gain seamless access to both applications.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Keycloak (IdP)                           │
│                   http://localhost:8080                     │
│                    Realm: sso-demo                          │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│   Next.js App (App A)   │     │   Django App (App B)    │
│  http://localhost:3000  │     │  http://localhost:8000  │
│   Client: nextjs-app    │     │   Client: django-app    │
└─────────────────────────┘     └─────────────────────────┘
```

## Features

- 🔒 **Single Sign-On** — Log in once, access all apps
- 🚀 **Docker-ready** — One command to start everything
- 🔑 **OIDC/OAuth2** — Industry-standard protocols
- 🛡️ **PKCE enabled** — Enhanced security for public clients
- 👤 **Pre-configured** — Test users and realm included
- 📱 **Modern stack** — Django 5.x + Next.js 15
- 🔐 **Secure sessions** — HttpOnly cookies, proper logout

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (macOS/Windows) or Docker Engine (Linux)
- [Docker Compose](https://docs.docker.com/compose/) (usually included with Docker Desktop)

## Quick Start

### 1. Start All Services

```bash
# Clone the repository
git clone https://github.com/naveedqadir/sso?tab=readme-ov-file#project-structure
cd sso-demo

# Start the stack
docker-compose up -d --build
```

This will start:
- **Keycloak** on [http://localhost:8080](http://localhost:8080)
- **Django App** on [http://localhost:8000](http://localhost:8000)
- **Next.js App** on [http://localhost:3000](http://localhost:3000)

### 2. Copy Environment Files

```bash
# Django: create app-django/.env from the example
cp app-django/.env.example app-django/.env

# Next.js: create app-nextjs/.env.local from the example
cp app-nextjs/.env.example app-nextjs/.env.local
```

> **Note:** These files are required for local development and when rebuilding containers.

### 3. Wait for Services to Start

```bash
# Check service health
docker-compose ps

# View logs
docker-compose logs -f
```

Wait until Keycloak is fully initialized (usually 30-60 seconds).

### 4. Access the Applications

| Service | URL | Credentials |
|---------|-----|-------------|
| Next.js App | [http://localhost:3000](http://localhost:3000) | `testuser` / `password` |
| Django App | [http://localhost:8000](http://localhost:8000) | `testuser` / `password` |
| Keycloak Admin | [http://localhost:8080](http://localhost:8080) | `admin` / `admin` |

## Testing SSO

Experience SSO in action:

1. Open [http://localhost:3000](http://localhost:3000) (Next.js app)
2. Click **"Login with Keycloak"**
3. Enter credentials: `testuser` / `password`
4. You'll be redirected back and logged in ✅
5. Open [http://localhost:8000](http://localhost:8000) (Django app) in the **same browser**
6. Click **"Login with Keycloak"**
7. **You're automatically logged in without re-entering credentials!** ✨

This demonstrates SSO — one login grants access to all connected applications.

## Project Structure

```
sso-demo/
├── app-django/                 # Django application
│   ├── backend/
│   │   ├── settings.py        # ⚙️ Keycloak/allauth configuration
│   │   └── urls.py
│   ├── core/
│   │   └── views.py
│   ├── templates/
│   │   ├── base.html
│   │   ├── home.html
│   │   └── profile.html
│   ├── .env.example           # 📋 Environment template
│   └── requirements.txt
│
├── app-nextjs/                # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/auth/     # NextAuth API routes
│   │   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── components/
│   │   ├── auth.ts           # ⚙️ NextAuth Keycloak config
│   │   └── types/
│   ├── .env.example          # 📋 Environment template
│   └── package.json
│
├── keycloak/
│   └── realm-config/
│       └── sso-demo-realm.json  # 🔑 Pre-configured realm
│
└── docker-compose.yml         # 🐳 Service orchestration
```

## Configuration

### Key Configuration Files

| File | Purpose |
|------|---------|
| `app-django/backend/settings.py` | Django + django-allauth + Keycloak setup |
| `app-nextjs/src/auth.ts` | NextAuth.js Keycloak provider configuration |
| `keycloak/realm-config/sso-demo-realm.json` | Pre-configured realm with clients and test users |
| `docker-compose.yml` | Service definitions and networking (`extra_hosts`) |

### Environment Variables

**Django** (`app-django/.env`):
```env
KEYCLOAK_SERVER_URL=http://localhost:8080
KEYCLOAK_REALM=sso-demo
KEYCLOAK_CLIENT_ID=django-app
KEYCLOAK_CLIENT_SECRET=<your-secret>
```

**Next.js** (`app-nextjs/.env.local`):
```env
NEXTAUTH_URL=http://localhost:3000
KEYCLOAK_ID=nextjs-app
KEYCLOAK_SECRET=<your-secret>
KEYCLOAK_ISSUER=http://localhost:8080/realms/sso-demo
```

## Development

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker logs django-sso -f
docker logs nextjs-sso -f
docker logs keycloak-sso -f
```

### Stopping Services

```bash
# Stop containers (data preserved)
docker-compose down

# Stop and remove all data
docker-compose down -v
```

### Rebuilding Services

```bash
docker-compose up -d --build
```

### Accessing Keycloak Admin Console

Visit [http://localhost:8080/admin](http://localhost:8080/admin)

- **Username:** `admin`
- **Password:** `admin`

From here you can:
- Manage users and roles
- Configure clients
- View sessions
- Export realm configuration

## Troubleshooting

### Issue: "Invalid redirect URI" error

**Solution:** Ensure redirect URIs in Keycloak match exactly (check for trailing slashes).

In Keycloak Admin Console:
1. Go to **Clients** → Select your client
2. Check **Valid Redirect URIs**
3. Add: `http://localhost:3000/*` (Next.js) or `http://localhost:8000/*` (Django)

### Issue: "Client secret mismatch"

**Solution:** Regenerate client secret in Keycloak and update your `.env` files.

### Issue: SSO not working between apps

**Checklist:**
- ✅ Both apps use the same Keycloak realm (`sso-demo`)
- ✅ Using the same browser (SSO relies on browser sessions)
- ✅ Keycloak is accessible at `http://localhost:8080`

### Issue: Issuer / token errors

**Verify Keycloak discovery from host:**
```bash
curl http://localhost:8080/realms/sso-demo/.well-known/openid-configuration | jq .issuer
```

**Verify from inside Django container:**
```bash
docker exec django-sso python -c "import urllib.request; print(urllib.request.urlopen('http://localhost:8080/realms/sso-demo/.well-known/openid-configuration').read())"
```

> **Note:** The `extra_hosts: "localhost:host-gateway"` in `docker-compose.yml` enables containers to reach `localhost:8080` on the host machine.

### Issue: Django migration errors

```bash
cd app-django
source venv/bin/activate
python manage.py migrate
```

## Security Notes

> ⚠️ **This is a development setup. For production:**

### Must Change:
- ✅ Replace all secret keys and passwords
- ✅ Use **HTTPS** for all services
- ✅ Set `DEBUG = False` in Django
- ✅ Configure proper CORS settings
- ✅ Use production-grade database (PostgreSQL)
- ✅ Enable SSL/TLS for Keycloak
- ✅ Use proper hostnames (not `localhost`)
- ✅ Remove `extra_hosts` workarounds

### Best Practices Implemented:
- ✅ **PKCE** (Proof Key for Code Exchange) enabled
- ✅ **HttpOnly cookies** for session security
- ✅ **Environment variables** for secrets (not hardcoded)
- ✅ **Proper logout** with Keycloak session termination
- ✅ **Virtual environment** for Python dependency isolation

## Next Steps

### Enhancements I can help with:

1. **End-to-End Testing**
   - Automated login flow testing
   - SSO verification script across apps

2. **Health Checks**
   - OIDC endpoint validation
   - Token exchange verification
   - Service readiness checks

3. **Additional Features**
   - Role-based access control (RBAC)
   - Multi-factor authentication (MFA)
   - Social login providers (Google, GitHub)
   - User self-registration

4. **Production Setup**
   - Kubernetes deployment manifests
   - CI/CD pipeline configuration
   - Production-ready secrets management

## Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [django-allauth Documentation](https://django-allauth.readthedocs.io/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [OpenID Connect Specification](https://openid.net/connect/)
- [OAuth 2.0 RFC](https://oauth.net/2/)

## License

MIT-style license for demo code. See project files for details.

---

<div align="center">

**Built with ❤️ using Keycloak, Django, and Next.js**

[Report Bug](https://github.com/your-username/sso-demo/issues) · [Request Feature](https://github.com/your-username/sso-demo/issues)

</div>