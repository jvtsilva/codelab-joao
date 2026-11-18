import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codelab João",
  description: "Plataforma de aprendizado e desafios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 🟢 Mude para 'true' para ativar a manutenção global
  const EM_MANUTENCAO = true; 

  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased animate-fadeIn">
        {EM_MANUTENCAO ? (
          <div className="min-h-screen bg-[#07080b] text-gray-200 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-900/60 border border-gray-800 p-8 rounded-2xl text-center space-y-6">
              <h1 className="text-xl font-bold text-white">Sistema em Manutenção</h1>
              <p className="text-sm text-gray-400">Voltamos em breve com novidades no Codelab!</p>
            </div>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}