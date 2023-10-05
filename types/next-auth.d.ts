import NextAuth, { DefaultSession, Profile } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      // user id
      id: string;
    } & DefaultSession["user"];
  }
  interface Profile {
    picture: sring;
  }
}
