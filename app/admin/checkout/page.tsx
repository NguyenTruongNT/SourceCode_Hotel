'use client';

import React, { useState } from 'react';
import { Search, Filter, Printer, CreditCard, Banknote, Edit3, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { useAdmin } from '@/app/admin/AdminProvider';
import { RoomStatus } from '@/app/admin/types';
import Image from 'next/image';

export default function CheckoutPage() {
  const { rooms, setRooms, bookings, setBookings } = useAdmin();
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrintInvoice, setShowPrintInvoice] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [feeName, setFeeName] = useState('');
  const [feeAmount, setFeeAmount] = useState('');

  const occupiedRooms = rooms
    .filter(r => r.status === RoomStatus.OCCUPIED && r.currentBookingId)
    .map(r => {
      const b = bookings.find(bk => bk.id === r.currentBookingId);
      const basePrice = r.type === 'Standard' ? 800000 : r.type === 'Superior' ? 1200000 : r.type === 'Deluxe' ? 1800000 : 3500000;
      let days = 1;
      if (b?.checkInDate && b?.checkOutDate) {
        try {
          const [d1, m1, y1] = b.checkInDate.split('/');
          const [d2, m2, y2] = b.checkOutDate.split('/');
          const t1 = new Date(Number(y1), Number(m1) - 1, Number(d1)).getTime();
          const t2 = new Date(Number(y2), Number(m2) - 1, Number(d2)).getTime();
          days = Math.max(1, Math.floor((t2 - t1) / (1000 * 3600 * 24)));
        } catch { }
      }
      return {
        id: r.id,
        type: r.type,
        name: b ? b.guestName : 'Khách vãng lai',
        checkIn: b ? b.checkInDate : '-',
        checkout: b ? b.checkOutDate : '-',
        price: basePrice,
        days,
        bookingId: r.currentBookingId,
      };
    })
    .filter(r => r.id.includes(searchQuery));

  const handleCheckoutClick = (room: any) => {
    setSelectedRoom(room);
    setShowFeeForm(false);
    setShowInvoice(false);
    setCheckoutComplete(false);
  };

  const handleCompletePayment = () => {
    if (selectedRoom) {
      setRooms(prev => prev.map(r =>
        r.id === selectedRoom.id
          ? { ...r, status: RoomStatus.CLEANING, currentBookingId: undefined }
          : r
      ));
      setBookings(prev => prev.map(b =>
        b.id === selectedRoom.bookingId ? { ...b, roomNumber: undefined } : b
      ));
    }
    setCheckoutComplete(true);
  };

  const totalAmount = selectedRoom
    ? (selectedRoom.price * selectedRoom.days) + 490000 - 1000000
    : 0;

  // Mở popup in riêng — chỉ gọi khi nhấn nút "In hóa đơn"
  const handlePrint = () => {
    const el = document.getElementById('invoice-print');
    if (!el) return;

    const win = window.open('', '_blank', 'width=860,height=750');
    if (!win) {
      alert('Trình duyệt đã chặn popup. Vui lòng cho phép popup để in hóa đơn.');
      return;
    }

    win.document.write(`
      <!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="UTF-8" />
          <title>Hóa đơn</title>
          <style>
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; background: #fff; color: #1e293b; }
            img { max-width: 100%; height: auto; display: block; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px 14px; }
            .divide-y tr + tr td { border-top: 1px solid #f1f5f9; }
            .bg-slate-100 { background: #f1f5f9; }
            .text-rose-600 { color: #e11d48; }
            .text-emerald-600 { color: #059669; }
            .text-blue-600 { color: #2563eb; }
            .text-slate-400 { color: #94a3b8; }
            .text-slate-500 { color: #64748b; }
            .text-slate-600 { color: #475569; }
            .text-slate-800 { color: #1e293b; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .font-black { font-weight: 900; }
            .italic { font-style: italic; }
            .text-xs { font-size: 11px; }
            .text-sm { font-size: 13px; }
            .text-lg { font-size: 17px; }
            .text-xl { font-size: 19px; }
            .text-2xl { font-size: 22px; }
            .uppercase { text-transform: uppercase; }
            .tracking-widest { letter-spacing: 4px; }
            .tracking-wider { letter-spacing: 1px; }
            .border-b-2 { border-bottom: 2px solid #1e293b; }
            .border-t-2 { border-top: 2px solid #1e293b; }
            .border-t { border-top: 1px solid #e2e8f0; }
            .pb-6 { padding-bottom: 24px; }
            .mb-8 { margin-bottom: 32px; }
            .mb-3 { margin-bottom: 12px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-12 { margin-bottom: 48px; }
            .mb-16 { margin-bottom: 64px; }
            .mt-1 { margin-top: 4px; }
            .mt-10 { margin-top: 40px; }
            .pt-3 { padding-top: 12px; }
            .pt-5 { padding-top: 20px; }
            .pt-8 { padding-top: 32px; }
            .py-3 { padding-top: 12px; padding-bottom: 12px; }
            .py-4 { padding-top: 16px; padding-bottom: 16px; }
            .px-4 { padding-left: 16px; padding-right: 16px; }
            .p-10 { padding: 40px; }
            .w-72 { width: 288px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .text-left { text-align: left; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .justify-end { justify-content: flex-end; }
            .items-center { align-items: center; }
            .items-start { align-items: flex-start; }
            .grid-cols-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
            .space-y-3 > * + * { margin-top: 12px; }
          </style>
        </head>
        <body>
          ${el.innerHTML}
          <script>window.onload = function(){ window.print(); };<\/script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Check-out</h2>
          <p className="text-sm text-slate-500 mt-1">Chọn phòng đang có khách để tiến hành thanh toán và trả phòng.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo số phòng..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-700">
            <Filter className="h-4 w-4" /> Lọc phòng
          </button>
        </div>
      </div>

      {/* Room Grid */}
      {occupiedRooms.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <p className="font-medium">Không có phòng nào cần check-out</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {occupiedRooms.map(room => (
            <div key={room.id} className="bg-white border-2 border-rose-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl font-black text-rose-600">{room.id}</span>
                <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">Đang ở</span>
              </div>
              <div className="space-y-1.5 mb-5 text-sm">
                <p className="text-slate-700"><span className="text-slate-400">Khách:</span> <span className="font-semibold">{room.name}</span></p>
                <p className="text-slate-500">Vào: {room.checkIn}</p>
                <p className="text-slate-500">Ra (dự kiến): {room.checkout}</p>
              </div>
              <button
                onClick={() => handleCheckoutClick(room)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-sm"
              >
                Tiến hành Check-out
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Checkout Modal */}
      {selectedRoom && !checkoutComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedRoom(null)} />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
              <h3 className="text-lg font-bold text-slate-800">
                Thủ tục Check-out — Phòng <span className="text-blue-600">{selectedRoom.id}</span>
              </h3>
              <button onClick={() => setSelectedRoom(null)} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <div className="flex flex-col md:flex-row gap-6">

                {/* Left: Info + Fees */}
                <div className="flex-[3] space-y-5">

                  {/* Thông tin lưu trú */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 text-sm uppercase tracking-wide">Thông tin lưu trú</h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs mb-0.5">Khách hàng</p>
                        <p className="font-semibold text-slate-800">{selectedRoom.name}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-0.5">Loại phòng</p>
                        <p className="font-semibold text-slate-800">{selectedRoom.type}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-0.5">Nhận phòng</p>
                        <p className="font-semibold text-slate-800">{selectedRoom.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-0.5">Trả phòng</p>
                        <p className="font-semibold text-slate-800">{selectedRoom.checkout}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 text-sm text-rose-600">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>Đã quá giờ trả phòng 120 phút — phụ phí tự động tính</span>
                    </div>
                  </div>

                  {/* Dịch vụ & Phụ phí */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                      <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Dịch vụ & Phụ phí</h4>
                      {!showFeeForm && (
                        <button
                          onClick={() => setShowFeeForm(true)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Thêm phí
                        </button>
                      )}
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Nước suối x2</span>
                        <span className="font-medium text-slate-800">40.000đ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Giặt ủi</span>
                        <span className="font-medium text-slate-800">150.000đ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-rose-600 font-medium">Phụ thu trả phòng trễ</span>
                        <span className="font-bold text-rose-600">300.000đ</span>
                      </div>
                    </div>

                    {showFeeForm && (
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4 animate-in slide-in-from-top-2">
                        <p className="text-sm font-semibold text-slate-700 mb-3">Thêm khoản phí mới</p>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <input
                            type="text"
                            placeholder="Tên dịch vụ / phí..."
                            value={feeName}
                            onChange={e => setFeeName(e.target.value)}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Số tiền (đ)..."
                            value={feeAmount}
                            onChange={e => setFeeAmount(e.target.value.replace(/[^0-9]/g, ''))}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setShowFeeForm(false)} className="text-slate-500 hover:text-slate-700 text-sm font-medium px-3 py-1.5 rounded-lg">Hủy</button>
                          <button onClick={() => setShowFeeForm(false)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg shadow">Thêm vào hóa đơn</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Payment */}
                <div className="flex-[2]">
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-full flex flex-col">
                    <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 text-sm uppercase tracking-wide">Chi tiết thanh toán</h4>

                    <div className="space-y-3 text-sm flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Tiền phòng ({selectedRoom.days} đêm)</span>
                        <span className="font-semibold text-slate-800">{(selectedRoom.price * selectedRoom.days).toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Dịch vụ & Phụ phí</span>
                        <span className="font-semibold text-slate-800">490.000đ</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-600">Đã cọc trước</span>
                        <span className="font-semibold text-emerald-600">-1.000.000đ</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="mt-5 pt-4 border-t border-slate-200">
                      <div className="flex justify-between items-center mb-5">
                        <span className="font-bold text-slate-700">Cần thanh toán</span>
                        <span className="text-2xl font-black text-blue-600 whitespace-nowrap">
                          {totalAmount.toLocaleString('vi-VN')}đ
                        </span>
                      </div>

                      {!showInvoice ? (
                        <div className="space-y-3">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phương thức thanh toán</p>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setPaymentMethod('card')}
                              className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-colors text-sm ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                            >
                              <CreditCard className="h-5 w-5 mb-1" />
                              <span className="text-xs font-bold">Thẻ / CK</span>
                            </button>
                            <button
                              onClick={() => setPaymentMethod('cash')}
                              className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-colors text-sm ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                            >
                              <Banknote className="h-5 w-5 mb-1" />
                              <span className="text-xs font-bold">Tiền mặt</span>
                            </button>
                          </div>
                          <button
                            onClick={() => setShowInvoice(true)}
                            className="w-full mt-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow"
                          >
                            <Printer className="h-4 w-4" /> Xem trước hóa đơn
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex gap-2 text-amber-800 text-sm">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>Xác nhận thanh toán để hoàn tất Check-out.</p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setShowInvoice(false)}
                              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm"
                            >
                              Quay lại
                            </button>
                            <button
                              onClick={handleCompletePayment}
                              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 className="h-4 w-4" /> Hoàn tất
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {checkoutComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center animate-in zoom-in-95 duration-300 shadow-2xl max-w-sm w-full mx-4">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-5">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Check-out thành công!</h3>
            <p className="text-slate-500 text-center text-sm mb-6">
              Phòng <span className="font-semibold text-slate-700">{selectedRoom?.id}</span> đã chuyển sang chờ dọn dẹp.<br />
              Hóa đơn đã gửi qua email cho khách.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => { setCheckoutComplete(false); setSelectedRoom(null); }}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm"
              >
                Đóng
              </button>
              <button
                onClick={() => setShowPrintInvoice(true)}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shadow"
              >
                <Printer className="h-4 w-4" /> Xuất PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice — xem bản in, giữ nguyên logic gốc */}
      {showPrintInvoice && selectedRoom && (
        <div className="fixed inset-0 z-[100] bg-slate-100 overflow-y-auto p-8">
          {/* id="invoice-print" bọc đúng nội dung cần in */}
          <div
            id="invoice-print"
            className="max-w-3xl mx-auto bg-white shadow-2xl border border-slate-200 p-10 rounded-xl relative"
          >

            <button
              onClick={() => setShowPrintInvoice(false)}
              className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 p-2 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
              <div>
                <Image
                  src="/images/logo.png"
                  alt="Thad Hotel Logo"
                  width={250}
                  height={80}
                  style={{ width: 'auto', height: '80px' }}
                  className="object-contain mb-3"
                  priority
                />
                <p className="text-sm text-slate-500">123 Đường Du Lịch, Quận 1, TP. Hồ Chí Minh</p>
                <p className="text-sm text-slate-500">Tel: 0236 3838 888 | contact@thadhotel.vn</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-widest">Hóa đơn</h2>
                <p className="text-sm text-slate-500 mt-1">Số: <span className="font-semibold text-slate-800">INV-{new Date().getTime().toString().slice(-6)}</span></p>
                <p className="text-sm text-slate-500">Ngày: <span className="font-semibold text-slate-800">{new Date().toLocaleDateString('vi-VN')}</span></p>
              </div>
            </div>

            {/* Guest & Room Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Khách hàng</p>
                <p className="text-lg font-bold text-slate-800">{selectedRoom.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thông tin phòng</p>
                <p className="font-semibold text-slate-800">Phòng {selectedRoom.id} ({selectedRoom.type})</p>
                <p className="text-sm text-slate-600">{selectedRoom.checkIn} → {selectedRoom.checkout}</p>
                <p className="text-sm text-slate-600">{selectedRoom.days} đêm</p>
              </div>
            </div>

            {/* Invoice Table */}
            <table className="w-full mb-8 text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-600">
                  <th className="text-left py-3 px-4 font-semibold rounded-l-lg">Hạng mục</th>
                  <th className="text-center py-3 px-4 font-semibold">Đơn giá</th>
                  <th className="text-center py-3 px-4 font-semibold">SL</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-r-lg">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4 px-4">Tiền phòng ({selectedRoom.type})</td>
                  <td className="py-4 px-4 text-center">{selectedRoom.price.toLocaleString('vi-VN')}đ</td>
                  <td className="py-4 px-4 text-center">{selectedRoom.days}</td>
                  <td className="py-4 px-4 text-right font-medium text-slate-800">{(selectedRoom.price * selectedRoom.days).toLocaleString('vi-VN')}đ</td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Nước suối x2</td>
                  <td className="py-4 px-4 text-center">20.000đ</td>
                  <td className="py-4 px-4 text-center">2</td>
                  <td className="py-4 px-4 text-right font-medium text-slate-800">40.000đ</td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Giặt ủi</td>
                  <td className="py-4 px-4 text-center">150.000đ</td>
                  <td className="py-4 px-4 text-center">1</td>
                  <td className="py-4 px-4 text-right font-medium text-slate-800">150.000đ</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-rose-600">Phụ thu trả phòng trễ</td>
                  <td className="py-4 px-4 text-center">300.000đ</td>
                  <td className="py-4 px-4 text-center">1</td>
                  <td className="py-4 px-4 text-right font-bold text-rose-600">300.000đ</td>
                </tr>
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-72 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cộng tiền dịch vụ</span>
                  <span className="font-semibold text-slate-800">{((selectedRoom.price * selectedRoom.days) + 490000).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Trừ tiền cọc (Deposit)</span>
                  <span className="font-semibold">-1.000.000đ</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-slate-800">
                  <span className="font-bold text-slate-800 text-base">Tổng thanh toán</span>
                  <span className="font-black text-blue-600 text-xl">{totalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-slate-400 text-xs pt-1">
                  <span>Phương thức:</span>
                  <span className="font-semibold uppercase">{paymentMethod === 'card' ? 'Thẻ / Chuyển khoản' : 'Tiền mặt'}</span>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="flex justify-between text-center text-sm border-t border-slate-100 pt-8">
              <div>
                <p className="font-bold text-slate-800 mb-16">Khách hàng</p>
                <p className="text-slate-400 italic">(Ký, ghi rõ họ tên)</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 mb-16">Nhân viên Lễ tân</p>
                <p className="text-slate-400 italic">(Ký, ghi rõ họ tên)</p>
              </div>
            </div>

            <div className="mt-10 text-center text-xs text-slate-400 border-t border-slate-100 pt-5">
              Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của THAD HOTEL!
            </div>
          </div>

          {/* Nút in — mở popup riêng thay vì window.print() trực tiếp */}
          <div className="fixed bottom-8 right-8">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <Printer className="h-5 w-5" /> In hóa đơn
            </button>
          </div>
        </div>
      )}

    </div>
  );
}