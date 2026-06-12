export type Room = {
  id: string
  name: string
  description: string
  image: string
  size: string
  beds: string
  price: number
  amenities: string[]
  badge?: { label: string; tone: "popular" | "discount" | "limited" | "available" }
}

export const rooms: Room[] = [
  {
    id: "deluxe",
    name: "Phòng Deluxe Giường Đôi",
    description: "Phòng Deluxe rộng rãi với nội thất sang trọng, phù hợp cho cặp đôi.",
    image: "/images/room-deluxe.png",
    size: "28m²",
    beds: "1 giường",
    price: 1200000,
    amenities: ["WIFI MIỄN PHÍ", "ĐIỀU HÒA", "TV MÀN HÌNH PHẲNG"],
    badge: { label: "Tiết kiệm 15%", tone: "discount" },
  },
  {
    id: "superior",
    name: "Phòng Superior Giường Đôi",
    description: "Phòng Superior tiện nghi với thiết kế hiện đại, phù hợp cho khách du lịch.",
    image: "/images/room-superior.png",
    size: "25m²",
    beds: "1 giường",
    price: 950000,
    amenities: ["WIFI MIỄN PHÍ", "ĐIỀU HÒA", "TV MÀN HÌNH PHẲNG"],
    badge: { label: "Phổ biến nhất", tone: "popular" },
  },
  {
    id: "standard",
    name: "Phòng Standard 2 Giường Đơn",
    description: "Phòng Standard thoải mái với 2 giường đơn, lý tưởng cho bạn bè.",
    image: "/images/room-standard.png",
    size: "22m²",
    beds: "2 giường",
    price: 750000,
    amenities: ["WIFI MIỄN PHÍ", "ĐIỀU HÒA", "TV"],
    badge: { label: "Chỉ còn 2 phòng", tone: "limited" },
  },
  {
    id: "suite",
    name: "Phòng Suite Executive",
    description: "Phòng Suite cao cấp với phòng khách riêng và tầm nhìn đẹp.",
    image: "/images/room-suite.png",
    size: "45m²",
    beds: "1 giường",
    price: 1600000,
    amenities: ["WIFI MIỄN PHÍ", "PHÒNG KHÁCH RIÊNG", "2 TV"],
    badge: { label: "Sẵn có", tone: "available" },
  },
  {
    id: "family",
    name: "Phòng Family 3 Giường",
    description: "Phòng Family rộng rãi với 3 giường, hoàn hảo cho gia đình.",
    image: "/images/room-family.png",
    size: "35m²",
    beds: "3 giường",
    price: 1500000,
    amenities: ["WIFI MIỄN PHÍ", "ĐIỀU HÒA", "2 TV"],
  },
  {
    id: "ocean",
    name: "Phòng Deluxe Hướng Biển",
    description: "Phòng Deluxe với tầm nhìn hướng biển tuyệt đẹp và ban công lớn.",
    image: "/images/room-ocean.png",
    size: "30m²",
    beds: "1 giường",
    price: 2500000,
    amenities: ["WIFI MIỄN PHÍ", "TẦM NHÌN BIỂN", "BAN CÔNG LỚN", "BỒN TẮM JACUZZI"],
  },
]

export function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "₫"
}

export function getRoom(id: string) {
  return rooms.find((r) => r.id === id)
}
