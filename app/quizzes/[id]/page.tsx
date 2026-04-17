'use client';

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
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

type Answer = {
  questionId: number;
  userAnswer: string;
};

async function fetchQuiz(id: string): Promise<Quiz> {
  const res = await api.get(`/api/quizzes/${id}`);
  return res.data;
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz(id)
      .then(setQuiz)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const startQuiz = async () => {
    if (!quiz) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/api/quizzes/${quiz.id}/start`);
      const attemptData: QuizAttemptResult = res.data;
      setAttempt(attemptData);
    } catch (err: unknown) {
      const error = err as AxiosError<{ error?: string; message?: string }> | Error;
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.error || error.response?.data?.message || error.message
        : error instanceof Error
        ? error.message
        : 'Unknown error';
      if (errorMessage.includes("already completed") || errorMessage.includes("You have already completed this quiz") || errorMessage.includes("sudah")) {
        setError("Anda sudah menyelesaikan kuis ini sebelumnya. Setiap teks hanya dapat dikerjakan sekali.");
      } else {
        setError(errorMessage || "Gagal memulai kuis");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const submitQuiz = async () => {
    if (!attempt) return;
    setSubmitting(true);
    setError(null);
    try {
      const answerList: Answer[] = Object.entries(answers).map(([qId, answer]) => ({
        questionId: Number(qId),
        userAnswer: answer,
      }));
      await api.post(`/api/quizzes/attempts/${attempt.attemptId}/submit`, {
        answers: answerList,
      });
      router.push(`/quizzes/${id}/result?attemptId=${attempt.attemptId}`);
    } catch (err: unknown) {
      const error = err as AxiosError<{ error?: string; message?: string }> | Error;
      const errorMsg = error instanceof AxiosError
        ? error.response?.data?.error || error.response?.data?.message
        : error instanceof Error
        ? error.message
        : 'Gagal mengirim jawaban';
      setError(errorMsg || "Gagal mengirim jawaban");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Memuat Kuis...">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Menyiapkan kuis...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
          <div className="text-5xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Oops! Terjadi Kesalahan</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => router.back()}
              className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              Kembali
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

  if (!quiz) {
    return (
      <Layout title="Kuis Tidak Ditemukan">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Kuis Tidak Ditemukan</h2>
          <p className="text-slate-600 mb-6">Kuis yang Anda cari tidak tersedia.</p>
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

  // Jika belum memulai kuis, tampilkan layar mulai
  if (!attempt) {
    return (
      <Layout title={quiz.title}>
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.push(`/texts/${id}`)}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Bacaan
          </button>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Quiz Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-8 py-12 text-white">
              <div className="text-5xl mb-4">📚</div>
              <h1 className="text-4xl font-bold mb-3">{quiz.title}</h1>
              <p className="text-indigo-100 text-lg">Total: {quiz.questions.length} pertanyaan</p>
            </div>

            {/* Quiz Info */}
            <div className="px-8 py-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-2xl">✅</div>
                <div>
                  <h3 className="font-bold text-slate-800">Periksa Jawaban</h3>
                  <p className="text-slate-600 text-sm">Setiap jawaban akan ditinjau secara otomatis</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">⏱️</div>
                <div>
                  <h3 className="font-bold text-slate-800">Waktu Terbuka</h3>
                  <p className="text-slate-600 text-sm">Kerjakan dengan santai sesuai kecepatan Anda</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">🎯</div>
                <div>
                  <h3 className="font-bold text-slate-800">Satu Kali</h3>
                  <p className="text-slate-600 text-sm">Setiap teks hanya dapat dikerjakan satu kali</p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Start Button */}
            <div className="px-8 py-8 bg-slate-50 border-t border-slate-200 flex gap-3 justify-between">
              <button 
                onClick={() => router.push(`/texts/${id}`)}
                className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-white transition-all"
              >
                ← Batal
              </button>
              <button 
                onClick={startQuiz}
                disabled={loading}
                className={`px-8 py-3 font-bold rounded-lg transition-all ${
                  loading
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed opacity-70"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white active:scale-95"
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memulai Kuis...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Mulai Kuis
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Quiz Taking Interface
  return (
    <Layout title={quiz.title}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/texts/${id}`)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{quiz.title}</h2>
                <p className="text-sm text-slate-500">Jawab semua pertanyaan dengan cermat</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Progress</div>
              <div className="font-bold text-indigo-600">
                {Object.keys(answers).length} / {quiz.questions.length} dijawab
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
              style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.map((question, idx) => (
            <div 
              key={question.id}
              className={`bg-white rounded-xl shadow-md border-2 p-6 transition-all ${
                answers[question.id] 
                  ? "border-indigo-200 shadow-lg" 
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Question Number Badge */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </div>

                {/* Question Content */}
                <div className="flex-1">
                  <p className="text-lg font-semibold text-slate-800 mb-4">
                    {question.questionText}
                  </p>

                  {/* Question Type Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      question.kind === "multiple_choice" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-purple-100 text-purple-800"
                    }`}>
                      {question.kind === "multiple_choice" 
                        ? "Pilihan Ganda" 
                        : "Jawaban Singkat"
                      }
                    </span>
                  </div>

                  {/* Answer Options */}
                  {question.kind === "multiple_choice" && question.options && (
                    <div className="space-y-3">
                      {question.options.map((option, optIdx) => (
                        <label 
                          key={optIdx} 
                          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            answers[question.id] === option
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={() => handleAnswerChange(question.id, option)}
                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-slate-700 font-medium">{option}</span>
                          {answers[question.id] === option && (
                            <svg className="w-5 h-5 text-indigo-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </label>
                      ))}
                    </div>
                  )}

                  {question.kind === "short_answer" && (
                    <input
                      type="text"
                      value={answers[question.id] || ""}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Ketik jawaban Anda di sini..."
                      className={`w-full px-4 py-3 text-slate-800 border-2 rounded-lg focus:ring-2 focus:outline-none transition-all ${
                        answers[question.id]
                          ? "border-indigo-500 focus:ring-indigo-200"
                          : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {Object.keys(answers).length === quiz.questions.length ? (
                <span className="text-emerald-600 font-medium flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Semua pertanyaan dijawab!
                </span>
              ) : (
                <span>
                  {quiz.questions.length - Object.keys(answers).length} pertanyaan belum dijawab
                </span>
              )}
            </div>
            <button
              onClick={submitQuiz}
              disabled={submitting || Object.keys(answers).length === 0}
              className={`px-8 py-3 font-bold rounded-xl transition-all transform ${
                Object.keys(answers).length === quiz.questions.length
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white active:scale-95" 
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              } ${submitting ? "opacity-70 cursor-wait" : ""}`}
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </span>
              ) : (
                <span className="flex items-center">
                  Kirim Jawaban
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
