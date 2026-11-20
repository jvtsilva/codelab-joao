'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

interface RecentActivity {
  lesson_id: string
  updated_at: string
  completed: boolean
}

const STORAGE_KEY = 'codelab_tema_aula'
const TOTAL_AULAS_MODULO_1 = 18
const XP_POR_AULA = 50

export default function PainelPage() {
  const [userName, setUserName] = useState<string>('Aluno')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [lastSignIn, setLastSignIn] = useState<string | null>(null)
  const [deviceInfo, setDeviceInfo] = useState<string>('Detectando...')
  const [completedCount, setCompletedCount] = useState<number>(0)
  const [lessonsXp, setLessonsXp] = useState<number>(0)
  const [challengesXp, setChallengesXp] = useState<number>(0)
  const [totalXP, setTotalXP] = useState<number>(0)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(true)

  // Estados para alteração de nome
  const [editableName, setEditableName] = useState('')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameMessage, setNameMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({
    text: '',
    type: '',
  })

  // Estados para alteração de senha
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{
    text: string
    type: 'success' | 'error' | ''
  }>({
    text: '',
    type: '',
  })

  // Validações em tempo real para a nova senha
  const hasMinLength = newPassword.length >= 8
  const hasUpperCase = /[A-Z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword)
  const passwordsMatch = confirmPassword.length > 0 ? newPassword === confirmPassword : true

  const router = useRouter()

  useLayoutEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    const escuro = salvo !== 'light'
    setIsDark(escuro)
    document.documentElement.classList.toggle('dark', escuro)
    document.documentElement.style.backgroundColor = escuro ? '#030712' : '#fafaf9'
  }, [])

  useEffect(() => {
    let active = true

    async function getUserAndProgress() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!active) return

      if (!session) {
        router.push('/login')
        return
      }

      const currentUserId = session.user.id
      setUserId(currentUserId)

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

      let xpAulas = 0
      let xpDesafios = 0

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id, completed, updated_at')
        .eq('user_id', currentUserId)

      if (!active) return

      if (progressData) {
        const count = progressData.filter((item) => item.completed).length
        setCompletedCount(count)
        xpAulas = count * XP_POR_AULA

        const sortedActivities = progressData
          .filter((item) => item.completed)
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 3)

        setRecentActivities(sortedActivities)
      }

      const { data: challengesData } = await supabase
        .from('user_challenges')
        .select('xp_earned')
        .eq('user_id', currentUserId)

      if (!active) return

      if (challengesData) {
        challengesData.forEach((item) => {
          xpDesafios += item.xp_earned || 0
        })
      }

      setLessonsXp(xpAulas)
      setChallengesXp(xpDesafios)
      setTotalXP(xpAulas + xpDesafios)

      const ua = navigator.userAgent
      let browser = 'Navegador desconhecido'
      let os = 'Dispositivo desconhecido'

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

    getUserAndProgress()

    return () => {
      active = false
    }
  }, [router])

  const alternarTema = () => {
    setIsDark((atual) => {
      const proximo = !atual
      localStorage.setItem(STORAGE_KEY, proximo ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', proximo)
      document.documentElement.style.backgroundColor = proximo ? '#030712' : '#fafaf9'
      return proximo
    })
  }

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameMessage({ text: '', type: '' })

    const cleanName = editableName.trim()
    if (!cleanName) {
      setNameMessage({ text: 'Informe um nome válido.', type: 'error' })
      return
    }

    setNameLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: cleanName },
      })

      if (error) throw error

      setUserName(cleanName)
      setEditableName(cleanName)
      setNameMessage({ text: 'Nome atualizado.', type: 'success' })
      router.refresh()
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erro ao alterar o nome.'
      setNameMessage({ text: msg, type: 'error' })
    } finally {
      setNameLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage({ text: '', type: '' })

    if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      setPasswordMessage({
        text: 'A nova senha precisa atender a todos os requisitos de segurança.',
        type: 'error',
      })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'As senhas não coincidem.', type: 'error' })
      return
    }

    setPasswordLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setPasswordMessage({ text: 'Senha alterada.', type: 'success' })
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erro ao alterar a senha.'
      setPasswordMessage({ text: msg, type: 'error' })
    } finally {
      setPasswordLoading(false)
    }
  }

  const progressPercent = Math.min(100, Math.round((completedCount / TOTAL_AULAS_MODULO_1) * 100))

  const cardClasses =
    'bg-white border-stone-200 text-stone-900 shadow-xs dark:bg-gray-900 dark:border-gray-800 dark:text-white dark:shadow-lg'

  const fieldBoxClasses =
    'bg-stone-50 border-stone-200 text-stone-900 dark:bg-gray-800/60 dark:border-gray-800 dark:text-white'

  const inputClasses =
    'bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 dark:bg-gray-950 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-500'

  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const textSubtleClasses = 'text-stone-500 dark:text-gray-500'
  const accentGreenClasses = 'text-emerald-700 dark:text-emerald-400'
  const accentAmberClasses = 'text-amber-700 dark:text-amber-400'
  const accentBlueClasses = 'text-blue-700 dark:text-blue-400'
  const accentRedClasses = 'text-red-700 dark:text-red-400'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin border-emerald-700 dark:border-emerald-500" />
          <span className={`text-sm ${textMutedClasses}`}>Carregando painel...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden selection:bg-emerald-500 selection:text-gray-950 bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white">
      <Navbar
        activeTab="painel"
        subtitle="Painel Codelab"
        userId={userId}
        userXp={totalXP}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
              Painel de Controle 🚀
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${textMutedClasses}`}>
              Gerencie seu perfil, senha e acompanhe seu progresso,{' '}
              <strong className="text-stone-900 dark:text-white">{userName}</strong>.
            </p>
          </div>
          <div className="flex items-center self-start md:self-auto gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sessão ativa
            </span>
          </div>
        </div>

        {/* Grid Superior: Progresso Geral na Trilha + Atalho para Medalhas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 lg:col-span-2 bg-white border-emerald-600/25 shadow-sm dark:bg-gray-900 dark:border-emerald-500/25 dark:shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${accentGreenClasses}`}>
                  Módulo 1 • JavaScript
                </span>
                <span className={`text-xs font-extrabold ${accentGreenClasses}`}>
                  {progressPercent}%
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
                Seu Desempenho na Trilha
              </h3>
              <p className={`text-xs ${textMutedClasses}`}>
                Você concluiu{' '}
                <strong className={accentGreenClasses}>
                  {completedCount} de {TOTAL_AULAS_MODULO_1}
                </strong>{' '}
                aulas.
              </p>
              <div className="w-full h-2 rounded-full overflow-hidden bg-stone-100 dark:bg-gray-950">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div>
              <Link
                href="/dashboard"
                className="inline-block px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl text-center cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Continuar Estudos ⚡
              </Link>
            </div>
          </div>

          <Link
            href="/medalhas"
            className={`border rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 cursor-pointer group lg:col-span-1 ${cardClasses} hover:border-amber-600/40 dark:hover:border-amber-500/40`}
          >
            <div className="space-y-1">
              <div className="w-10 h-10 border rounded-xl flex items-center justify-center text-lg mb-3 bg-amber-50 border-amber-600/25 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400">
                🏆
              </div>
              <h3 className="text-base font-bold group-hover:text-amber-700 dark:group-hover:text-amber-400">
                Painel de Medalhas
              </h3>
              <p className={`text-xs ${textMutedClasses}`}>
                Veja suas medalhas conquistadas e acompanhe seu XP.
              </p>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold ${accentAmberClasses}`}>
              <span>Ver conquistas</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>

        {/* Detalhamento de XP: Aulas vs Desafios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className={`border rounded-2xl p-5 flex items-center justify-between gap-4 ${cardClasses}`}>
            <div className="space-y-1 min-w-0">
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${accentGreenClasses}`}>
                Trilha de Estudos
              </span>
              <h3 className="text-sm sm:text-base font-bold truncate">
                XP das Aulas
              </h3>
              <p className={`text-xs ${textMutedClasses}`}>
                {XP_POR_AULA} XP por aula concluída ({completedCount} {completedCount === 1 ? 'aula' : 'aulas'}).
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-lg sm:text-xl font-black ${accentGreenClasses}`}>
                {lessonsXp.toLocaleString('pt-BR')} XP
              </span>
              <span className={`block text-[10px] uppercase tracking-wider ${textSubtleClasses}`}>
                Aulas
              </span>
            </div>
          </div>

          <div className={`border rounded-2xl p-5 flex items-center justify-between gap-4 ${cardClasses}`}>
            <div className="space-y-1 min-w-0">
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${accentAmberClasses}`}>
                Arena de Desafios
              </span>
              <h3 className="text-sm sm:text-base font-bold truncate">
                XP dos Desafios
              </h3>
              <p className={`text-xs ${textMutedClasses}`}>
                Pontos conquistados resolvendo desafios práticos.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-lg sm:text-xl font-black ${accentAmberClasses}`}>
                {challengesXp.toLocaleString('pt-BR')} XP
              </span>
              <span className={`block text-[10px] uppercase tracking-wider ${textSubtleClasses}`}>
                Desafios
              </span>
            </div>
          </div>
        </div>

        {/* Grid Inferior: Informações, Atividades, Perfil, Segurança e Exclusão */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-1">
            {/* Informações */}
            <div className={`border rounded-2xl p-5 sm:p-6 space-y-4 ${cardClasses}`}>
              <h3 className="text-base sm:text-lg font-bold">Informações</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className={`block mb-1 ${textSubtleClasses}`}>Nome cadastrado</span>
                  <span className={`font-medium px-3 py-2 rounded-lg block border truncate ${fieldBoxClasses}`}>
                    {userName}
                  </span>
                </div>
                <div>
                  <span className={`block mb-1 ${textSubtleClasses}`}>E-mail</span>
                  <span className={`font-medium px-3 py-2 rounded-lg block border truncate ${fieldBoxClasses}`}>
                    {userEmail}
                  </span>
                </div>
                <div>
                  <span className={`block mb-1 ${textSubtleClasses}`}>Dispositivo / Navegador</span>
                  <span className={`font-medium px-3 py-2 rounded-lg block border truncate ${fieldBoxClasses} ${accentBlueClasses}`}>
                    {deviceInfo}
                  </span>
                </div>
                <div>
                  <span className={`block mb-1 ${textSubtleClasses}`}>Último acesso</span>
                  <span className={`font-medium px-3 py-2 rounded-lg block border truncate ${fieldBoxClasses} ${accentGreenClasses}`}>
                    {lastSignIn}
                  </span>
                </div>
              </div>
            </div>

            {/* Atividades Recentes */}
            <div className={`border rounded-2xl p-5 sm:p-6 space-y-4 ${cardClasses}`}>
              <div>
                <h3 className="text-base font-bold">Atividades Recentes ⏳</h3>
                <p className={`text-[11px] mt-0.5 ${textMutedClasses}`}>
                  Seus últimos passos na trilha.
                </p>
              </div>

              {recentActivities.length === 0 ? (
                <p className={`text-xs italic py-2 ${textSubtleClasses}`}>
                  Nenhuma atividade registrada ainda. Conclua sua primeira aula.
                </p>
              ) : (
                <div className="space-y-3 pt-1">
                  {recentActivities.map((act, idx) => (
                    <div key={`${act.lesson_id}-${idx}`} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px] shrink-0 mt-0.5 bg-emerald-50 border-emerald-600/30 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-400">
                        ✓
                      </div>
                      <div className="border rounded-xl p-2.5 flex-1 space-y-0.5 bg-stone-50 border-stone-200 dark:bg-gray-950/60 dark:border-gray-800/80">
                        <div className={`flex items-center justify-between text-[10px] ${textSubtleClasses}`}>
                          <span className="uppercase">{act.lesson_id}</span>
                          <span>{new Date(act.updated_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <p className="text-xs font-semibold">Aula concluída</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            {/* Nome de Exibição */}
            <div className={`border rounded-2xl p-5 sm:p-6 space-y-4 ${cardClasses}`}>
              <div>
                <h3 className="text-base sm:text-lg font-bold">Nome de Exibição</h3>
                <p className={`text-xs mt-0.5 ${textMutedClasses}`}>
                  Como seu nome aparece na plataforma e no Ranking.
                </p>
              </div>

              {nameMessage.text && (
                <div
                  className={`p-3 text-xs rounded-xl border ${
                    nameMessage.type === 'success'
                      ? 'bg-emerald-50 border-emerald-600/30 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                      : 'bg-red-50 border-red-600/30 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'
                  }`}
                >
                  {nameMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdateName} className="space-y-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textMutedClasses}`}>
                    Seu nome
                  </label>
                  <input
                    type="text"
                    value={editableName}
                    onChange={(e) => setEditableName(e.target.value)}
                    required
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none text-sm ${inputClasses}`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={nameLoading}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold rounded-xl text-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {nameLoading ? 'Salvando...' : 'Salvar Nome'}
                </button>
              </form>
            </div>

            {/* Segurança (Senha) */}
            <div className={`border rounded-2xl p-5 sm:p-6 space-y-4 ${cardClasses}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold">Segurança</h3>
                  <p className={`text-xs mt-0.5 ${textMutedClasses}`}>
                    Atualize sua senha de acesso.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => !prev)}
                  className={`text-xs font-semibold cursor-pointer ${accentGreenClasses} hover:underline`}
                >
                  {showPasswords ? 'Ocultar senhas' : 'Mostrar senhas'}
                </button>
              </div>

              {passwordMessage.text && (
                <div
                  className={`p-3 text-xs rounded-xl border ${
                    passwordMessage.type === 'success'
                      ? 'bg-emerald-50 border-emerald-600/30 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                      : 'bg-red-50 border-red-600/30 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${textMutedClasses}`}>
                      Nova senha
                    </label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none text-sm ${inputClasses}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${textMutedClasses}`}>
                      Confirme a nova senha
                    </label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none text-sm ${inputClasses}`}
                    />
                  </div>
                </div>

                {!passwordsMatch && (
                  <p className={`text-xs font-medium ${accentRedClasses}`}>
                    As senhas não coincidem.
                  </p>
                )}

                <div className="p-3 border rounded-xl space-y-1.5 text-xs bg-stone-50 border-stone-200 dark:bg-gray-950/60 dark:border-gray-800">
                  <p className={`font-medium mb-1 ${textMutedClasses}`}>A nova senha deve conter:</p>
                  <div className={`flex items-center gap-2 ${hasMinLength ? accentGreenClasses : textSubtleClasses}`}>
                    <span>{hasMinLength ? '✓' : '○'}</span>
                    <span>Mínimo de 8 caracteres</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasUpperCase ? accentGreenClasses : textSubtleClasses}`}>
                    <span>{hasUpperCase ? '✓' : '○'}</span>
                    <span>Pelo menos uma letra maiúscula</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasNumber ? accentGreenClasses : textSubtleClasses}`}>
                    <span>{hasNumber ? '✓' : '○'}</span>
                    <span>Pelo menos um número</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasSpecialChar ? accentGreenClasses : textSubtleClasses}`}>
                    <span>{hasSpecialChar ? '✓' : '○'}</span>
                    <span>Pelo menos um caractere especial (ex: @, #, $, !)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    passwordLoading ||
                    !hasMinLength ||
                    !hasUpperCase ||
                    !hasNumber ||
                    !hasSpecialChar ||
                    !passwordsMatch
                  }
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold rounded-xl text-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                      Alterando...
                    </>
                  ) : (
                    'Alterar Senha'
                  )}
                </button>
              </form>
            </div>

            {/* Zona de Perigo */}
            <div className="border rounded-2xl p-5 sm:p-6 space-y-3 bg-white border-red-600/25 shadow-sm dark:bg-gray-900 dark:border-red-500/20 dark:shadow-lg">
              <div>
                <h3 className={`text-base sm:text-lg font-bold ${accentRedClasses}`}>
                  Zona de Perigo
                </h3>
                <p className={`text-xs mt-0.5 ${textMutedClasses}`}>
                  Ação definitiva na sua conta.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <span className={`text-xs ${textMutedClasses}`}>
                  Excluir conta, progresso e dados associados.
                </span>
                <Link
                  href="/painel/excluir-conta"
                  className="px-4 py-2 border font-semibold rounded-xl text-xs cursor-pointer shrink-0 text-center bg-red-50 hover:bg-red-100 border-red-600/30 text-red-700 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:border-red-500/30 dark:text-red-400"
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