"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Users, BedDouble, Search, Minus, Plus, AlertCircle, X, ChevronRight } from "lucide-react"
import { useBooking } from "@/components/booking-context"

// Component gợi ý ngày thay thế - Luồng rẽ nhánh 3
function SuggestionModal({
  isOpen,
  onClose,
  onSelectDate,
  currentCheckIn,
  currentCheckOut
}: {
  isOpen: boolean
  onClose: () => void
  onSelectDate: (checkIn: string, checkOut: string) => void
  currentCheckIn: string
  currentCheckOut: string
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr)
    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
    return days[date.getDay()]
  }

  const getSuggestedDates = () => {
    const suggestions = []
    const currentStart = new Date(currentCheckIn)
    const currentEnd = new Date(currentCheckOut)
    const nights = Math.max(1, Math.ceil((currentEnd.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24)))

    const prevWeekStart = new Date(currentStart)
    prevWeekStart.setDate(prevWeekStart.getDate() - 7)
    const prevWeekEnd = new Date(prevWeekStart)
    prevWeekEnd.setDate(prevWeekEnd.getDate() + nights)

    const nextWeekStart = new Date(currentStart)
    nextWeekStart.setDate(nextWeekStart.getDate() + 7)
    const nextWeekEnd = new Date(nextWeekStart)
    nextWeekEnd.setDate(nextWeekEnd.getDate() + nights)

    const prev3Start = new Date(currentStart)
    prev3Start.setDate(prev3Start.getDate() - 3)
    const prev3End = new Date(prev3Start)
    prev3End.setDate(prev3End.getDate() + nights)

    const next3Start = new Date(currentStart)
    next3Start.setDate(next3Start.getDate() + 3)
    const next3End = new Date(next3Start)
    next3End.setDate(next3End.getDate() + nights)

    suggestions.push(
      {
        id: 1,
        icon: "📅",
        label: "Tuần trước",
        checkIn: prevWeekStart.toISOString().split("T")[0],
        checkOut: prevWeekEnd.toISOString().split("T")[0],
        dateRange: `${formatDate(prevWeekStart.toISOString().split("T")[0])} - ${formatDate(prevWeekEnd.toISOString().split("T")[0])}`,
        days: `${getDayName(prevWeekStart.toISOString().split("T")[0])} - ${getDayName(prevWeekEnd.toISOString().split("T")[0])}`,
        nights: nights
      },
      {
        id: 2,
        icon: "📅",
        label: "Tuần tới",
        checkIn: nextWeekStart.toISOString().split("T")[0],
        checkOut: nextWeekEnd.toISOString().split("T")[0],
        dateRange: `${formatDate(nextWeekStart.toISOString().split("T")[0])} - ${formatDate(nextWeekEnd.toISOString().split("T")[0])}`,
        days: `${getDayName(nextWeekStart.toISOString().split("T")[0])} - ${getDayName(nextWeekEnd.toISOString().split("T")[0])}`,
        nights: nights
      },
      {
        id: 3,
        icon: "⏪",
        label: "Sớm hơn",
        checkIn: prev3Start.toISOString().split("T")[0],
        checkOut: prev3End.toISOString().split("T")[0],
        dateRange: `${formatDate(prev3Start.toISOString().split("T")[0])} - ${formatDate(prev3End.toISOString().split("T")[0])}`,
        days: `${getDayName(prev3Start.toISOString().split("T")[0])} - ${getDayName(prev3End.toISOString().split("T")[0])}`,
        nights: nights
      },
      {
        id: 4,
        icon: "⏩",
        label: "Muộn hơn",
        checkIn: next3Start.toISOString().split("T")[0],
        checkOut: next3End.toISOString().split("T")[0],
        dateRange: `${formatDate(next3Start.toISOString().split("T")[0])} - ${formatDate(next3End.toISOString().split("T")[0])}`,
        days: `${getDayName(next3Start.toISOString().split("T")[0])} - ${getDayName(next3End.toISOString().split("T")[0])}`,
        nights: nights
      }
    )
    return suggestions
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">😔</span>
                <h3 className="text-lg font-bold text-white">Không có phòng trống</h3>
              </div>
              <button onClick={onClose} className="rounded-full p-1 text-white/80 hover:text-white hover:bg-white/20">
                <X className="size-5" />
              </button>
            </div>
          </div>
          <div className="p-5">
            <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
              <p className="font-medium">📅 Khoảng thời gian bạn chọn:</p>
              <p className="mt-1">
                {formatDate(currentCheckIn)} ({getDayName(currentCheckIn)}) → {formatDate(currentCheckOut)} ({getDayName(currentCheckOut)})
              </p>
            </div>
            <p className="mb-4 text-sm text-slate-600">
              Rất tiếc, không còn phòng trống cho khoảng thời gian này.
              Dưới đây là một số gợi ý ngày thay thế:
            </p>
            <div className="space-y-3 max-h-[320px] overflow-y-auto">
              {getSuggestedDates().map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => {
                    onSelectDate(suggestion.checkIn, suggestion.checkOut)
                    onClose()
                  }}
                  className="group w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{suggestion.icon}</span>
                      <div>
                        <div className="font-semibold text-slate-800 group-hover:text-blue-700">
                          {suggestion.label}
                        </div>
                        <div className="text-sm text-slate-500">
                          {suggestion.dateRange}
                        </div>
                        <div className="text-xs text-slate-400">
                          {suggestion.days} • {suggestion.nights} đêm
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="size-5 text-slate-400 group-hover:text-blue-500" />
                  </div>
                </button>
              ))}
            </div>
            <button onClick={onClose} className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export function SearchForm() {
  const router = useRouter()
  const { search, setSearch } = useBooking()
  const [checkIn, setCheckIn] = useState(search.checkIn)
  const [checkOut, setCheckOut] = useState(search.checkOut)
  const [guests, setGuests] = useState(Number(search.guests) || 2)
  const [roomType, setRoomType] = useState(search.roomType)

  const [checkInError, setCheckInError] = useState("")
  const [checkOutError, setCheckOutError] = useState("")
  const [touched, setTouched] = useState({ checkIn: false, checkOut: false })
  const [showSuggestionModal, setShowSuggestionModal] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [today, setToday] = useState("")

  useEffect(() => {
    const tzoffset = new Date().getTimezoneOffset() * 60000
    const localISOTime = new Date(Date.now() - tzoffset).toISOString().split("T")[0]
    setToday(localISOTime)
  }, [])

  const validateCheckIn = (value: string): string => {
    if (!value) return "Vui lòng chọn ngày nhận phòng"
    if (value < today) return `Ngày nhận phòng phải từ ${new Date(today).toLocaleDateString("vi-VN")} trở đi`
    return ""
  }

  const validateCheckOut = (value: string, checkInValue: string): string => {
    if (!value) return "Vui lòng chọn ngày trả phòng"
    if (checkInValue && value <= checkInValue) return "Ngày trả phòng phải sau ngày nhận ít nhất 1 ngày"
    return ""
  }

  const handleCheckInChange = (value: string) => {
    setCheckIn(value)
    setCheckInError("")
    if (touched.checkOut && checkOut) {
      const error = validateCheckOut(checkOut, value)
      setCheckOutError(error)
    }
  }

  const handleCheckOutChange = (value: string) => {
    setCheckOut(value)
    setCheckOutError("")
    if (touched.checkOut) {
      const error = validateCheckOut(value, checkIn)
      setCheckOutError(error)
    }
  }

  const handleBlur = (field: "checkIn" | "checkOut") => {
    if (!touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }))
    }
    if (field === "checkIn") {
      setCheckInError(validateCheckIn(checkIn))
    }
    if (field === "checkOut") {
      setCheckOutError(validateCheckOut(checkOut, checkIn))
    }
  }

  const checkRoomAvailability = async (checkInDate: string, checkOutDate: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isAvailable = Math.random() > 0.5
        resolve(isAvailable)
      }, 800)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ checkIn: true, checkOut: true })
    const checkInErr = validateCheckIn(checkIn)
    const checkOutErr = validateCheckOut(checkOut, checkIn)
    setCheckInError(checkInErr)
    setCheckOutError(checkOutErr)
    if (checkInErr || checkOutErr) return

    setIsSearching(true)
    const isAvailable = await checkRoomAvailability(checkIn, checkOut)
    setIsSearching(false)

    if (!isAvailable) {
      setShowSuggestionModal(true)
      return
    }

    setSearch({ checkIn, checkOut, guests: guests.toString(), roomType })
    router.push("/search")
  }

  const handleSelectSuggestion = (newCheckIn: string, newCheckOut: string) => {
    setCheckIn(newCheckIn)
    setCheckOut(newCheckOut)
    setTouched({ checkIn: true, checkOut: true })
    setSearch({
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      guests: guests.toString(),
      roomType
    })
    router.push("/search")
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="w-full rounded-xl bg-white p-5 text-left shadow-xl sm:p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          THÔNG TIN TÌM KIẾM
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Ngày nhận phòng */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Calendar className="size-3.5" /> NGÀY NHẬN PHÒNG
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => handleCheckInChange(e.target.value)}
              onBlur={() => handleBlur("checkIn")}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 ${checkInError && touched.checkIn
                  ? "border-red-500 bg-red-50 focus:ring-red-100"
                  : "border-slate-200 bg-slate-50 focus:ring-blue-100 focus:border-blue-300"
                }`}
            />
            {checkInError && touched.checkIn && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle className="size-3.5" />
                <span>{checkInError}</span>
              </div>
            )}
          </div>

          {/* Ngày trả phòng */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Calendar className="size-3.5" /> NGÀY TRẢ PHÒNG
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => handleCheckOutChange(e.target.value)}
              onBlur={() => handleBlur("checkOut")}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 ${checkOutError && touched.checkOut
                  ? "border-red-500 bg-red-50 focus:ring-red-100"
                  : "border-slate-200 bg-slate-50 focus:ring-blue-100 focus:border-blue-300"
                }`}
            />
            {checkOutError && touched.checkOut && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle className="size-3.5" />
                <span>{checkOutError}</span>
              </div>
            )}
          </div>

          {/* Số lượng khách */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Users className="size-3.5" /> SỐ LƯỢNG KHÁCH
            </label>
            <div className="flex h-[42px] w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-1">
              <button
                type="button"
                onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                disabled={guests === 1}
                className={`flex size-7 items-center justify-center rounded transition-colors ${guests === 1
                    ? "text-slate-300 cursor-not-allowed"
                    : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
                  }`}
              >
                <Minus className="size-4" />
              </button>
              <input
                type="text"
                readOnly
                value={`${guests} khách`}
                className="w-full bg-transparent text-center text-sm font-medium text-slate-700 outline-none pointer-events-none select-none"
              />
              <button
                type="button"
                onClick={() => setGuests((prev) => Math.min(10, prev + 1))}
                disabled={guests === 10}
                className={`flex size-7 items-center justify-center rounded transition-colors ${guests === 10
                    ? "text-slate-300 cursor-not-allowed"
                    : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
                  }`}
              >
                <Plus className="size-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">Tối đa 10 khách</p>
          </div>

          {/* Loại phòng */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <BedDouble className="size-3.5" /> LOẠI PHÒNG
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">Tất cả</option>
              <option value="superior">Phòng Superior</option>
              <option value="deluxe">Phòng Deluxe</option>
              <option value="suite">Phòng Suite</option>
              <option value="family">Phòng Family</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <>
              <span className="animate-spin">⏳</span> Đang kiểm tra phòng trống...
            </>
          ) : (
            <>
              <Search className="size-4" /> Tìm phòng khả dụng
            </>
          )}
        </button>
      </form>

      <SuggestionModal
        isOpen={showSuggestionModal}
        onClose={() => setShowSuggestionModal(false)}
        onSelectDate={handleSelectSuggestion}
        currentCheckIn={checkIn}
        currentCheckOut={checkOut}
      />
    </>
  )
}