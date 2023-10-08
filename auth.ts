import User from "@models/user";
import { connectDB } from "@utils/database";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
const bcrypt = require("bcryptjs");

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password)
          return null;

        await connectDB();
        const dbUser = await User.findOne({ email: credentials.email });

        if (dbUser) {
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            dbUser.password
          );
          if (isPasswordCorrect) {
            const { _id, email, username, image } = dbUser;

            return { id: _id, email, username, image };
          }
        }
        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account?.provider !== "credentials") {
        await connectDB();
        const sessionUser = await User.findOne({ email: token.email });
        token.id = sessionUser._id.toString();
      } else if (user) {
        token.id = user.id.toString();
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;

      return session;
    },
    async signIn({ profile, user }) {
      try {
        await connectDB();

        const dbUser = await User.findOne({ email: profile?.email });
        console.log("signIn ", user);

        if (user) return true;
        if (!dbUser) {
          await User.create({
            email: profile?.email,
            username: profile?.name?.replace(" ", "").toLowerCase(),
            image: profile?.picture,
          });
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};
