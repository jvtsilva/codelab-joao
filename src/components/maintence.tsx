'use client'

import { useState, useEffect } from 'react'

export default function MaintenancePage() {
  const [pontos, setPontos] = useState('.')

  useEffect(() => {
    const interval = setInterval(() => {
      setPontos((prev) => (prev.length >= 3 ? '.' : `${prev}.`))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#030407] text-gray-100 flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-gray-950 font-sans antialiased relative overflow-hidden">
      {/* Efeito de luz esmeralda decorativo */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"
      />

      <div className="max-w-lg w-full bg-gray-900/80 border border-gray-800/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-2xl relative z-10">
        {/* Ícone de status */}
        <div
          aria-hidden="true"
          className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 relative"
        >
          <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-md opacity-50" />
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping absolute" />
          <span className="w-3 h-3 rounded-full bg-emerald-400 relative z-10" />
        </div>

        {/* Textos principais */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl inline-block shadow-sm">
            Modo Manutenção • Codelab João
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Atualizando a plataforma<span aria-hidden="true">{pontos}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm mx-auto">
            Estamos aplicando melhorias e preparando novidades para deixar sua experiência de aprendizado ainda melhor.
          </p>
        </div>

        {/* Painel ilustrativo de status */}
        <div className="bg-[#010204] border border-gray-800/80 rounded-2xl p-4 text-left font-mono text-[11px] text-emerald-400 space-y-1.5 shadow-inner">
          <div
            aria-hidden="true"
            className="flex items-center justify-between text-gray-600 border-b border-gray-900 pb-2 mb-2"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
            </span>
            <span>status</span>
          </div>
          <p className="text-gray-400">&gt; Aplicando melhorias na plataforma...</p>
          <p className="text-gray-300">&gt; Sincronizando aulas e desafios...</p>
          <p className="text-emerald-400 font-bold">
            &gt; Plataforma em atualização. Volte em breve. 🚀
          </p>
        </div>

        {/* Rodapé discreto */}
        <div className="pt-2">
          <p className="text-[11px] font-mono text-gray-500 tracking-wide">
            Fones de ouvido ativados • Foco total 🎧
          </p>
        </div>
      </div>
    </div>
  )
}