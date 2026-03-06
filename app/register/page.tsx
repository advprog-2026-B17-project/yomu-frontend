"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as z from 'zod';
import api from '@/lib/axios';

const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

type RegisterInput = z.infer<typeof registerSchema>;

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
  setError(null);
  try {
    await api.post('/auth/register', data);
    router.push('/login?registered=true');
  } catch (err: unknown) { 
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || 'Registrasi gagal, coba lagi.');
    } else {
      setError('Terjadi kesalahan yang tidak terduga.');
    }
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Buat Akun Baru</h2>
        <p className="text-gray-500 text-sm text-center mb-6">Bergabunglah bersama kami hari ini</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              {...register("username")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                errors.username ? "border-red-500 focus:ring-red-200" : "focus:ring-indigo-500"
              }`}
              placeholder="Username unik"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                errors.email ? "border-red-500 focus:ring-red-200" : "focus:ring-indigo-500"
              }`}
              placeholder="nama@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                errors.password ? "border-red-500 focus:ring-red-200" : "focus:ring-indigo-500"
              }`}
              placeholder="Min. 8 karakter"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-70"
          >
            {isSubmitting ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <a href="/login" className="text-indigo-600 hover:underline font-medium">Masuk di sini</a>
        </p>
      </div>
    </div>
  );
}