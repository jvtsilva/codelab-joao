'use client'

import Link from 'next/link'

export default function VerificarEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center shadow-2xl">
        <div className="text-5xl mb-4">📩</div>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          Verifique seu e-mail
        </h1>
        
        <p className="text-gray-400 text-sm mb-6">
          Enviamos um link de confirmação para o seu e-mail. Acesse sua caixa de entrada (e a aba de spam) para ativar sua conta e liberar o acesso ao Codelab.
        </p>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition duration-200"
          >
            Já confirmei, ir para o Login
          </Link>
        </div>
      </div>
    </div>
  )
}