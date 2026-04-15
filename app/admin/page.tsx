"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
      <h1 className="text-3xl font-bold text-gray-800">This is Admin Dashboard</h1>
    </div>
  );
}
