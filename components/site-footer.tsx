import Link from "next/link"
import Image from "next/image"
import { Globe, ThumbsUp, PlayCircle, MapPin, Phone, Mail } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr_1.5fr]">

        {/* Cột 1: Logo + mô tả + mạng xã hội */}
        <div className="flex flex-col gap-4">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Thad Hotel Logo"
              width={150}
              height={42}
              className="object-contain -mt-2"
              priority
            />
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Kiến tạo không gian nghỉ dưỡng đẳng cấp và trải nghiệm ẩm thực tinh hoa tại trung tâm thành phố.
          </p>
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Globe size={16} />
            </Link>
            <Link
              href="/"
              className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ThumbsUp size={16} />
            </Link>
            <Link
              href="/"
              className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <PlayCircle size={16} />
            </Link>
          </div>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Liên kết nhanh
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link href="/search" className="transition-colors hover:text-foreground">
                Phòng nghỉ
              </Link>
            </li>
            <li>
              <Link href="/events" className="transition-colors hover:text-foreground">
                Sự kiện
              </Link>
            </li>
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                Ưu đãi thành viên
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Chính sách */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Chính sách
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                Quy định đặt phòng
              </Link>
            </li>
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                Chính sách hoàn tiền
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Liên hệ
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>123 Đường Du Lịch, Quận 1, TP. Hồ Chí Minh, Việt Nam</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-primary" />
              <span>Hotline: (+84) 123 456 789</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-primary" />
              <span>contact@thadhotel.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
          © 2026 THAD HOTEL. All rights reserved.
        </p>
      </div>
    </footer>
  )
}