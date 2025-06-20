import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { md5 } from 'js-md5'

// Hardcoded valid credentials (replace with your preserved accounts)
import { prisma } from "@/libs/prisma"

const getUserFromDb = async (email, password) => {
  if (!(email && password)) return null
  const results = await prisma.Accounts.findFirst({
    where: {
      email,
      password
    }
  })
  return results
}

export const authOptions = {
  trustHost: true,
  // ===== Token Lifetime Configuration =====
  session: {
    strategy: "jwt", // Required for token-based sessions
    maxAge: 3400 * 12, // 7 days in seconds (adjust as needed)
  },
  
  jwt: {
    maxAge: 3400 * 12, // Must match session.maxAge
  },
  // ========================================
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Check credentials against hardcoded values
        const hashedPass = md5(credentials.password)
        const user = await getUserFromDb(credentials.email, hashedPass)

        return user 
          ? { name: user.email } 
          : null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET
};

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authOptions);