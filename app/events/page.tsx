import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import Link from "next/link"

export default function EventsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative h-[400px] flex items-center justify-center">
          <Image
            src="/images/exp-dining.png"
            alt="Sự kiện tại khách sạn"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Sự kiện & Ưu đãi</h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto">
              Khám phá các chương trình khuyến mãi đặc biệt và những sự kiện đẳng cấp đang diễn ra tại THAD HOTEL.
            </p>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Event 1 */}
              <Link href="/events/ev-002" className="group rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all block">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="/images/exp-spa.png"
                    alt="Spa Khuyến mãi"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    HOT DEAL
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Gói Nghỉ Dưỡng Mùa Hè & Spa Trị Liệu</h3>
                  <p className="text-slate-600 mb-6">Tận hưởng không gian thư giãn tuyệt đối với gói nghỉ dưỡng bao gồm phòng Superior và 1 liệu trình massage toàn thân miễn phí dành cho 2 người.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-400">Áp dụng đến 30/08/2026</span>
                    <span className="text-blue-600 font-bold group-hover:text-blue-700 transition-colors">Xem chi tiết &rarr;</span>
                  </div>
                </div>
              </Link>

              {/* Event 2 */}
              <Link href="/events/ev-003" className="group rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all block">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="/images/exp-pool.png"
                    alt="Tiệc bể bơi"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    SỰ KIỆN
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Tiệc Hồ Bơi Chào Đón Mùa Hè Đầy Sôi Động</h3>
                  <p className="text-slate-600 mb-6">Hòa mình vào không khí sôi động với DJ quốc tế, đồ uống nhiệt đới không giới hạn và tiệc nướng BBQ hấp dẫn bên cạnh hồ bơi vô cực.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-400">Diễn ra vào Thứ 7 hàng tuần</span>
                    <span className="text-blue-600 font-bold group-hover:text-blue-700 transition-colors">Xem chi tiết &rarr;</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
