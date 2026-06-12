'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/AuthProvider';
import { Lock, User, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, currentUser, isLoading } = useAuth();
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push('/admin/checkin');
    }
  }, [currentUser, isLoading, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Mock authentication check
    if (username === 'admin' && password === 'admin123') {
      login({ username, name: 'Quản trị viên THAD', role: 'Quản lý hệ thống' });
    } else if (username === 'letan' && password === 'letan123') {
      login({ username, name: 'Lê Tuấn Dũng', role: 'Nhân viên Lễ tân' });
    } else {
      setError('Tài khoản hoặc mật khẩu không chính xác.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (isLoading || currentUser) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/hero-hotel.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      
      <div className={`relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-500 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-wide text-white mb-2">
            THAD<span className="font-light text-blue-400">HOTEL</span>
          </h1>
          <p className="text-slate-300 text-sm">Hệ thống Quản lý Khách sạn Nâng cao</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Tên đăng nhập</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-400 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Nhập tên tài khoản..."
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-400 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/20 border border-rose-500/50 p-3 rounded-lg flex items-center gap-2 text-rose-200 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/30 transition-all mt-4"
          >
            Đăng nhập hệ thống
          </button>
          
          <div className="text-center mt-6 text-xs text-slate-400">
            <p>Tài khoản thử nghiệm:</p>
            <p className="mt-1">Admin: <span className="text-white">admin / admin123</span></p>
            <p>Lễ tân: <span className="text-white">letan / letan123</span></p>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
