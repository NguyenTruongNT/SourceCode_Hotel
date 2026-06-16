"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Wallet, Building2, Store, ShieldCheck, Clock, Tag, AlertCircle } from "lucide-react"
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

const VALID_VOUCHERS: Record<string, number> = {
  "SUMMER20": 0.2,
  "WELCOME10": 0.1,
  "THAD50K": 50000,
}

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
  const {
    selectedRoomId,
    customer,
    payment,
    setPayment,
    discount,
    setDiscount,
    discountCode,
    setDiscountCode,
    search,
    setBookingCode
  } = useBooking()

  const room = selectedRoomId ? getRoom(selectedRoomId) : undefined
  const [seconds, setSeconds] = useState(15 * 60)
  const [processing, setProcessing] = useState(false)
  const [voucherCode, setVoucherCode] = useState(discountCode || "")
  const [voucherError, setVoucherError] = useState("")
  const [showVoucherInput, setShowVoucherInput] = useState(false)
  const [voucherSuccess, setVoucherSuccess] = useState(false)

  // Modal states
  const [showRoomTakenModal, setShowRoomTakenModal] = useState(false)
  const [showPaymentFailedModal, setShowPaymentFailedModal] = useState(false)

  useEffect(() => {
    if (!selectedRoomId || !customer.name) {
      router.replace("/search")
    }
  }, [selectedRoomId, customer.name, router])

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (seconds === 0) {
      alert("Thời gian giữ phòng đã hết. Vui lòng tìm kiếm lại phòng khác.")
      router.push("/search")
    }
  }, [seconds, router])

  if (!room) return null

  const nightsCount = nights(search.checkIn, search.checkOut)
  const subtotal = room.price * nightsCount
  const discountAmount = discount > 0 ? discount : 0
  const total = Math.max(0, subtotal - discountAmount)

  const validateVoucher = (code: string): { valid: boolean; message: string; value: number } => {
    const trimmedCode = code.trim().toUpperCase()

    if (!trimmedCode) {
      return { valid: false, message: "Vui lòng nhập mã giảm giá", value: 0 }
    }

    const voucherValue = VALID_VOUCHERS[trimmedCode]

    if (!voucherValue) {
      return { valid: false, message: "Mã giảm giá không hợp lệ hoặc đã hết hạn", value: 0 }
    }

    let discountValue = 0
    if (voucherValue <= 1) {
      discountValue = subtotal * voucherValue
    } else {
      discountValue = Math.min(voucherValue, subtotal)
    }

    return { valid: true, message: "", value: discountValue }
  }

  const handleApplyVoucher = () => {
    const result = validateVoucher(voucherCode)
    setVoucherError(result.message)

    if (result.valid) {
      setDiscount(result.value)
      setDiscountCode(voucherCode.trim().toUpperCase())
      setVoucherSuccess(true)
      setTimeout(() => setVoucherSuccess(false), 3000)
    } else {
      setDiscount(0)
      setDiscountCode("")
      setVoucherSuccess(false)
    }
  }

  const handleVoucherChange = (code: string) => {
    setVoucherCode(code)
    if (voucherError) {
      setVoucherError("")
      setVoucherSuccess(false)
    }
  }

  // Tách riêng logic xử lý thanh toán (không kiểm tra availability nữa)
  const processPayment = () => {
    setProcessing(true)
    setShowPaymentFailedModal(false)

    setTimeout(() => {
      const isPaymentSuccess = Math.random() > 0.25

      if (isPaymentSuccess) {
        setBookingCode(makeCode())
        router.push("/success")
      } else {
        setProcessing(false)
        setShowPaymentFailedModal(true)
      }
    }, 1500)
  }

  const handlePay = () => {
    if (!payment) return

    // Ngoại lệ 4: Kiểm tra phòng còn khả dụng không
    const isRoomStillAvailable = Math.random() > 0.25

    if (!isRoomStillAvailable) {
      setShowRoomTakenModal(true)
      return
    }

    // Nếu phòng còn, tiến hành thanh toán
    processPayment()
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <SiteHeader />

      {/* Modal: Phòng bị đặt mất (Ngoại lệ 4) */}
      {showRoomTakenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="size-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Phòng đã bị đặt mất</h3>
            <p className="mt-2 text-sm text-slate-500">
              Rất tiếc, phòng{" "}
              <span className="font-medium text-slate-700">{room.name}</span> vừa được
              khách hàng khác hoàn tất thanh toán trong lúc bạn thực hiện giao dịch.
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-left text-xs text-slate-500">
              <svg
                className="mt-0.5 size-3.5 shrink-0 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              Vui lòng quay lại để chọn phòng và đặt lại từ đầu.
            </div>
            <button
              onClick={() => {
                setShowRoomTakenModal(false)
                router.push("/search")
              }}
              className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              QUAY LẠI CHỌN PHÒNG
            </button>
          </div>
        </div>
      )}

      {/* Modal: Thanh toán thất bại (Ngoại lệ 3) */}
      {showPaymentFailedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-red-100">
              <svg className="size-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Giao dịch chưa thành công</h3>
            <p className="mt-2 text-sm text-slate-500">
              Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng thử lại hoặc
              chọn phương thức thanh toán khác.
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-left text-xs text-slate-500">
              <svg
                className="mt-0.5 size-3.5 shrink-0 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              <span>
                Chúng tôi đang giữ phòng thêm{" "}
                <span className="font-semibold text-slate-700 tabular-nums">
                  {formatCountdown(seconds)}
                </span>
                . Hãy hoàn tất trước khi hết giờ, sau đó phòng sẽ tự động giải phóng.
              </span>
            </div>
            <button
              onClick={processPayment}
              className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              THỬ LẠI NGAY
            </button>
            <button
              onClick={() => {
                setShowPaymentFailedModal(false)
                setPayment("")
              }}
              className="mt-2 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              CHỌN PHƯƠNG THỨC KHÁC
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/booking"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="size-4" /> Quay lại thông tin đặt phòng
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">Thanh toán</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Thông tin khách hàng */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Thông tin khách hàng</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Họ và tên</dt>
                  <dd className="font-medium text-slate-900">{customer.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Email</dt>
                  <dd className="font-medium text-slate-900">{customer.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Số điện thoại</dt>
                  <dd className="font-medium text-slate-900">{customer.phone}</dd>
                </div>
                {customer.note && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Ghi chú</dt>
                    <dd className="font-medium text-slate-900 max-w-[200px] text-right break-words">
                      {customer.note}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Mã giảm giá */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              {!showVoucherInput ? (
                <button
                  onClick={() => setShowVoucherInput(true)}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Tag className="size-4" /> Áp dụng mã giảm giá
                </button>
              ) : (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-900">Mã giảm giá</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => handleVoucherChange(e.target.value)}
                      placeholder="Nhập mã giảm giá (VD: SUMMER20, WELCOME10, THAD50K)"
                      className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                    <button
                      onClick={handleApplyVoucher}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>

                  {voucherError && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-red-600">
                      <AlertCircle className="size-3.5" />
                      <span>{voucherError}</span>
                    </div>
                  )}

                  {voucherSuccess && !voucherError && discountAmount > 0 && (
                    <p className="text-xs text-green-600">
                      ✓ Đã áp dụng mã {voucherCode.trim().toUpperCase()}. Giảm{" "}
                      {formatVND(discountAmount)}
                    </p>
                  )}

                  <p className="text-xs text-slate-400">
                    Mã thử nghiệm: SUMMER20 (20%), WELCOME10 (10%), THAD50K (50,000đ)
                  </p>
                </div>
              )}
            </div>

            {/* Phương thức thanh toán */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Phương thức thanh toán</h2>
              <p className="text-xs text-slate-400 mt-1 mb-3">
                Vui lòng chọn một phương thức thanh toán để tiếp tục
              </p>
              <div className="mt-2 space-y-3">
                {methods.map((m) => {
                  const Icon = m.icon
                  const active = payment === m.id
                  return (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${active
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={active}
                        onChange={() => setPayment(m.id)}
                        className="size-4 accent-blue-600"
                      />
                      <Icon
                        className={`size-5 ${active ? "text-blue-600" : "text-slate-400"}`}
                      />
                      <span
                        className={`text-sm font-medium ${active ? "text-blue-700" : "text-slate-700"
                          }`}
                      >
                        {m.label}
                      </span>
                    </label>
                  )
                })}
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="size-3.5" /> Bạn sẽ được chuyển đến cổng thanh
                toán an toàn để hoàn tất giao dịch.
              </p>
            </div>
          </div>

          {/* Order Summary và nút thanh toán */}
          <aside className="space-y-4">
            <OrderSummary
              room={room}
              discount={discountAmount}
              discountCode={discountCode}
              nights={nightsCount}
            />

            <button
              onClick={handlePay}
              disabled={processing || !payment}
              className={`w-full rounded-lg py-3 text-sm font-semibold transition-all ${payment && !processing
                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                : "bg-slate-300 text-white cursor-not-allowed opacity-60"
                }`}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Đang xử lý...
                </span>
              ) : payment ? (
                `XÁC NHẬN THANH TOÁN ${formatVND(total)}`
              ) : (
                "VUI LÒNG CHỌN PHƯƠNG THỨC THANH TOÁN"
              )}
            </button>

            <p className="text-center text-xs text-slate-400">
              Thông tin của bạn sẽ được bảo mật theo chính sách bảo vệ dữ liệu cá nhân.
            </p>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}