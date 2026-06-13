"use client"

import { useBooking } from "@/components/booking-context"
import { type Room, formatVND } from "@/lib/rooms"

function nights(checkIn: string, checkOut: string) {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.max(1, Math.round(ms / 86400000))
}

function longDate(d: string) {
  const date = new Date(d)
  const days = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
  return `${date.toLocaleDateString("vi-VN")} - ${days[date.getDay()]}`
}

export function OrderSummary({
  room,
  discount = 0,
  discountCode = "",
  nights: nightsProp
}: {
  room: Room
  discount?: number
  discountCode?: string
  nights: number
}) {
  const { search } = useBooking()

  const n = nightsProp
  const subtotal = room.price * n
  const total = Math.max(0, subtotal - discount)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Chi tiết đơn hàng</h2>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="font-medium text-slate-900">{room.name}</p>
          <p className="mt-1 text-slate-500">{longDate(search.checkIn)}</p>
        </div>

        <dl className="space-y-2 border-t border-slate-200 pt-3">
          <div className="flex justify-between">
            <dt className="text-slate-500">Loại phòng</dt>
            <dd className="text-right font-medium text-slate-900">{room.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Nhận phòng</dt>
            <dd className="font-medium text-slate-900">{longDate(search.checkIn)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Trả phòng</dt>
            <dd className="font-medium text-slate-900">{longDate(search.checkOut)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Số đêm</dt>
            <dd className="font-medium text-slate-900">{n} đêm</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Số khách</dt>
            <dd className="font-medium text-slate-900">{search.guests} người</dd>
          </div>
        </dl>

        <dl className="space-y-2 border-t border-slate-200 pt-3">
          <div className="flex justify-between">
            <dt className="text-slate-500">
              {formatVND(room.price)} × {n} đêm
            </dt>
            <dd className="font-medium text-slate-900">{formatVND(subtotal)}</dd>
          </div>
          {discount > 0 && discountCode && (
            <div className="flex justify-between">
              <dt className="text-green-600">Giảm giá ({discountCode})</dt>
              <dd className="font-medium text-green-600">-{formatVND(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-200 pt-2">
            <dt className="text-base font-semibold text-slate-900">Tổng thanh toán</dt>
            <dd className="text-base font-bold text-blue-600">{formatVND(total)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export { nights, longDate }