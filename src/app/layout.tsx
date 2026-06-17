import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Tirtanexa — Platform Latihan & Ujian Cerdas",
  description:
    "Platform latihan soal dan ujian berbasis IRT (Item Response Theory) untuk siswa SD, SMP, SMA, dan persiapan UTBK.",
  keywords: ["tirtanexa", "latihan soal", "UTBK", "IRT", "ujian online", "tryout"],
  authors: [{ name: "Tirtanexa" }],
};

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`h-full ${nunito.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full antialiased font-nunito bg-[var(--bg)] text-[var(--text)]">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "var(--font-nunito), sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
              padding: "12px 16px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.08)",
            },
            success: {
              style: { background: "#ECFDF5", color: "#065F46", border: "1px solid #A7F3D0" },
            },
            error: {
              style: { background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" },
            },
          }}
        />
      </body>
    </html>
  );
}
