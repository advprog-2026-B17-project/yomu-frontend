"use client";

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/axios';

type TextSummary = {
  id: number;
  title: string;
  category?: string | null;
  excerpt?: string | null;
  createdByName?: string | null;
};

type TextWithStats = TextSummary & { attempts?: number; avgScore?: number };

export default function AdminTextsPage() {
  const [texts, setTexts] = useState<TextWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTexts();
  }, []);

  async function fetchTexts() {
    setLoading(true);
    try {
      const res = await api.get('/api/texts?page=0&size=100');
      const data = res.data;
      const items: TextWithStats[] = (data.content || []).map((t: TextWithStats) => ({ ...t }));
      // fetch stats for each text
      await Promise.all(items.map(async (t) => {
        try {
          const s = await api.get(`/api/texts/${t.id}/stats`);
          t.attempts = s.data.attempts;
          t.avgScore = s.data.avgScore;
        } catch {
          t.attempts = 0;
          t.avgScore = 0;
        }
      }));

      setTexts(items);
    } catch (err: unknown) {
      console.error(err);
      setError('Gagal memuat daftar teks');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/api/admin/texts', { title, category, content });
      setTitle('');
      setCategory('');
      setContent('');
      fetchTexts();
    } catch (err: unknown) {
      console.error(err);
      setError('Gagal membuat teks');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Hapus teks ini?')) return;
    try {
      await api.delete(`/api/admin/texts/${id}`);
      fetchTexts();
    } catch (err: unknown) {
      console.error(err);
      setError('Gagal menghapus teks');
    }
  }

  return (
    <Layout title="Admin — Manage Texts">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Manage Texts</h1>

        <section className="bg-white p-6 rounded-lg border">
          <h2 className="font-semibold mb-3">Create New Text</h2>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-sm">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm">Category</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm">Content</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full border rounded p-2 h-32" />
            </div>
            <div>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Create</button>
            </div>
          </form>
        </section>

        <section className="bg-white p-6 rounded-lg border">
          <h2 className="font-semibold mb-3">Existing Texts</h2>
          {loading ? (
            <div>Loading...</div>
          ) : texts.length === 0 ? (
            <div>No texts</div>
          ) : (
            <div className="space-y-4">
              {texts.map((t) => (
                <div key={t.id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-sm text-slate-500">{t.category} • {t.createdByName}</div>
                    <div className="text-sm text-slate-600">Attempts: {t.attempts ?? 0} • Avg: {Number(t.avgScore ?? 0).toFixed(2)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(t.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
