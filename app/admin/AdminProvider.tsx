'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Room, Booking, HotelEvent, Voucher } from '@/app/admin/types';
import { INITIAL_ROOMS, INITIAL_BOOKINGS, INITIAL_EVENTS, INITIAL_VOUCHERS } from '@/app/admin/data';

interface AdminContextType {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  events: HotelEvent[];
  setEvents: React.Dispatch<React.SetStateAction<HotelEvent[]>>;
  vouchers: Voucher[];
  setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  addRoom: (room: Room) => void;
  addVoucher: (voucher: Voucher) => void;
  updateVoucher: (id: string, updates: Partial<Voucher>) => void;
  resetToInitialData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<HotelEvent[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRooms = localStorage.getItem('hotel_rooms_v3');
      const savedBookings = localStorage.getItem('hotel_bookings_v3');
      const savedEvents = localStorage.getItem('hotel_events_v3');
      const savedVouchers = localStorage.getItem('hotel_vouchers_v3');

      if (savedRooms && savedBookings && savedEvents) {
        try {
          setRooms(JSON.parse(savedRooms));
          setBookings(JSON.parse(savedBookings));
          setEvents(JSON.parse(savedEvents));
          setVouchers(savedVouchers ? JSON.parse(savedVouchers) : INITIAL_VOUCHERS);
        } catch {
          setRooms(INITIAL_ROOMS);
          setBookings(INITIAL_BOOKINGS);
          setEvents(INITIAL_EVENTS);
          setVouchers(INITIAL_VOUCHERS);
        }
      } else {
        setRooms(INITIAL_ROOMS);
        setBookings(INITIAL_BOOKINGS);
        setEvents(INITIAL_EVENTS);
        setVouchers(INITIAL_VOUCHERS);
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('hotel_rooms_v3', JSON.stringify(rooms));
      localStorage.setItem('hotel_bookings_v3', JSON.stringify(bookings));
      localStorage.setItem('hotel_events_v3', JSON.stringify(events));
      localStorage.setItem('hotel_vouchers_v3', JSON.stringify(vouchers));
    }
  }, [rooms, bookings, events, vouchers, isLoaded]);

  const addBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const addRoom = (newRoom: Room) => {
    setRooms((prev) => [...prev, newRoom]);
  };

  const addVoucher = (newVoucher: Voucher) => {
    setVouchers((prev) => [newVoucher, ...prev]);
  };

  const updateVoucher = (id: string, updates: Partial<Voucher>) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const resetToInitialData = () => {
    setRooms(INITIAL_ROOMS);
    setBookings(INITIAL_BOOKINGS);
    setEvents(INITIAL_EVENTS);
    setVouchers(INITIAL_VOUCHERS);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminContext.Provider
      value={{
        rooms,
        setRooms,
        bookings,
        setBookings,
        events,
        setEvents,
        vouchers,
        setVouchers,
        addBooking,
        updateBooking,
        updateRoom,
        addRoom,
        addVoucher,
        updateVoucher,
        resetToInitialData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
