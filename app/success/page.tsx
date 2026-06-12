"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Copy, Check, Download, Home, Info } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { nights, longDate } from "@/components/order-summary"
import { useBooking } from "@/components/booking-context"
import { getRoom, formatVND } from "@/lib/rooms"

export default function SuccessPage() {
  const router = useRouter()
  const { selectedRoomId, customer, search, discount, discountCode, bookingCode } = useBooking()
  const room = selectedRoomId ? getRoom(selectedRoomId) : undefined
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!bookingCode || !room) router.replace("/")
  }, [bookingCode, room, router])

  if (!room || !bookingCode) return null

  const n = nights(search.checkIn, search.checkOut)
  const total = Math.max(0, room.price * n - discount)

  function copy() {
    navigator.clipboard.writeText(bookingCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="size-9 text-emerald-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Đặt phòng thành công!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cảm ơn bạn đã đặt phòng. Email xác nhận đã được gửi đến {customer.email}
          </p>

          {/* Booking code */}
          <div className="mt-6 rounded-xl border border-dashed border-primary/50 bg-accent p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Mã đặt phòng của bạn</p>
            <p className="mt-2 font-mono text-2xl font-bold tracking-wider text-primary">{bookingCode}</p>
            <button
              onClick={copy}
              className="mx-auto mt-3 flex items-center gap-1.5 rounded-md border border-primary/40 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "ĐÃ SAO CHÉP" : "SAO CHÉP MÃ"}
            </button>
          </div>

          <p className="mt-4 flex items-start justify-center gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            Vui lòng lưu mã đặt phòng này. Bạn sẽ cần xuất trình mã khi check-in tại khách sạn.
          </p>

          {/* Recap */}
          <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Thông tin khách hàng</p>
            <dl className="mt-2 space-y-1 text-sm text-foreground">
              <p>Họ tên: {customer.name}</p>
              <p>Email: {customer.email}</p>
              <p>Điện thoại: {customer.phone}</p>
            </dl>
            <div className="mt-4 border-t border-border pt-4">
              <p className="font-medium text-foreground">{room.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {longDate(search.checkIn)} → {longDate(search.checkOut)} ({n} đêm)
              </p>
              {discount > 0 && (
                <p className="mt-2 flex justify-between text-sm text-emerald-600">
                  <span>Giảm giá ({discountCode})</span>
                  <span>-{formatVND(discount)}</span>
                </p>
              )}
              <p className="mt-2 flex justify-between text-base font-bold text-foreground">
                <span>Tổng thanh toán</span>
                <span className="text-primary">{formatVND(total)}</span>
              </p>
            </div>
          </div>

          {/* Barcode */}
          <div className="mt-6 flex h-16 items-center justify-center gap-[3px] overflow-hidden rounded-lg bg-foreground px-4">
            {Array.from({ length: 48 }).map((_, i) => (
              <span
                key={i}
                className="h-full bg-background"
                style={{ width: `${(i % 3) + 1}px`, opacity: i % 2 ? 1 : 0.6 }}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-secondary">
              <Download className="size-4" /> TẢI PDF PHIẾU ĐẶT PHÒNG
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Home className="size-4" /> VỀ TRANG CHỦ
            </button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
