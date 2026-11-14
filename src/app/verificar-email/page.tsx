'use client'

export default function VerificarEmailPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative">
        
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl mx-auto shadow-inner mb-5 text-emerald-400">
          📩
        </div>
        
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
          Verifique seu e-mail
        </h1>
        
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
          Enviamos um link de confirmação para o seu e-mail. Acesse sua caixa de entrada (e a aba de spam) para ativar sua conta. 
        </p>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-500 text-[11px] leading-relaxed">
          💡 Assim que você clicar no link do e-mail, sua conta será ativada automaticamente e você será logado na plataforma.
        </div>
      </div>
    </div>
  )
}