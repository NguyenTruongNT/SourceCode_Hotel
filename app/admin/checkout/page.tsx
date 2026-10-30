'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Printer,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coffee,
  ShieldAlert,
  ArrowRight,
  FileText,
  User,
  Calendar,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '@/app/admin/AdminProvider';
import { RoomStatus, RoomType, Booking } from '@/app/admin/types';
import { formatVND } from '@/lib/rooms';

// Danh mục Minibar tiêu chuẩn theo đặc tả F4 (3.7.2)
const MINIBAR_PRICES = {
  water: { name: 'Nước suối Aquafina', price: 20000 },
  softDrink: { name: 'Nước ngọt Coca/Pepsi', price: 25000 },
  beer: { name: 'Bia Heineken/Tiger', price: 35000 },
  snack: { name: 'Snack khoai tây Ostar', price: 30000 },
};

export default function CheckoutPage() {
  const { rooms, setRooms, bookings, setBookings } = useAdmin();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Giờ check-out thực tế & Chế độ kiểm thử (Testing Surcharge Override)
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

  const [checkoutTimeMode, setCheckoutTimeMode] = useState<'realtime' | 'ontime' | 'late30' | 'late50' | 'late100'>('realtime');
  const [checkoutTime, setCheckoutTime] = useState(currentTimeStr);

  // Minibar inputs
  const [minibar, setMinibar] = useState({
    water: 0,
    softDrink: 0,
    beer: 0,
    snack: 0,
  });
  const [minibarError, setMinibarError] = useState('');

  // Phí bồi thường hư hại
  const [damageFee, setDamageFee] = useState<number>(0);
  const [damageFeeError, setDamageFeeError] = useState('');
  const [damageReason, setDamageReason] = useState('');

  // Phương thức quyết toán số dư (3.7.2)
  const [settlementMethod, setSettlementMethod] = useState<'CASH' | 'POS' | 'QR'>('CASH');

  // Trạng thái hóa đơn & hoàn tất
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);

  // Đồng bộ giờ checkout theo mode
  useEffect(() => {
    if (checkoutTimeMode === 'ontime') setCheckoutTime('11:45');
    else if (checkoutTimeMode === 'late30') setCheckoutTime('13:30'); // 12:01 - 15:00
    else if (checkoutTimeMode === 'late50') setCheckoutTime('16:15'); // 15:01 - 18:00
    else if (checkoutTimeMode === 'late100') setCheckoutTime('19:00'); // Sau 18:00
    else setCheckoutTime(currentTimeStr);
  }, [checkoutTimeMode, currentTimeStr]);

  // Lấy danh sách các phòng đang có khách (OCCUPIED)
  const occupiedRooms = rooms.filter(
    (r) => r.status === RoomStatus.OCCUPIED && r.currentBookingId
  );

  // Lọc theo tìm kiếm
  const filteredRooms = occupiedRooms.filter((r) => {
    const b = bookings.find((bk) => bk.id === r.currentBookingId);
    const q = searchQuery.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      (b && b.guestName.toLowerCase().includes(q)) ||
      (b && b.id.toLowerCase().includes(q))
    );
  });

  // Chọn phòng đầu tiên nếu chưa chọn
  useEffect(() => {
    if (!selectedRoomId && occupiedRooms.length > 0) {
      setSelectedRoomId(occupiedRooms[0].id);
    }
  }, [occupiedRooms, selectedRoomId]);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const currentBooking = selectedRoom
    ? bookings.find((b) => b.id === selectedRoom.currentBookingId)
    : undefined;

  // Tính phụ thu trả phòng trễ (BR_F4_01)
  const calcLateCheckoutSurcharge = () => {
    if (!selectedRoom) return { rate: 0, fee: 0, label: 'Đúng giờ tiêu chuẩn' };

    const parts = checkoutTime.split(':');
    const h = Number(parts[0]);
    const m = Number(parts[1] || 0);
    const totalMinutes = h * 60 + m;

    const nightPrice = selectedRoom.price || 1200000;

    // Giờ trả tiêu chuẩn: 12:00 (720 phút)
    if (totalMinutes <= 12 * 60) {
      return { rate: 0, fee: 0, label: 'Đúng giờ tiêu chuẩn (Trước hoặc đúng 12:00 - Không phụ thu)' };
    } else if (totalMinutes <= 15 * 60) {
      // 12:01 - 15:00: Phụ thu 30%
      return { rate: 0.3, fee: Math.round(nightPrice * 0.3), label: 'Trả trễ 12:01 - 15:00 (Phụ thu 30% giá phòng)' };
    } else if (totalMinutes <= 18 * 60) {
      // 15:01 - 18:00: Phụ thu 50%
      return { rate: 0.5, fee: Math.round(nightPrice * 0.5), label: 'Trả trễ 15:01 - 18:00 (Phụ thu 50% giá phòng)' };
    } else {
      // Sau 18:00: Phụ thu 100%
      return { rate: 1.0, fee: nightPrice, label: 'Trả trễ sau 18:00 (Phụ thu 100% giá phòng nguyên đêm)' };
    }
  };

  const lateSurcharge = calcLateCheckoutSurcharge();

  // Validate Minibar: Mỗi món 0-50, không được âm
  const handleMinibarChange = (field: keyof typeof minibar, val: number) => {
    if (val < 0) {
      setMinibarError('Số lượng tiêu thụ minibar không thể là số âm (E2)!');
      return;
    }
    setMinibarError('');
    setMinibar((prev) => ({ ...prev, [field]: val }));
  };

  const handleDamageChange = (val: number) => {
    if (val < 0) {
      setDamageFeeError('Phí bồi thường hư hại tài sản không thể là số âm (E3)!');
      return;
    }
    setDamageFeeError('');
    setDamageFee(val);
  };

  // Tính tổng tiền Minibar
  const totalMinibar =
    minibar.water * MINIBAR_PRICES.water.price +
    minibar.softDrink * MINIBAR_PRICES.softDrink.price +
    minibar.beer * MINIBAR_PRICES.beer.price +
    minibar.snack * MINIBAR_PRICES.snack.price;

  // Tiền phòng còn thiếu
  const remainingRoomFee = currentBooking?.remainingAmount || 0;

  // Tiền cọc tài sản đã thu lúc Check-in
  const securityDepositRefundable = currentBooking?.securityDeposit || 500000;

  // Công thức quyết toán:
  // [Tổng thanh toán = Tiền phòng còn lại + Phụ thu trễ + Minibar + Bồi thường - Tiền cọc tài sản 500k]
  const finalBalance =
    remainingRoomFee + lateSurcharge.fee + totalMinibar + damageFee - securityDepositRefundable;

  const isFormValid = !minibarError && !damageFeeError;

  // Thực hiện Check-out
  const handleExecuteCheckout = () => {
    if (!selectedRoom || !currentBooking) return;

    // 1. Cập nhật booking sang Checked-out
    setBookings((prev) =>
      prev.map((b) =>
        b.id === currentBooking.id
          ? {
              ...b,
              status: 'Checked-out',
              actualCheckOutTime: checkoutTime,
              lateCheckOutFee: lateSurcharge.fee,
              minibarUsage: minibar,
              damageFee: damageFee,
              finalTotal: finalBalance,
            }
          : b
      )
    );

    // 2. Chuyển phòng sang CLEANING (Dirty) và giải phóng booking
    setRooms((prev) =>
      prev.map((r) =>
        r.id === selectedRoom.id
          ? {
              ...r,
              status: RoomStatus.CLEANING,
              currentBookingId: undefined,
            }
          : r
      )
    );

    setShowInvoiceModal(true);
  };

  return (
    <div className="flex-1 space-y-6 p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Xử lý Trả phòng &amp; Quyết toán Hóa đơn (Check-out - F4)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Khấu trừ tiền cọc, kiểm kê minibar, tính phụ thu giờ trả trễ và xuất hóa đơn tài chính VAT.
          </p>
        </div>

        {/* Thanh tìm kiếm nhanh */}
        <div className="relative w-full md:w-80">
          <Search className="size-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo số phòng, tên khách, PNR..."
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs outline-none focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cột trái (4 cột): Danh sách phòng đang lưu trú (Occupied) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Phòng đang có khách ({filteredRooms.length})
            </h3>
            <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              Occupied
            </span>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((r) => {
                const b = bookings.find((bk) => bk.id === r.currentBookingId);
                const isSelected = r.id === selectedRoomId;
                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedRoomId(r.id);
                      setMinibar({ water: 0, softDrink: 0, beer: 0, snack: 0 });
                      setDamageFee(0);
                    }}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-base font-black text-slate-900">
                        {r.id}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {r.type}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {b ? b.guestName : 'Khách lưu trú'}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>Mã: <strong className="font-mono">{b ? b.id : '---'}</strong></span>
                      <span>Kỳ: {b?.checkInDate} → {b?.checkOutDate}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                Không tìm thấy phòng Occupied phù hợp.
              </div>
            )}
          </div>
        </div>

        {/* Cột phải (8 cột): Chi tiết quyết toán */}
        {selectedRoom && currentBooking ? (
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Quyết toán phòng lưu trú
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  Phòng {selectedRoom.id} • {selectedRoom.type}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Khách hàng lưu trú:</span>
                <span className="font-bold text-slate-800 text-sm">{currentBooking.guestName}</span>
                <span className="text-xs text-slate-400 block font-mono">CCCD: {currentBooking.cccd}</span>
              </div>
            </div>

            {/* 1. Bộ chọn nhanh kiểm thử phụ thu trả trễ (BR_F4_01) */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Clock className="size-3.5" /> Chính sách phụ thu trả trễ (Late Check-out)
                </span>
                <span className="font-mono text-xs font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">
                  Giờ trả phòng: {checkoutTime}
                </span>
              </div>
              <p className="text-xs text-amber-800 mb-3">
                {lateSurcharge.label}: <strong>{formatVND(lateSurcharge.fee)}</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutTimeMode('realtime')}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                    checkoutTimeMode === 'realtime'
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  Giờ thực tế ({currentTimeStr})
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutTimeMode('ontime')}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                    checkoutTimeMode === 'ontime'
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  Trước 12:00 (0đ)
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutTimeMode('late30')}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                    checkoutTimeMode === 'late30'
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  12:01 - 15:00 (+30%)
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutTimeMode('late50')}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                    checkoutTimeMode === 'late50'
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  15:01 - 18:00 (+50%)
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutTimeMode('late100')}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                    checkoutTimeMode === 'late100'
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  Sau 18:00 (+100%)
                </button>
              </div>
            </div>

            {/* 2. Kiểm kê Minibar tiêu thụ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Coffee className="size-3.5" /> Kiểm kê Minibar phòng (0 - 50 món)
                </h4>
                <span className="text-xs font-bold text-slate-800">
                  Tổng Minibar: {formatVND(totalMinibar)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Nước suối */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <p className="text-xs font-bold text-slate-800">Nước suối</p>
                  <p className="text-[10px] text-slate-500 mb-2">20,000đ/chai</p>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={minibar.water}
                    onChange={(e) => handleMinibarChange('water', Number(e.target.value))}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold outline-none"
                  />
                </div>

                {/* Nước ngọt */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <p className="text-xs font-bold text-slate-800">Nước ngọt</p>
                  <p className="text-[10px] text-slate-500 mb-2">25,000đ/lon</p>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={minibar.softDrink}
                    onChange={(e) => handleMinibarChange('softDrink', Number(e.target.value))}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold outline-none"
                  />
                </div>

                {/* Bia */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <p className="text-xs font-bold text-slate-800">Bia lon</p>
                  <p className="text-[10px] text-slate-500 mb-2">35,000đ/lon</p>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={minibar.beer}
                    onChange={(e) => handleMinibarChange('beer', Number(e.target.value))}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold outline-none"
                  />
                </div>

                {/* Snack */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <p className="text-xs font-bold text-slate-800">Snack</p>
                  <p className="text-[10px] text-slate-500 mb-2">30,000đ/gói</p>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={minibar.snack}
                    onChange={(e) => handleMinibarChange('snack', Number(e.target.value))}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              {minibarError && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="size-3.5" /> {minibarError}
                </p>
              )}
            </div>

            {/* 3. Phí bồi thường hư hại tài sản */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldAlert className="size-3.5" /> Bồi thường hư hại tài sản (nếu có)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Số tiền bồi thường (VNĐ):</label>
                  <input
                    type="number"
                    min={0}
                    step={50000}
                    value={damageFee}
                    onChange={(e) => handleDamageChange(Number(e.target.value))}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold outline-none focus:border-blue-500"
                  />
                  {damageFeeError && (
                    <p className="text-xs text-red-600 font-medium mt-1">{damageFeeError}</p>
                  )}
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Ghi chú biên bản buồng phòng:</label>
                  <input
                    type="text"
                    value={damageReason}
                    onChange={(e) => setDamageReason(e.target.value)}
                    placeholder="VD: Làm vỡ cốc thủy tinh, rách khăn tắm..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 4. Bảng tính toán tổng quyết toán tài chính */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2.5 text-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-2">
                Bảng tính quyết toán thanh lý (Settle Bill):
              </h4>
              <div className="flex justify-between text-slate-600">
                <span>Tiền phòng còn thiếu (nếu mới cọc 50%):</span>
                <span className="font-semibold text-slate-800">{formatVND(remainingRoomFee)}</span>
              </div>
              {lateSurcharge.fee > 0 && (
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>Phụ thu trả phòng trễ ({checkoutTime}):</span>
                  <span>+{formatVND(lateSurcharge.fee)}</span>
                </div>
              )}
              {totalMinibar > 0 && (
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Chi phí tiêu thụ Minibar:</span>
                  <span>+{formatVND(totalMinibar)}</span>
                </div>
              )}
              {damageFee > 0 && (
                <div className="flex justify-between text-rose-700 font-medium">
                  <span>Phí đền bù hư hại tài sản:</span>
                  <span>+{formatVND(damageFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-blue-700 font-medium">
                <span>Khấu trừ tiền cọc tài sản đảm bảo:</span>
                <span>-{formatVND(securityDepositRefundable)}</span>
              </div>

              {/* Kết quả ròng */}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    {finalBalance >= 0 ? 'Số dư thu thêm từ khách (COLLECT):' : 'Hoàn trả cọc thừa cho khách (REFUND):'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {finalBalance >= 0 ? 'Khách hàng thanh toán thêm' : 'Lễ tân trả lại tiền mặt/chuyển khoản cho khách'}
                  </span>
                </div>
                <div className={`text-2xl font-black ${finalBalance >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatVND(Math.abs(finalBalance))}
                </div>
              </div>
            </div>

            {/* 5. Phương thức quyết toán số dư */}
            <div className="space-y-2 border-t pt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Hình thức quyết toán số dư:
              </label>
              <div className="flex flex-wrap gap-3">
                <label
                  onClick={() => setSettlementMethod('CASH')}
                  className={`flex items-center gap-2 cursor-pointer border rounded-lg px-4 py-2.5 text-xs font-semibold ${
                    settlementMethod === 'CASH'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="size-4" /> Tiền mặt
                </label>
                <label
                  onClick={() => setSettlementMethod('POS')}
                  className={`flex items-center gap-2 cursor-pointer border rounded-lg px-4 py-2.5 text-xs font-semibold ${
                    settlementMethod === 'POS'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="size-4" /> Quẹt thẻ POS
                </label>
                <label
                  onClick={() => setSettlementMethod('QR')}
                  className={`flex items-center gap-2 cursor-pointer border rounded-lg px-4 py-2.5 text-xs font-semibold ${
                    settlementMethod === 'QR'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="size-4" /> Chuyển khoản QR
                </label>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleExecuteCheckout}
                disabled={!isFormValid}
                className={`flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all ${
                  isFormValid
                    ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="size-5" /> Hoàn tất Check-out &amp; In hóa đơn VAT
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
            <p className="text-base font-bold text-slate-700">Chưa chọn phòng quyết toán</p>
            <p className="text-xs text-slate-400 mt-1">
              Vui lòng nhấp vào một phòng đang lưu trú (Occupied) ở cột bên trái để bắt đầu thanh lý.
            </p>
          </div>
        )}
      </div>

      {/* Modal Hóa đơn tài chính VAT (S1) */}
      {showInvoiceModal && selectedRoom && currentBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowInvoiceModal(false)} />
          <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl p-6">
            <div className="border-b pb-4 mb-4 text-center">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">
                KHÁCH SẠN HST HOTEL • PHIẾU THANH LÝ QUYẾT TOÁN
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">HÓA ĐƠN DỊCH VỤ LƯU TRÚ</h3>
              <p className="text-xs text-slate-400 mt-0.5">Số HĐ: HD-{Math.floor(100000 + Math.random() * 900000)} • Ngày: {new Date().toLocaleDateString('vi-VN')}</p>
            </div>

            <div className="space-y-3 text-xs border-b pb-4">
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <p>Khách hàng: <strong>{currentBooking.guestName}</strong></p>
                <p>Số CCCD: <strong className="font-mono">{currentBooking.cccd}</strong></p>
                <p>Mã đặt phòng: <strong className="font-mono">{currentBooking.id}</strong></p>
                <p>Phòng trả: <strong className="font-mono">{selectedRoom.id}</strong> ({selectedRoom.type})</p>
                <p>Giờ trả phòng: <strong>{checkoutTime}</strong></p>
                <p>Hình thức: <strong>{settlementMethod}</strong></p>
              </div>
            </div>

            {/* Chi tiết bảng kê */}
            <div className="py-4 border-b space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tiền phòng còn lại:</span>
                <span>{formatVND(remainingRoomFee)}</span>
              </div>
              {lateSurcharge.fee > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Phụ thu trả trễ:</span>
                  <span>+{formatVND(lateSurcharge.fee)}</span>
                </div>
              )}
              {totalMinibar > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Minibar tiêu thụ:</span>
                  <span>+{formatVND(totalMinibar)}</span>
                </div>
              )}
              {damageFee > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Bồi thường tài sản ({damageReason || 'Hư hại'}):</span>
                  <span>+{formatVND(damageFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Khấu trừ tiền cọc thiết bị:</span>
                <span>-{formatVND(securityDepositRefundable)}</span>
              </div>

              <div className="border-t pt-2 flex justify-between text-sm font-bold text-slate-900">
                <span>{finalBalance >= 0 ? 'Tổng thu thêm:' : 'Tổng hoàn cọc thừa:'}</span>
                <span className={finalBalance >= 0 ? 'text-rose-600' : 'text-emerald-600'}>
                  {formatVND(Math.abs(finalBalance))}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 text-xs flex items-center gap-2 mt-4">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span>
                Thủ tục hoàn tất! Phòng <strong>{selectedRoom.id}</strong> đã chuyển trạng thái sang <strong>Chờ dọn dẹp (Dirty)</strong>.
              </span>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Printer className="size-3.5" /> In hóa đơn
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInvoiceModal(false);
                  setSelectedRoomId(null);
                }}
                className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
