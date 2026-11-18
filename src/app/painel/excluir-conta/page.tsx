'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ExcluirContaPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('Aluno')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUserId(session.user.id)
        const meta = session.user.user_metadata
        setUserName(meta?.full_name || meta?.name || 'Aluno')
      }
    }
    checkUser()
  }, [router])

  const handleDeleteAccount = async () => {
    if (!userId) return
    setDeleteLoading(true)
    setDeleteError('')

    try {
      const response = await fetch('/api/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Erro ao excluir conta.')

      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('codelab_')) {
            localStorage.removeItem(key)
          }
        })
      }

      await supabase.auth.signOut()
      setDeleteLoading(false)
      setDeleteSuccess(true)

    } catch (error: any) {
      setDeleteError(error.message || 'Não foi possível excluir a conta.')
      setDeleteLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 selection:bg-red-500 selection:text-white">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl animate-fadeIn text-center">
        
        {deleteSuccess ? (
          <div className="space-y-5 py-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-lg shadow-emerald-500/10">
              ✓
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Até logo, {userName}! 👋</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Sua conta foi excluída com sucesso. Foi incrível ter você com a gente no Codelab João. Sucesso na sua jornada e até a próxima! 🚀
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold rounded-xl text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Voltar para a Página de Login
            </button>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-lg shadow-red-500/10">
              ⚠️
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-black text-red-400 tracking-tight">Deseja realmente excluir sua conta?</h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Esta ação é <strong className="text-white">definitiva e irreversível</strong>, {userName}. Todos os seus dados, progresso e acessos serão apagados permanentemente do Codelab João.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-left">
                {deleteError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/painel"
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl text-xs transition text-center cursor-pointer"
              >
                Cancelar / Voltar
              </Link>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-600/20"
              >
                {deleteLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Excluindo...
                  </>
                ) : (
                  'Sim, excluir conta'
                )}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}