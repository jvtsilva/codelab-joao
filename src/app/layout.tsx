import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codelab João",
  description: "Plataforma de aprendizado e desafios",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const EM_MANUTENCAO = false;

  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isLocalhost =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]");

  const mostrarManutencao = EM_MANUTENCAO && !isLocalhost;

  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className="antialiased bg-gray-950 text-white"
        suppressHydrationWarning
      >
        {mostrarManutencao ? (
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