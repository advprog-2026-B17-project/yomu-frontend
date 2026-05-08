"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as z from 'zod';
import api from '@/lib/axios';
const loginSchema = z.object({
  identifier: z.string().min(1, "Username/Email/Phone wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      console.log("Login attempt:", { identifier: data.identifier });
      const res = await api.post('/auth/login', {
        identifier: data.identifier,
        password: data.password,
      });
      console.log("Login success:", res.data);
      localStorage.setItem('token', res.data.token);
      
      router.push('/texts');
      router.refresh();
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (axios.isAxiosError(err)) {
        alert(`Login gagal: ${err.response?.status} - ${JSON.stringify(err.response?.data)}`);
      } else {
        alert("Login gagal, silakan cek kembali kredensial Anda.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Selamat Datang</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username / Email / No. HP</label>
            <input 
              {...register("identifier")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Masukkan username, email, atau nomor HP" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••" 
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Memproses..." : "Masuk ke Akun"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-medium">Daftar di sini</a>
        </p>
      </div>
    </div>
  );
}
