import type { Metadata } from "next";
import { headers } from "next/headers";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Codelab João",
  description: "Plataforma de aprendizado e desafios",
};

const THEME_INIT_SCRIPT = `
try {
  var saved = localStorage.getItem('codelab_tema_aula');
  var dark = saved !== 'light';
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.backgroundColor = dark ? '#030712' : '#fafaf9';
} catch (e) {}
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const emManutencao = process.env.MAINTENANCE_MODE === "true";

  let mostrarManutencao = false;
  if (emManutencao) {
    const headersList = await headers();
    const rawHost = (headersList.get("host") || "").toLowerCase().trim();
    const isLocalhost =
      rawHost.startsWith("localhost") ||
      rawHost.startsWith("127.0.0.1") ||
      rawHost.startsWith("[::1]");
    mostrarManutencao = !isLocalhost;
  }

  return (
    <html
      lang="pt-BR"
      className={`dark ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className="font-sans antialiased bg-gray-950 text-white"
        suppressHydrationWarning
      >
        {mostrarManutencao ? (
          <div className="min-h-screen bg-[#07080b] text-gray-200 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-900/60 border border-gray-800 p-8 rounded-2xl text-center space-y-6">
              <h1 className="text-xl font-bold text-white">Sistema em Manutenção</h1>
              <p className="text-sm text-gray-400">
                Voltamos em breve com novidades no Codelab!
              </p>
            </div>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}