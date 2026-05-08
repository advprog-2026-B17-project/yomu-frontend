import React from "react";
import Layout from "@/components/Layout";
import TextCard from "@/components/TextCard";

type TextSummary = {
  id: number;
  title: string;
  category?: string | null;
  excerpt?: string | null;
  createdById?: number | null;
  createdByName?: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchTexts(): Promise<{ content: TextSummary[] }> {
  const res = await fetch(`${API_BASE}/api/texts?page=0&size=20`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Gagal mengambil daftar teks");
  }
  return res.json();
}

export default async function Page() {
  let texts: TextSummary[] = [];
  try {
    const data = await fetchTexts();
    // Spring Data Page response: { content: [...], ... }
    texts = data.content ?? [];
  } catch (err) {
    console.error("fetchTexts error", err);
  }

  return (
    <Layout title="Yomu - Bacaan">
      <h1 style={{ marginTop: 0 }}>Daftar Bacaan</h1>
      <p style={{ color: "#444" }}>Pilih bacaan untuk meningkatkan literasi informasi.</p>

      <section style={{ marginTop: 20 }}>
        {texts.length === 0 && (
          <div style={{ padding: 20, border: "1px dashed #ddd", borderRadius: 8 }}>Belum ada bacaan atau gagal mengambil data.</div>
        )}
        {texts.map((t) => (
          <TextCard key={t.id} id={t.id} title={t.title} category={t.category} excerpt={t.excerpt} createdByName={t.createdByName} />
        ))}
      </section>
    </Layout>
  );
}
