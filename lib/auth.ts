import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import clientPromise from "./mongodb"
import { comparePassword } from "./models/user"
import { ObjectId } from "mongodb"
import type { NextRequest } from "next/server"
import type { UserSession } from "./models/user"

export async function getSession(req: NextRequest): Promise<UserSession | null> {
  const sessionCookie = req.cookies.get("auth_session")?.value

  if (!sessionCookie) {
    return null
  }

  try {
    return JSON.parse(sessionCookie) as UserSession
  } catch (error) {
    console.error("Session parsing error:", error)
    return null
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const client = await clientPromise
        const db = client.db()

        const user = await db.collection("users").findOne({ email: credentials.email })

        if (!user || !user.password) {
          return null
        }

        const isValid = await comparePassword(credentials.password, user.password)

        if (!isValid) {
          return null
        }

        // Update last login
        await db.collection("users").updateOne({ _id: new ObjectId(user._id) }, { $set: { lastLogin: new Date() } })

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const client = await clientPromise
          const db = client.db()

          // Check if user exists
          const existingUser = await db.collection("users").findOne({ email: user.email })

          if (existingUser) {
            // Update user info
            await db.collection("users").updateOne(
              { email: user.email },
              {
                $set: {
                  name: user.name,
                  image: user.image,
                  lastLogin: new Date(),
                },
              },
            )
          } else {
            // Create new user
            await db.collection("users").insertOne({
              name: user.name,
              email: user.email,
              image: user.image,
              createdAt: new Date(),
              lastLogin: new Date(),
              progress: {
                math: 0,
                science: 0,
                reading: 0,
                coding: 0,
                art: 0,
                music: 0,
                geography: 0,
                logic: 0,
                movies: 0,
                c_programming: 0,
                python: 0,
                java: 0,
              },
              stats: {
                totalQuizzesTaken: 0,
                totalQuestionsAnswered: 0,
                correctAnswers: 0,
                totalTimeSpent: 0,
                gamesPlayed: 0,
              },
            })
          }
        } catch (error) {
          console.error("Error during Google sign in:", error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
