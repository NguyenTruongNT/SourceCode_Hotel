"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Booking, RoomType } from "@/app/admin/types"

type SearchParams = {
  checkIn: string
  checkOut: string
  guests: string
  roomType: string
}

type CustomerInfo = {
  name: string
  email: string
  phone: string
  idNumber: string // CCCD (12 số) hoặc Hộ chiếu (1 hoa + 7 số)
  note: string
}

type BookingContextType = {
  // Search
  search: SearchParams
  setSearch: (params: SearchParams) => void

  // Room selection
  selectedRoomId: string | null
  setSelectedRoomId: (id: string | null) => void

  // Customer info
  customer: CustomerInfo
  setCustomer: (info: CustomerInfo) => void

  // Payment & Terms
  payment: string | null
  setPayment: (method: string | null) => void
  termsAgreed: boolean
  setTermsAgreed: (agreed: boolean) => void

  // Discount
  discount: number
  setDiscount: (value: number) => void
  discountCode: string
  setDiscountCode: (code: string) => void

  // Financial amounts
  totalAmount: number
  setTotalAmount: (amount: number) => void
  depositAmount: number
  setDepositAmount: (amount: number) => void

  // Booking result PNR
  bookingCode: string | null
  setBookingCode: (code: string | null) => void

  // Sync to PMS helper
  saveBookingToPMS: (pnr: string, roomType: RoomType, nightsCount: number) => Booking
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<SearchParams>({
    checkIn: "",
    checkOut: "",
    guests: "2",
    roomType: "all",
  })

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    note: "",
  })

  const [payment, setPayment] = useState<string | null>("VNPAY")
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false)
  const [discount, setDiscount] = useState<number>(0)
  const [discountCode, setDiscountCode] = useState<string>("")
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [depositAmount, setDepositAmount] = useState<number>(0)
  const [bookingCode, setBookingCode] = useState<string | null>(null)

  const saveBookingToPMS = (pnr: string, roomType: RoomType, nightsCount: number): Booking => {
    const finalTotal = totalAmount || 1600000
    const finalDeposit = depositAmount || Math.round(finalTotal * 0.5)
    const finalRemaining = finalTotal - finalDeposit

    const newBooking: Booking = {
      id: pnr,
      guestName: customer.name,
      phone: customer.phone,
      email: customer.email,
      cccd: customer.idNumber,
      checkInDate: search.checkIn,
      checkOutDate: search.checkOut,
      roomType,
      guestCount: Number(search.guests) || 2,
      status: 'Confirmed',
      totalAmount: finalTotal,
      depositAmount: finalDeposit,
      remainingAmount: finalRemaining,
      voucherCode: discountCode || undefined,
      voucherDiscount: discount || undefined,
      paymentMethod: payment || 'VNPAY',
      paidDeposit: true
    }

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('hotel_bookings_v3')
        const currentBookings: Booking[] = stored ? JSON.parse(stored) : []
        localStorage.setItem('hotel_bookings_v3', JSON.stringify([newBooking, ...currentBookings]))
      } catch (err) {
        console.error('Failed to save booking to localStorage:', err)
      }
    }

    return newBooking
  }

  return (
    <BookingContext.Provider
      value={{
        search,
        setSearch,
        selectedRoomId,
        setSelectedRoomId,
        customer,
        setCustomer,
        payment,
        setPayment,
        termsAgreed,
        setTermsAgreed,
        discount,
        setDiscount,
        discountCode,
        setDiscountCode,
        totalAmount,
        setTotalAmount,
        depositAmount,
        setDepositAmount,
        bookingCode,
        setBookingCode,
        saveBookingToPMS,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}
