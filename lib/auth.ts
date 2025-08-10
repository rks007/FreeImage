import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./db";
import User from "@/models/user";
import bcrypt from "bcryptjs";


export const NextAuth_CONFIG: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        
        name: "Login with Email",

        credentials: {
          email: { label: "email", type: "text", placeholder: "test@gmail.com" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
        
          //destructure kiya credentials
          const { email, password } = credentials as { email: string; password: string };

          if(!email){
            return null;
          }

          try {
            await dbConnect();
           const user = await User.findOne({email: email});
           if(!user){
             return null;
           }
           // Check if the password matches
           const isPasswordValid = await bcrypt.compare(password, user.password);
           if (!isPasswordValid) {
             return null;
           }

           return {
            id: user._id.toString(),
            email: user.email,
            role: user.role
           }


          } catch (error) {
            console.error("Auth Error", error);
            throw error;
          }
        }
      })
    ],
    
    callbacks: {

      async jwt({token, user}){
        if(user){
          token.id = user.id;  
          token.email = user.email;
          token.role = user.role;
        }
        return token
      },
    
      async session({session, token}){
    
        if(session.user){
          session.user.id = token.id;
          session.user.email = token.email; 
          session.user.role = token.role;
        }
        return session
      }
    },
    
    // pages: {
    //   signIn: "/login",
    //   error: "/login", // Error code passed in query string as ?error=
    // },
    
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    
    secret: process.env.NEXTAUTH_SECRET,
}