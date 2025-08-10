import { NextAuth_CONFIG } from "@/lib/auth"
import NextAuth from "next-auth"

const handler = NextAuth(NextAuth_CONFIG)

export { handler as GET, handler as POST }