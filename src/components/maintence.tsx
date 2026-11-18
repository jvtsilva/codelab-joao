export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#07080b] text-gray-200 flex items-center justify-center p-4 font-sans selection:bg-emerald-500 selection:text-gray-950">
      <div className="max-w-md w-full bg-gray-900/60 border border-gray-800 p-8 rounded-2xl text-center space-y-6 shadow-2xl">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center mx-auto">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white tracking-tight">Sistema em Manutenção</h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Estamos aplicando atualizações de arquitetura e melhorias estruturais no Codelab João. Retornaremos em breve.
          </p>
        </div>

        <div className="pt-2 text-[11px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/5 border border-emerald-500/10 py-2 rounded-lg">
          Status: Atualizando o Código
        </div>
      </div>
    </div>
  )
}