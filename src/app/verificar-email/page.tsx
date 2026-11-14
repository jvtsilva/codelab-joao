'use client'

import { useState, Suspense } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter, useSearchParams } from 'next/navigation'

function VerificarEmailContent() {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleConfirmarConta = async () => {
    if (!code) {
      setErrorMessage('Código de confirmação não encontrado ou inválido.')
      return
    }

    setLoading(true)
    setErrorMessage('')

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error

      router.push('/dashboard')
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao confirmar a conta. O link pode ter expirado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center shadow-xl space-y-6">
      <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto text-xl">
        ✉️
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">Confirmação de E-mail</h2>
        <p className="text-gray-400 text-sm">
          Clique no botão abaixo para confirmar o seu endereço de e-mail e ativar definitivamente a sua conta na plataforma.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-left">
          {errorMessage}
        </div>
      )}

      <button
        onClick={handleConfirmarConta}
        disabled={loading || !code}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 transition font-medium rounded-xl text-sm disabled:opacity-50 shadow-lg shadow-indigo-600/20"
      >
        {loading ? 'Confirmando conta...' : 'Confirmar e acessar'}
      </button>

      {!code && (
        <p className="text-xs text-amber-400">
          Link inválido ou sem código de verificação. Certifique-se de abrir o link correto enviado por e-mail.
        </p>
      )}
    </div>
  )
}

export default function VerificarEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
      <Suspense fallback={<div className="text-white">Carregando...</div>}>
        <VerificarEmailContent />
      </Suspense>
    </div>
  )
}