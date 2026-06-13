"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { User, LogOut, LogIn } from "lucide-react"

const nav = [
  { label: "Trang chủ", href: "/" },
  { label: "Phòng nghỉ", href: "/search" },
  { label: "Sự kiện & Ưu đãi", href: "/events" },
  { label: "Liên hệ", href: "/contact" },
]

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

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
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-semibold transition-colors relative ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-5 left-0 right-0 h-1 bg-primary rounded-t-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {isLoggedIn ? (
          <div className="flex items-center gap-3 rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-sm text-primary shadow-sm">
            <User className="size-4" />
            <span className="hidden sm:inline font-medium">{user?.name || "Nguyễn Văn An"}</span>
            <button
              onClick={handleLogout}
              className="rounded-full p-1 hover:bg-primary/10 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
          >
            <LogIn className="size-4" /> Đăng nhập
          </Link>
        )}
      </div>
    </header>
  )
}