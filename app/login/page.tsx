'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/AuthProvider';  // Sửa lại import
import { useAuth as useCustomerAuth } from '@/components/auth-context';  // Đổi tên để tránh conflict
import { Lock, User, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from "next/image"
export default function LoginPage() {
  const router = useRouter();
  const { login: adminLogin, currentUser, isLoading: adminLoading } = useAuth();
  const { login: customerLogin, user, isLoading: customerLoading } = useCustomerAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!adminLoading && currentUser) {
      router.push('/admin/checkin');
    }
    if (!customerLoading && user.isLoggedIn) {
      router.push('/');
    }
  }, [currentUser, user.isLoggedIn, adminLoading, customerLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    if (!username || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu');
      setIsLoggingIn(false);
      return;
    }

    // Admin login
    if (username === 'admin' && password === 'admin123') {
      adminLogin({ username, name: 'Quản trị viên THAD', role: 'Quản lý hệ thống' });
      setIsLoggingIn(false);
      return;
    }

    if (username === 'letan' && password === 'letan123') {
      adminLogin({ username, name: 'Lê Tuấn Dũng', role: 'Nhân viên Lễ tân' });
      setIsLoggingIn(false);
      return;
    }

    // Customer login
    const success = await customerLogin(username, password);

    if (success) {
      router.push('/');
    } else {
      setError('Email hoặc mật khẩu không chính xác.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setIsLoggingIn(false);
  };

  if (adminLoading || customerLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/hero-hotel.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

      <div className={`relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-500 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        <div className="text-center mb-8 flex flex-col items-center">
          <Image
            src="/images/logo-white.png"
            alt="Thad Hotel Logo"
            width={200}
            height={56}
            style={{ width: 'auto', height: '56px' }}
            className="object-contain mb-3"
            priority
          />
          <p className="text-slate-300 text-sm">Hệ thống Quản lý & Đặt phòng Khách sạn</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">TÊN ĐĂNG NHẬP / EMAIL</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-400 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="admin / letan / email@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">MẬT KHẨU</label>
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
            disabled={isLoggingIn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/30 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập hệ thống'}
          </button>

          <div className="text-center mt-6 text-xs text-slate-400">
            <p className="font-semibold text-white mb-2">🔐 TÀI KHOẢN THỬ NGHIỆM</p>
            <div className="space-y-1 text-left bg-white/5 p-3 rounded-lg">
              <p>👑 <span className="text-yellow-400">QUẢN TRỊ</span></p>
              <p className="pl-4">📧 Tài khoản: <span className="text-white">admin</span></p>
              <p className="pl-4">🔑 Mật khẩu: <span className="text-white">admin123</span></p>

              <p className="mt-2">👤 <span className="text-green-400">LỄ TÂN</span></p>
              <p className="pl-4">📧 Tài khoản: <span className="text-white">letan</span></p>
              <p className="pl-4">🔑 Mật khẩu: <span className="text-white">letan123</span></p>

              <p className="mt-2">🏠 <span className="text-blue-400">KHÁCH HÀNG</span></p>
              <p className="pl-4">📧 Email: <span className="text-white">nguyenvana@example.com</span></p>
              <p className="pl-4">🔑 Mật khẩu: <span className="text-white">123456</span></p>
            </div>
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