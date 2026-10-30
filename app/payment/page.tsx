"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  Smartphone,
  ShieldCheck,
  Clock,
  Tag,
  AlertCircle,
  CheckCircle2,
  Lock,
  X
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useBooking } from "@/components/booking-context"
import { getRoom, formatVND } from "@/lib/rooms"
import { Voucher, RoomType } from "@/app/admin/types"
import { INITIAL_VOUCHERS } from "@/app/admin/data"

// 3 phương thức thanh toán cọc theo chuẩn đặc tả F2 (3.3.2)
const paymentMethods = [
  {
    id: "VNPAY",
    name: "Cổng VNPay (QR Pay)",
    desc: "Quét mã VNPAY-QR qua ứng dụng ngân hàng hoặc ví VNPAY",
    icon: QrCode,
    badge: "Khuyên dùng",
  },
  {
    id: "MOMO",
    name: "Ví điện tử MoMo",
    desc: "Thanh toán siêu tốc qua ứng dụng Ví MoMo",
    icon: Smartphone,
  },
  {
    id: "CARD",
    name: "Thẻ ghi nợ / Tín dụng quốc tế",
    desc: "Hỗ trợ thẻ Visa, MasterCard, JCB nội địa và quốc tế",
    icon: CreditCard,
  },
]

function formatCountdown(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

export default function PaymentPage() {
  const router = useRouter()
  const {
    selectedRoomId,
    customer,
    payment,
    setPayment,
    termsAgreed,
    setTermsAgreed,
    discount,
    setDiscount,
    discountCode,
    setDiscountCode,
    search,
    setBookingCode,
    saveBookingToPMS,
  } = useBooking()

  const room = selectedRoomId ? getRoom(selectedRoomId) : undefined
  const [seconds, setSeconds] = useState(15 * 60) // 15 phút (900s) holding timeout
  const [processing, setProcessing] = useState(false)
  const [voucherInput, setVoucherInput] = useState(discountCode || "")
  const [voucherError, setVoucherError] = useState("")
  const [voucherSuccessMsg, setVoucherSuccessMsg] = useState("")
  const [termsError, setTermsError] = useState("")

  // Available vouchers store
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS)

  // Modals
  const [showTimeoutModal, setShowTimeoutModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [currentPnr, setCurrentPnr] = useState("")

  useEffect(() => {
    if (!selectedRoomId || !customer.name) {
      router.replace("/search")
    }
  }, [selectedRoomId, customer.name, router])

  // Lấy danh sách Voucher mới nhất từ LocalStorage (F6)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("hotel_vouchers_v3")
      if (stored) {
        try {
          setAvailableVouchers(JSON.parse(stored))
        } catch {
          setAvailableVouchers(INITIAL_VOUCHERS)
        }
      }
    }
  }, [])

  // Đếm ngược 15 phút giữ chỗ tạm thời (BR_F2_02)
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowTimeoutModal(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!room) return null

  // Tính số đêm lưu trú
  const calculateNights = () => {
    if (!search.checkIn || !search.checkOut) return 1
    const start = new Date(search.checkIn).getTime()
    const end = new Date(search.checkOut).getTime()
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24))
    return Math.max(1, diff)
  }

  const nights = calculateNights()
  const subtotal = room.price * nights
  const discountAmount = discount > 0 ? discount : 0
  const afterDiscount = Math.max(0, subtotal - discountAmount)

  // Quy tắc nghiệp vụ BR_F2_01: Cọc tối thiểu 50% tổng giá trị phòng sau voucher
  const depositRequired = Math.round(afterDiscount * 0.5)
  const remainingAtCheckin = afterDiscount - depositRequired

  // Kiểm tra mã voucher theo đặc tả 3.3.2 & 3.3.4 (Ngoại lệ 5 - E5)
  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault()
    setVoucherError("")
    setVoucherSuccessMsg("")

    const code = voucherInput.trim().toUpperCase()
    if (!code) {
      setVoucherError("Vui lòng nhập mã giảm giá!")
      return
    }

    // Tra cứu trong kho Voucher
    const found = availableVouchers.find((v) => v.code.toUpperCase() === code)
    const todayStr = new Date().toISOString().slice(0, 10)

    if (
      !found ||
      found.status !== "Active" ||
      (found.endDate && found.endDate < todayStr) ||
      (found.used >= found.quantity)
    ) {
      setVoucherError("Mã giảm giá không hợp lệ hoặc đã hết lượt sử dụng!")
      setDiscount(0)
      setDiscountCode("")
      return
    }

    // Áp dụng thành công
    const calculatedDiscount = Math.round(subtotal * (found.percent / 100))
    setDiscount(calculatedDiscount)
    setDiscountCode(found.code)
    setVoucherSuccessMsg(`Áp dụng thành công mã ${found.code} (Giảm ${found.percent}%)!`)
  }

  // Xử lý xác nhận cọc và điều hướng thanh toán
  const handleConfirmBooking = () => {
    if (!termsAgreed) {
      setTermsError("Vui lòng tích chọn đồng ý với điều khoản lưu trú của HST Hotel!")
      return
    }
    setTermsError("")

    // Sinh mã đặt phòng PNR duy nhất theo chuẩn: HST + 5 chữ số
    const randomNum = Math.floor(10000 + Math.random() * 90000)
    const pnr = `HST${randomNum}`
    setCurrentPnr(pnr)

    setProcessing(true)

    // Hiển thị cổng thanh toán mô phỏng
    setTimeout(() => {
      setProcessing(false)
      setShowQRModal(true)
    }, 800)
  }

  const handleFinishPayment = () => {
    setShowQRModal(false)
    setProcessing(true)

    setTimeout(() => {
      // Map room type
      let rType = RoomType.STANDARD
      if (room.type === "Superior") rType = RoomType.SUPERIOR
      if (room.type === "Deluxe") rType = RoomType.DELUXE
      if (room.type === "Suite") rType = RoomType.SUITE

      // Lưu đơn vào Store chung để Lễ tân F3 tra cứu ngay
      saveBookingToPMS(currentPnr, rType, nights)
      setBookingCode(currentPnr)
      router.push("/success")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <SiteHeader />

      {/* Modal hết giờ giữ chỗ 15 phút (E6) */}
      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Clock className="size-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Hết thời gian giữ chỗ</h3>
            <p className="mt-2 text-sm text-slate-600">
              Giao dịch thanh toán cọc không thành công do quá thời gian 15 phút. Phiên giữ chỗ đã được giải phóng để nhường cho khách hàng khác!
            </p>
            <button
              onClick={() => {
                setShowTimeoutModal(false)
                router.push("/search")
              }}
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Quay lại tìm kiếm phòng
            </button>
          </div>
        </div>
      )}

      {/* Modal giả lập Cổng thanh toán (QR Pay / Thẻ / MoMo) */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowQRModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Lock className="size-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">
                  {payment === "VNPAY" ? "Cổng thanh toán VNPay-QR" : payment === "MOMO" ? "Cổng thanh toán MoMo" : "Cổng thẻ Quốc tế"}
                </h3>
              </div>
              <button onClick={() => setShowQRModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="size-5" />
              </button>
            </div>

            <div className="text-center py-4">
              <div className="mx-auto size-48 bg-slate-100 border border-slate-300 rounded-xl flex flex-col items-center justify-center p-3">
                <QrCode className="size-36 text-slate-800" />
                <span className="text-[10px] text-slate-500 font-mono mt-1">QUÉT MÃ ĐỂ THANH TOÁN</span>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-900">
                <p className="font-semibold">Mã PNR: <span className="font-mono text-blue-700">{currentPnr}</span></p>
                <p className="mt-1">Số tiền cọc cần trả (50%): <strong className="text-blue-700">{formatVND(depositRequired)}</strong></p>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                (Môi trường kiểm thử giả lập: Nhấn nút bên dưới để mô phỏng khách hàng quét mã và ngân hàng phản hồi giao dịch thành công)
              </p>

              <button
                onClick={handleFinishPayment}
                className="mt-5 w-full rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 shadow-md transition-colors"
              >
                Xác nhận đã quét mã &amp; Hoàn tất cọc
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <Link
            href="/booking"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="size-4" /> Quay lại thông tin khách
          </Link>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
            Bước 2: Thanh toán cọc &amp; Xác nhận PNR
          </span>
        </div>

        {/* Thanh đếm ngược 15 phút (900s) giữ phòng */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="size-5 text-amber-600 animate-pulse" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Thời gian giữ chỗ tạm thời (BR_F2_02)
              </p>
              <p className="text-xs text-amber-700">
                Phòng đang được khóa giữ trong 15 phút. Quý khách vui lòng hoàn tất đặt cọc trước khi hết giờ.
              </p>
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-amber-600">
            {formatCountdown(seconds)}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr] items-start">
          {/* Cột trái: Tóm tắt chi phí thanh toán */}
          <aside className="h-fit rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4 text-slate-900">Chi tiết thanh toán</h2>

            <div className="space-y-3 text-sm border-b border-slate-200 pb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Khách đặt:</span>
                <span className="font-semibold text-slate-900">{customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CCCD:</span>
                <span className="font-mono font-medium text-slate-900">{customer.idNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hạng phòng:</span>
                <span className="font-semibold text-slate-900">{room.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kỳ lưu trú:</span>
                <span className="font-medium text-slate-900">{nights} đêm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Giá phòng 1 đêm:</span>
                <span className="text-slate-900">{formatVND(room.price)}</span>
              </div>
            </div>

            <div className="space-y-2 py-4 border-b border-slate-200 text-sm">
              <div className="flex justify-between text-slate-700">
                <span>Tổng tiền phòng:</span>
                <span>{formatVND(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Mã ưu đãi ({discountCode}):</span>
                  <span>-{formatVND(discount)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-slate-900 text-base pt-2">
                <span>Tổng sau giảm giá:</span>
                <span>{formatVND(afterDiscount)}</span>
              </div>
            </div>

            {/* Khối cọc 50% theo BR_F2_01 */}
            <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-blue-900">Tiền cọc cần thanh toán (50%):</span>
                <span className="text-xl font-extrabold text-blue-700">{formatVND(depositRequired)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 border-t border-blue-200/60 pt-2">
                <span>Còn lại thanh toán khi Check-in:</span>
                <span className="font-semibold text-slate-700">{formatVND(remainingAtCheckin)}</span>
              </div>
            </div>

            {/* Nhập mã Voucher F6 */}
            <form onSubmit={handleApplyVoucher} className="mt-6">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
                <Tag className="size-3.5" /> Mã giảm giá Voucher (F6)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherInput}
                  onChange={(e) => {
                    setVoucherInput(e.target.value.toUpperCase())
                    setVoucherError("")
                  }}
                  placeholder="VD: HST2026, SUMMER20"
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm uppercase font-mono outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-900"
                >
                  Áp dụng
                </button>
              </div>
              {voucherError && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                  <AlertCircle className="size-3.5 shrink-0" />
                  <span>{voucherError}</span>
                </div>
              )}
              {voucherSuccessMsg && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  <span>{voucherSuccessMsg}</span>
                </div>
              )}
            </form>
          </aside>

          {/* Cột phải: Chọn phương thức & Điều khoản */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Phương thức thanh toán cọc trực tuyến
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Chọn một trong các phương thức thanh toán an toàn được HST Hotel bảo chứng:
              </p>

              <div className="space-y-3">
                {paymentMethods.map((m) => {
                  const Icon = m.icon
                  const isSelected = payment === m.id
                  return (
                    <label
                      key={m.id}
                      onClick={() => setPayment(m.id)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={isSelected}
                          onChange={() => setPayment(m.id)}
                          className="size-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-900">{m.name}</span>
                            {m.badge && (
                              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                {m.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Checkbox điều khoản lưu trú (Bắt buộc theo đặc tả 3.3.2) */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="termsAgreement"
                  checked={termsAgreed}
                  onChange={(e) => {
                    setTermsAgreed(e.target.checked)
                    if (e.target.checked) setTermsError("")
                  }}
                  className="mt-1 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="termsAgreement" className="text-sm text-slate-700 cursor-pointer leading-relaxed">
                  Tôi đồng ý với <strong>Chính sách đặt phòng và Quy định thanh toán cọc</strong> của HST Hotel.
                  Tôi cam kết thông tin số định danh CCCD đã khai báo là chính xác để đối chiếu khi làm thủ tục Check-in.
                </label>
              </div>

              {termsError && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{termsError}</span>
                </div>
              )}

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  Mã hóa bảo mật 256-bit SSL
                </div>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={processing}
                  className={`flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm font-bold text-white transition-all shadow-md ${
                    processing
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  }`}
                >
                  {processing ? (
                    <>
                      <span className="animate-spin">⏳</span> Đang chuyển cổng thanh toán...
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" /> Xác nhận và Thanh toán cọc ({formatVND(depositRequired)})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
