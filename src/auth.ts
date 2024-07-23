import NextAuth, { type NextAuthConfig } from "next-auth"
import Keycloak from 'next-auth/providers/keycloak' 

export const config: NextAuthConfig = {
  providers: [
    Keycloak({
      jwks_endpoint: `${process.env.AUTH_KEYCLOAK_DOCKER_CONTAINER_URI}/realms/myrealm/protocol/openid-connect/certs`,
      token: `${process.env.AUTH_KEYCLOAK_DOCKER_CONTAINER_URI}/realms/myrealm/protocol/openid-connect/token`,
      userinfo: `${process.env.AUTH_KEYCLOAK_DOCKER_CONTAINER_URI}/realms/myrealm/protocol/openid-connect/userinfo`,
      wellKnown: undefined,
      clientId: process.env.AUTH_KEYCLOAK_ID,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
      authorization: {
        params: {
          scope: "openid email profile",
        },
        url: `${process.env.AUTH_KEYCLOAK_URL}/realms/myrealm/protocol/openid-connect/auth`,
      },
    })
  ],
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)
