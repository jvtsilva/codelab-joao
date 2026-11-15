'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PainelPage() {
  const [userName, setUserName] = useState<string>('Usuário')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [lastSignIn, setLastSignIn] = useState<string | null>(null)
  const [deviceInfo, setDeviceInfo] = useState<string>('Detectando...')
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

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

  // Estados para exclusão de conta
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
      } else {
        const metadata = session.user.user_metadata
        const nameFromMeta = metadata?.full_name || metadata?.name || 'Aluno'
        
        setUserName(nameFromMeta)
        setUserEmail(session.user.email ?? 'E-mail não informado')
        setUserId(session.user.id)
        
        if (session.user.last_sign_in_at) {
          const date = new Date(session.user.last_sign_in_at)
          setLastSignIn(date.toLocaleString('pt-BR'))
        } else {
          setLastSignIn('Sessão ativa recente')
        }

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

    getUser()
  }, [router])

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

      localStorage.removeItem('codelab_user_xp')
      localStorage.removeItem('codelab_visitante_desafio_1')

      await supabase.auth.signOut()
      setDeleteLoading(false)
      setDeleteSuccess(true)

    } catch (error: any) {
      setDeleteError(error.message || 'Não foi possível excluir a conta.')
      setDeleteLoading(false)
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('codelab_user_xp')
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700/60 rounded-lg text-xs font-medium text-emerald-400 transition shrink-0 cursor-pointer"
            >
              <span>Voltar para os estudos</span>
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
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Gerencie as configurações e a segurança da sua conta, {userName}.</p>
          </div>
          <div className="flex items-center self-start md:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Sessão Autenticada
            </span>
          </div>
        </div>

        {/* Grid de Informações e Segurança */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-4 lg:col-span-1 shadow-lg">
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

          <div className="space-y-6 lg:col-span-2">
            
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

            <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-5 sm:p-6 space-y-3 shadow-lg">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-red-400">Zona de Perigo</h3>
                <p className="text-xs text-gray-400 mt-0.5">Ações irreversíveis relacionadas à sua conta na plataforma.</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <span className="text-xs text-gray-400">Excluir permanentemente sua conta e todos os dados associados.</span>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold rounded-lg text-xs transition cursor-pointer shrink-0 text-center"
                >
                  Excluir Conta
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Modal Responsivo de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 max-w-md w-full p-5 sm:p-6 rounded-2xl space-y-4 shadow-2xl">
            
            {deleteSuccess ? (
              <div className="py-4 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Até logo, {userName}! 👋</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Sua conta foi excluída com sucesso. Foi incrível ter você com a gente no Codelab João. Sucesso na sua jornada e até a próxima! 🚀
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold rounded-lg text-xs transition cursor-pointer mt-2"
                >
                  Voltar para a Página de Login
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-base sm:text-lg font-bold text-red-400">Deseja realmente excluir sua conta?</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Esta ação é <strong className="text-white">definitiva e irreversível</strong>, {userName}. Todos os seus dados e acessos serão apagados permanentemente do Codelab João.
                </p>

                {deleteError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
                    {deleteError}
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleteLoading}
                    className="w-full sm:w-auto px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg text-xs transition cursor-pointer text-center"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
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
      )}
    </div>
  )
}