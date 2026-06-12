"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Search = {
  checkIn: string
  checkOut: string
  guests: string
  roomType: string
}

export type Customer = {
  name: string
  email: string
  phone: string
  note: string
}

type BookingState = {
  search: Search
  setSearch: (s: Search) => void
  selectedRoomId: string | null
  setSelectedRoomId: (id: string | null) => void
  customer: Customer
  setCustomer: (c: Customer) => void
  payment: string
  setPayment: (p: string) => void
  discount: number
  discountCode: string
  setDiscount: (amount: number, code: string) => void
  bookingCode: string
  setBookingCode: (c: string) => void
}

const defaultSearch: Search = {
  checkIn: "2026-06-06",
  checkOut: "2026-06-07",
  guests: "2",
  roomType: "all",
}

const defaultCustomer: Customer = { name: "", email: "", phone: "", note: "" }

const BookingContext = createContext<BookingState | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<Search>(defaultSearch)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [customer, setCustomer] = useState<Customer>(defaultCustomer)
  const [payment, setPayment] = useState("card")
  const [discount, setDiscountAmount] = useState(0)
  const [discountCode, setDiscountCode] = useState("")
  const [bookingCode, setBookingCode] = useState("")

  const setDiscount = (amount: number, code: string) => {
    setDiscountAmount(amount)
    setDiscountCode(code)
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
        discount,
        discountCode,
        setDiscount,
        bookingCode,
        setBookingCode,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used within BookingProvider")
  return ctx
}
