import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export type SessionUser = {
  id: string
  email: string
  name: string
  role: string
  image?: string | null
}

export async function getCurrentSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session
}

export async function requireUser(): Promise<SessionUser> {
  const session = await getCurrentSession()
  if (!session?.user) {
    redirect('/login')
  }
  return session.user as unknown as SessionUser
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await getCurrentSession()
  const user = session?.user as unknown as SessionUser | undefined
  if (!user) {
    redirect('/admin/login')
  }
  if (user.role !== 'admin') {
    redirect('/')
  }
  return user
}

// For API routes: returns the session user or null instead of redirecting.
export async function getApiUser(): Promise<SessionUser | null> {
  const session = await getCurrentSession()
  return (session?.user as unknown as SessionUser) ?? null
}

export async function getApiAdmin(): Promise<SessionUser | null> {
  const user = await getApiUser()
  if (!user || user.role !== 'admin') return null
  return user
}
