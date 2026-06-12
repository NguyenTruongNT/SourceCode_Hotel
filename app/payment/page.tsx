"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Wallet, Building2, Store, ShieldCheck, Clock, Tag } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { OrderSummary, nights } from "@/components/order-summary"
import { useBooking } from "@/components/booking-context"
import { getRoom, formatVND } from "@/lib/rooms"

const methods = [
  { id: "card", label: "Thẻ tín dụng / Thẻ ghi nợ", icon: CreditCard },
  { id: "wallet", label: "Ví điện tử (Momo, ZaloPay, VNPay)", icon: Wallet },
  { id: "bank", label: "Chuyển khoản ngân hàng", icon: Building2 },
  { id: "counter", label: "Thanh toán tại quầy", icon: Store },
]

function formatCountdown(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

function makeCode() {
  const today = new Date()
  const ymd = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `THAD-${ymd}-${rand}`
}

export default function PaymentPage() {
  const router = useRouter()
  const { selectedRoomId, customer, payment, setPayment, discount, search, setBookingCode } = useBooking()
  const room = selectedRoomId ? getRoom(selectedRoomId) : undefined
  const [seconds, setSeconds] = useState(15 * 60)
  const [processing, setProcessing] = useState(false)
  const [voucherCode, setVoucherCode] = useState("")
  const [voucherError, setVoucherError] = useState("")
  const [showVoucherInput, setShowVoucherInput] = useState(false)
  const { setDiscount } = useBooking()

  useEffect(() => {
    if (!selectedRoomId || !customer.name) router.replace("/search")
  }, [selectedRoomId, customer.name, router])

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  if (!room) return null

  const subtotalTotal = Math.max(0, room.price * nights(search.checkIn, search.checkOut) - discount)

  function handlePay() {
    if (!payment) return;
    setProcessing(true)
    // Simulate payment: ~75% success
    setTimeout(() => {
      const ok = Math.random() > 0.25
      if (ok) {
        setBookingCode(makeCode())
        router.push("/success")
      } else {
        router.push("/payment/error")
      }
    }, 1200)
  }

  function applyVoucher() {
    if (voucherCode === "SUMMER20") {
      setDiscount(subtotalTotal * 0.2);
      setVoucherError("");
    } else {
      setVoucherError("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      setDiscount(0);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/booking"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Quay lại
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-foreground">Thanh toán</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Hold timer */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
              <Clock className="mt-0.5 size-4 shrink-0" />
              <p>
                Chúng tôi đang giữ phòng cho bạn trong{" "}
                <span className="font-semibold tabular-nums">{formatCountdown(seconds)}</span>. Vui lòng hoàn tất thanh
                toán trước khi thời gian hết hạn.
              </p>
            </div>

            {/* Customer recap */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-foreground">Thông tin khách hàng</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tên khách hàng</dt>
                  <dd className="font-medium text-foreground">{customer.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium text-foreground">{customer.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Số điện thoại</dt>
                  <dd className="font-medium text-foreground">{customer.phone}</dd>
                </div>
              </dl>
            </div>

            {/* Voucher interaction */}
            <div className="rounded-xl border border-border bg-card p-5">
              {!showVoucherInput ? (
                <button 
                  onClick={() => setShowVoucherInput(true)}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
                >
                  <Tag className="size-4" /> Áp dụng mã giảm giá
                </button>
              ) : (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">Mã giảm giá</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Nhập mã giảm giá..."
                      className={`flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30 ${voucherError ? 'border-destructive focus:border-destructive' : 'border-input focus:border-ring'}`}
                    />
                    <button 
                      onClick={applyVoucher}
                      className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80"
                    >
                      Áp dụng
                    </button>
                  </div>
                  {voucherError && <p className="text-xs text-destructive">{voucherError}</p>}
                </div>
              )}
            </div>

            {/* Payment methods */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-foreground">Phương thức thanh toán</h2>
              <div className="mt-4 space-y-3">
                {methods.map((m) => {
                  const Icon = m.icon
                  const active = payment === m.id
                  return (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                        active ? "border-primary bg-accent" : "border-border hover:bg-secondary/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={active}
                        onChange={() => setPayment(m.id)}
                        className="size-4 accent-[var(--primary)]"
                      />
                      <Icon className="size-5 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{m.label}</span>
                    </label>
                  )
                })}
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5" /> Bạn sẽ được chuyển đến cổng thanh toán an toàn để hoàn tất giao
                dịch.
              </p>
            </div>
          </div>

          {/* Summary + pay */}
          <aside className="space-y-4">
            <OrderSummary room={room} />
            <button
              onClick={handlePay}
              disabled={processing || !payment}
              className={`w-full rounded-md py-3 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${payment ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-slate-200 text-slate-500'}`}
            >
              {processing ? "Đang xử lý..." : payment ? `XÁC NHẬN THANH TOÁN ${formatVND(subtotalTotal)}` : "VUI LÒNG CHỌN PHƯƠNG THỨC"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Thông tin của bạn sẽ được bảo mật theo chính sách bảo vệ dữ liệu cá nhân.
            </p>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
