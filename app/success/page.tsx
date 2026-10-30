"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Copy, Check, Download, Home, Info, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { nights, longDate } from "@/components/order-summary"
import { useBooking } from "@/components/booking-context"
import { getRoom, formatVND } from "@/lib/rooms"
import Link from "next/link"

export default function SuccessPage() {
  const router = useRouter()
  const { selectedRoomId, customer, search, discount, discountCode, bookingCode, depositAmount } = useBooking()
  const room = selectedRoomId ? getRoom(selectedRoomId) : undefined
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!bookingCode || !room) router.replace("/")
  }, [bookingCode, room, router])

  if (!room || !bookingCode) return null

  const n = nights(search.checkIn, search.checkOut)
  const total = Math.max(0, room.price * n - discount)
  const depositPaid = depositAmount || Math.round(total * 0.5)
  const remaining = total - depositPaid

  function copy() {
    navigator.clipboard.writeText(bookingCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-6 text-center sm:p-8 shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="size-9" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Xác nhận đặt phòng thành công (F2 - S1)!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Hệ thống HST Hotel đã nhận thanh toán tiền cọc 50% và gửi email xác nhận đến <strong>{customer.email}</strong>.
          </p>

          {/* Booking code PNR */}
          <div className="mt-6 rounded-xl border border-dashed border-primary/50 bg-blue-50/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mã đặt phòng duy nhất (PNR)</p>
            <p className="mt-2 font-mono text-3xl font-extrabold tracking-wider text-blue-700">{bookingCode}</p>
            <button
              onClick={copy}
              className="mx-auto mt-3 flex items-center gap-1.5 rounded-md border border-blue-400 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
            >
              {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              {copied ? "ĐÃ SAO CHÉP MÃ" : "SAO CHÉP MÃ PNR"}
            </button>
          </div>

          <p className="mt-4 flex items-start justify-center gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0 text-blue-600" />
            Vui lòng lưu giữ mã đặt phòng này kèm giấy tờ CCCD đối chiếu khi đến quầy Lễ tân làm thủ tục Check-in (F3).
          </p>

          {/* Recap */}
          <div className="mt-6 rounded-xl border border-border bg-slate-50 p-5 text-left text-sm space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Thông tin chi tiết đơn lưu trú</p>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <p>Khách hàng: <strong>{customer.name}</strong></p>
              <p>Số CCCD: <strong className="font-mono">{customer.idNumber}</strong></p>
              <p>Số điện thoại: <strong>{customer.phone}</strong></p>
              <p>Hạng phòng: <strong>{room.name}</strong></p>
            </div>
            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs text-slate-500">Thời gian lưu trú:</p>
              <p className="font-semibold text-slate-800">
                {longDate(search.checkIn)} → {longDate(search.checkOut)} ({n} đêm)
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span>Tổng giá trị đơn phòng:</span>
                <span className="font-bold text-slate-900">{formatVND(total)}</span>
              </div>
              <div className="flex justify-between text-blue-700 font-bold">
                <span>Tiền cọc 50% đã thanh toán:</span>
                <span>{formatVND(depositPaid)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-xs">
                <span>Số tiền còn lại thanh toán tại quầy Check-in:</span>
                <span className="font-medium text-slate-700">{formatVND(remaining)}</span>
              </div>
            </div>
          </div>

          {/* Tiện ích chuyển nhanh sang Lễ tân F3 để kiểm thử */}
          <div className="mt-6 p-4 rounded-xl bg-purple-50 border border-purple-200 text-left flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-purple-900 uppercase">Dành cho Giảng viên / Kiểm thử viên:</p>
              <p className="text-xs text-purple-700">Đơn đã được tự động đồng bộ sang Phân hệ Lễ tân PMS (F3).</p>
            </div>
            <Link
              href="/admin/checkin"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow transition-colors"
            >
              Mở trang Check-in Lễ tân <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => window.print()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-slate-100 transition-colors"
            >
              <Download className="size-4" /> IN PHIẾU XÁC NHẬN ĐẶT PHÒNG
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
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
