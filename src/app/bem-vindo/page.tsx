'use client'

import Link from 'next/link'

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-950 text-white text-center animate-fadeIn">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl space-y-6">
        
        <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
          🎉
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px] rounded-full">
            CONTA CRIADA COM SUCESSO
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">Bem-vindo ao Codelab!</h1>
          <p className="text-xs text-gray-400">
            Sua conta está pronta. Agora você tem acesso completo à nossa trilha prática de programação. Vamos começar?
          </p>
        </div>

        <Link
          href="/dashboard"
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition-all font-extrabold rounded-xl text-xs shadow-lg shadow-emerald-500/20 block cursor-pointer"
        >
          Acessar minha Trilha de Estudos ⚡
        </Link>
      </div>
    </div>
  )
}