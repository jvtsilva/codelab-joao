'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface RecentActivity {
  lesson_id: string
  updated_at: string
  completed: boolean
}

export default function PainelPage() {
  const [userName, setUserName] = useState<string>('Usuário')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [lastSignIn, setLastSignIn] = useState<string | null>(null)
  const [deviceInfo, setDeviceInfo] = useState<string>('Detectando...')
  const [completedCount, setCompletedCount] = useState<number>(0)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  // Estados para alteração de nome
  const [editableName, setEditableName] = useState('')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameMessage, setNameMessage] = useState({ text: '', type: '' })

  // Estados para alteração de senha
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' })

  // Validações em tempo real para a nova senha
  const hasMinLength = newPassword.length >= 8
  const hasUpperCase = /[A-Z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword)

  const router = useRouter()
  const totalLessonsCount = 14 // Total de aulas do Módulo 1

  useEffect(() => {
    async function getUserAndProgress() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
      } else {
        const metadata = session.user.user_metadata
        const nameFromMeta = metadata?.full_name || metadata?.name || 'Aluno'
        
        setUserName(nameFromMeta)
        setEditableName(nameFromMeta)
        setUserEmail(session.user.email ?? 'E-mail não informado')
        
        if (session.user.last_sign_in_at) {
          const date = new Date(session.user.last_sign_in_at)
          setLastSignIn(date.toLocaleString('pt-BR'))
        } else {
          setLastSignIn('Sessão ativa recente')
        }

        // Buscar progresso de aulas concluídas do usuário no Supabase
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('lesson_id, completed, updated_at')
          .eq('user_id', session.user.id)

        if (progressData) {
          const count = progressData.filter(item => item.completed).length
          setCompletedCount(count)

          // Filtrar apenas concluídas e ordenar pelas mais recentes (últimas 3)
          const sortedActivities = progressData
            .filter(item => item.completed)
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, 3)

          setRecentActivities(sortedActivities)
        }

        // Dispositivo e Navegador
        const ua = navigator.userAgent
        let browser = 'Navegador Desconhecido'
        let os = 'Dispositivo Desconhecido'

        if (ua.includes('Win')) os = 'Windows'
        else if (ua.includes('Mac')) os = 'macOS'
        else if (ua.includes('Linux')) os = 'Linux'
        else if (ua.includes('Android')) os = 'Android'
        else if (ua.includes('like Mac') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

        if (ua.includes('Firefox')) browser = 'Firefox'
        else if (ua.includes('SamsungBrowser')) browser = 'Samsung Internet'
        else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera'
        else if (ua.includes('Edg')) browser = 'Microsoft Edge'
        else if (ua.includes('Chrome')) browser = 'Google Chrome'
        else if (ua.includes('Safari')) browser = 'Safari'

        setDeviceInfo(`${browser} (${os})`)
        setLoading(false)
      }
    }

    getUserAndProgress()
  }, [router])

  // Função para atualizar o nome
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameMessage({ text: '', type: '' })
    setNameLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: editableName }
      })

      if (error) throw error

      setUserName(editableName)
      setNameMessage({ text: 'Nome de exibição alterado com sucesso!', type: 'success' })
    } catch (error: any) {
      setNameMessage({ text: error.message || 'Erro ao alterar o nome.', type: 'error' })
    } finally {
      setNameLoading(false)
    }
  }

  // Função para atualizar a senha
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage({ text: '', type: '' })

    if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      setPasswordMessage({ text: 'A nova senha precisa atender a todos os requisitos de segurança.', type: 'error' })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'As senhas não coincidem.', type: 'error' })
      return
    }

    setPasswordLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setPasswordMessage({ text: 'Senha alterada com sucesso!', type: 'success' })
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      setPasswordMessage({ text: error.message || 'Erro ao alterar a senha.', type: 'error' })
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('codelab_')) {
          localStorage.removeItem(key)
        }
      })
    }
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
          <span className="text-sm text-gray-400">Carregando painel de controle...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-x-hidden animate-fadeIn">
      
      {/* Header Superior */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-400 transition shrink-0 cursor-pointer"
            >
              <span>⚡ Voltar para a Trilha de Aulas</span>
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs text-gray-400 bg-gray-800/60 px-3 py-1.5 rounded-full border border-gray-700/50 truncate max-w-[180px]">
              {userName}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg transition cursor-pointer shrink-0"
            >
              Sair
            </button>
          </div>

          <div className="flex sm:hidden items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-emerald-400 font-bold transition cursor-pointer active:scale-95"
              aria-label="Menu"
            >
              <span className="text-lg leading-none">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Menu Dropdown Mobile */}
      {menuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 space-y-3 z-50 shadow-2xl animate-fadeIn">
          <div className="px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 truncate">
            👤 Logado como: <strong className="text-emerald-400">{userName}</strong>
          </div>
          <Link 
            href="/dashboard" 
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold text-emerald-400"
          >
            Voltar para a Trilha de Aulas
          </Link>
          <Link 
            href="/medalhas" 
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold text-amber-400"
          >
            🏆 Ver Painel de Medalhas
          </Link>
          <button
            onClick={() => { setMenuOpen(false); handleLogout(); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-xl text-xs cursor-pointer"
          >
            <span>🚪 Sair da Conta</span>
          </button>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Painel de Controle 🚀</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Gerencie seu perfil, segurança e acompanhe seu progresso na trilha, {userName}.</p>
          </div>
          <div className="flex items-center self-start md:self-auto gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Sessão Autenticada
            </span>
          </div>
        </div>

        {/* Grid Superior: Progresso Geral na Trilha + Atalho para Medalhas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card de Progresso Geral na Trilha */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-gray-900 to-gray-900 border border-emerald-500/20 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between gap-4 lg:col-span-2">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Módulo 1 • JavaScript do Zero ao Avançado</span>
              <h3 className="text-base sm:text-lg font-bold text-white">Seu Desempenho na Trilha de Aulas</h3>
              <p className="text-xs text-gray-300">
                Você já concluiu <strong className="text-emerald-400">{completedCount} de {totalLessonsCount}</strong> aulas oficiais do curso.
              </p>
            </div>
            <div>
              <Link
                href="/dashboard"
                className="inline-block px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition text-center cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Continuar Estudos ⚡
              </Link>
            </div>
          </div>

          {/* Atalho para a Página de Medalhas */}
          <Link
            href="/medalhas"
            className="bg-gray-900 hover:bg-gray-800/80 border border-gray-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 transition cursor-pointer shadow-xl group lg:col-span-1"
          >
            <div className="space-y-1">
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center text-lg mb-3">
                🏆
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition">Painel de Medalhas</h3>
              <p className="text-xs text-gray-400">
                Acompanhe seus emblemas conquistados e veja o que falta para desbloquear novos.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
              <span>Ver conquistas</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

        </div>

        {/* Grid de Informações, Perfil, Linha do Tempo e Segurança */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="space-y-6 lg:col-span-1">
            {/* Bloco de Informações */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg">
              <h3 className="text-base sm:text-lg font-bold">Informações</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-500 block mb-1">Nome Cadastrado</span>
                  <span className="text-white font-medium bg-gray-800/60 px-3 py-2 rounded-lg block border border-gray-800 truncate">
                    {userName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">E-mail</span>
                  <span className="text-white font-medium bg-gray-800/60 px-3 py-2 rounded-lg block border border-gray-800 truncate">
                    {userEmail}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Dispositivo / Navegador</span>
                  <span className="text-blue-400 font-medium bg-gray-800/60 px-3 py-2 rounded-lg block border border-gray-800 truncate">
                    {deviceInfo}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Último Acesso</span>
                  <span className="text-emerald-400 font-medium bg-gray-800/60 px-3 py-2 rounded-lg block border border-gray-800 truncate">
                    {lastSignIn}
                  </span>
                </div>
              </div>
            </div>

            {/* Linha do Tempo de Atividades Recentes */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg">
              <div>
                <h3 className="text-base font-bold">Atividades Recentes ⏳</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Seus últimos passos na trilha.</p>
              </div>

              {recentActivities.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-2">Nenhuma atividade recente registrada ainda. Conclua sua primeira aula!</p>
              ) : (
                <div className="space-y-3 pt-1 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-gray-800">
                  {recentActivities.map((act, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 group">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 z-10 shadow-sm">
                        ✓
                      </div>
                      <div className="bg-gray-950/60 border border-gray-800/80 rounded-xl p-2.5 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between text-[10px] text-gray-500">
                          <span className="uppercase">{act.lesson_id}</span>
                          <span>{new Date(act.updated_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <p className="text-xs font-semibold text-white">Aula concluída na trilha</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            
            {/* Bloco de Alteração de Nome */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg">
              <div>
                <h3 className="text-base sm:text-lg font-bold">Nome de Exibição</h3>
                <p className="text-xs text-gray-400 mt-0.5">Atualize como você aparece para os outros alunos na plataforma e no Ranking.</p>
              </div>

              {nameMessage.text && (
                <div className={`p-3 text-xs rounded-lg border ${
                  nameMessage.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {nameMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdateName} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Seu Nome</label>
                  <input
                    type="text"
                    value={editableName}
                    onChange={(e) => setEditableName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={nameLoading}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition font-bold rounded-lg text-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {nameLoading ? 'Salvando...' : 'Salvar Nome'}
                </button>
              </form>
            </div>

            {/* Bloco de Segurança (Senha) */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg">
              <div>
                <h3 className="text-base sm:text-lg font-bold">Segurança</h3>
                <p className="text-xs text-gray-400 mt-0.5">Atualize sua senha de acesso à plataforma.</p>
              </div>

              {passwordMessage.text && (
                <div className={`p-3 text-xs rounded-lg border ${
                  passwordMessage.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {passwordMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Nova Senha</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Confirme a Nova Senha</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                </div>

                <div className="p-3 bg-gray-950/60 border border-gray-800 rounded-xl space-y-1.5 text-xs">
                  <p className="text-gray-400 font-medium mb-1">A nova senha deve conter:</p>
                  <div className={`flex items-center gap-2 transition-colors ${hasMinLength ? 'text-emerald-400' : 'text-gray-500'}`}>
                    <span>{hasMinLength ? '✓' : '○'}</span>
                    <span>Mínimo de 8 caracteres</span>
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${hasUpperCase ? 'text-emerald-400' : 'text-gray-500'}`}>
                    <span>{hasUpperCase ? '✓' : '○'}</span>
                    <span>Pelo menos uma letra maiúscula</span>
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${hasNumber ? 'text-emerald-400' : 'text-gray-500'}`}>
                    <span>{hasNumber ? '✓' : '○'}</span>
                    <span>Pelo menos um número</span>
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${hasSpecialChar ? 'text-emerald-400' : 'text-gray-500'}`}>
                    <span>{hasSpecialChar ? '✓' : '○'}</span>
                    <span>Pelo menos um caracter especial (ex: @, #, $, !)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading || !hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition font-bold rounded-lg text-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></span>
                      Alterando...
                    </>
                  ) : (
                    'Alterar Senha'
                  )}
                </button>
              </form>
            </div>

            {/* Zona de Perigo */}
            <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-5 sm:p-6 space-y-3 shadow-lg">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-red-400">Zona de Perigo</h3>
                <p className="text-xs text-gray-400 mt-0.5">Ações irreversíveis relacionadas à sua conta na plataforma.</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <span className="text-xs text-gray-400">Excluir permanentemente sua conta e todos os dados associados.</span>
                <Link
                  href="/painel/excluir-conta"
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold rounded-lg text-xs transition cursor-pointer shrink-0 text-center"
                >
                  Excluir Conta
                </Link>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  )
}