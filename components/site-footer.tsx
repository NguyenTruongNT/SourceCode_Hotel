import Link from "next/link"
import { Globe, ThumbsUp, PlayCircle, MapPin, Phone, Mail } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              T
            </span>
            <span className="text-lg font-semibold text-foreground">THAD HOTEL</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Kiến tạo không gian nghỉ dưỡng đẳng cấp và trải nghiệm ẩm thực tinh hoa tại trung tâm thành phố.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/"
              className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Globe size={16} />
            </Link>
            <Link
              href="/"
              className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <ThumbsUp size={16} />
            </Link>
            <Link
              href="/"
              className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <PlayCircle size={16} />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Liên kết nhanh</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-foreground transition-colors">
                Phòng nghỉ
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Sự kiện
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Ưu đãi thành viên
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Chính sách</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Quy định đặt phòng
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Chính sách hoàn tiền
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Liên hệ</h3>
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
              <span>Email: contact@thadhotel.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
          © 2026 THAD HOTEL. All rights reserved.
        </p>
      </div>
    </footer>
  )
}