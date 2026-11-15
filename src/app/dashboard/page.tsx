'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Pega os dados do usuário logado ao carregar a página
  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // Se não tiver sessão, manda de volta pro login
        router.push('/login')
      } else {
        setUserEmail(session.user.email ?? 'Usuário')
        setLoading(false)
      }
    }

    getUser()
  }, [router])

  // Função de Logout segura
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
          <span className="text-sm text-gray-400">Carregando painel...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white transition-opacity duration-700 opacity-100 flex flex-col">
      {/* Header Superior */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              ⚡
            </div>
            <span className="font-bold text-lg tracking-tight">Painel de Controle</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 hidden sm:inline-block bg-gray-800/60 px-3 py-1.5 rounded-full border border-gray-700/50">
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        
        {/* Boas-vindas */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Seja bem-vindo! 🚀</h1>
            <p className="text-sm text-gray-400 mt-1">Aqui está o resumo geral das suas atividades e status do sistema.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistema Protegido & Online
            </span>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-2 hover:border-gray-700 transition">
            <span className="text-xs font-medium text-gray-400">Status da Conta</span>
            <div className="text-2xl font-bold text-emerald-400">Ativa & Verificada</div>
            <p className="text-xs text-gray-500">Protegido por Cloudflare Turnstile</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-2 hover:border-gray-700 transition">
            <span className="text-xs font-medium text-gray-400">Rate Limit de IP</span>
            <div className="text-2xl font-bold text-white">Blindado (1h / 3 req)</div>
            <p className="text-xs text-gray-500">Proteção ativa contra bots e floods</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-2 hover:border-gray-700 transition">
            <span className="text-xs font-medium text-gray-400">Plano Atual</span>
            <div className="text-2xl font-bold text-blue-400">Free Tier (Vercel)</div>
            <p className="text-xs text-gray-500">Otimizado para alto desempenho</p>
          </div>
        </div>

        {/* Seção de Atividades Recentes / Tabela */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Atividades Recentes</h3>
            <span className="text-xs text-gray-500">Últimos registros do sistema</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-400">
              <thead className="border-b border-gray-800 uppercase tracking-wider text-gray-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Evento</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">IP / Origem</th>
                  <th className="py-3 px-4">Data / Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                <tr className="hover:bg-gray-800/30 transition">
                  <td className="py-3 px-4 font-medium text-white">Login Realizado com Sucesso</td>
                  <td className="py-3 px-4"><span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-semibold">Sucesso</span></td>
                  <td className="py-3 px-4">Validado via Turnstile</td>
                  <td className="py-3 px-4 text-gray-500">Agora mesmo</td>
                </tr>
                <tr className="hover:bg-gray-800/30 transition">
                  <td className="py-3 px-4 font-medium text-white">Sessão Autenticada (Supabase)</td>
                  <td className="py-3 px-4"><span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded text-[10px] font-semibold">Conectado</span></td>
                  <td className="py-3 px-4">Sessão Segura</td>
                  <td className="py-3 px-4 text-gray-500">Hoje</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  )
}