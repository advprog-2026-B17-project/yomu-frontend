import React from "react";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title = "Yomu - Bacaan" }: Props) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid #eee", background: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Link tidak boleh berisi <a> child di Next 13+ */}
          <Link href="/texts" style={{ textDecoration: "none", color: "#111", fontWeight: 700, fontSize: 18 }}>
            {title}
          </Link>

          <nav>
            <Link href="/texts" style={{ marginRight: 12, color: "#333", textDecoration: "none" }}>Bacaan</Link>
            <Link href="/profile" style={{ color: "#333", textDecoration: "none" }}>Profil</Link>
          </nav>
        </div>
      </header>

      <main style={{ flex: 1, padding: "2rem", maxWidth: 960, margin: "0 auto" }}>
        {children}
      </main>

      <footer style={{ padding: "1rem 2rem", borderTop: "1px solid #eee", background: "#fafafa" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center", color: "#666" }}>
          © {new Date().getFullYear()} Yomu — Aplikasi Pembelajaran Ber-gamifikasi
        </div>
      </footer>
    </div>
  );
}
