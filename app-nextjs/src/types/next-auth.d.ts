import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    idToken?: string
    user: DefaultSession["user"]
  }
}
