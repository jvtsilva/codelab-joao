'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUserEmail(session.user.email || '')
      }
    }
    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/cadastro')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl">
          🎉
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">Bem-vindo ao Codelab!</h1>
          <p className="text-gray-400 text-sm">
            Sua conta foi verificada com sucesso e você está logado como:
          </p>
          <span className="text-indigo-400 font-medium text-sm mt-1 inline-block">
            {userEmail}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 transition font-medium rounded-xl text-sm border border-red-500/30"
        >
          Sair da conta
        </button>
      </div>
    </div>
  )
}