"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Maximize, BedDouble, Calendar, Users, Search } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useBooking } from "@/components/booking-context"
import { rooms, formatVND, type Room } from "@/lib/rooms"

// Sử dụng các màu chủ đạo đồng bộ
const badgeTone: Record<string, string> = {
  popular: "bg-primary text-primary-foreground",
  discount: "bg-emerald-600 text-white",
  limited: "bg-amber-500 text-white",
  available: "bg-secondary text-secondary-foreground",
}

function formatDate(d: string) {
  const date = new Date(d)
  return date.toLocaleDateString("vi-VN")
}

export default function SearchPage() {
  const router = useRouter()
  const { search, setSelectedRoomId } = useBooking()
  const [sort, setSort] = useState("popular")

  const filtered = rooms.filter(room => {
    if (search.roomType === "all") return true;
    return room.id.toLowerCase() === search.roomType.toLowerCase() || room.name.toLowerCase().includes(search.roomType.toLowerCase());
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "low") return a.price - b.price
    if (sort === "high") return b.price - a.price
    return 0
  })

  function handleSelect(room: Room) {
    setSelectedRoomId(room.id)
    router.push("/booking")
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

        {/* Status Bar Đồng bộ màu Primary */}
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white border border-primary/20 text-primary">
              <Calendar className="size-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Thời gian lưu trú</p>
              <p className="text-sm font-semibold text-foreground">
                {formatDate(search.checkIn)} – {formatDate(search.checkOut)}
              </p>
            </div>
          </div>

          <div className="hidden h-8 w-px bg-primary/20 sm:block" />

          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white border border-primary/20 text-primary">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Số khách</p>
              <p className="text-sm font-semibold text-foreground">{search.guests} người lớn</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">{sorted.length} phòng khả dụng</p>
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
        </div>

        {/* Room grid */}
        {sorted.length > 0 ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((room) => (
              <article key={room.id} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50">
                <div className="relative h-44">
                  <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                  {room.badge && (
                    <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeTone[room.badge.tone]}`}>
                      {room.badge.label}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{room.name}</h3>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Maximize className="size-3.5" /> {room.size}
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="size-3.5" /> {room.beds}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{room.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {room.amenities.map((a) => (
                      <span key={a} className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                        {a}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-4">
                    <p className="text-lg font-bold text-primary">
                      {formatVND(room.price)}
                      <span className="text-xs font-normal text-muted-foreground">/đêm</span>
                    </p>
                    <button
                      onClick={() => handleSelect(room)}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                    >
                      Chọn phòng
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-slate-200">
              <Search className="size-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Rất tiếc, đã hết phòng trống!</h2>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}