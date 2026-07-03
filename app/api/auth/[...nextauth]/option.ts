import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.identifier.email,
            },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              isVerified: true,
            },
          });

          if (!user) {
            throw new Error("Invalid Credentials");
          }

          const isPasswordCorrcet = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordCorrcet) {
            throw new Error("Invalid Credentials");
          } else {
            return user;
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token._id = user._id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
