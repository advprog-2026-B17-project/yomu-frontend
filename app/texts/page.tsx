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
  quizzes?: { id: number; title: string }[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchTexts(): Promise<{ content: TextSummary[] }> {
  const res = await fetch(`${API_BASE}/api/texts?page=0&size=20`, { 
    cache: "no-store",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Gagal mengambil daftar teks");
  }
  return res.json();
}

export default async function Page() {
  let texts: TextSummary[] = [];
  let error: string | null = null;

  try {
    const data = await fetchTexts();
    texts = data.content ?? [];
  } catch (err) {
    console.error("fetchTexts error", err);
    error = "Gagal memuat daftar bacaan";
  }

  return (
    <Layout title="Yomu - Bacaan">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-2xl border border-indigo-100">
          <div className="max-w-2xl mx-auto px-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Selamat Membaca!
            </h1>
            <p className="text-lg text-slate-600 mb-2">
              Tingkatkan literasi dan kemampuan fact-checking Anda melalui bacaan_interaktif ini.
            </p>
            <p className="text-sm text-indigo-600 font-medium">
              📊 {texts.length} bacaan tersedia • 🏆 Dapatkan poin dengan mengerjakan kuis
            </p>
          </div>
        </div>

        {/* Main Content */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Daftar Bacaan
            </h2>
            {texts.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                </svg>
                {texts.length} artikel
              </div>
            )}
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-red-600 font-medium">{error}</p>
              <p className="text-slate-500 text-sm mt-2">Silakan periksa koneksi atau coba lagi nanti.</p>
            </div>
          ) : texts.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Belum Ada Bacaan</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Materi pembelajaran masih dalam persiapan. Silakan cek kembali beberapa saat lagi!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
               {texts.map((t) => (
                 <TextCard 
                   key={t.id} 
                   id={t.id} 
                   title={t.title} 
                   category={t.category} 
                   excerpt={t.excerpt} 
                   createdByName={t.createdByName}
                   quizCount={t.quizzes?.length || 0}
                 />
               ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
