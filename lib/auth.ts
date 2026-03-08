import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/db'

export const authOptions: NextAuthOptions = {
  providers: [
    // Authentification par téléphone (OTP via WhatsApp)
    CredentialsProvider({
      id: 'phone',
      name: 'Téléphone',
      credentials: {
        phone: { label: 'Téléphone', type: 'tel' },
        otp: { label: 'Code OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          return null
        }

        // TODO: Vérifier le code OTP via WhatsApp/SMS
        // SECURITE : OTP dev bypass actif UNIQUEMENT en developpement
        if (process.env.NODE_ENV === 'development' && credentials.otp === '123456') {
          console.warn(
            '⚠️ SECURITE: OTP dev bypass utilise pour ' + credentials.phone +
            '. Ce bypass est DESACTIVE en production.'
          )
          // Trouver ou créer l'utilisateur
          let user = await prisma.user.findUnique({
            where: { phone: credentials.phone },
          })

          if (!user) {
            user = await prisma.user.create({
              data: { phone: credentials.phone },
            })
          }

          return {
            id: user.id,
            phone: user.phone,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        }

        return null
      },
    }),

    // Authentification admin (email/password)
    CredentialsProvider({
      id: 'admin',
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (
          credentials.email === adminEmail &&
          credentials.password === adminPassword
        ) {
          return {
            id: 'admin',
            email: adminEmail,
            name: 'Admin TOKOSSA',
            role: 'admin',
          }
        }

        return null
      },
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.phone = (user as { phone?: string }).phone
        token.role = (user as { role?: string }).role
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string
        (session.user as { phone?: string }).phone = token.phone as string
        (session.user as { role?: string }).role = token.role as string
      }
      return session
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
}
