export type Room = {
  id: string
  name: string
  type: "Standard" | "Superior" | "Deluxe" | "Suite"
  description: string
  image: string
  size: string
  beds: string
  price: number
  capacity: number
  amenities: string[]
  badge?: { label: string; tone: "popular" | "discount" | "limited" | "available" }
}

export const rooms: Room[] = [
  {
    id: "standard",
    name: "Phòng Standard (STD)",
    type: "Standard",
    description: "Phòng Standard tiêu chuẩn ấm cúng với 2 giường đơn, trang thiết bị hiện đại, lý tưởng cho kỳ nghỉ tiết kiệm.",
    image: "/images/room-standard.png",
    size: "22m²",
    beds: "2 giường đơn",
    price: 800000,
    capacity: 2,
    amenities: ["WIFI MIỄN PHÍ", "ĐIỀU HÒA", "TV TRUYỀN HÌNH CÁP", "MINIBAR"],
    badge: { label: "Tiêu chuẩn", tone: "available" },
  },
  {
    id: "superior",
    name: "Phòng Superior (SUP)",
    type: "Superior",
    description: "Phòng Superior tiện nghi cao cấp với thiết kế thanh lịch, ban công thoáng mát hướng phố.",
    image: "/images/room-superior.png",
    size: "26m²",
    beds: "1 giường đôi King",
    price: 1200000,
    capacity: 2,
    amenities: ["WIFI MIỄN PHÍ", "ĐIỀU HÒA", "TV MÀN HÌNH PHẲNG", "BÀN LÀM VIỆC", "MINIBAR"],
    badge: { label: "Phổ biến nhất", tone: "popular" },
  },
  {
    id: "deluxe",
    name: "Phòng Deluxe (DLX)",
    type: "Deluxe",
    description: "Phòng Deluxe rộng rãi sang trọng với không gian ấm cúng, phù hợp cho gia đình nhỏ hoặc du khách tìm kiếm sự thoải mái.",
    image: "/images/room-deluxe.png",
    size: "32m²",
    beds: "1 giường King + 1 Sofa bed",
    price: 1800000,
    capacity: 3,
    amenities: ["WIFI MIỄN PHÍ", "ĐIỀU HÒA", "TV 4K", "BỒN TẮM RIÊNG", "MINIBAR CAO CẤP"],
    badge: { label: "Ưu đãi 15%", tone: "discount" },
  },
  {
    id: "suite",
    name: "Phòng Suite Luxury (SUT)",
    type: "Suite",
    description: "Phòng Suite đẳng cấp Hoàng Gia với phòng khách riêng biệt, bồn tắm sục Jacuzzi và tầm nhìn toàn cảnh tuyệt đẹp.",
    image: "/images/room-suite.png",
    size: "55m²",
    beds: "1 giường Super King",
    price: 3500000,
    capacity: 4,
    amenities: ["WIFI TỐC ĐỘ CAO", "PHÒNG KHÁCH RIÊNG", "JACUZZI", "2 SMART TV 65''", "MINIBAR MIỄN PHÍ"],
    badge: { label: "Hạng sang", tone: "limited" },
  },
]

export function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "₫"
}

export function getRoom(id: string) {
  return rooms.find((r) => r.id === id || r.type.toLowerCase() === id.toLowerCase())
}
