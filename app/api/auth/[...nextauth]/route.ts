import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        //TODO: validation
        const response = await db.account.findFirst({
          where: {
            email: credentials?.email,
          },
        });
        if (!response) {
          throw new Error("No user found");
        }

        const passwordCorrect = await compare(
          credentials?.password || "",
          response.password
        );

        console.log("Password correct: ", passwordCorrect);

        if (passwordCorrect) {
          return {
            id: response.id,
            email: response.email,
          };
        }

        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
