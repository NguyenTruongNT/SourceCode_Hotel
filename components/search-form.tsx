"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Users, BedDouble, Search, Minus, Plus } from "lucide-react"
import { useBooking } from "@/components/booking-context"

export function SearchForm() {
  const router = useRouter()
  const { search, setSearch } = useBooking()
  const [checkIn, setCheckIn] = useState(search.checkIn)
  const [checkOut, setCheckOut] = useState(search.checkOut)
  const [guests, setGuests] = useState(Number(search.guests) || 1)
  const [roomType, setRoomType] = useState(search.roomType)
  const [error, setError] = useState("")
  const [today, setToday] = useState("")

  useEffect(() => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];
    setToday(localISOTime);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!checkIn || !checkOut) {
      setError("Vui lòng chọn ngày nhận và trả phòng.")
      return
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Ngày trả phòng phải sau ngày nhận ít nhất 1 ngày.")
      return
    }
    setError("")
    setSearch({ checkIn, checkOut, guests: guests.toString(), roomType })
    router.push("/search")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl bg-card p-5 text-left shadow-2xl shadow-black/10 sm:p-6"
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Thông tin tìm kiếm
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Calendar className="size-3.5" /> NGÀY NHẬN PHÒNG
          </label>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Calendar className="size-3.5" /> NGÀY TRẢ PHÒNG
          </label>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Users className="size-3.5" /> SỐ LƯỢNG KHÁCH
          </label>
          <div className="flex h-[42px] w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1">
            <button
              type="button"
              onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
              className="flex size-7 items-center justify-center rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <Minus className="size-4" />
            </button>
            <input
              type="text"
              readOnly
              value={`${guests} khách`}
              className="w-full bg-transparent text-center text-sm font-medium text-foreground outline-none pointer-events-none select-none"
            />
            <button
              type="button"
              onClick={() => setGuests((prev) => Math.min(10, prev + 1))}
              className="flex size-7 items-center justify-center rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <BedDouble className="size-3.5" /> LOẠI PHÒNG
          </label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          >
            <option value="all">Tất cả</option>
            <option value="superior">Phòng Superior</option>
            <option value="deluxe">Phòng Deluxe</option>
            <option value="suite">Phòng Suite</option>
            <option value="family">Phòng Family</option>
          </select>
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Search className="size-4" /> Tìm phòng khả dụng
      </button>
    </form>
  )
}
