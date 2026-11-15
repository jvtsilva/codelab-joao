'use client'

import { useRouter } from 'next/navigation'

export default function ContatoPage() {
  const router = useRouter()

  const whatsappNumber = '5519995200014'
  const instagramUser = 'jvsilva.dev'
  const emailContato = 'codelab.joao@gmail.com'

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Olá%20João,%20estou%20entrando%20em%20contato%20através%20da%20plataforma%20Codelab.`
  const instagramUrl = `https://instagram.com/${instagramUser}`

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-gray-950 overflow-x-hidden animate-fadeIn">
      
      {/* Top Bar / Header Ajustado e Elegante */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="px-2.5 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-lg border border-emerald-500/30 select-none">
            JS
          </div>
          <h1 className="font-bold text-sm sm:text-base tracking-wide truncate">
            Codelab <span className="text-emerald-400 font-normal">João</span>
          </h1>
        </div>

        {/* Botão Voltar Inteligente (Retorna à tela anterior de onde o usuário veio) */}
        <button 
          onClick={() => router.back()}
          className="text-xs font-semibold text-gray-300 hover:text-white transition px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
        >
          <span>Voltar à tela anterior</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center items-center">
        <div className="w-full bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
          
          <div className="text-center space-y-3 flex flex-col items-center">
            <span className="inline-block px-3.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs rounded-full">
              SUPORTE E ATENDIMENTO 💬
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Central de Ajuda e Feedback
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm mx-auto">
              Em caso de dúvidas com o código, reporte de problemas ou envio de sugestões, utilize um dos canais oficiais de comunicação abaixo.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-4 bg-emerald-500/5 hover:bg-emerald-500/15 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 rounded-2xl transition flex items-center gap-4 group shadow-lg cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                💬
              </div>
              <div className="text-left min-w-0">
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Atendimento Rápido</p>
                <p className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-400 transition truncate">Contatos via WhatsApp</p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-4 bg-pink-500/5 hover:bg-pink-500/15 border border-pink-500/30 hover:border-pink-500/60 text-pink-300 rounded-2xl transition flex items-center gap-4 group shadow-lg cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                📸
              </div>
              <div className="text-left min-w-0">
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Redes Sociais</p>
                <p className="font-bold text-sm sm:text-base text-white group-hover:text-pink-400 transition truncate">@{instagramUser}</p>
              </div>
            </a>

            {/* E-mail */}
            <a
              href={`mailto:${emailContato}`}
              className="w-full py-4 px-4 bg-blue-500/5 hover:bg-blue-500/15 border border-blue-500/30 hover:border-blue-500/60 text-blue-300 rounded-2xl transition flex items-center gap-4 group shadow-lg cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                ✉️
              </div>
              <div className="text-left min-w-0">
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Envio de Sugestões</p>
                <p className="font-bold text-xs sm:text-sm text-white group-hover:text-blue-400 transition truncate">{emailContato}</p>
              </div>
            </a>
          </div>

          <div className="pt-2 text-center border-t border-gray-800/80">
            <p className="text-[11px] text-gray-500 pt-3">
              Retornaremos o contato com brevidade. Bons estudos!
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 px-4 sm:px-8 py-6 text-center text-xs text-gray-500 max-w-5xl mx-auto w-full">
        <p>Codelab João • Plataforma educacional voltada para o aprendizado prático</p>
      </footer>

    </div>
  )
}