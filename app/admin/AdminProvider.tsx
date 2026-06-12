'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Room, Booking, HotelEvent } from '@/app/admin/types';
import { INITIAL_ROOMS, INITIAL_BOOKINGS, INITIAL_EVENTS } from '@/app/admin/data';

interface AdminContextType {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  events: HotelEvent[];
  setEvents: React.Dispatch<React.SetStateAction<HotelEvent[]>>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<HotelEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRooms = localStorage.getItem('hotel_rooms_v2');
      const savedBookings = localStorage.getItem('hotel_bookings_v2');
      const savedEvents = localStorage.getItem('hotel_events_v2');

      if (savedRooms && savedBookings && savedEvents) {
        setRooms(JSON.parse(savedRooms));
        setBookings(JSON.parse(savedBookings));
        setEvents(JSON.parse(savedEvents));
      } else {
        setRooms(INITIAL_ROOMS);
        setBookings(INITIAL_BOOKINGS);
        setEvents(INITIAL_EVENTS);
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('hotel_rooms_v2', JSON.stringify(rooms));
      localStorage.setItem('hotel_bookings_v2', JSON.stringify(bookings));
      localStorage.setItem('hotel_events_v2', JSON.stringify(events));
    }
  }, [rooms, bookings, events, isLoaded]);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>; // Simple loading state to prevent hydration mismatch
  }

  return (
    <AdminContext.Provider value={{ rooms, setRooms, bookings, setBookings, events, setEvents }}>
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
