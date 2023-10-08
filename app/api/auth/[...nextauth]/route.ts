import User from "@/models/user";
import { connectDB } from "@/utils/database";
import { authConfig } from "@auth";
import nextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = nextAuth(authConfig);

export { handler as GET, handler as POST };
