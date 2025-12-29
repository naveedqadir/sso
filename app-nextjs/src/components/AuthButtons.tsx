"use client"

import { signIn, signOut } from "next-auth/react"

interface AuthButtonsProps {
  isAuthenticated: boolean
}

export function LoginButton() {
  return (
    <button
      onClick={() => signIn("keycloak")}
      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
    >
      Login with Keycloak
    </button>
  )
}

export function LogoutButton() {
  const handleLogout = async () => {
    // First, sign out from NextAuth
    await signOut({ redirect: false })
    
    // Then redirect to Keycloak logout
    const keycloakIssuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER || "http://localhost:8080/realms/sso-demo"
    const logoutUrl = `${keycloakIssuer}/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent("http://localhost:3000")}&client_id=${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "nextjs-app"}`
    
    window.location.href = logoutUrl
  }

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-700 transform hover:-translate-y-1 transition-all duration-200"
    >
      Logout
    </button>
  )
}
