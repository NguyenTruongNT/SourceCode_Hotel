"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Info, Wifi, Coffee, AlertCircle, ShieldCheck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useBooking } from "@/components/booking-context"
import { useAuth } from "@/components/auth-context"
import { getRoom, formatVND } from "@/lib/rooms"

type FieldName = "fullName" | "email" | "phone" | "idNumber"

export default function BookingPage() {
  const router = useRouter()
  const { selectedRoomId, search, customer, setCustomer, setTotalAmount, setDepositAmount } = useBooking()
  const { user, isLoggedIn } = useAuth()
  const room = selectedRoomId ? getRoom(selectedRoomId) : undefined

  // Form states
  const [name, setName] = useState(customer.name || "")
  const [email, setEmail] = useState(customer.email || "")
  const [phone, setPhone] = useState(customer.phone || "")
  const [idNumber, setIdNumber] = useState(customer.idNumber || "")
  const [note, setNote] = useState(customer.note || "")

  // Error states theo mã lỗi đặc tả E1, E2, E3, E4
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
  })

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
    idNumber: false,
  })

  // Tính số đêm
  const calculateNights = () => {
    if (!search.checkIn || !search.checkOut) return 1
    const start = new Date(search.checkIn).getTime()
    const end = new Date(search.checkOut).getTime()
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24))
    return Math.max(1, diff)
  }

  const nights = calculateNights()
  const subtotal = room ? room.price * nights : 0
  const deposit = Math.round(subtotal * 0.5)

  useEffect(() => {
    setTotalAmount(subtotal)
    setDepositAmount(deposit)
  }, [subtotal, deposit, setTotalAmount, setDepositAmount])

  // Tự động điền nếu đăng nhập
  useEffect(() => {
    if (isLoggedIn && user && user.name && !name) {
      setName(user.name)
      setEmail(user.email || "")
      setPhone(user.phone || "")
      setIdNumber(user.cccd || "001090123456")
    }
  }, [isLoggedIn, user, name])

  // Validation rules bám sát đặc tả F2 (3.3.2 & 3.3.4):
  // E1: Tên 3-50 ký tự, chỉ chữ cái tiếng Việt/Anh
  // E2: SĐT 10 số, đầu số 03, 05, 07, 08, 09
  // E3: Email chuẩn
  // E4: CCCD đúng 12 chữ số hoặc Hộ chiếu 1 chữ in hoa + 7 số
  const validateField = (field: FieldName, value: string): string => {
    const val = value.trim()
    switch (field) {
      case "fullName":
        if (!val) return "Họ và tên bắt buộc nhập!"
        if (val.length < 3 || val.length > 50 || !/^[\p{L} ]+$/u.test(val)) {
          return "Họ và tên không hợp lệ (chỉ được chứa chữ cái, từ 3-50 ký tự)!"
        }
        return ""

      case "phone":
        if (!val) return "Số điện thoại bắt buộc nhập!"
        if (!/^(03|05|07|08|09)\d{8}$/.test(val)) {
          return "Số điện thoại không đúng định dạng di động Việt Nam (10 số)!"
        }
        return ""

      case "email":
        if (!val) return "Địa chỉ email bắt buộc nhập!"
        if (val.includes(" ") || !/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(val)) {
          return "Địa chỉ email không hợp lệ!"
        }
        return ""

      case "idNumber":
        if (!val) return "Số CCCD hoặc Hộ chiếu bắt buộc nhập!"
        const isCccd = /^\d{12}$/.test(val)
        const isPassport = /^[A-Z]\d{7}$/.test(val)
        if (!isCccd && !isPassport) {
          return "Số CCCD phải gồm đúng 12 chữ số hoặc Hộ chiếu gồm 1 chữ cái in hoa + 7 số!"
        }
        return ""

      default:
        return ""
    }
  }

  const handleFieldChange = (field: FieldName, value: string) => {
    if (field === "fullName") setName(value)
    if (field === "email") setEmail(value)
    if (field === "phone") setPhone(value)
    if (field === "idNumber") setIdNumber(value)

    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
    }
  }

  const handleBlur = (field: FieldName) => {
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }))
    }
    const val =
      field === "fullName" ? name : field === "email" ? email : field === "phone" ? phone : idNumber
    setErrors((prev) => ({ ...prev, [field]: validateField(field, val) }))
  }

  const isFormValid = () => {
    const nameErr = validateField("fullName", name)
    const emailErr = validateField("email", email)
    const phoneErr = validateField("phone", phone)
    const idErr = validateField("idNumber", idNumber)
    return !nameErr && !emailErr && !phoneErr && !idErr
  }

  // Redirect if no room selected
  useEffect(() => {
    if (!selectedRoomId) router.replace("/search")
  }, [selectedRoomId, router])

  if (!room) return null

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ fullName: true, email: true, phone: true, idNumber: true })

    const nameErr = validateField("fullName", name)
    const emailErr = validateField("email", email)
    const phoneErr = validateField("phone", phone)
    const idErr = validateField("idNumber", idNumber)

    setErrors({
      fullName: nameErr,
      email: emailErr,
      phone: phoneErr,
      idNumber: idErr,
    })

    if (nameErr || emailErr || phoneErr || idErr) return

    setCustomer({ name, email, phone, idNumber, note })
    router.push("/payment")
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="size-4" /> Quay lại danh sách phòng
          </Link>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
            Bước 1: Thông tin khách hàng & CCCD
          </span>
        </div>

        {isLoggedIn && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 shadow-sm flex items-center gap-2">
            <Info className="size-4 shrink-0" />
            <span>
              Bạn đang đặt phòng với tài khoản <strong>{user?.name}</strong>. Hệ thống đã tự động điền thông tin đã lưu.
            </span>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr] items-start">
          {/* Cột trái: Tóm tắt đơn đặt theo đặc tả 3.3.3 Bước 2 */}
          <aside className="h-fit rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4 text-slate-900">Tóm tắt đơn đặt phòng</h2>
            <div className="relative h-44 w-full mb-4 overflow-hidden rounded-lg">
              <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
            </div>
            <h3 className="font-bold text-base text-slate-900">{room.name}</h3>
            <p className="text-xs text-slate-500 mb-4">{room.description}</p>

            <div className="space-y-3 text-sm border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Ngày nhận phòng:</span>
                <span className="font-semibold text-slate-900">
                  {search.checkIn ? new Date(search.checkIn).toLocaleDateString("vi-VN") : "---"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ngày trả phòng:</span>
                <span className="font-semibold text-slate-900">
                  {search.checkOut ? new Date(search.checkOut).toLocaleDateString("vi-VN") : "---"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Thời gian lưu trú:</span>
                <span className="font-semibold text-slate-900">{nights} đêm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số lượng khách:</span>
                <span className="font-semibold text-slate-900">{search.guests} người</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Giá phòng tiêu chuẩn:</span>
                <span className="font-semibold text-slate-900">{formatVND(room.price)} / đêm</span>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Tổng tiền phòng ({nights} đêm):</span>
                <span className="font-bold text-slate-900">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm p-2 rounded bg-amber-50 border border-amber-200">
                <span className="text-amber-800 font-medium">Tiền cọc 50% yêu cầu:</span>
                <span className="font-bold text-amber-900">{formatVND(deposit)}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <span className="flex items-center gap-1 text-xs bg-slate-100 px-2.5 py-1.5 rounded text-slate-700 font-medium">
                <Wifi className="size-3.5" /> Wifi miễn phí
              </span>
              <span className="flex items-center gap-1 text-xs bg-slate-100 px-2.5 py-1.5 rounded text-slate-700 font-medium">
                <Coffee className="size-3.5" /> Bữa sáng
              </span>
            </div>
          </aside>

          {/* Cột phải: Form thông tin khách hàng bám sát F2 */}
          <form onSubmit={handleContinue} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Thông tin khách hàng đặt phòng (F2)</h2>
            <p className="mt-1 text-sm text-slate-500 mb-6">
              Vui lòng điền đúng thông tin định danh CCCD để đối chiếu khi làm thủ tục nhận phòng (Check-in).
            </p>

            <div className="space-y-5">
              {/* Họ và tên (E1) */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">
                  Họ và tên khách đặt <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => handleFieldChange("fullName", e.target.value)}
                  onBlur={() => handleBlur("fullName")}
                  placeholder="Ví dụ: Nguyễn Văn Huỳnh"
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 ${
                    errors.fullName && touched.fullName
                      ? "border-red-500 bg-red-50 focus:ring-red-100"
                      : "border-slate-200 bg-slate-50 focus:ring-blue-100"
                  }`}
                />
                {errors.fullName && touched.fullName && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{errors.fullName}</span>
                  </div>
                )}
              </div>

              {/* Số CCCD / Hộ chiếu (E4) - Bổ sung theo đặc tả */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">
                  Số CCCD / Hộ chiếu <span className="text-red-500">*</span>
                </label>
                <input
                  value={idNumber}
                  onChange={(e) => handleFieldChange("idNumber", e.target.value)}
                  onBlur={() => handleBlur("idNumber")}
                  placeholder="CCCD gồm đúng 12 số (VD: 001090123456) hoặc Hộ chiếu (VD: B1234567)"
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 ${
                    errors.idNumber && touched.idNumber
                      ? "border-red-500 bg-red-50 focus:ring-red-100"
                      : "border-slate-200 bg-slate-50 focus:ring-blue-100"
                  }`}
                />
                <span className="text-xs text-slate-400 mt-1 block">
                  Định dạng: 12 chữ số CCCD Việt Nam hoặc 1 chữ cái in hoa kèm 7 số hộ chiếu.
                </span>
                {errors.idNumber && touched.idNumber && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{errors.idNumber}</span>
                  </div>
                )}
              </div>

              {/* Số điện thoại (E2) */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">
                  Số điện thoại liên hệ <span className="text-red-500">*</span>
                </label>
                <input
                  value={phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  placeholder="Đúng 10 chữ số (VD: 0901234567)"
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 ${
                    errors.phone && touched.phone
                      ? "border-red-500 bg-red-50 focus:ring-red-100"
                      : "border-slate-200 bg-slate-50 focus:ring-blue-100"
                  }`}
                />
                {errors.phone && touched.phone && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>

              {/* Email (E3) */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">
                  Địa chỉ Email nhận xác nhận <span className="text-red-500">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="email@example.com"
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 ${
                    errors.email && touched.email
                      ? "border-red-500 bg-red-50 focus:ring-red-100"
                      : "border-slate-200 bg-slate-50 focus:ring-blue-100"
                  }`}
                />
                {errors.email && touched.email && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Ghi chú */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">
                  Ghi chú lưu trú (Không bắt buộc)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) setNote(e.target.value)
                  }}
                  rows={3}
                  placeholder="Yêu cầu tầng cao, phòng không hút thuốc, giờ nhận phòng..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                />
                <div className="mt-1 text-right text-xs text-slate-400">
                  {note.length}/500 ký tự
                </div>
              </div>

              {/* Thông báo bảo mật */}
              <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-3.5 border border-emerald-100 text-emerald-800 text-xs">
                <ShieldCheck className="size-5 shrink-0 text-emerald-600" />
                <span>
                  Thông tin cá nhân và số định danh CCCD được mã hóa bảo mật phục vụ nghiệp vụ đối chiếu Check-in tại quầy lễ tân.
                </span>
              </div>

              {/* Nút tiếp tục sang Bước 2 Thanh toán cọc */}
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`w-full rounded-lg py-3.5 font-bold text-white transition-all shadow-sm ${
                  isFormValid()
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    : "bg-slate-300 cursor-not-allowed"
                }`}
              >
                Tiếp tục đến bước Thanh toán cọc &gt;
              </button>
            </div>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
