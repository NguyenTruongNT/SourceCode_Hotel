"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Maximize, BedDouble, Calendar, Users, Search, AlertCircle, RefreshCw } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useBooking } from "@/components/booking-context"
import { rooms, formatVND, type Room } from "@/lib/rooms"
import { SuggestionModal } from "@/components/search-form"
import { Room as AdminRoom, RoomStatus } from "@/app/admin/types"

const badgeTone: Record<string, string> = {
  popular: "bg-primary text-primary-foreground",
  discount: "bg-emerald-600 text-white",
  limited: "bg-amber-500 text-white",
  available: "bg-secondary text-secondary-foreground",
}

function formatDate(d: string) {
  if (!d) return ""
  const date = new Date(d)
  return date.toLocaleDateString("vi-VN")
}

export default function SearchPage() {
  const router = useRouter()
  const { search, setSearch, setSelectedRoomId } = useBooking()
  const [sort, setSort] = useState("popular")
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [activeAdminRooms, setActiveAdminRooms] = useState<AdminRoom[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("hotel_rooms_v3")
      if (stored) {
        try {
          setActiveAdminRooms(JSON.parse(stored))
        } catch {
          // fallback
        }
      }
    }
  }, [])

  const guestCount = Number(search.guests) || 1

  // Lọc theo quy tắc nghiệp vụ BR_F1_02 & BR_F1_03:
  // 1. Phù hợp hạng phòng đã chọn (hoặc tất cả)
  // 2. Sức chứa phòng >= số khách
  const filtered = rooms.filter((room) => {
    // Lọc theo Hạng phòng
    if (search.roomType && search.roomType !== "all") {
      const typeMatches =
        room.id.toLowerCase() === search.roomType.toLowerCase() ||
        room.type.toLowerCase() === search.roomType.toLowerCase()
      if (!typeMatches) return false
    }

    // Lọc theo Sức chứa
    if (room.capacity < guestCount) {
      return false
    }

    // Kiểm tra trạng thái phòng thực tế từ Admin PMS (nếu có dữ liệu phòng)
    if (activeAdminRooms.length > 0) {
      const sameTypeRooms = activeAdminRooms.filter(
        (ar) => ar.type.toLowerCase() === room.type.toLowerCase()
      )
      // Nếu tất cả phòng vật lý của hạng này đều bị OCCUPIED hoặc BOOKED
      const availablePhysical = sameTypeRooms.filter(
        (ar) => ar.status === RoomStatus.EMPTY
      )
      if (sameTypeRooms.length > 0 && availablePhysical.length === 0) {
        return false
      }
    }

    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "low") return a.price - b.price
    if (sort === "high") return b.price - a.price
    return 0
  })

  function handleSelect(room: Room) {
    setSelectedRoomId(room.id)
    router.push("/booking")
  }

  const handleSelectSuggestion = (newCheckIn: string, newCheckOut: string) => {
    setSearch({
      ...search,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
    })
    setShowSuggestion(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" /> Quay lại tìm kiếm
        </Link>

        {/* Thanh trạng thái tìm kiếm F1 */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-white border border-primary/20 text-primary">
                <Calendar className="size-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Thời gian lưu trú</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatDate(search.checkIn) || "Chưa chọn"} – {formatDate(search.checkOut) || "Chưa chọn"}
                </p>
              </div>
            </div>

            <div className="hidden h-8 w-px bg-primary/20 sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-white border border-primary/20 text-primary">
                <Users className="size-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Số khách & Hạng phòng</p>
                <p className="text-sm font-semibold text-foreground">
                  {search.guests || 1} khách • {search.roomType === "all" ? "Tất cả các hạng" : search.roomType.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1 rounded-lg border border-primary/30 bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
          >
            <RefreshCw className="size-3.5" /> Đổi ngày / bộ lọc
          </Link>
        </div>

        {/* Toolbar */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            {sorted.length > 0 ? (
              <span>Tìm thấy <strong>{sorted.length}</strong> hạng phòng khả dụng</span>
            ) : (
              <span className="text-red-500 font-semibold">0 phòng khả dụng</span>
            )}
          </p>
          {sorted.length > 0 && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              SẮP XẾP:
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
              >
                <option value="popular">Phổ biến nhất</option>
                <option value="low">Giá thấp đến cao</option>
                <option value="high">Giá cao đến thấp</option>
              </select>
            </label>
          )}
        </div>

        {/* Room grid */}
        {sorted.length > 0 ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {sorted.map((room) => (
              <article
                key={room.id}
                className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 shadow-sm hover:shadow-md"
              >
                <div className="relative h-48 sm:h-auto sm:w-2/5 min-w-[200px]">
                  <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                  {room.badge && (
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeTone[room.badge.tone]}`}
                    >
                      {room.badge.label}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {room.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">Sức chứa tối đa: {room.capacity} người</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Maximize className="size-3.5" /> {room.size}
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="size-3.5" /> {room.beds}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {room.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {room.amenities.map((a) => (
                      <span
                        key={a}
                        className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-4 border-t border-border/50">
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Giá tiêu chuẩn 1 đêm:</span>
                      <p className="text-xl font-bold text-primary">
                        {formatVND(room.price)}
                        <span className="text-xs font-normal text-muted-foreground">/đêm</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleSelect(room)}
                      className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 shadow-sm"
                    >
                      Đặt phòng này
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Luồng thay thế S2: Khách sạn hết phòng phù hợp */
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 p-12 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle className="size-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Rất tiếc, khách sạn đã kín phòng trong khoảng thời gian này!
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Quý khách vui lòng chọn khoảng ngày khác hoặc thử giảm số lượng khách để tìm phòng phù hợp.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setShowSuggestion(true)}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                Xem gợi ý ngày trống thay thế
              </button>
              <Link
                href="/"
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Về lại trang chủ
              </Link>
            </div>
          </div>
        )}
      </main>

      <SuggestionModal
        isOpen={showSuggestion}
        onClose={() => setShowSuggestion(false)}
        onSelectDate={handleSelectSuggestion}
        currentCheckIn={search.checkIn}
        currentCheckOut={search.checkOut}
      />

      <SiteFooter />
    </div>
  )
}
