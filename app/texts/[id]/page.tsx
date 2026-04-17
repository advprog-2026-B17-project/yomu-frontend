'use client';

import React, { use } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Link from "next/link";

type TextDetail = {
  id: number;
  title: string;
  category?: string | null;
  content?: string | null;
  createdById?: number | null;
  createdByName?: string | null;
  createdAt?: string | null;
  quizzes?: { id: number; title: string }[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

async function fetchText(id: string): Promise<TextDetail> {
  const res = await fetch(`${API_BASE}/api/texts/${id}?includeQuizMetadata=true`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Gagal mengambil teks");
  }
  return res.json();
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [text, setText] = React.useState<TextDetail | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchText(id)
      .then((data) => {
        setText(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Layout title="Memuat...">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
          <div className="text-5xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Terjadi Kesalahan</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => router.push('/texts')}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Kembali ke Daftar Bacaan
          </button>
        </div>
      </Layout>
    );
  }

  if (!text) return null;

  return (
    <Layout title={text.title}>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link 
            href="/texts" 
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Daftar Bacaan
          </Link>
        </nav>

        {/* Article Card */}
        <article className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header dengan gradient */}
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {text.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/30">
                      📁 {text.category}
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-400 text-amber-900">
                    ✨ Materi Interaktif
                  </span>
                </div>
                <h1 className="text-3xl font-bold leading-tight">{text.title}</h1>
                {text.createdByName && (
                  <div className="mt-3 flex items-center text-indigo-100">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Ditulis oleh <span className="font-semibold ml-1">{text.createdByName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
              {text.content || "Tidak ada konten"}
            </div>

            {/* Quiz Section */}
            {text.quizzes && text.quizzes.length > 0 && (
              <section className="border-t border-slate-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg mr-3">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    Uji Pemahaman Anda
                  </h2>
                  <div className="text-sm text-slate-500">
                    completed: {text.quizzes.length} kuis
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {text.quizzes.map((quiz) => (
                    <div 
                      key={quiz.id}
                      className="group bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Max Score: 100 XP
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">
                        {quiz.title}
                      </h3>

                      <Link
                        href={`/quizzes/${quiz.id}`}
                        className="inline-flex items-center w-full justify-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-105 active:scale-95"
                      >
                        <span>Mulai Kuis</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </div>
    </Layout>
  );
}
