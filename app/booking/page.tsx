"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Info, Wifi, Coffee, AlertCircle, User, LogOut, LogIn } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useBooking } from "@/components/booking-context"
import { useAuth } from "@/components/auth-context"
import { getRoom, formatVND } from "@/lib/rooms"

// Regex validation rules
const VALIDATION = {
  fullName: /^[a-zA-ZÀ-ỹ\s]{2,100}$/,
  email: /^\S+@\S+\.\S+$/,
  phone: /^(0|84)(3|5|7|8|9)\d{8}$/,
}

type FieldName = "fullName" | "email" | "phone"

export default function BookingPage() {
  const router = useRouter()
  const { selectedRoomId, search, customer, setCustomer } = useBooking()
  const { user, isLoggedIn, logout } = useAuth()
  const room = selectedRoomId ? getRoom(selectedRoomId) : undefined

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")

  // Error state
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
  })

  // Touched state (chỉ hiển thị lỗi sau khi user rời input)
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
  })

  // ========== LUỒNG RẼ NHÁNH 2: Tự động điền thông tin khi đăng nhập ==========
  useEffect(() => {
    if (isLoggedIn && user && user.name) {
      // Tự động điền thông tin từ tài khoản
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone)
      // Lưu vào context
      setCustomer({ name: user.name, email: user.email, phone: user.phone, note: note })
    } else if (customer.name) {
      // Nếu chưa đăng nhập nhưng có thông tin cũ trong context
      setName(customer.name)
      setEmail(customer.email)
      setPhone(customer.phone)
      setNote(customer.note)
    }
  }, [isLoggedIn, user, customer.name])

  // Validate single field
  const validateField = (field: FieldName, value: string): string => {
    switch (field) {
      case "fullName":
        if (!value.trim()) return "Họ tên không được để trống"
        if (!VALIDATION.fullName.test(value)) return "Họ tên không hợp lệ (2-100 chữ cái, không số/ký tự đặc biệt)"
        return ""
      case "email":
        if (!value.trim()) return "Email không được để trống"
        if (!VALIDATION.email.test(value)) return "Email không hợp lệ (vd: ten@example.com)"
        return ""
      case "phone":
        if (!value.trim()) return "Số điện thoại không được để trống"
        if (!VALIDATION.phone.test(value)) return "Số điện thoại không đúng định dạng"
        return ""
      default:
        return ""
    }
  }

  // Update error when field changes
  const handleFieldChange = (field: FieldName, value: string) => {
    if (field === "fullName") setName(value)
    if (field === "email") setEmail(value)
    if (field === "phone") setPhone(value)

    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validateField(field, value) }))
    }
  }

  // Mark as touched on blur
  const handleBlur = (field: FieldName) => {
    if (!touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }))
      const error = validateField(field, field === "fullName" ? name : field === "email" ? email : phone)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  // Check overall form validity
  const isFormValid = () => {
    const nameError = validateField("fullName", name)
    const emailError = validateField("email", email)
    const phoneError = validateField("phone", phone)
    return nameError === "" && emailError === "" && phoneError === ""
  }

  // Redirect if no room selected
  useEffect(() => {
    if (!selectedRoomId) router.replace("/search")
  }, [selectedRoomId, router])

  if (!room) return null

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    // Mark all as touched before validation
    setTouched({ fullName: true, email: true, phone: true })
    const nameError = validateField("fullName", name)
    const emailError = validateField("email", email)
    const phoneError = validateField("phone", phone)
    setErrors({
      fullName: nameError,
      email: emailError,
      phone: phoneError,
    })
    if (nameError || emailError || phoneError) return
    setCustomer({ name, email, phone, note })
    router.push("/payment")
  }

  const handleLogout = () => {
    logout()
    setCustomer({ name: "", email: "", phone: "", note: "" })
    setName("")
    setEmail("")
    setPhone("")
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

        </div>



        {/* Thông báo đã đăng nhập - Màu xanh dương */}
        {isLoggedIn && (
          <div className="mt-4 rounded-lg border border-primary/10 bg-primary/5 p-3 text-sm text-primary shadow-sm">
            <Info className="inline size-4 mr-2" />
            Bạn đang đặt phòng với tài khoản <strong>{user.name}</strong>. Thông tin đã được tự động điền.
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr] items-start">
          {/* Cột trái: Thông tin đặt phòng */}
          <aside className="h-fit rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-5">Thông tin đặt phòng</h2>
            <div className="relative h-44 w-full mb-4 overflow-hidden rounded-lg">
              <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
            </div>
            <h3 className="font-bold text-base text-slate-900">{room.name}</h3>
            <p className="text-sm text-slate-600 mb-6">{room.description}</p>

            <div className="space-y-3 text-sm border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Nhận phòng</span>
                <span className="font-semibold text-slate-900">{new Date(search.checkIn).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trả phòng</span>
                <span className="font-semibold text-slate-900">{new Date(search.checkOut).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số khách</span>
                <span className="font-semibold text-slate-900">{search.guests} người</span>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5 flex justify-between items-center font-bold text-xl text-slate-900">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{formatVND(room.price)}</span>
            </div>

            <div className="mt-5 flex gap-2">
              <span className="flex items-center gap-1 text-xs bg-slate-200 px-2.5 py-1.5 rounded text-slate-700 font-medium">
                <Wifi className="size-3.5" /> Miễn phí Wifi
              </span>
              <span className="flex items-center gap-1 text-xs bg-slate-200 px-2.5 py-1.5 rounded text-slate-700 font-medium">
                <Coffee className="size-3.5" /> Ăn sáng
              </span>
            </div>
          </aside>

          {/* Cột phải: Form thông tin khách hàng */}
          <form onSubmit={handleContinue} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Thông tin khách hàng</h2>
            <p className="mt-1 text-sm text-slate-500 mb-6">
              Vui lòng điền đầy đủ thông tin. Các trường đánh dấu (*) là bắt buộc.
            </p>

            <div className="space-y-5">
              {/* Họ và tên */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => handleFieldChange("fullName", e.target.value)}
                  onBlur={() => handleBlur("fullName")}
                  placeholder="Nguyễn Văn A"
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 ${errors.fullName && touched.fullName
                    ? "border-red-500 bg-red-50 focus:ring-red-100"
                    : "border-slate-200 bg-slate-50 focus:ring-blue-100"
                    }`}
                />
                {errors.fullName && touched.fullName && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
                    <AlertCircle className="size-4" />
                    <span>{errors.fullName}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="email@example.com"
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 ${errors.email && touched.email
                    ? "border-red-500 bg-red-50 focus:ring-red-100"
                    : "border-slate-200 bg-slate-50 focus:ring-blue-100"
                    }`}
                />
                {errors.email && touched.email && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
                    <AlertCircle className="size-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  value={phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  placeholder="090 123 4567"
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 ${errors.phone && touched.phone
                    ? "border-red-500 bg-red-50 focus:ring-red-100"
                    : "border-slate-200 bg-slate-50 focus:ring-blue-100"
                    }`}
                />
                {errors.phone && touched.phone && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
                    <AlertCircle className="size-4" />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>

              {/* Ghi chú - giới hạn 500 ký tự */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">
                  Ghi chú (Không bắt buộc)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) setNote(e.target.value)
                  }}
                  rows={4}
                  placeholder="Yêu cầu đặc biệt, thời gian check-in dự kiến, số phòng mong muốn..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                />
                <div className="mt-1 text-right text-xs text-slate-400">
                  {note.length}/500 ký tự
                </div>
              </div>

              {/* Thông báo bảo mật */}
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 border border-blue-100 text-blue-900 text-xs">
                <Info className="size-5 flex-shrink-0" />
                Thông tin của bạn sẽ được bảo mật theo chính sách bảo vệ dữ liệu cá nhân.
              </div>

              {/* Nút submit */}
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`w-full rounded-lg py-3.5 font-bold text-white transition-all ${isFormValid()
                  ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-300 cursor-not-allowed"
                  }`}
              >
                Tiếp tục thanh toán
              </button>
            </div>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}