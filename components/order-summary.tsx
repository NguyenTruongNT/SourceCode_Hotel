"use client"

import { useState } from "react"
import { useBooking } from "@/components/booking-context"
import { type Room, formatVND } from "@/lib/rooms"

const VALID_CODES: Record<string, number> = {
  SUMMER2026: 200000,
  THAD10: 100000,
}

function nights(checkIn: string, checkOut: string) {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.max(1, Math.round(ms / 86400000))
}

function longDate(d: string) {
  const date = new Date(d)
  const days = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
  return `${date.toLocaleDateString("vi-VN")} - ${days[date.getDay()]}`
}

export function OrderSummary({ room, showDiscount = true }: { room: Room; showDiscount?: boolean }) {
  const { search, discount, discountCode, setDiscount } = useBooking()
  const [code, setCode] = useState(discountCode)
  const [open, setOpen] = useState(true)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(
    discountCode ? { ok: true, text: "Mã giảm giá đã được áp dụng" } : null,
  )

  const n = nights(search.checkIn, search.checkOut)
  const subtotal = room.price * n
  const total = Math.max(0, subtotal - discount)

  function applyCode() {
    const value = VALID_CODES[code.trim().toUpperCase()]
    if (value) {
      setDiscount(value, code.trim().toUpperCase())
      setMsg({ ok: true, text: "Mã giảm giá đã được áp dụng" })
    } else {
      setDiscount(0, "")
      setMsg({ ok: false, text: "Mã giảm giá không hợp lệ hoặc đã hết hạn" })
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-base font-semibold text-foreground">Chi tiết đơn hàng</h2>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="font-medium text-foreground">{room.name}</p>
          <p className="mt-1 text-muted-foreground">
            {longDate(search.checkIn)}
          </p>
        </div>

        <dl className="space-y-2 border-t border-border pt-3">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Loại phòng</dt>
            <dd className="text-right font-medium text-foreground">{room.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Nhận phòng</dt>
            <dd className="font-medium text-foreground">{longDate(search.checkIn)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Trả phòng</dt>
            <dd className="font-medium text-foreground">{longDate(search.checkOut)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Số đêm</dt>
            <dd className="font-medium text-foreground">{n} đêm</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Số khách</dt>
            <dd className="font-medium text-foreground">{search.guests} người</dd>
          </div>
        </dl>

        {showDiscount && (
          <div className="border-t border-border pt-3">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex w-full items-center justify-between text-sm font-medium text-foreground"
            >
              <span>Mã giảm giá</span>
              <span className="text-xs text-primary">{open ? "ẨN" : "HIỆN"}</span>
            </button>
            {open && (
              <div className="mt-2">
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                  <button
                    onClick={applyCode}
                    className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Áp dụng
                  </button>
                </div>
                {msg && (
                  <p className={`mt-2 text-xs ${msg.ok ? "text-emerald-600" : "text-destructive"}`}>{msg.text}</p>
                )}
              </div>
            )}
          </div>
        )}

        <dl className="space-y-2 border-t border-border pt-3">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              {formatVND(room.price)} × {n} đêm
            </dt>
            <dd className="font-medium text-foreground">{formatVND(subtotal)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-emerald-600">Giảm giá ({discountCode})</dt>
              <dd className="font-medium text-emerald-600">-{formatVND(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-2">
            <dt className="text-base font-semibold text-foreground">Tổng thanh toán</dt>
            <dd className="text-base font-bold text-primary">{formatVND(total)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export { nights, longDate }
