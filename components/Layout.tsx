import React from "react";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title = "Yomu - Bacaan" }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header dengan gradient */}
      <header className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/texts" className="text-xl font-bold tracking-tight hover:text-indigo-100 transition-colors">
            📚 {title}
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/texts" className="font-medium hover:text-indigo-100 transition-colors">
              Bacaan
            </Link>
            <Link href="/profile" className="font-medium hover:text-indigo-100 transition-colors">
              Profil
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-8 w-full">
        {children}
      </main>

      {/* Footer dengan gradient */}
      <footer className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="font-medium">© {new Date().getFullYear()} Yomu — Aplikasi Pembelajaran Ber-gamifikasi</p>
          <p className="text-sm text-indigo-100 mt-1">Tingkatkan literasi Anda dengan cara yang menyenangkan!</p>
        </div>
      </footer>
    </div>
  );
}
