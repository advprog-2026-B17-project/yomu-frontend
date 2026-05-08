"use client";

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/axios';

type TextSummary = { id: number; title: string };
type Quiz = { id: number; title: string; totalQuestions?: number };

export default function AdminQuizzesPage() {
  const [texts, setTexts] = useState<TextSummary[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [title, setTitle] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [kind, setKind] = useState('multiple_choice');
  const [options, setOptions] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  async function fetchTexts() {
    try {
      const res = await api.get('/api/texts?page=0&size=100');
      setTexts(res.data.content || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchQuizzes(textId: number) {
    try {
      const res = await api.get(`/api/texts/${textId}?includeQuizMetadata=true`);
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      console.error(err);
      setQuizzes([]);
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchTexts(); }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (selectedTextId) fetchQuizzes(selectedTextId); else setQuizzes([]); }, [selectedTextId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTextId) return alert('Select a text first');
    const questionOptions = options.split(',').map(s => s.trim()).filter(Boolean);
    const payload = {
      title,
      questions: [
        {
          kind,
          questionText,
          options: questionOptions,
          correctAnswer
        }
      ]
    };
    try {
      await api.post(`/api/admin/texts/${selectedTextId}/quizzes`, payload);
      setTitle(''); setQuestionText(''); setOptions(''); setCorrectAnswer('');
      fetchQuizzes(selectedTextId);
    } catch (err: unknown) {
      console.error(err);
      alert('Failed to create quiz');
    }
  }

  async function handleDelete(quizId: number) {
    if (!confirm('Delete this quiz?')) return;
    try {
      await api.delete(`/api/admin/quizzes/${quizId}`);
      if (selectedTextId) fetchQuizzes(selectedTextId);
    } catch (err: unknown) {
      console.error(err);
      alert('Failed to delete');
    }
  }

  return (
    <Layout title="Admin — Manage Quizzes">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Manage Quizzes</h1>
        <section className="bg-white p-6 rounded-lg border">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Text</label>
            <select value={selectedTextId ?? ''} onChange={(e) => setSelectedTextId(e.target.value ? Number(e.target.value) : null)} className="border rounded p-2 w-full">
              <option value="">-- choose --</option>
              {texts.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>

          {selectedTextId && (
            <div>
              <form onSubmit={handleCreate} className="space-y-3 mb-6">
                <h3 className="font-semibold">Create Quiz for Selected Text</h3>
                <div>
                  <label className="block text-sm">Quiz Title</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm">Question Text</label>
                  <input value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm">Kind</label>
                  <select value={kind} onChange={(e) => setKind(e.target.value)} className="w-full border rounded p-2">
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="short_answer">Short Answer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm">Options (comma separated, for multiple choice)</label>
                  <input value={options} onChange={(e) => setOptions(e.target.value)} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm">Correct Answer</label>
                  <input value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="w-full border rounded p-2" />
                </div>
                <div>
                  <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded">Create Quiz</button>
                </div>
              </form>

              <div>
                <h3 className="font-semibold mb-3">Existing Quizzes</h3>
                {quizzes.length === 0 ? <div>No quizzes</div> : (
                  <div className="space-y-3">
                    {quizzes.map(q => (
                      <div key={q.id} className="flex items-center justify-between border rounded p-3">
                        <div>
                          <div className="font-semibold">{q.title}</div>
                          <div className="text-sm text-slate-600">Questions: {q.totalQuestions ?? 0}</div>
                        </div>
                        <div>
                          <button onClick={() => handleDelete(q.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </section>
      </div>
    </Layout>
  );
}
