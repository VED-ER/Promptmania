import User from "@/models/user";
import { connectDB } from "@/utils/database";
import nextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = nextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        const sessionUser = await User.findOne({ email: token.email });
        token.id = sessionUser._id.toString();
      }

      return token;
    },
    async session({ session, token, user }) {
      // const sessionUser = await User.findOne({ email: session.user.email });

      // session.user.id = sessionUser._id.toString();
      session.user.id = token.id as string;
      console.log("session USER ", user);

      console.log("SESSION ", session);

      return session;
    },
    async signIn({ profile }) {
      console.log("sign In profile", profile);

      try {
        await connectDB();

        const user = await User.findOne({ email: profile?.email });

        if (!user) {
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
});

export { handler as GET, handler as POST };
