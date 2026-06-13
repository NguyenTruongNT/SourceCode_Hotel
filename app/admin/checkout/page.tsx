'use client';

import React, { useState } from 'react';
import { Search, Filter, Printer, CreditCard, Banknote, Edit3, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { useAdmin } from '@/app/admin/AdminProvider';
import { RoomStatus } from '@/app/admin/types';

export default function CheckoutPage() {
  const { rooms, setRooms, bookings, setBookings } = useAdmin();
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrintInvoice, setShowPrintInvoice] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  
  // Custom fee states
  const [feeName, setFeeName] = useState('');
  const [feeAmount, setFeeAmount] = useState('');

  // Derive occupied rooms from real data
  const occupiedRooms = rooms
    .filter(r => r.status === RoomStatus.OCCUPIED && r.currentBookingId)
    .map(r => {
      const b = bookings.find(bk => bk.id === r.currentBookingId);
      // Rough price estimation
      const basePrice = r.type === 'Standard' ? 800000 : r.type === 'Superior' ? 1200000 : r.type === 'Deluxe' ? 1800000 : 3500000;
      
      // Calculate days diff roughly
      let days = 1;
      if (b && b.checkInDate && b.checkOutDate) {
         try {
           const [d1, m1, y1] = b.checkInDate.split('/');
           const [d2, m2, y2] = b.checkOutDate.split('/');
           const t1 = new Date(Number(y1), Number(m1)-1, Number(d1)).getTime();
           const t2 = new Date(Number(y2), Number(m2)-1, Number(d2)).getTime();
           days = Math.max(1, Math.floor((t2 - t1) / (1000 * 3600 * 24)));
         } catch(e) {}
      }

      return {
        id: r.id,
        type: r.type,
        name: b ? b.guestName : 'Khách vãng lai',
        checkIn: b ? b.checkInDate : '-',
        checkout: b ? b.checkOutDate : '-',
        price: basePrice,
        days: days,
        bookingId: r.currentBookingId
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
    // Modify global state to check-out the room
    if (selectedRoom) {
      setRooms(prev => prev.map(r => {
        if (r.id === selectedRoom.id) {
          return { ...r, status: RoomStatus.CLEANING, currentBookingId: undefined };
        }
        return r;
      }));
      setBookings(prev => prev.map(b => {
        if (b.id === selectedRoom.bookingId) {
          return { ...b, roomNumber: undefined };
        }
        return b;
      }));
    }

    setCheckoutComplete(true);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Check-out</h2>
          <p className="text-sm text-slate-500 mt-1">Chọn phòng đang có khách để tiến hành thanh toán và trả phòng.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm theo số phòng..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-700">
            <Filter className="h-4 w-4" /> Lọc phòng
          </button>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {occupiedRooms.map((room) => (
          <div key={room.id} className="bg-white border-2 border-rose-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl font-black text-rose-600">{room.id}</span>
              <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded">Đang ở</span>
            </div>
            <div className="space-y-2 mb-6">
              <p className="text-sm text-slate-600"><span className="font-semibold">Khách:</span> {room.name}</p>
              <p className="text-xs text-slate-500">Vào: {room.checkIn}</p>
              <p className="text-xs text-slate-500">Ra (dự kiến): {room.checkout}</p>
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

      {/* Checkout Modal Overlay */}
      {selectedRoom && !checkoutComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedRoom(null)}></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">
                Thủ tục Check-out - Phòng {selectedRoom.id}
              </h3>
              <button onClick={() => setSelectedRoom(null)} className="text-slate-400 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6 bg-slate-50">
              
              {/* Left Column: Info & Fees */}
              <div className="flex-[2] space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Thông tin lưu trú</h4>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <p><span className="text-slate-500">Khách hàng:</span> <span className="font-semibold text-slate-800">{selectedRoom.name}</span></p>
                    <p><span className="text-slate-500">Loại phòng:</span> <span className="font-semibold text-slate-800">{selectedRoom.type}</span></p>
                    <p><span className="text-slate-500">Nhận phòng:</span> <span className="font-semibold text-slate-800">{selectedRoom.checkIn}</span></p>
                    <p><span className="text-slate-500">Trả phòng:</span> <span className="font-semibold text-slate-800">{selectedRoom.checkout}</span></p>
                    <p className="col-span-2 text-rose-600 font-semibold mt-2">Đã quá giờ trả phòng 120 phút (Phụ phí tự động tính)</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-slate-800">Dịch vụ & Phụ phí</h4>
                    {!showFeeForm && (
                      <button 
                        onClick={() => setShowFeeForm(true)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="h-4 w-4" /> Thêm phí
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Nước suối x2</span>
                      <span className="font-medium text-slate-800">40.000đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Giặt ủi</span>
                      <span className="font-medium text-slate-800">150.000đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-rose-600 font-medium">Phụ thu trả phòng trễ</span>
                      <span className="font-bold text-rose-600">300.000đ</span>
                    </div>
                  </div>

                  {showFeeForm && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4 animate-in slide-in-from-top-2">
                      <h5 className="text-sm font-semibold text-slate-700 mb-3">Thêm khoản phí mới</h5>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input 
                          type="text" 
                          placeholder="Tên dịch vụ/phí..." 
                          value={feeName}
                          onChange={(e) => setFeeName(e.target.value)}
                          className="border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                        <input 
                          type="text" 
                          placeholder="Số tiền..." 
                          value={feeAmount}
                          onChange={(e) => setFeeAmount(e.target.value.replace(/[^0-9]/g, ''))}
                          className="border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setShowFeeForm(false)} className="text-slate-500 hover:text-slate-700 text-xs font-semibold px-3 py-1.5 rounded">Hủy</button>
                        <button onClick={() => setShowFeeForm(false)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded shadow">Thêm vào hóa đơn</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Total & Payment */}
              <div className="flex-1 flex flex-col">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col">
                  <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Chi tiết thanh toán</h4>
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Tiền phòng ({selectedRoom.days} đêm)</span>
                      <span className="font-semibold text-slate-800">{(selectedRoom.price * selectedRoom.days).toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Dịch vụ & Phụ phí</span>
                      <span className="font-semibold text-slate-800">490.000đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-600">Đã cọc trước</span>
                      <span className="font-semibold text-emerald-600">-1.000.000đ</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-end mb-6">
                      <span className="font-bold text-slate-700 text-lg">Cần thanh toán</span>
                      <span className="text-3xl font-black text-blue-600">
                        {((selectedRoom.price * selectedRoom.days) + 490000 - 1000000).toLocaleString('vi-VN')}đ
                      </span>
                    </div>

                    {!showInvoice ? (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phương thức thanh toán</p>
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => setPaymentMethod('card')}
                            className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-colors ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                            <CreditCard className="h-6 w-6 mb-1" />
                            <span className="text-xs font-bold">Thẻ tín dụng / CK</span>
                          </button>
                          <button 
                            onClick={() => setPaymentMethod('cash')}
                            className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-colors ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                            <Banknote className="h-6 w-6 mb-1" />
                            <span className="text-xs font-bold">Tiền mặt</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => setShowInvoice(true)}
                          className="w-full mt-4 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
                        >
                          <Printer className="h-5 w-5" /> Xem trước hóa đơn
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-yellow-800 mb-4 flex gap-2">
                          <AlertCircle className="h-5 w-5 shrink-0" />
                          <p>Hóa đơn đã được tạo tạm thời. Xác nhận thanh toán để hoàn tất quá trình Check-out.</p>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                          <button 
                            onClick={() => setShowInvoice(false)}
                            className="px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm"
                          >
                            Quay lại
                          </button>
                          <button 
                            onClick={handleCompletePayment}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm flex items-center gap-2"
                          >
                            <CheckCircle2 className="h-5 w-5" /> Hoàn tất thanh toán
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
      )}

      {/* Success Animation overlay */}
      {checkoutComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center animate-in zoom-in-50 duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Check-out thành công!</h3>
            <p className="text-slate-500 text-center mb-6">Phòng {selectedRoom?.id} đã được chuyển sang trạng thái chờ dọn dẹp.<br/>Hóa đơn đã được gửi qua email cho khách hàng.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setCheckoutComplete(false);
                  setSelectedRoom(null);
                }}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-sm"
              >
                Đóng
              </button>
              <button 
                onClick={() => setShowPrintInvoice(true)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors text-sm shadow-md"
              >
                <Printer className="h-4 w-4" /> Xuất hóa đơn (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {showPrintInvoice && selectedRoom && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto print:p-0 p-8">
          <div className="max-w-3xl mx-auto bg-white print:shadow-none shadow-2xl border border-slate-200 print:border-none p-10 rounded-xl relative">
            <button 
              onClick={() => setShowPrintInvoice(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 p-2 rounded-full print:hidden"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
              <div>
                <h1 className="text-3xl font-black tracking-widest text-slate-900">THAD<span className="text-blue-600 font-medium tracking-normal">HOTEL</span></h1>
                <p className="text-sm text-slate-500 mt-1">123 Đường Ven Biển, Quận Sơn Trà, Đà Nẵng</p>
                <p className="text-sm text-slate-500">Tel: 0236 3838 888 | Email: contact@thadhotel.vn</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-widest">Hóa đơn</h2>
                <p className="text-sm text-slate-500 mt-1">Số: <span className="font-semibold text-slate-800">INV-{new Date().getTime().toString().slice(-6)}</span></p>
                <p className="text-sm text-slate-500">Ngày: <span className="font-semibold text-slate-800">{new Date().toLocaleDateString('vi-VN')}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Khách hàng</h3>
                <p className="text-lg font-bold text-slate-800">{selectedRoom.name}</p>
              </div>
              <div className="text-right">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thông tin phòng</h3>
                <p className="font-semibold text-slate-800">Phòng {selectedRoom.id} ({selectedRoom.type})</p>
                <p className="text-sm text-slate-600">{selectedRoom.checkIn} - {selectedRoom.checkout}</p>
                <p className="text-sm text-slate-600">{selectedRoom.days} đêm</p>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-sm">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-lg rounded-bl-lg">Hạng mục</th>
                  <th className="text-center py-3 px-4 font-semibold">Đơn giá</th>
                  <th className="text-center py-3 px-4 font-semibold">SL</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-lg rounded-br-lg">Thành tiền</th>
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
                  <td className="py-4 px-4 text-right font-medium text-rose-600">300.000đ</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end mb-12">
              <div className="w-80 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cộng tiền dịch vụ</span>
                  <span className="font-semibold text-slate-800">{((selectedRoom.price * selectedRoom.days) + 490000).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Trừ tiền cọc (Deposit)</span>
                  <span className="font-semibold">-1.000.000đ</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-slate-800 text-lg">
                  <span className="font-bold text-slate-800">Tổng thanh toán</span>
                  <span className="font-black text-blue-600">{((selectedRoom.price * selectedRoom.days) + 490000 - 1000000).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-slate-500 pt-1 text-xs">
                  <span>Phương thức:</span>
                  <span className="font-semibold uppercase">{paymentMethod === 'card' ? 'Thẻ / Chuyển khoản' : 'Tiền mặt'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-center pt-8">
              <div>
                <p className="font-bold text-slate-800 mb-16">Khách hàng</p>
                <p className="text-slate-500 italic">(Ký, ghi rõ họ tên)</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 mb-16">Nhân viên Lễ tân</p>
                <p className="text-slate-500 italic">(Ký, ghi rõ họ tên)</p>
              </div>
            </div>
            
            <div className="mt-12 text-center text-xs text-slate-400 border-t border-slate-100 pt-6">
              Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của THAD HOTEL!
            </div>
          </div>
          
          <div className="fixed bottom-8 right-8 flex gap-4 print:hidden">
            <button 
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-2xl flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Printer className="h-5 w-5" /> In hóa đơn ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
