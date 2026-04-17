"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import api from '@/lib/axios';

const profileSchema = z.object({
  displayName: z.string().min(1, "Nama tampilan wajib diisi"),
  email: z.string().email("Format email tidak valid").or(z.literal("")),
  phoneNumber: z.string().min(8, "Nomor HP minimal 8 digit").or(z.literal("")),
  password: z.string().min(8, "Password minimal 8 karakter").optional(),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function Profile() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        const user = res.data;
        setValue('displayName', user.displayName || user.username || '');
        setValue('email', user.email || '');
        setValue('phoneNumber', user.phoneNumber || '');
      } catch {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, setValue]);

  const onSubmit = async (data: ProfileInput) => {
    setError(null);
    setSuccess(null);
    try {
      const payload: Record<string, string | null> = {
        displayName: data.displayName,
        email: data.email || null,
        phoneNumber: data.phoneNumber || null,
      };
      if (data.password) {
        payload.password = data.password;
      }

      await api.put('/auth/me', payload);
      setSuccess("Profil berhasil diperbarui!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Gagal memperbarui profil.');
      } else {
        setError('Terjadi kesalahan yang tidak terduga.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Profil Saya</h2>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tampilan</label>
            <input
              {...register("displayName")}
              className={`w-full px-4 py-2 border text-gray-800 rounded-lg focus:ring-2 outline-none transition-all placeholder:text-gray-400 ${
                errors.displayName ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-500"
              }`}
              placeholder="Nama yang ditampilkan"
            />
            {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2 border text-gray-800 rounded-lg focus:ring-2 outline-none transition-all placeholder:text-gray-400 ${
                errors.email ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-500"
              }`}
              placeholder="nama@email.com (opsional)"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
            <input
              {...register("phoneNumber")}
              className={`w-full px-4 py-2 border text-gray-800 rounded-lg focus:ring-2 outline-none transition-all placeholder:text-gray-400 ${
                errors.phoneNumber ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-500"
              }`}
              placeholder="08xxxxxxxxxx (opsional)"
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-4 py-2 border text-gray-800 rounded-lg focus:ring-2 outline-none transition-all placeholder:text-gray-400 ${
                errors.password ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-500"
              }`}
              placeholder="Kosongkan jika tidak ingin mengubah"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            <p className="text-xs text-gray-500 mt-1">Minimal 8 karakter</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-70"
          >
            {isSubmitting ? "Memproses..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}
