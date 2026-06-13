'use client';

import Sidebar from '@/components/admin/Sidebar';
import { ReactNode, useEffect } from 'react';
import { AdminProvider } from './AdminProvider';
import { useAuth } from '@/app/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        router.push('/');
      } else if (currentUser.username === 'letan' && (pathname.includes('/admin/rooms') || pathname.includes('/admin/events'))) {
        router.push('/admin/checkin');
      }
    }
  }, [currentUser, isLoading, router, pathname]);

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <AdminProvider>
      <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 antialiased font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* We can place a generic Header here if needed, but since each page might have its own header (like Phan2/Phan3/Phan4 have), we can leave it to the page components or extract it. Let's put a simple global admin header. */}
          <header className="h-[70px] bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
            <div className="text-lg font-bold tracking-tight text-slate-800 flex items-center gap-4">
              Hệ thống Quản lý Khách sạn
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="text-xs px-3 py-1.5 bg-rose-100 text-rose-700 font-semibold rounded hover:bg-rose-200 transition-colors"
              >
                Khôi phục dữ liệu gốc
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right leading-tight">
                <div className="font-semibold text-sm">{currentUser.name}</div>
                <div className="text-xs text-slate-500">{currentUser.role}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {currentUser.name.charAt(0)}
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto relative">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
