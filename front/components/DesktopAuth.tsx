'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function DesktopAuth() {
  const { data: session, status } = useSession()

  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/' })
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="hidden md:flex items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-neutral-300 text-sm font-medium">
            {session.user?.name}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="text-neutral-400 hover:text-neutral-200 transition-colors text-sm font-medium"
        >
          Déconnexion
        </button>
      </div>
    )
  }

  return (
    <div className="hidden md:flex items-center gap-4">
      <Link
        href="/auth/signin"
        className="text-neutral-400 hover:text-neutral-200 transition-colors text-sm font-medium"
      >
        Connexion
      </Link>
      <button
        onClick={handleSignIn}
        className="bg-white text-neutral-900 hover:bg-neutral-200 transition-colors text-sm font-medium px-4 py-2 rounded-lg"
      >
        S'inscrire
      </button>
    </div>
  )
}