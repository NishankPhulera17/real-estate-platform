import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Providers are defined in auth.ts to avoid Edge runtime issues
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  session: { strategy: "jwt" }
} satisfies NextAuthConfig;
