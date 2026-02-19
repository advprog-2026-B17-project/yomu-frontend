'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Gagal mengambil data dari server');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Mengirim data...');

    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }),
      });

      if (response.ok) {
        setStatus('User berhasil ditambahkan!');
        setUsername(''); // Kosongkan input form
        setEmail('');

        fetchUsers();
      } else {
        setStatus('Gagal menambahkan user.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Error: Gagal terhubung ke Backend.');
    }
  };

  return (
      <main className="flex flex-col items-center min-h-screen p-8 bg-gray-50 text-gray-900 gap-8">

        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Tambah User Yomu</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Masukkan username"
                  required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Masukkan email"
                  required
              />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 mt-2"
            >
              Kirim ke Database
            </button>
          </form>

          {status && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-center text-sm font-medium">
                {status}
              </div>
          )}
        </div>

        {/* --- BAGIAN DAFTAR USER (GET) --- */}
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4 text-center">Daftar User di Database</h2>

          {isLoading ? (
              <p className="text-center text-gray-500">Memuat data...</p>
          ) : users.length === 0 ? (
              <p className="text-center text-gray-500">Belum ada user di database.</p>
          ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-3">ID</th>
                    <th className="p-3">Username</th>
                    <th className="p-3">Email</th>
                  </tr>
                  </thead>
                  <tbody>
                  {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{user.id}</td>
                        <td className="p-3 font-medium">{user.username}</td>
                        <td className="p-3 text-gray-600">{user.email}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>

      </main>
  );
}