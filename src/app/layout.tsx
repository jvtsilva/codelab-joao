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
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className="antialiased animate-fadeIn">
        {children}
      </body>
    </html>
  );
}