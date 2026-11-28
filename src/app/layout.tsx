import type { Metadata } from "next";
import { headers } from "next/headers";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Codelab João",
    template: "%s • Codelab João",
  },
  description:
    "Trilha interativa e desafios práticos de lógica, JavaScript e desenvolvimento web no seu próprio ritmo.",
};

const THEME_INIT_SCRIPT = `
try {
  var saved = localStorage.getItem('codelab_tema_aula');
  var dark = saved !== 'light';
  var root = document.documentElement;
  root.classList.toggle('dark', dark);
  root.style.backgroundColor = dark ? '#0B0F14' : '#F8F7F4';
} catch (e) {}
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const emManutencao = process.env.MAINTENANCE_MODE === "true";

  let mostrarManutencao = true;
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
      data-scroll-behavior="smooth"
      className={`dark ${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className="font-sans antialiased min-h-screen bg-[#F8F7F4] text-[#18181B] dark:bg-[#0B0F14] dark:text-[#F1F5F9]"
        suppressHydrationWarning
      >
        {mostrarManutencao ? (
          <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0B0F14] text-[#18181B] dark:text-[#F1F5F9] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-[#121821] border border-[#E7E5E4] dark:border-[#1E293B] p-7 sm:p-8 rounded-2xl text-center space-y-4">
              <span className="inline-block text-[11px] font-mono font-semibold uppercase tracking-[0.14em] px-3 py-1 rounded-full bg-[#047857]/10 text-[#047857] dark:bg-[#34D399]/10 dark:text-[#34D399]">
                Codelab João
              </span>
              <h1 className="text-xl font-extrabold tracking-tight">
                Sistema em Manutenção
              </h1>
              <p className="text-sm text-[#57534E] dark:text-[#94A3B8] leading-relaxed">
                Estamos aplicando melhorias na plataforma. Voltamos em breve com novidades.
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