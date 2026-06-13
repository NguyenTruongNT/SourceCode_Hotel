'use client';

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SearchForm } from "@/components/search-form"
import { ChevronLeft, ChevronRight } from "lucide-react"

const experiences = [
  {
    title: "Thư giãn tâm hồn tại Spa",
    desc: "Giảm 20% cho các dịch vụ massage và trị liệu toàn thân.",
    image: "/images/exp-spa.png",
    tag: "ƯU ĐÃI SPA",
  },
  {
    title: "Hồ bơi vô cực",
    desc: "Thư giãn trong làn nước trong xanh và ngắm hoàng hôn rực rỡ bên bờ biển.",
    image: "/images/exp-pool.png",
    tag: "SỨC KHỎE & THỂ THAO",
  },
  {
    title: "Ẩm thực tinh hoa",
    desc: "Khám phá hương vị tinh tế từ các đầu bếp hàng đầu thế giới ngay tại nhà hàng chúng tôi.",
    image: "/images/exp-dining.png",
    tag: "NHÀ HÀNG & BAR",
  },
]

const INITIAL_SLIDES = [
  {
    id: 'EV-001',
    title: "Sự kiện: Summer Wedding",
    desc: "Tổ chức tiệc cưới trong mơ bên bờ biển thơ mộng với gói dịch vụ trọn gói đẳng cấp.",
    image: "/images/hero-hotel.png",
    link: "/events/ev-001",
  },
  {
    id: 'EV-002',
    title: "Ưu đãi: Giảm ngay 20%",
    desc: "Áp dụng mã SUMMER20 để nhận ưu đãi giảm giá 20% cho tất cả các dịch vụ Spa và thư giãn.",
    image: "/images/exp-spa.png",
    link: "/events/ev-002",
  },
  {
    id: 'EV-003',
    title: "Tiệc nướng BBQ bãi biển",
    desc: "Thưởng thức hải sản tươi sống và không gian âm nhạc sống động vào mỗi tối thứ Bảy.",
    image: "/images/exp-dining.png",
    link: "/events/ev-003",
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>(INITIAL_SLIDES);

  useEffect(() => {
    // Sync with localStorage Admin
    if (typeof window !== 'undefined') {
      const savedEvents = localStorage.getItem('hotel_events_v2');
      if (savedEvents) {
        const parsed = JSON.parse(savedEvents);
        // Lấy danh sách sự kiện ACTIVE hoặc SCHEDULED làm carousel
        const activeEvents = parsed
          .filter((ev: any) => ev.status === 'ACTIVE' || ev.status === 'SCHEDULED')
          .map((ev: any) => ({
            id: ev.id,
            title: ev.title,
            desc: ev.shortDesc,
            image: ev.image || '/placeholder.svg',
            link: ev.link || `/events/${ev.id.toLowerCase()}`
          }));

        if (activeEvents.length > 0) {
          setSlides(activeEvents);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Carousel Banner Hero */}
        <section className="relative overflow-hidden">
          <div className="relative h-[600px] w-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)`, display: 'flex' }}>
            {slides.map((slide) => (
              <div key={slide.id} className="relative h-full w-full shrink-0">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-foreground/55" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <h1 className="text-balance text-3xl font-bold tracking-tight text-background sm:text-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {slide.title}
                  </h1>
                  <p className="mt-4 max-w-2xl text-pretty text-base text-background/80 sm:text-lg animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                    {slide.desc}
                  </p>
                  <div className="mt-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                    <Link href={slide.link} className="inline-block rounded-md bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all">
                      Xem chi tiết ưu đãi
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex size-12 items-center justify-center rounded-full bg-background/20 text-white backdrop-blur-sm hover:bg-background/40 transition-colors"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex size-12 items-center justify-center rounded-full bg-background/20 text-white backdrop-blur-sm hover:bg-background/40 transition-colors"
          >
            <ChevronRight className="size-6" />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${currentSlide === idx ? 'w-8 bg-primary' : 'w-2.5 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>

          <div className="relative mx-auto max-w-4xl px-4 -mt-20 z-10">
            <div className="rounded-2xl bg-white shadow-2xl p-2">
              <SearchForm />
            </div>
          </div>
        </section>

        {/* Experiences */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Khám Phá Trải Nghiệm
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
              Tận hưởng kỳ nghỉ dưỡng hoàn hảo tại THAD HOTEL với hệ thống phòng ốc hiện đại, sang trọng cùng tầm nhìn
              hướng biển tuyệt đẹp.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {experiences.map((exp) => (
              <article
                key={exp.title}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={exp.image || "/placeholder.svg"}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {exp.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground">{exp.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{exp.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="border-t border-border bg-secondary/50">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6 md:flex-row md:text-left">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">Nhận thông tin ưu đãi mới nhất</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Đăng ký để không bỏ lỡ các chương trình khuyến mãi đặc biệt và voucher giảm giá hàng tháng.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 rounded-md border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Đăng ký ngay
              </button>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
