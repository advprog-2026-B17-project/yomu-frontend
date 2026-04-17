'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import api from "@/lib/axios";

type Question = {
  id: number;
  kind: string;
  questionText: string;
  options: string[] | null;
};

type Quiz = {
  id: number;
  title: string;
  questions: Question[];
};

type GradingResult = {
  questionId: number;
  isCorrect: boolean;
  score: number;
  feedback: string;
  correctAnswer: string;
  userAnswer: string;
};

type QuizAttemptResult = {
  attemptId: number;
  score: number | null;
  startedAt: string;
  submittedAt: string | null;
  gradingResults: GradingResult[] | null;
};

export default function QuizResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!attemptId) {
      setError("ID percobaan kuis tidak ditemukan");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch quiz details
        const quizRes = await api.get(`/api/quizzes/${id}`);
        const quizData: Quiz = quizRes.data;
        setQuiz(quizData);

        // Fetch attempt result
        const attemptRes = await api.get(`/api/quizzes/attempts/${attemptId}`);
        const attemptData: QuizAttemptResult = attemptRes.data;
        setAttempt(attemptData);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Gagal mengambil hasil kuis");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, attemptId]);

  if (loading) {
    return (
      <Layout title="Memuat Hasil...">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Mengambil hasil kuis...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
          <div className="text-5xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Terjadi Kesalahan</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => router.push(`/quizzes/${id}`)}
              className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              Kembali ke Kuis
            </button>
            <button 
              onClick={() => router.push('/texts')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Daftar Bacaan
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!quiz || !attempt) {
    return (
      <Layout title="Tidak Ditemukan">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Hasil Tidak Ditemukan</h2>
          <p className="text-slate-600 mb-6">Data hasil kuis tidak tersedia.</p>
          <button 
            onClick={() => router.push('/texts')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Kembali ke Daftar Bacaan
          </button>
        </div>
      </Layout>
    );
  }

  const totalQuestions = quiz.questions.length;
  const correctCount = attempt.gradingResults?.filter(r => r.isCorrect).length || 0;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  
  // Determine grade message
  let gradeMessage = "";
  let gradeEmoji = "";
  let gradeColor = "";
  if (percentage >= 80) {
    gradeMessage = "Luar Biasa!";
    gradeEmoji = "🏆";
    gradeColor = "from-green-400 to-emerald-500";
  } else if (percentage >= 60) {
    gradeMessage = "Bagus!";
    gradeEmoji = "👍";
    gradeColor = "from-blue-400 to-indigo-500";
  } else if (percentage >= 40) {
    gradeMessage = "Coba Lagi!";
    gradeEmoji = "💪";
    gradeColor = "from-amber-400 to-orange-500";
  } else {
    gradeMessage = "Tingkatkan!";
    gradeEmoji = "📚";
    gradeColor = "from-red-400 to-pink-500";
  }

  return (
    <Layout title={`Hasil: ${quiz.title}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <button 
          onClick={() => router.push(`/texts/${id}`)}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Bacaan
        </button>

        {/* Result Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Result Header */}
          <div className={`bg-gradient-to-r ${gradeColor} px-8 py-10 text-white text-center`}>
            <div className="text-6xl mb-4">{gradeEmoji}</div>
            <h2 className="text-3xl font-bold mb-2">{gradeMessage}</h2>
            <p className="text-white/90 text-lg">{quiz.title}</p>
          </div>

          {/* Score Display */}
          <div className="px-8 py-8 bg-slate-50 border-b border-slate-200">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-600">{attempt.score ?? "-"}</div>
                <div className="text-sm text-slate-600">Skor Akhir</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">{correctCount}/{totalQuestions}</div>
                <div className="text-sm text-slate-600">Benar</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-600">{percentage}%</div>
                <div className="text-sm text-slate-600">Presentase</div>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="px-8 py-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Hasil per Pertanyaan
            </h3>
            
            <div className="space-y-4">
               {attempt.gradingResults?.map((result, idx) => {
                  const question = quiz.questions.find((q) => q.id === result.questionId);
                  
                  return (
                    <div 
                      key={result.questionId} 
                      className={`p-5 rounded-xl border-2 transition-all ${
                        result.isCorrect 
                          ? "bg-emerald-50 border-emerald-200" 
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          result.isCorrect ? "bg-emerald-500" : "bg-red-500"
                        }`}>
                          <span className="text-white text-lg">
                            {result.isCorrect ? "✓" : "✗"}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 mb-3">
                            {idx + 1}. {question?.questionText || "Pertanyaan"}
                          </p>
                          
                          {/* Your Answer */}
                          <div className="mb-2">
                            <span className="text-sm font-medium text-slate-600">Jawaban Anda: </span>
                            <span className={`font-bold ${
                              result.isCorrect ? "text-emerald-700" : "text-red-700"
                            }`}>
                              {result.userAnswer || "-"}
                              {result.isCorrect && " ✓"}
                            </span>
                          </div>

                          {/* Correct Answer if wrong */}
                          {!result.isCorrect && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-slate-600">Jawaban Benar: </span>
                              <span className="font-bold text-emerald-700">{result.correctAnswer}</span>
                            </div>
                          )}

                          {/* Feedback */}
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className={`text-sm font-medium ${result.isCorrect ? "text-emerald-600" : "text-red-600"}`}>
                              {result.feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex gap-3 justify-between">
            <button
              onClick={() => router.push(`/quizzes/${id}`)}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-white hover:shadow-md transition-all"
            >
              ← Kembali ke Kuis
            </button>
            <button
              onClick={() => router.push('/texts')}
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all active:scale-95"
            >
              Pilih Bacaan Lain
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}