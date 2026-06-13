"use client"

import { createContext, useContext, useState, ReactNode } from "react"

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

  // Payment
  payment: string | null
  setPayment: (method: string | null) => void

  // Discount
  discount: number
  setDiscount: (value: number) => void
  discountCode: string
  setDiscountCode: (code: string) => void

  // Booking result
  bookingCode: string | null
  setBookingCode: (code: string | null) => void
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
    note: "",
  })

  const [payment, setPayment] = useState<string | null>(null)
  const [discount, setDiscount] = useState<number>(0)
  const [discountCode, setDiscountCode] = useState<string>("")
  const [bookingCode, setBookingCode] = useState<string | null>(null)

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
        discount,
        setDiscount,
        discountCode,
        setDiscountCode,
        bookingCode,
        setBookingCode,
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