'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, LogIn, LogOut, Menu, X, User, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const [session, setSession] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-orange-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">
                HARDY <span className="text-orange-600 italic font-medium">PRO</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-orange-600 px-4 py-2 font-bold text-sm uppercase tracking-widest transition-colors"
            >
              Modo Público
            </Link>

            {session ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/admin" 
                  className="flex items-center bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-all font-bold text-sm shadow-lg shadow-gray-900/10"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 text-gray-400 hover:text-red-600 transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <div className="flex items-center pl-4 border-l border-gray-100">
                  <img 
                    src={session.user.user_metadata.avatar_url} 
                    className="w-9 h-9 rounded-full border-2 border-orange-100" 
                    alt="User"
                  />
                </div>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-600/20"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Acceso Desarrollador
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-900"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-4 animate-in slide-in-from-top duration-300">
          <Link href="/" className="block text-gray-900 font-bold p-2">Modo Público</Link>
          {session ? (
            <>
              <Link href="/admin" className="block text-orange-600 font-bold p-2">Dashboard</Link>
              <button onClick={handleLogout} className="block w-full text-left text-red-600 font-bold p-2 underline decoration-2">Cerrar Sesión</button>
            </>
          ) : (
            <button onClick={handleLogin} className="block w-full text-left text-orange-600 font-bold p-2">Acceso Desarrollador (GitHub)</button>
          )}
        </div>
      )}
    </nav>
  )
}
