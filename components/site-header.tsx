'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"

const nav = [
  { label: "Trang chủ", href: "/" },
  { label: "Phòng nghỉ", href: "/search" },
  { label: "Sự kiện & Ưu đãi", href: "/events" },
  { label: "Liên hệ", href: "/contact" },
]

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            T
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">THAD HOTEL</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            // Check if active: Exact match for '/', or starts with href for others
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-semibold transition-colors relative ${
                  isActive ? "text-blue-600" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-5 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></span>
                )}
              </Link>
            );
          })}
        </nav>
        <Link href="/login" className="rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
          Đăng nhập
        </Link>
      </div>
    </header>
  )
}
