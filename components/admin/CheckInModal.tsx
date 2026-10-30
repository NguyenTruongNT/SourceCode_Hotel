'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  User,
  Phone,
  Mail,
  CreditCard,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle2,
  Key,
  ShieldAlert,
  Printer,
  Sparkles
} from 'lucide-react';
import { Booking, Room, RoomType, RoomStatus } from '@/app/admin/types';
import { formatVND } from '@/lib/rooms';

interface CheckInModalProps {
  booking: Booking | null;
  rooms: Room[];
  onClose: () => void;
  onConfirmCheckIn: (
    bookingId: string,
    assignedRoom: string,
    cccd: string,
    updatedBooking?: Partial<Booking>
  ) => void;
}

export default function CheckInModal({
  booking,
  rooms,
  onClose,
  onConfirmCheckIn
}: CheckInModalProps) {
  if (!booking) return null;

  // Giờ hệ thống thực tế
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

  // State khung giờ kiểm thử (Testing Override)
  const [testTimeMode, setTestTimeMode] = useState<'realtime' | 'before6' | '6to9' | '9to14' | 'after14'>('realtime');
  const [checkInTime, setCheckInTime] = useState(currentTimeStr);

  // Form states theo đặc tả F3 (3.5.2)
  const [cccdInput, setCccdInput] = useState(booking.cccd || '');
  const [roomNumber, setRoomNumber] = useState(booking.roomNumber || '');
  const [securityDeposit, setSecurityDeposit] = useState<number>(booking.securityDeposit || 500000);
  const [keycardCode, setKeycardCode] = useState(booking.keycardCode || '');
  const [depositPaymentMethod, setDepositPaymentMethod] = useState<'CASH' | 'POS'>('CASH');
  const [isAuthorizedGuest, setIsAuthorizedGuest] = useState(false);

  // Walk-in fields
  const [guestName, setGuestName] = useState(booking.guestName || '');
  const [phone, setPhone] = useState(booking.phone || '');

  // Touched & Error states
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [printedSlip, setPrintedSlip] = useState(false);

  // Đồng bộ giờ theo testTimeMode
  useEffect(() => {
    if (testTimeMode === 'before6') setCheckInTime('05:30');
    else if (testTimeMode === '6to9') setCheckInTime('07:45');
    else if (testTimeMode === '9to14') setCheckInTime('10:30');
    else if (testTimeMode === 'after14') setCheckInTime('14:30');
    else setCheckInTime(currentTimeStr);
  }, [testTimeMode, currentTimeStr]);

  // Tìm phòng trống thích hợp cùng hạng
  useEffect(() => {
    setCccdInput(booking.cccd || '');
    setGuestName(booking.guestName || '');
    setPhone(booking.phone || '');
    setSecurityDeposit(500000);
    setKeycardCode(booking.keycardCode || 'KEY' + Math.random().toString(16).slice(2, 8).toUpperCase());
    setTouched({});
    setIsAuthorizedGuest(false);
    setPrintedSlip(false);

    // Gán mặc định phòng trống sạch cùng hạng
    const cleanRoom = rooms.find(
      (r) => r.type === booking.roomType && r.status === RoomStatus.EMPTY
    );
    if (cleanRoom && !booking.roomNumber) {
      setRoomNumber(cleanRoom.id);
    } else if (booking.roomNumber) {
      setRoomNumber(booking.roomNumber);
    }
  }, [booking, rooms]);

  // Tính phụ thu nhận phòng sớm (BR_F3_01)
  const calcEarlyCheckInSurcharge = (): { rate: number; fee: number; label: string } => {
    const parts = checkInTime.split(':');
    const h = Number(parts[0]);
    const m = Number(parts[1] || 0);
    const totalMinutes = h * 60 + m;

    // Giá phòng 1 đêm
    const nightPrice =
      booking.roomType === RoomType.STANDARD
        ? 800000
        : booking.roomType === RoomType.SUPERIOR
        ? 1200000
        : booking.roomType === RoomType.DELUXE
        ? 1800000
        : 3500000;

    if (totalMinutes < 6 * 60) {
      // Trước 06:00: 100%
      return { rate: 1.0, fee: nightPrice, label: 'Nhận phòng trước 06:00 (Phụ thu 100% giá 1 đêm)' };
    } else if (totalMinutes < 9 * 60) {
      // 06:00 - 09:00: 50%
      return { rate: 0.5, fee: Math.round(nightPrice * 0.5), label: 'Nhận phòng khung 06:00 - 09:00 (Phụ thu 50% giá 1 đêm)' };
    } else if (totalMinutes < 14 * 60) {
      // 09:00 - 14:00: 30%
      return { rate: 0.3, fee: Math.round(nightPrice * 0.3), label: 'Nhận phòng khung 09:00 - 14:00 (Phụ thu 30% giá 1 đêm)' };
    } else {
      // Từ 14:00: Miễn phí
      return { rate: 0, fee: 0, label: 'Đúng giờ tiêu chuẩn từ 14:00 (Không phụ thu)' };
    }
  };

  const earlySurcharge = calcEarlyCheckInSurcharge();

  // Validate CCCD: Phải đúng 12 số
  const validateCccd = (val: string): string => {
    const trimmed = val.trim();
    if (!trimmed) return 'Số CCCD bắt buộc nhập!';
    if (!/^\d{12}$/.test(trimmed)) return 'Số CCCD phải gồm đúng 12 chữ số!';
    return '';
  };

  // Đối chiếu CCCD với hồ sơ đặt online
  const isCccdMismatch =
    !booking.isWalkIn &&
    booking.cccd &&
    cccdInput.trim() !== booking.cccd.trim() &&
    !isAuthorizedGuest;

  // Validate tiền cọc đảm bảo: >= 500,000 VNĐ
  const validateDeposit = (amt: number): string => {
    if (!amt || isNaN(amt) || amt < 500000) {
      return 'Tiền cọc đảm bảo tài sản tối thiểu là 500,000 VNĐ!';
    }
    return '';
  };

  // Validate mã thẻ từ: 6-10 hex
  const validateKeycard = (code: string): string => {
    const trimmed = code.trim();
    if (!trimmed) return 'Vui lòng quẹt thẻ từ bàn giao!';
    if (trimmed.length < 4 || trimmed.length > 12) {
      return 'Mã thẻ từ không hợp lệ (4-12 ký tự)!';
    }
    return '';
  };

  const cccdErr = validateCccd(cccdInput);
  const depositErr = validateDeposit(securityDeposit);
  const keycardErr = validateKeycard(keycardCode);
  const roomErr = !roomNumber ? 'Vui lòng chọn phòng trống để gán cho khách!' : '';

  const isFormValid = !cccdErr && !depositErr && !keycardErr && !roomErr && !isCccdMismatch;

  // Lọc danh sách phòng trống sạch cùng hạng
  const availableRooms = rooms.filter(
    (r) =>
      r.type === booking.roomType &&
      (r.status === RoomStatus.EMPTY || r.id === booking.roomNumber)
  );

  const handleGenerateKeycard = () => {
    const hex = 'KEY' + Math.random().toString(16).substring(2, 8).toUpperCase();
    setKeycardCode(hex);
  };

  const handleSubmit = () => {
    setTouched({ cccd: true, deposit: true, keycard: true, room: true });
    if (!isFormValid) return;

    const remainingRoomFee = booking.remainingAmount || 0;
    const totalCollectedAtCheckin = remainingRoomFee + earlySurcharge.fee + securityDeposit;

    onConfirmCheckIn(booking.id, roomNumber, cccdInput.trim(), {
      status: 'Checked-in',
      roomNumber,
      cccd: cccdInput.trim(),
      securityDeposit,
      keycardCode: keycardCode.trim(),
      actualCheckInTime: checkInTime,
      earlyCheckInFee: earlySurcharge.fee,
      earlyCheckInStatus: earlySurcharge.fee > 0 ? 'EARLY_SURCHARGE' : 'ON_TIME',
      remainingAmount: remainingRoomFee,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header modal */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white/20">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Xử lý Tiếp nhận Nhận phòng (Check-in - F3)</h2>
              <p className="text-xs text-blue-100">
                Mã Booking: <strong className="font-mono">{booking.id}</strong> • Hạng phòng: {booking.roomType}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Thanh chọn nhanh khung giờ kiểm thử (Testing Surcharge Boundary) */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <Clock className="size-3.5" /> Kiểm thử Phụ thu giờ Check-in (BR_F3_01)
              </span>
              <span className="font-mono text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                Giờ Check-in: {checkInTime}
              </span>
            </div>
            <p className="text-xs text-indigo-800 mb-3">
              {earlySurcharge.label}: <strong>{formatVND(earlySurcharge.fee)}</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTestTimeMode('realtime')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                  testTimeMode === 'realtime'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white text-indigo-900 border border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                Giờ thực tế ({currentTimeStr})
              </button>
              <button
                type="button"
                onClick={() => setTestTimeMode('before6')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                  testTimeMode === 'before6'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white text-indigo-900 border border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                &lt; 06:00 (+100%)
              </button>
              <button
                type="button"
                onClick={() => setTestTimeMode('6to9')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                  testTimeMode === '6to9'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white text-indigo-900 border border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                06:00 - 09:00 (+50%)
              </button>
              <button
                type="button"
                onClick={() => setTestTimeMode('9to14')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                  testTimeMode === '9to14'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white text-indigo-900 border border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                09:00 - 14:00 (+30%)
              </button>
              <button
                type="button"
                onClick={() => setTestTimeMode('after14')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                  testTimeMode === 'after14'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white text-indigo-900 border border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                &gt;= 14:00 (Miễn phí 0đ)
              </button>
            </div>
          </div>

          {/* Thông tin hồ sơ đối soát */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs">
            <div>
              <p className="text-slate-500">Khách đặt hồ sơ online:</p>
              <p className="font-bold text-slate-800 text-sm">{booking.guestName}</p>
              <p className="text-slate-600 mt-1">SĐT: {booking.phone}</p>
            </div>
            <div>
              <p className="text-slate-500">Số CCCD đăng ký trong đơn:</p>
              <p className="font-mono font-bold text-slate-800 text-sm">
                {booking.cccd || 'Khách chưa khai báo'}
              </p>
              <p className="text-slate-600 mt-1">
                Kỳ ở: {booking.checkInDate} → {booking.checkOutDate}
              </p>
            </div>
          </div>

          {/* Đối chiếu CCCD thực tế */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Số CCCD đối chiếu thực tế (12 số) <span className="text-red-500">*</span></span>
              {booking.cccd && (
                <span className="text-[11px] font-normal text-slate-500">
                  Hồ sơ gốc: <strong className="font-mono">{booking.cccd}</strong>
                </span>
              )}
            </label>
            <input
              type="text"
              value={cccdInput}
              onChange={(e) => setCccdInput(e.target.value)}
              placeholder="Nhập đúng 12 chữ số CCCD bản cứng của khách"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm font-mono outline-none ${
                cccdErr
                  ? 'border-red-500 bg-red-50 focus:ring-red-100'
                  : 'border-slate-300 focus:border-blue-500'
              }`}
            />
            {cccdErr && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertTriangle className="size-3.5" /> {cccdErr}
              </p>
            )}

            {/* Cảnh báo sai lệch CCCD (Ngoại lệ E3) */}
            {isCccdMismatch && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 mt-2 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <ShieldAlert className="size-4 shrink-0 text-amber-600" />
                  Cảnh báo: Số CCCD không trùng khớp với hồ sơ đặt phòng online!
                </div>
                <p>
                  Khách cung cấp: <strong className="font-mono">{cccdInput}</strong> khác với hồ sơ{' '}
                  <strong className="font-mono">{booking.cccd}</strong>. Vui lòng kiểm tra lại giấy ủy quyền hoặc căn cước.
                </p>
                <label className="flex items-center gap-2 pt-1 font-semibold text-amber-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAuthorizedGuest}
                    onChange={(e) => setIsAuthorizedGuest(e.target.checked)}
                    className="size-4 rounded text-blue-600"
                  />
                  Xác thực: Khách nhận phòng đã được chủ đơn ủy quyền hợp lệ
                </label>
              </div>
            )}
          </div>

          {/* Chọn phòng thực tế gán cho khách (Room Assigned) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Gán phòng vật lý Trống - Sạch ({booking.roomType}) <span className="text-red-500">*</span>
            </label>
            <select
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold outline-none focus:border-blue-500 bg-white"
            >
              <option value="">-- Chọn phòng sạch sẵn sàng đón khách --</option>
              {availableRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Phòng {r.id} (Tầng {r.floor} • Trạng thái: {r.status === RoomStatus.EMPTY ? 'Trống - Sạch' : r.status})
                </option>
              ))}
            </select>
            {roomErr && (
              <p className="text-xs text-red-600 font-medium">{roomErr}</p>
            )}
            {availableRooms.length === 0 && (
              <p className="text-xs text-red-500 font-semibold">
                Hiện không có phòng nào của hạng {booking.roomType} ở trạng thái Trống - Sạch (Clean)!
              </p>
            )}
          </div>

          {/* Tiền cọc tài sản đảm bảo & Mã thẻ từ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Tiền cọc đảm bảo thiết bị <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  step={50000}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">Mặc định: 500,000 VNĐ / phòng (&gt;= 500,000 VNĐ)</p>
              {depositErr && (
                <p className="text-xs text-red-600 font-medium">{depositErr}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Mã thẻ từ (RFID Key) <span className="text-red-500">*</span></span>
                <button
                  type="button"
                  onClick={handleGenerateKeycard}
                  className="text-[11px] text-blue-600 hover:underline font-normal flex items-center gap-1"
                >
                  <Sparkles className="size-3" /> Quẹt thẻ tự động
                </button>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key className="size-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={keycardCode}
                    onChange={(e) => setKeycardCode(e.target.value.toUpperCase())}
                    placeholder="Mã hex (VD: A1B2C3)"
                    className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm font-mono uppercase outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              {keycardErr && (
                <p className="text-xs text-red-600 font-medium">{keycardErr}</p>
              )}
            </div>
          </div>

          {/* Bảng tổng kết tài chính thu tại quầy */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Bảng thu tiền tại quầy Check-in:
            </h4>
            <div className="flex justify-between text-slate-600">
              <span>Tiền phòng còn lại chưa cọc:</span>
              <span className="font-semibold text-slate-800">
                {formatVND(booking.remainingAmount || 0)}
              </span>
            </div>
            {earlySurcharge.fee > 0 && (
              <div className="flex justify-between text-indigo-700 font-medium">
                <span>Phụ thu nhận phòng sớm ({checkInTime}):</span>
                <span>+{formatVND(earlySurcharge.fee)}</span>
              </div>
            )}
            <div className="flex justify-between text-blue-700 font-medium">
              <span>Tiền cọc đảm bảo thiết bị tài sản:</span>
              <span>+{formatVND(securityDeposit)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-slate-900 text-base pt-2 border-t border-slate-200">
              <span>Tổng thu từ khách lúc này:</span>
              <span className="text-emerald-700">
                {formatVND((booking.remainingAmount || 0) + earlySurcharge.fee + securityDeposit)}
              </span>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold text-white transition-all shadow-md ${
                isFormValid
                  ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="size-4" /> Xác nhận Check-in &amp; Giao thẻ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
