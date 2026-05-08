"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

interface UserInfo {
  id: number;
  username: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await api.get('/auth/me');
        const user: UserInfo = res.data;

        if (user.role !== 'ADMIN') {
          router.push('/');
          return;
        }
      } catch {
        router.push('/login');
        return;
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-slate-600">Pilih area administrasi di bawah ini.</p>
        <div className="flex gap-4 justify-center mt-4">
          <Link href="/admin/texts" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Manage Texts</Link>
          <Link href="/admin/quizzes" className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600">Manage Quizzes</Link>
        </div>
      </div>
    </div>
  );
}
