import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, CreditCard, Clock, AlertTriangle, Info, ClipboardList } from 'lucide-react';
import { Booking, Room, RoomType, RoomStatus } from '@/app/admin/types';

interface CheckInModalProps {
  booking: Booking | null;
  rooms: Room[];
  onClose: () => void;
  onConfirmCheckIn: (bookingId: string, assignedRoom: string, cccd: string, updatedBooking?: Partial<Booking>) => void;
}

export default function CheckInModal({
  booking,
  rooms,
  onClose,
  onConfirmCheckIn
}: CheckInModalProps) {
  // ---- LOGIC: Xử lý thời gian thực (Real-time) ----
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const currentDate = `${dd}/${mm}/${yyyy}`;

  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  // Helper: Chuyển đổi dd/mm/yyyy sang Date object để so sánh logic
  const parseDate = (str: string) => {
    if (!str) return new Date();
    const [d, m, y] = str.split('/');
    return new Date(Number(y), Number(m) - 1, Number(d));
  };

  const todayDateObj = new Date();
  todayDateObj.setHours(0, 0, 0, 0);

  // Mặc định khách Walk-in trả phòng vào ngày hôm sau
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultCheckOut = `${String(tomorrow.getDate()).padStart(2, '0')}/${String(tomorrow.getMonth() + 1).padStart(2, '0')}/${tomorrow.getFullYear()}`;

  // ---- STATE ----
  if (!booking) return null;

  const [cccd, setCccd] = useState(booking.cccd || '');
  const [roomNumber, setRoomNumber] = useState(booking.roomNumber || '');
  
  const [guestName, setGuestName] = useState(booking.guestName || '');
  const [phone, setPhone] = useState(booking.phone || '');
  const [email, setEmail] = useState(booking.email || '');
  const [checkOutDate, setCheckOutDate] = useState(booking.checkOutDate || defaultCheckOut);

  const [showEarlyConfirmation, setShowEarlyConfirmation] = useState(false);
  const [isEarlyCheckInApplied, setIsEarlyCheckInApplied] = useState(booking.earlyCheckInStatus === 'UPDATED');

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setCccd(booking.cccd || '');
    setRoomNumber(booking.roomNumber || '');
    setGuestName(booking.guestName || '');
    setPhone(booking.phone || '');
    setEmail(booking.email || '');
    setCheckOutDate(booking.checkOutDate || defaultCheckOut);
    setShowEarlyConfirmation(false);
    setIsEarlyCheckInApplied(booking.earlyCheckInStatus === 'UPDATED');
    setTouched({});
    
    const matchingRoom = rooms.find(
      r => r.type === booking.roomType && r.status === RoomStatus.EMPTY
    );
    if (matchingRoom && !booking.roomNumber) {
      setRoomNumber(matchingRoom.id);
    }
  }, [booking, rooms, defaultCheckOut]);

  // Logic kiểm tra nhận phòng sớm (đối chiếu ngày trong booking với ngày thực tế)
  const bookingInDateObj = parseDate(booking.checkInDate || currentDate);
  bookingInDateObj.setHours(0, 0, 0, 0);
  const isFutureCheckIn = !booking.isWalkIn && (bookingInDateObj > todayDateObj) && !isEarlyCheckInApplied;

  // ---- VALIDATION RULES ----
  const validateCccd = (val: string) => {
    const rawValue = val.replace(/\s/g, ''); 
    if (!rawValue) return 'Vui lòng nhập số CCCD';
    if (!/^\d{12}$/.test(rawValue)) return 'Số CCCD phải đúng 12 chữ số';
    return null;
  };

  const validatePhone = (val: string) => {
    if (!val.trim()) return 'Vui lòng nhập số điện thoại';
    const phoneRegex = /^0(3|5|7|8|9)\d{8}$/;
    if (!phoneRegex.test(val.trim())) return 'Số điện thoại không đúng định dạng';
    return null;
  };

  const validateGuestName = (val: string) => {
    if (!val.trim()) return 'Vui lòng nhập họ và tên';
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]{2,100}$/;
    if (!nameRegex.test(val)) return 'Họ tên không hợp lệ (chỉ nhập chữ cái)';
    return null;
  };

  const validateCheckOutDate = (val: string) => {
    if (!val.trim()) return 'Vui lòng nhập ngày trả phòng';
    const outDateObj = parseDate(val);
    outDateObj.setHours(0, 0, 0, 0);
    if (isNaN(outDateObj.getTime())) return 'Ngày không hợp lệ';
    if (outDateObj <= todayDateObj) return 'Ngày trả phòng phải sau ngày nhận ít nhất 1 ngày';
    return null;
  };

  // Triggers
  const cccdError = validateCccd(cccd);
  const phoneError = booking.isWalkIn ? validatePhone(phone) : null;
  const nameError = booking.isWalkIn ? validateGuestName(guestName) : null;
  const checkOutError = booking.isWalkIn ? validateCheckOutDate(checkOutDate) : null;
  const roomError = !roomNumber ? 'Vui lòng chọn phòng giao cho khách' : null;

  const isFormInvalid = !!cccdError || !!phoneError || !!nameError || !!checkOutError || !!roomError || isFutureCheckIn;

  const availableRoomsOfType = rooms.filter(
    r => r.type === booking.roomType && (r.status === RoomStatus.EMPTY || r.id === booking.roomNumber)
  );

  const handleCompleteCheckIn = () => {
    setTouched({ cccd: true, phone: true, name: true, roomNumber: true, checkOut: true });
    if (isFormInvalid) return;

    const partialUpdates: Partial<Booking> = {};
    if (booking.isWalkIn) {
      partialUpdates.guestName = guestName;
      partialUpdates.phone = phone;
      partialUpdates.email = email;
      partialUpdates.checkOutDate = checkOutDate;
      partialUpdates.checkInDate = currentDate;
    }
    if (isEarlyCheckInApplied) {
      partialUpdates.earlyCheckInStatus = 'UPDATED';
      partialUpdates.checkInDate = currentDate;
      partialUpdates.earlyCheckInFee = 500000;
    }

    onConfirmCheckIn(booking.id, roomNumber, cccd.replace(/\s/g, ''), partialUpdates);
  };

  const handleApplyEarlyCheckIn = () => {
    setIsEarlyCheckInApplied(true);
    setShowEarlyConfirmation(false);
  };

  const handleCancelEarlyCheckIn = () => {
    setShowEarlyConfirmation(false);
  };
  // Tính ngày mai với định dạng YYYY-MM-DD để khóa các ngày trong quá khứ và hôm nay
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const minDateStr = tomorrowObj.toISOString().split('T')[0];

  // Hàm chuyển DD/MM/YYYY (state) sang YYYY-MM-DD (input date)
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  };
// Tính toán số ngày nhận phòng sớm và tổng phí
  const originalCheckInObj = parseDate(booking?.checkInDate || currentDate);
  originalCheckInObj.setHours(0, 0, 0, 0);
  
  // Tính độ lệch thời gian (milliseconds) rồi đổi ra ngày
  const timeDiff = originalCheckInObj.getTime() - todayDateObj.getTime();
  const earlyDays = timeDiff > 0 ? Math.ceil(timeDiff / (1000 * 3600 * 24)) : 0;
  
  const unitPrice = 500000;
  const totalEarlyCheckInFee = earlyDays * unitPrice;
  return (
    <div id="checkin-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 transition-all duration-300">
      
      {/* RENDER NATIVE STATE 1 (EARLY CHECK-IN CONFIRMATION MODAL) */}
      {showEarlyConfirmation ? (
        <div id="early-checkin-confirmation" className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-300">
          <div className="p-6 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="p-1 px-1.5 bg-amber-500 rounded text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6 font-bold" />
              </span>
              <h2 className="text-xl font-bold text-amber-900">Xác nhận cập nhật nhận sớm</h2>
            </div>
            <button onClick={handleCancelEarlyCheckIn} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-amber-100">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-[#FFF4E5] p-4 rounded-xl flex gap-3 border border-[#FFE0B2]">
              <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">
                Khách đang yêu cầu nhận phòng sớm hơn so với đặt chỗ ban đầu.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-3.5 bg-slate-50 font-bold text-xs text-slate-500 border-b border-slate-200 uppercase tracking-wider">
                Chi tiết phát sinh
              </div>
              <div className="divide-y divide-slate-100">
                <div className="p-4 flex justify-between items-center bg-white text-sm">
                  <span className="text-slate-500">Ngày nhận ban đầu</span>
                  <span className="font-semibold text-slate-800">{booking.checkInDate}</span>
                </div>
                <div className="p-4 flex justify-between items-center bg-white text-sm">
                  <span className="text-slate-500">Ngày nhận mới</span>
                  <span className="font-bold text-blue-600">{currentDate} (Hôm nay)</span>
                </div>
                
                {/* Dòng mới bổ sung: Số ngày nhận sớm */}
                <div className="p-4 flex justify-between items-center bg-white text-sm">
                  <span className="text-slate-500">Số ngày nhận sớm</span>
                  <span className="font-semibold text-slate-800">{earlyDays} ngày</span>
                </div>
                
                <div className="p-4 flex justify-between items-center bg-white text-sm">
                  <span className="text-slate-500">Đơn giá/ngày</span>
                  <span className="font-semibold text-slate-800">
                    {unitPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
              <div className="p-5 bg-amber-50/50 flex justify-between items-center border-t border-amber-100">
                <span className="text-sm font-bold text-amber-800">Tổng phí phát sinh</span>
                {/* Hiển thị tổng tiền linh động dựa trên phép nhân */}
                <span className="text-2xl font-black text-amber-600">
                  {totalEarlyCheckInFee.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 py-1 italic">
              Vui lòng xác nhận với khách hàng trước khi tiếp tục
            </p>
          </div>

          <div className="p-6 flex justify-end gap-3 bg-slate-50 border-t border-slate-200">
            <button
              onClick={handleCancelEarlyCheckIn}
              className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white font-semibold hover:bg-slate-50 transition-colors text-sm"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleApplyEarlyCheckIn}
              className="px-6 py-2.5 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 shadow-md transition-all text-sm"
            >
              Xác nhận cập nhật
            </button>
          </div>
        </div>
      ) : (
        
        /* RENDER NATIVE STATE 2 (MAIN CHECK-IN FORM MODAL) */
        <div id="checkin-modal" className="bg-white rounded-2xl shadow-2xl w-full max-w-[560px] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
          
          <div className="px-8 py-5 flex justify-between items-start border-b border-slate-100 shrink-0">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">Xử lý Check-in</h3>
              {booking.isWalkIn ? (
                <span className="inline-block px-2.5 py-0.5 bg-[#FF7A00] text-white text-[11px] font-bold rounded uppercase tracking-wide">
                  {booking.id}
                </span>
              ) : (
                <span className="inline-block px-2.5 py-0.5 bg-blue-600 text-white text-[11px] font-bold rounded uppercase tracking-wide">
                  {booking.id}
                </span>
              )}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-8 py-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">

            {isFutureCheckIn && (
              <div id="early-checkin-alert" className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-800 text-sm leading-relaxed">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold mb-1">Cảnh báo ngày nhận phòng</p>
                  <p className="text-xs text-red-700">
                    Ngày nhận phòng theo đặt chỗ là {booking.checkInDate}. Vui lòng cập nhật nhận sớm trước khi check-in.
                  </p>
                  <button
                    onClick={() => setShowEarlyConfirmation(true)}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm transition-colors"
                  >
                    Cập nhật nhận sớm
                  </button>
                </div>
              </div>
            )}

            {isEarlyCheckInApplied && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 text-sm leading-relaxed">
                <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
                <div className="flex-1">
                  <p className="font-semibold text-xs text-amber-900">Đã cập nhật nhận sớm thành công!</p>
                  <p className="text-xs text-amber-700">
                    Sửa ngày nhận: {currentDate} • Đơn giá dịch vụ tăng cường: <span className="font-bold">+500.000đ</span>
                  </p>
                </div>
              </div>
            )}

            <div className="border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm bg-gradient-to-b from-white to-slate-50">
              <p className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <ClipboardList className="h-4 w-4 text-blue-600" />
                <span>Thông tin đặt phòng</span>
              </p>
              
              {booking.isWalkIn ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#FF7A00] text-white text-[10px] font-bold rounded">WALK-IN</span>
                    <span className="text-xs text-slate-500">Khách vãng lai trực tiếp</span>
                  </div>
                  {/* Bổ sung dòng ngày tháng nhận/trả phòng cho khách Walk-in */}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {currentDate}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-base">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-800 font-semibold">{guestName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {isEarlyCheckInApplied ? currentDate : booking.checkInDate} - {booking.checkOutDate}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs">Loại phòng</span>
                  <span className="font-bold text-slate-700">{booking.roomType}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-gray-400 text-xs">Số khách</span>
                  <span className="font-bold text-slate-700">{booking.guestCount} người</span>
                </div>
              </div>
            </div>

            {booking.isWalkIn ? (
              <div className="space-y-4" id="walk-in-customer-form">
                <p className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="h-4 w-4 text-amber-500" />
                  <span>Thông tin khách hàng</span>
                </p>

                {/* Name */}
                <div className="relative">
                  <label className={`absolute -top-2 left-3 bg-white px-2 text-[10px] font-bold ${touched.name && nameError ? 'text-red-500' : 'text-slate-500'} z-10`}>
                    Họ và tên *
                  </label>
                  <div className={`relative flex items-center border ${touched.name && nameError ? 'border-red-500 focus-within:ring-red-500' : 'border-slate-300 focus-within:ring-amber-500'} rounded-lg px-3 py-3 bg-white transition-all`}>
                    <User className="h-4 w-4 text-slate-400 mr-2" />
                    <input
                      className="w-full border-none p-0 text-sm focus:ring-0 outline-none text-slate-800"
                      type="text"
                      value={guestName}
                      placeholder="Nhập họ tên khách hàng"
                      onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                      onChange={e => setGuestName(e.target.value)}
                    />
                  </div>
                  {touched.name && nameError && (
                    <p className="mt-1 text-red-500 text-[10.5px] font-semibold pl-1">{nameError}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="relative">
                  <label className={`absolute -top-2 left-3 bg-white px-2 text-[10px] font-bold ${touched.phone && phoneError ? 'text-red-500' : 'text-slate-500'} z-10`}>
                    Số điện thoại *
                  </label>
                  <div className={`relative flex items-center border ${touched.phone && phoneError ? 'border-red-500 focus-within:ring-red-500' : 'border-slate-300 focus-within:ring-amber-500'} rounded-lg px-3 py-3 bg-white transition-all`}>
                    <Phone className="h-4 w-4 text-slate-400 mr-2" />
                    <input
                      className="w-full border-none p-0 text-sm focus:ring-0 outline-none text-slate-800"
                      type="text"
                      value={phone}
                      placeholder="Nhập số điện thoại"
                      onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                      // Hạn chế nhập chữ, tối đa 11 số (cho đầu 84) hoặc 10 số
                      onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    />
                    {touched.phone && phoneError && (
                      <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                    )}
                  </div>
                  {touched.phone && phoneError && (
                    <p className="mt-1 text-red-500 text-[10.5px] font-semibold pl-1">{phoneError}</p>
                  )}
                </div>

                {/* Email */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-2 text-[10px] font-bold text-slate-500 z-10">Email</label>
                  <div className="flex items-center border border-slate-300 focus-within:ring-1 focus-within:ring-amber-500 rounded-lg px-3 py-3 bg-white transition-all">
                    <Mail className="h-4 w-4 text-slate-400 mr-2" />
                    <input
                      className="w-full border-none p-0 text-sm focus:ring-0 outline-none text-slate-800"
                      type="email"
                      value={email}
                      placeholder="example@gmail.com"
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Checkout Date */}
                <div className="relative">
      <label className={`absolute -top-2 left-3 bg-white px-2 text-[10px] font-bold ${touched.checkOut && checkOutError ? 'text-red-500' : 'text-slate-500'} z-10`}>
        Ngày trả phòng *
      </label>
      <div className={`flex items-center border ${touched.checkOut && checkOutError ? 'border-red-500 focus-within:ring-red-500' : 'border-slate-300 focus-within:ring-amber-500'} rounded-lg px-3 py-3 bg-white transition-all`}>
        <Calendar className="h-4 w-4 text-slate-400 mr-2" />
        <input
          className="w-full border-none p-0 text-sm focus:ring-0 outline-none text-slate-800 bg-transparent"
          type="date"
          min={minDateStr} // Tự động mờ (disable) các ngày <= hôm nay
          value={formatDateForInput(checkOutDate)}
          onBlur={() => setTouched(prev => ({ ...prev, checkOut: true }))}
          onChange={e => {
            // Chuyển ngược YYYY-MM-DD (từ lịch) về lại DD/MM/YYYY (để lưu state)
            const val = e.target.value; 
            if (val) {
              const [y, m, d] = val.split('-');
              setCheckOutDate(`${d}/${m}/${y}`);
            } else {
              setCheckOutDate('');
            }
          }}
        />
      </div>
      {touched.checkOut && checkOutError && (
        <p className="mt-1 text-red-500 text-[10.5px] font-semibold pl-1">{checkOutError}</p>
      )}
    </div>
              </div>
            ) : null}

            <div className="space-y-4">
              {/* CCCD Input */}
              <div className="relative">
                <label className={`absolute -top-2 left-3 bg-white px-2 text-[10px] font-bold ${touched.cccd && cccdError ? 'text-red-500' : 'text-slate-500'} z-10`}>
                  Số CCCD *
                </label>
                <div className={`relative flex items-center border ${touched.cccd && cccdError ? 'border-red-500 focus-within:ring-red-500' : 'border-slate-300 focus-within:ring-blue-500'} rounded-lg px-3 py-3.5 bg-white transition-all`}>
                  <CreditCard className="h-5 w-5 text-slate-400 mr-3" />
                  <input
                    className="w-full border-none p-0 text-sm focus:ring-0 outline-none text-slate-800 placeholder:text-slate-400"
                    type="text"
                    value={cccd}
                    placeholder="Nhập 12 chữ số"
                    onBlur={() => setTouched(prev => ({ ...prev, cccd: true }))}
                    // Chặn gõ chữ, khóa cứng độ dài max 12
                    onChange={e => setCccd(e.target.value.replace(/[^0-9]/g, '').slice(0, 12))}
                  />
                  {touched.cccd && cccdError && (
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 ml-2" />
                  )}
                </div>
                {touched.cccd && cccdError && (
                  <p className="mt-1.5 text-red-500 text-[11px] font-medium leading-none pl-1">
                    {cccdError}
                  </p>
                )}
              </div>

              {/* Room Assignment Dropdown */}
              <div className="relative">
                <span className="absolute -top-2 left-3 bg-white px-2 text-[10px] font-bold text-slate-500 z-10">
                  Phòng giao cho khách *
                </span>
                <div className="relative">
                  <select
                    className="w-full pl-4 pr-10 py-3.5 border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg outline-none bg-white text-sm text-slate-800 transition-all font-medium"
                    value={roomNumber}
                    onChange={e => setRoomNumber(e.target.value)}
                  >
                    <option value="">Chọn phòng thích hợp</option>
                    {availableRoomsOfType.map(r => (
                      <option key={r.id} value={r.id}>
                        Phòng {r.id} - {r.type} (Sạch - Sẵn sàng)
                      </option>
                    ))}
                    {rooms
                      .filter(r => r.type === booking.roomType && !availableRoomsOfType.includes(r))
                      .map(r => (
                        <option key={r.id} value={r.id} disabled>
                          Phòng {r.id} - {r.type} ({r.status === RoomStatus.OCCUPIED ? 'Đang có khách' : r.status === RoomStatus.CLEANING ? 'Đang dọn dẹp' : 'Đã đặt'})
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Check-In Time Notice Banner - Cập nhật real-time */}
            <div className="bg-[#eef8fe] border border-[#d2eefe] rounded-xl p-4 flex items-center gap-3 text-blue-700 min-h-[48px] shadow-sm">
              <Clock className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs font-semibold">
                Thời gian nhận phòng ghi nhận hệ thống: {currentTime} - {currentDate}
              </span>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="p-8 pt-4 border-t border-slate-100 flex flex-col space-y-3 shrink-0 bg-slate-50">
            {/* Thêm w-full để container dàn đều, bỏ justify-end */}
            <div className="flex w-full gap-3">
              <button
                onClick={onClose}
                // Thêm flex-1 để chiếm 50%
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm"
              >
                Hủy
              </button>
              <button
                disabled={isFormInvalid}
                onClick={handleCompleteCheckIn}
                // Thêm flex-1 để chiếm 50%, gộp chung màu xanh nước biển khi form hợp lệ
                className={`flex-1 py-3 font-semibold rounded-lg text-sm transition-colors shadow-sm ${
                  isFormInvalid
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Hoàn tất Check-in
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 italic">
              {isFormInvalid
                ? isFutureCheckIn
                  ? 'Vui lòng cập nhật nhận sớm trước khi check-in'
                  : 'Vui lòng điền đầy đủ thông tin hợp lệ'
                : 'Thông tin đã sẵn sàng'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}