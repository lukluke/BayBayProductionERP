import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/utils/prisma";
import * as bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.password || !credentials.username) return null;
          const user = await prisma.user.findFirst({
            select: {
              id: true,
              username: true,
              password: true,
              role: true,
            },
            where: {
              username: credentials?.username,
              role: {
                in: ["admin", "staff"],
              },
            },
          });
          if (!user) return null;
          if (bcrypt.compareSync(credentials.password, user.password)) {
            return {
              id: user.id,
              name: user.username,
              role: user.role,
            };
          } else return null;
        } catch (e: any) {
          console.log(e);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return Promise.resolve(token);
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.user.id;
      session.user.name = token.user.name;
      session.user.role = token.user.role;
      delete session.user.image;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
