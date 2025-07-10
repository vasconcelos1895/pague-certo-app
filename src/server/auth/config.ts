import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: "ADMIN" | "SUPERVISOR" | "AGENT";
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "SUPERVISOR" | "AGENT";
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  adapter: PrismaAdapter(db), 
  session: {
    strategy: "jwt",
  },  
  providers: [
    DiscordProvider,
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && account.provider === "google") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token; // Útil para refresh
      }
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as "ADMIN" | "SUPERVISOR" | "AGENT";
      // Exponha o accessToken se quiser usá-lo no client (opcional)
      session.accessToken = token.accessToken as string;
      return session;
    },    
    // session: ({ session, token }) => ({
    //   ...session,
    //   user: {
    //     ...session.user,
    //     id: token.sub,
    //     role: token.role as "ADMIN" | "SUPERVISOR" | "AGENT",
    //   },
    // }),
    // jwt: ({ token, user }) => {
    //   if (user) {
    //     token.role = user.role;
    //   }
    //   return token;
    // },
  },
} satisfies NextAuthConfig;
