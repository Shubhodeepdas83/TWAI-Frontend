// [...nextauth].js or [...nextauth].ts

import { prisma } from '../../../../lib/prisma'
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'

const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_ID
const GOOGLE_CLIENT_SECRET = process.env.AUTH_GOOGLE_SECRET
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile?.email) {
        throw new Error('No profile')
      }

      await prisma.user.upsert({
        where: {
          email: profile.email,
        },
        create: {
          email: profile.email,
          name: profile.name,
        },
        update: {
          name: profile.name,
        },
      })
      return true
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      if (profile) {
        const fetchedUser = await prisma.user.findUnique({
          where: {
            email: profile.email,
          },
        })
        if (!fetchedUser) {
          throw new Error('No user found')
        }

        token.id = fetchedUser.id
      }
      return token
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
