import NextAuth from "next-auth"

// Use environment variables with fallbacks
const keycloakServerUrl = process.env.KEYCLOAK_SERVER_URL || "http://localhost:8080"
const keycloakPublicUrl = process.env.KEYCLOAK_PUBLIC_URL || "http://localhost:8080"
const realm = "sso-demo"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "keycloak",
      name: "Keycloak",
      type: "oidc",
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      // Use public URL as issuer (what Keycloak reports)
      issuer: `${keycloakPublicUrl}/realms/${realm}`,
      // Override endpoints to use internal server URL for server-side calls
      token: `${keycloakServerUrl}/realms/${realm}/protocol/openid-connect/token`,
      userinfo: `${keycloakServerUrl}/realms/${realm}/protocol/openid-connect/userinfo`,
      // Authorization uses public URL (browser redirect)
      authorization: {
        url: `${keycloakPublicUrl}/realms/${realm}/protocol/openid-connect/auth`,
        params: { scope: "openid email profile" },
      },
      // JWKS for token verification
      jwks_endpoint: `${keycloakServerUrl}/realms/${realm}/protocol/openid-connect/certs`,
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and refresh_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.idToken = account.id_token
        token.expiresAt = account.expires_at
        // Get user info from profile
        if (profile) {
          token.name = profile.name || profile.preferred_username
          token.email = profile.email
        }
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string
      session.idToken = token.idToken as string
      if (token.name) session.user.name = token.name as string
      if (token.email) session.user.email = token.email as string
      return session
    },
  },
  trustHost: true,
})
