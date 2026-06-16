'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BedDouble, LogOut, CheckSquare, Gift } from 'lucide-react';
import { useAuth } from '@/app/AuthProvider';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, currentUser } = useAuth();

  const allNavItems = [
    { name: 'Bảng điều khiển & Check-in', href: '/admin/checkin', icon: Home, roles: ['admin', 'letan'] },
    { name: 'Quản lý phòng', href: '/admin/rooms', icon: BedDouble, roles: ['admin'] },
    { name: 'Thủ tục Check-out', href: '/admin/checkout', icon: CheckSquare, roles: ['admin', 'letan'] },
    { name: 'Sự kiện & Ưu đãi', href: '/admin/events', icon: Gift, roles: ['admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(currentUser?.username || 'admin'));

  return (
    <aside className="w-64 bg-[#0F172A] text-white min-h-screen border-r border-slate-800 flex flex-col shrink-0 transition-all duration-300 shadow-xl z-20">
      <div className="h-[70px] px-6 flex items-center border-b border-white/5">
        <Link href="/admin/checkin">
          <Image
            src="/images/logo-white.png"
            alt="Thad Hotel Logo"
            width={150}
            height={36}
            style={{ width: 'auto', height: '36px' }}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-lg font-medium transition-all duration-200 ${isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white border-l-4 border-blue-500'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-2 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
