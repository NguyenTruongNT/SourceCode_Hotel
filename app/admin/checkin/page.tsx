'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, User, Phone, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import MainHeader from '@/components/admin/MainHeader';
import Legend from '@/components/admin/Legend';
import RoomGrid from '@/components/admin/RoomGrid';
import CheckInModal from '@/components/admin/CheckInModal';
import SuccessToast from '@/components/admin/SuccessToast';
import { Room, Booking, RoomStatus, RoomType } from '@/app/admin/types';
import { useAdmin } from '@/app/admin/AdminProvider';

export default function App() {
  const { rooms, setRooms, bookings, setBookings } = useAdmin();

  // Tab navigation State
  const [currentTab, setCurrentTab] = useState('room-map');

  // Interactive search state
  const [searchText, setSearchText] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Active check-in state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // View room info state (replaces native alert)
  const [viewingRoomInfo, setViewingRoomInfo] = useState<{room: Room, booking?: Booking} | null>(null);

  // Confirm room cleaning state (replaces native confirm)
  const [cleaningRoomConfirm, setCleaningRoomConfirm] = useState<Room | null>(null);

  // Toast status text
  const [toastMessage, setToastMessage] = useState('');

  // Search autocomplete filter results
  const searchResults = useMemo(() => {
    if (!searchText.trim()) return [];
    const query = searchText.toLowerCase();
    return bookings.filter(
      (b) =>
        b.id.toLowerCase().includes(query) ||
        b.guestName.toLowerCase().includes(query) ||
        (b.phone && b.phone.includes(query))
    );
  }, [bookings, searchText]);

  // Open walk-in check-in modal on command
  const handleOpenWalkIn = () => {
    const walkInId = `THAD-WALKIN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newWalkIn: Booking = {
      id: walkInId,
      guestName: '',
      phone: '',
      email: '',
      checkInDate: '02/06/2026',
      checkOutDate: '09/06/2026',
      roomType: RoomType.STANDARD,
      guestCount: 1,
      cccd: '',
      isWalkIn: true,
    };
    setSelectedBooking(newWalkIn);
  };

  // Complete / execute room assignment and check-in confirmation
  const handleConfirmCheckIn = (
    bookingId: string,
    assignedRoom: string,
    cccd: string,
    updatedBookingDetails?: Partial<Booking>
  ) => {
    // 1. Find the booking or append it if walk-in
    let targetBooking = bookings.find((b) => b.id === bookingId);
    let name = '';

    if (!targetBooking && updatedBookingDetails?.isWalkIn) {
      // Walk-In check-in add on the fly
      const newBooking: Booking = {
        id: bookingId,
        guestName: updatedBookingDetails.guestName || 'Nguyễn Minh Đông',
        phone: updatedBookingDetails.phone || '0986553523',
        email: updatedBookingDetails.email || '',
        checkInDate: '02/06/2026',
        checkOutDate: updatedBookingDetails.checkOutDate || '09/06/2026',
        roomType: RoomType.STANDARD,
        roomNumber: assignedRoom,
        guestCount: updatedBookingDetails.guestCount || 1,
        cccd: cccd,
        isWalkIn: true,
      };
      setBookings((prev) => [newBooking, ...prev]);
      name = newBooking.guestName;
    } else {
      // Regular booking update
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id === bookingId) {
            name = b.guestName;
            return {
              ...b,
              roomNumber: assignedRoom,
              cccd,
              ...updatedBookingDetails,
            };
          }
          return b;
        })
      );
    }

    // 2. Set the designated room as occupied & attach modern booking details
    setRooms((prev) =>
      prev.map((r) => {
        // If room is the newly assigned room, mark OCCUPIED
        if (r.id === assignedRoom) {
          return {
            ...r,
            status: RoomStatus.OCCUPIED,
            currentBookingId: bookingId,
          };
        }
        // If room is older room of this booking, free it
        if (r.currentBookingId === bookingId && r.id !== assignedRoom) {
          return {
            ...r,
            status: RoomStatus.EMPTY,
            currentBookingId: undefined,
          };
        }
        return r;
      })
    );

    // 3. Trigger screen success notifications
    setToastMessage(
      `Check-in thành công! Phòng ${assignedRoom} đã được giao cho ${name || updatedBookingDetails?.guestName || 'khách hàng'}.`
    );
    setSelectedBooking(null);
    setSearchText('');
  };

  // Fast room-click handler
  const handleSelectRoom = (room: Room) => {
    // If room is BOOKED, find its associated booking to check in
    if (room.status === RoomStatus.BOOKED && room.currentBookingId) {
      const associatedBooking = bookings.find((b) => b.id === room.currentBookingId);
      if (associatedBooking) {
        setSelectedBooking(associatedBooking);
      } else {
        // Fallback placeholder
        setSelectedBooking({
          id: `TH-BOOK-${room.id}`,
          guestName: 'Khách Đặt Trước',
          phone: '0983332211',
          checkInDate: '02/06/2026',
          checkOutDate: '05/06/2026',
          roomType: room.type,
          roomNumber: room.id,
          guestCount: 2,
        });
      }
    } else if (room.status === RoomStatus.EMPTY) {
      // Treat as quick Walk-In for this empty room
      const walkInId = `THAD-WALKIN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      setSelectedBooking({
        id: walkInId,
        guestName: '',
        phone: '',
        email: '',
        checkInDate: '02/06/2026',
        checkOutDate: '09/06/2026',
        roomType: room.type,
        roomNumber: room.id,
        guestCount: 1,
        cccd: '',
        isWalkIn: true,
      });
    } else if (room.status === RoomStatus.OCCUPIED && room.currentBookingId) {
      const bObj = bookings.find((b) => b.id === room.currentBookingId);
      setViewingRoomInfo({ room, booking: bObj });
    } else if (room.status === RoomStatus.CLEANING) {
      setCleaningRoomConfirm(room);
    }
  };

  const handleConfirmCleaning = () => {
    if (cleaningRoomConfirm) {
      setRooms((prev) =>
        prev.map((r) => (r.id === cleaningRoomConfirm.id ? { ...r, status: RoomStatus.EMPTY } : r))
      );
      setToastMessage(`Phòng ${cleaningRoomConfirm.id} đã được dọn dẹp xong và sẵn sàng đón khách.`);
      setCleaningRoomConfirm(null);
    }
  };

  return (
    <div className="min-h-full bg-[#f8fafc] flex antialiased">
      {/* 1. Toast Alert */}
      <SuccessToast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* 3. Central Operational Dashboard Grid */}
      <div className="flex-1 flex flex-col p-8">
        
        {/* Main Search Autocomplete Header */}
        <MainHeader
          searchText={searchText}
          setSearchText={setSearchText}
          searchResults={searchResults}
          setSelectedBooking={setSelectedBooking}
          showSearchResults={showSearchResults}
          setShowSearchResults={setShowSearchResults}
        />

        {currentTab === 'room-map' ? (
          <div className="flex-1 space-y-6">

  
  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
      <h3 className="text-lg font-bold text-slate-900">Trạng thái phòng</h3>
      
      {/* Đưa Legend vào đây, nó sẽ nằm ép bên phải */}
      {/* <Legend /> */}
    </div>
    
    <RoomGrid rooms={rooms} onSelectRoom={handleSelectRoom} />
  </div>
</div>
        ) : (
          /* Bookings Tab */
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Danh sách đặt chỗ hiện hành</h3>
                <p className="text-xs text-slate-400">Danh sách quản lý phòng booking đặt trước</p>
              </div>
              <button
                onClick={handleOpenWalkIn}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition-colors"
              >
                Nhận Khách Walk-in mới
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                    <th className="p-4">Mã đặt chỗ</th>
                    <th className="p-4">Khách hàng</th>
                    <th className="p-4">Số điện thoại</th>
                    <th className="p-4">Thời gian</th>
                    <th className="p-4">Loại phòng</th>
                    <th className="p-4">Phòng chỉ định</th>
                    <th className="p-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => {
                    const isCheckedIn = !!booking.roomNumber;
                    return (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{booking.id}</td>
                        <td className="p-4 font-semibold text-slate-800">{booking.guestName || 'Vãng lai'}</td>
                        <td className="p-4 text-slate-500 font-mono">{booking.phone || 'Chưa lưu'}</td>
                        <td className="p-4 text-slate-600">
                          {booking.checkInDate} - {booking.checkOutDate}
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                            {booking.roomType}
                          </span>
                        </td>
                        <td className="p-4 text-slate-700 font-bold">
                          {booking.roomNumber ? `Phòng ${booking.roomNumber}` : 'Chưa giao phòng'}
                        </td>
                        <td className="p-4 text-center">
                          {isCheckedIn ? (
                            <span className="inline-flex items-center text-emerald-600 font-semibold gap-1">
                              <CheckCircle className="h-4 w-4" /> Đã nhận phòng
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 hover:bg-blue-100/50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100"
                            >
                              Thủ tục Check-in
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5. Check-In overlays */}
      {selectedBooking && (
        <CheckInModal
          booking={selectedBooking}
          rooms={rooms}
          onClose={() => setSelectedBooking(null)}
          onConfirmCheckIn={handleConfirmCheckIn}
        />
      )}

      {/* 6. Room Info Modal (Replacing ugly alert) */}
      {viewingRoomInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setViewingRoomInfo(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Thông tin lưu trú</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-3xl font-black text-rose-600">P.{viewingRoomInfo.room.id}</span>
                <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full uppercase tracking-wide">
                  Đang có khách
                </span>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                {viewingRoomInfo.booking ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Khách hàng:</span>
                      <span className="font-semibold text-slate-800">{viewingRoomInfo.booking.guestName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Số điện thoại:</span>
                      <span className="font-semibold text-slate-800">{viewingRoomInfo.booking.phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Số CCCD:</span>
                      <span className="font-semibold text-slate-800">{viewingRoomInfo.booking.cccd || 'Chưa cung cấp'}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                      <span className="text-slate-500">Lưu trú:</span>
                      <span className="font-bold text-blue-600">{viewingRoomInfo.booking.checkInDate} - {viewingRoomInfo.booking.checkOutDate}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500 italic">Không tìm thấy dữ liệu đặt phòng chi tiết.</p>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setViewingRoomInfo(null)}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Confirm Cleaning Modal (Replacing ugly confirm) */}
      {cleaningRoomConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setCleaningRoomConfirm(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Hoàn tất dọn dẹp?</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Xác nhận phòng <span className="font-bold text-slate-800">{cleaningRoomConfirm.id}</span> đã dọn dẹp xong và sẵn sàng đón khách mới.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-center gap-3">
              <button 
                onClick={() => setCleaningRoomConfirm(null)}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors flex-1"
              >
                Hủy
              </button>
              <button 
                onClick={handleConfirmCleaning}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex-1"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
