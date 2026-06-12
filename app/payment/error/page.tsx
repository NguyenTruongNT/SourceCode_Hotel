"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { XCircle, AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useBooking } from "@/components/booking-context"
import { getRoom } from "@/lib/rooms"

function ErrorContent() {
  const router = useRouter()
  const params = useSearchParams()
  const taken = params.get("reason") === "taken"
  const { selectedRoomId } = useBooking()
  const room = selectedRoomId ? getRoom(selectedRoomId) : undefined

  useEffect(() => {
    if (!selectedRoomId) router.replace("/search")
  }, [selectedRoomId, router])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 items-center px-4 py-12 sm:px-6">
        <div className="w-full rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
          <div
            className={`mx-auto flex size-16 items-center justify-center rounded-full ${
              taken ? "bg-amber-100" : "bg-red-100"
            }`}
          >
            {taken ? (
              <AlertTriangle className="size-9 text-amber-600" />
            ) : (
              <XCircle className="size-9 text-destructive" />
            )}
          </div>

          {taken ? (
            <>
              <h1 className="mt-4 text-xl font-bold text-foreground">Phòng đã bị đặt mất</h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Rất tiếc, phòng {room?.name ?? "bạn chọn"} đã được khách hàng khác thanh toán thành công trong lúc bạn
                thực hiện giao dịch.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-4 text-xl font-bold text-foreground">Giao dịch chưa thành công</h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng kiểm tra lại thông tin hoặc thử với phương thức
                thanh toán khác.
              </p>
            </>
          )}

          <div className="mt-6 flex flex-col gap-3">
            {taken ? (
              <button
                onClick={() => router.push("/search")}
                className="flex items-center justify-center gap-1.5 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <ArrowLeft className="size-4" /> QUAY LẠI CHỌN PHÒNG
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push("/payment")}
                  className="flex items-center justify-center gap-1.5 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <RotateCcw className="size-4" /> THỬ LẠI NGAY
                </button>
                <button
                  onClick={() => router.push("/payment")}
                  className="rounded-md border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  CHỌN PHƯƠNG THỨC KHÁC
                </button>
              </>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={null}>
      <ErrorContent />
    </Suspense>
  )
}
