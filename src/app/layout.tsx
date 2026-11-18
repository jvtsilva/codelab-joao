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
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Script que lê o localStorage ANTES de desenhar a tela, evitando o flash e aplicando o tema certo */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('codelab_theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased animate-fadeIn">
        {children}
      </body>
    </html>
  );
}