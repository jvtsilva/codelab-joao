'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setAuthError('Por favor, digite um e-mail válido.')
      return
    }

    setIsLoading(true)

    try {
      setStatusMessage('Verificando credenciais...')
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (error) {
        setAuthError('E-mail ou senha incorretos.')
        setStatusMessage('')
        setIsLoading(false)
      } else {
        setStatusMessage('✨ Login efetuado com sucesso!')
        await new Promise(resolve => setTimeout(resolve, 1000))
        router.push('/') // Manda para a página principal logado
      }
    } catch (err) {
      setAuthError('Ocorreu um erro inesperado.')
      setStatusMessage('')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-3 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 space-y-4 shadow-2xl relative my-auto box-border">
        
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Acessar plataforma
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Entre para salvar seu progresso.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl mx-auto flex items-center justify-center text-lg font-bold animate-spin">
              ⏳
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-bold text-sm px-2">{statusMessage}</h4>
              <p className="text-[11px] text-slate-400">Aguarde um instante...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-3.5">
            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs leading-relaxed">
                {authError}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 box-border"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 box-border"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/10 mt-1 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <span>Entrar na Trilha →</span>
            </button>
          </form>
        )}

        {!isLoading && (
          <div className="text-center pt-2 border-t border-slate-800/80">
            <Link 
              href="/cadastro"
              className="text-[11px] text-slate-400 hover:text-emerald-400 font-medium px-2 py-1 inline-block no-underline"
            >
              Não tem conta? Cadastre-se
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}