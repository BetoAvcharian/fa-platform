import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "FA Platform — Wealth Management CRM",
  description: "Plataforma de gestión para Financial Advisors y equipos de Wealth Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster position="top-right" theme="system" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
