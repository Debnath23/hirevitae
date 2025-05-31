import { api } from "@/service/apiClient";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "oat",
      name: "oat",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@email.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Authentication failed");
          }

          const { user, token } = data;

          if (token && user) {
            return {
              ...user,
              access_token: token,
            };
          }

          throw new Error("Invalid response from the server");
        } catch (err: any) {
          throw new Error(err?.message || "Authentication error");
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
        token.user = user;
        api.defaults.headers.common.Authorization = `Bearer ${user.access_token}`;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.access_token) {
        session.access_token = token.access_token as string;
        session.user = token.user;
        api.defaults.headers.common.Authorization = `Bearer ${token.access_token}`;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
