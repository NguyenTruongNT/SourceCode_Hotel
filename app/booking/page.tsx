"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Mail, Phone, FileText } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { OrderSummary } from "@/components/order-summary"
import { useBooking } from "@/components/booking-context"
import { getRoom } from "@/lib/rooms"

export default function BookingPage() {
  const router = useRouter()
  const { selectedRoomId, customer, setCustomer } = useBooking()
  const room = selectedRoomId ? getRoom(selectedRoomId) : undefined

  const [name, setName] = useState(customer.name)
  const [email, setEmail] = useState(customer.email)
  const [phone, setPhone] = useState(customer.phone)
  const [note, setNote] = useState(customer.note)
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({})

  useEffect(() => {
    if (!selectedRoomId) router.replace("/search")
  }, [selectedRoomId, router])

  if (!room) return null

  function validate() {
    const e: typeof errors = {}
    if (!name.trim()) e.name = "Vui lòng nhập họ và tên"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Email không hợp lệ"
    if (!/^0\d{8,10}$/.test(phone.replace(/\s/g, ""))) e.phone = "Số điện thoại không đúng định dạng"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setCustomer({ name, email, phone, note })
    router.push("/payment")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Quay lại danh sách phòng
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-foreground">Thông tin đặt phòng</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Order summary (Cột trái) */}
          <aside className="order-1 lg:order-none">
            <OrderSummary room={room} />
          </aside>

          {/* Customer form (Cột phải) */}
          <form onSubmit={handleContinue} className="order-2 lg:order-none rounded-xl border border-border bg-card p-5 sm:p-6">
            <h2 className="text-base font-semibold text-foreground">Thông tin khách hàng</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Vui lòng điền đầy đủ thông tin. Các trường đánh dấu (*) là bắt buộc.
            </p>

            <div className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Họ và tên *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className={`w-full rounded-md border bg-background pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30 ${errors.name ? 'border-destructive focus:border-destructive' : 'border-input focus:border-ring'}`}
                  />
                </div>
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className={`w-full rounded-md border bg-background pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30 ${errors.email ? 'border-destructive focus:border-destructive' : 'border-input focus:border-ring'}`}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Email để nhận thông tin xác nhận</p>
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Số điện thoại *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="090 123 4567"
                    className={`w-full rounded-md border bg-background pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30 ${errors.phone ? 'border-destructive focus:border-destructive' : 'border-input focus:border-ring'}`}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Số điện thoại để liên hệ</p>
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Ghi chú (Không bắt buộc)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value.slice(0, 500))}
                    rows={3}
                    placeholder="Yêu cầu đặc biệt, thời gian check-in dự kiến, số phòng mong muốn..."
                    className="w-full resize-none rounded-md border border-input bg-background pl-10 pr-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <p className="text-right text-xs text-muted-foreground">{note.length}/500 ký tự</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={Object.keys(errors).length > 0}
              className="mt-6 w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tiếp tục thanh toán
            </button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
