import React from 'react';
import { Search, Plus, X, UploadCloud, Calendar, ToggleLeft, AlertCircle, CheckCircle, Tag } from 'lucide-react';
import Image from 'next/image';

export default function FigmaExportPage() {
  return (
    <div className="bg-[#e2e8f0] p-10 space-y-20 font-sans min-h-screen">
      <h1 className="text-3xl font-black text-slate-800 text-center uppercase tracking-widest mb-10">
        Figma Export - Code Gốc 100%
      </h1>

      {/* 1. Admin Dashboard (Empty) */}
      <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 overflow-hidden">
        <h2 className="text-lg font-bold bg-slate-800 text-white px-4 py-2 rounded-lg inline-block mb-6">1. Admin List (Empty)</h2>
        <div className="p-8 space-y-6 relative flex flex-col bg-[#f8fafc] rounded-2xl border border-slate-200 h-[600px]">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="text" placeholder="Tìm kiếm sự kiện, ưu đãi..." className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-72 focus:outline-none" />
                    </div>
                    <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-700 outline-none"><option>Tất cả phân loại</option></select>
                </div>
                <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm"><Plus className="h-4 w-4" /> Soạn bài viết mới</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
                <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider"><th className="p-4 font-semibold">Mã</th><th className="p-4 font-semibold">Tiêu đề bài viết</th><th className="p-4 font-semibold">Phân loại</th><th className="p-4 font-semibold">Trạng thái</th><th className="p-4 font-semibold">Lượt xem</th><th className="p-4 font-semibold text-center">Thao tác</th></tr></thead>
                    <tbody><tr><td colSpan={6} className="p-12 text-center text-slate-500"><div className="flex flex-col items-center justify-center"><Search className="h-10 w-10 text-slate-300 mb-3" /><p className="font-semibold text-slate-600">Không tìm thấy bài viết nào</p><p className="text-sm">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p></div></td></tr></tbody>
                </table>
            </div>
        </div>
      </section>

      {/* 2. Admin Dashboard (Data) */}
      <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 overflow-hidden">
        <h2 className="text-lg font-bold bg-slate-800 text-white px-4 py-2 rounded-lg inline-block mb-6">2. Admin List (Có Dữ liệu)</h2>
        <div className="p-8 space-y-6 relative flex flex-col bg-[#f8fafc] rounded-2xl border border-slate-200 h-[600px]">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex gap-4">
                    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type="text" placeholder="Tìm kiếm sự kiện, ưu đãi..." className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-72 focus:outline-none" /></div>
                    <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-700 outline-none"><option>Tất cả phân loại</option></select>
                </div>
                <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm"><Plus className="h-4 w-4" /> Soạn bài viết mới</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
                <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider"><th className="p-4 font-semibold">Mã</th><th className="p-4 font-semibold">Tiêu đề bài viết</th><th className="p-4 font-semibold">Phân loại</th><th className="p-4 font-semibold">Trạng thái</th><th className="p-4 font-semibold">Lượt xem</th><th className="p-4 font-semibold text-center">Thao tác</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50"><td className="p-4 font-bold text-slate-800 text-sm">EV-001</td><td className="p-4 text-slate-800 text-sm font-semibold max-w-[200px] truncate">Sự kiện: Summer Wedding</td><td className="p-4 text-slate-600 text-sm">Sự kiện</td><td className="p-4"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Đang hoạt động</span></td><td className="p-4 text-slate-600 text-sm">1250</td><td className="p-4 text-center"><div className="flex gap-2 justify-center"><button className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-semibold text-slate-600">Sửa</button><button className="px-3 py-1.5 border border-red-200 rounded-md text-xs font-semibold text-red-600">Xóa</button></div></td></tr>
                        <tr className="hover:bg-slate-50/50"><td className="p-4 font-bold text-slate-800 text-sm">EV-002</td><td className="p-4 text-slate-800 text-sm font-semibold max-w-[200px] truncate">Ưu đãi: Giảm ngay 20%</td><td className="p-4 text-slate-600 text-sm">Ưu đãi</td><td className="p-4"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Đã lên lịch</span></td><td className="p-4 text-slate-600 text-sm">3420</td><td className="p-4 text-center"><div className="flex gap-2 justify-center"><button className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-semibold text-slate-600">Sửa</button><button className="px-3 py-1.5 border border-red-200 rounded-md text-xs font-semibold text-red-600">Xóa</button></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
      </section>

      {/* 3. Admin Add Modal (Blank) */}
      <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 overflow-hidden">
        <h2 className="text-lg font-bold bg-slate-800 text-white px-4 py-2 rounded-lg inline-block mb-6">3. Admin Modal (Blank)</h2>
        <div className="relative p-8 min-h-[850px] bg-[#f8fafc] rounded-2xl flex justify-center items-center overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-10 rounded-2xl"></div>
            <div className="relative z-20 w-[900px] max-w-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-white"><h2 className="text-xl font-bold text-slate-800">Soạn bài viết mới</h2><button className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><X className="h-5 w-5" /></button></div>
                <div className="flex-1 p-6 grid grid-cols-[1fr_300px] gap-8 bg-slate-50">
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Tiêu đề bài viết <span className="text-red-500">*</span></label><input type="text" placeholder="Nhập tiêu đề..." className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none" /></div>
                            <div className="space-y-1.5"><div className="flex justify-between items-center"><label className="text-sm font-semibold text-slate-700">Mô tả ngắn</label><span className="text-xs text-slate-400">0/150</span></div><textarea rows={3} placeholder="Tóm tắt nội dung chính..." className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none resize-none" /></div>
                            <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Thời gian bắt đầu <span className="text-red-500">*</span></label><input type="datetime-local" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none" /></div><div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Thời gian kết thúc <span className="text-red-500">*</span></label><input type="datetime-local" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none" /></div></div>
                            <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Sức chứa tối đa (người) <span className="text-red-500">*</span></label><input type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none" /></div></div>
                            <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Ảnh bìa (Tối đa 5MB)</label><div className="relative border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-8 text-center"><UploadCloud className="h-10 w-10 mx-auto mb-3 text-slate-400" /><p className="text-sm text-slate-600">Kéo thả ảnh vào đây hoặc <span className="text-blue-600 font-semibold underline">Duyệt file</span></p></div></div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Cấu hình xuất bản</h3>
                            <div className="space-y-2"><label className="text-sm font-semibold text-slate-700">Phân loại</label><select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"><option>Sự kiện</option><option>Ưu đãi</option></select></div>
                            <div className="pt-3 border-t border-slate-100"><div className="flex items-center justify-between"><label className="text-sm font-semibold text-slate-700">Lên lịch tự động</label><ToggleLeft className="h-6 w-6 text-slate-300" /></div></div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0"><button className="px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg text-sm">Hủy bỏ</button><button className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm text-sm">Xuất bản ngay</button></div>
            </div>
        </div>
      </section>

      {/* 4. Admin Add Modal (Error & Promo mode) */}
      <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 overflow-hidden">
        <h2 className="text-lg font-bold bg-slate-800 text-white px-4 py-2 rounded-lg inline-block mb-6">4. Admin Modal (Error Validation & Ưu đãi Mode)</h2>
        <div className="relative p-8 min-h-[850px] bg-[#f8fafc] rounded-2xl flex justify-center items-center overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-10 rounded-2xl"></div>
            <div className="relative z-20 w-[900px] max-w-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-white"><h2 className="text-xl font-bold text-slate-800">Soạn bài viết mới</h2><button className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><X className="h-5 w-5" /></button></div>
                <div className="flex-1 p-6 grid grid-cols-[1fr_300px] gap-8 bg-slate-50">
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Tiêu đề bài viết <span className="text-red-500">*</span></label><input type="text" className="w-full px-4 py-2.5 border border-red-500 bg-red-50 rounded-lg text-sm outline-none" /><p className="text-xs text-red-500 font-medium">Vui lòng nhập tiêu đề bài viết.</p></div>
                            <div className="space-y-1.5"><div className="flex justify-between items-center"><label className="text-sm font-semibold text-slate-700">Mô tả ngắn</label><span className="text-xs text-slate-400">0/150</span></div><textarea rows={3} className="w-full px-4 py-2.5 border border-red-500 bg-red-50 rounded-lg text-sm outline-none resize-none" /><p className="text-xs text-red-500 font-medium">Vui lòng nhập mô tả ngắn.</p></div>
                            <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Thời gian bắt đầu <span className="text-red-500">*</span></label><input type="datetime-local" className="w-full px-4 py-2 border border-red-500 bg-red-50 rounded-lg text-sm outline-none" /><p className="text-xs text-red-500 font-medium">Vui lòng nhập thời gian bắt đầu.</p></div><div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Thời gian kết thúc <span className="text-red-500">*</span></label><input type="datetime-local" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none" /></div></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Sức chứa tối đa (người) <span className="text-red-500">*</span></label><input type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none" /></div>
                                <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Ưu đãi (%) <span className="text-red-500">*</span></label><input type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none" /></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Cấu hình xuất bản</h3>
                            <div className="space-y-2"><label className="text-sm font-semibold text-slate-700">Phân loại</label><select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"><option>Ưu đãi</option></select></div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0"><button className="px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg text-sm">Hủy bỏ</button><button className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm text-sm opacity-50">Xuất bản ngay</button></div>
            </div>
        </div>
      </section>

      {/* 5. Admin Popups */}
      <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 overflow-hidden">
        <h2 className="text-lg font-bold bg-slate-800 text-white px-4 py-2 rounded-lg inline-block mb-6">5. Admin Popups & Toasts</h2>
        <div className="relative p-8 h-[500px] bg-[#f8fafc] rounded-2xl flex justify-center items-center overflow-hidden border border-slate-200">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-10 rounded-2xl"></div>
            
            {/* Confirm Popup */}
            <div className="relative z-20 bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận xóa?</h3>
                <p className="text-sm text-slate-500 mb-6">Bạn chắc chắn muốn xóa bài viết <strong>Sự kiện: Summer Wedding</strong>?</p>
                <div className="flex gap-3 justify-end">
                  <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-semibold hover:bg-slate-200">Hủy</button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 shadow-sm">Xác nhận xóa</button>
                </div>
            </div>

            {/* Toasts overlayed randomly for demonstration */}
            <div className="absolute top-4 right-4 z-50">
                <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-semibold text-sm">Lỗi mạng: Không thể kết nối đến máy chủ.</p>
                    <button className="ml-2"><X className="h-4 w-4"/></button>
                </div>
            </div>
            
            <div className="absolute bottom-4 right-4 z-50">
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <div><p className="font-semibold text-sm">Lưu bài viết thành công!</p></div>
                    <button className="ml-2"><X className="h-4 w-4 text-emerald-400"/></button>
                </div>
            </div>
        </div>
      </section>

      {/* 6. Guest List */}
      <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 overflow-hidden">
        <h2 className="text-lg font-bold bg-slate-800 text-white px-4 py-2 rounded-lg inline-block mb-6">6. Guest - Home List</h2>
        <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-white">
            <section className="relative h-[400px] flex items-center justify-center bg-slate-800">
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Sự kiện & Ưu đãi</h1>
                    <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto">Khám phá các chương trình khuyến mãi đặc biệt và những sự kiện đẳng cấp đang diễn ra tại THAD HOTEL.</p>
                </div>
            </section>
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="group rounded-2xl overflow-hidden border border-slate-200 shadow-sm block">
                        <div className="relative h-64 overflow-hidden bg-slate-200">
                            <div className="absolute top-4 left-4 z-10 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">HOT DEAL</div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Gói Nghỉ Dưỡng Mùa Hè & Spa Trị Liệu</h3>
                            <p className="text-slate-600 mb-6">Tận hưởng không gian thư giãn tuyệt đối với gói nghỉ dưỡng bao gồm phòng Superior và 1 liệu trình massage toàn thân miễn phí dành cho 2 người.</p>
                            <div className="flex justify-between items-center"><span className="text-sm font-semibold text-slate-400">Áp dụng đến 30/08/2026</span><span className="text-blue-600 font-bold">Xem chi tiết &rarr;</span></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </section>

      {/* 7. Guest Voucher Detail */}
      <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 overflow-hidden">
        <h2 className="text-lg font-bold bg-slate-800 text-white px-4 py-2 rounded-lg inline-block mb-6">7. Guest - Voucher Detail</h2>
        <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-white pb-20">
            <div className="relative h-[400px] w-full bg-slate-800">
                <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                    <div className="max-w-3xl">
                        <span className="inline-block px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider">Ưu đãi đặc biệt</span>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Giảm ngay 20% Dịch vụ Spa</h1>
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6 text-slate-700 leading-relaxed"><h2 className="text-2xl font-bold text-slate-900">Thông tin chi tiết</h2><p>Tận hưởng không gian thư giãn tuyệt đối với gói nghỉ dưỡng bao gồm phòng Superior và 1 liệu trình massage toàn thân miễn phí dành cho 2 người.</p></div>
                <div className="space-y-6">
                    <div className="bg-[#FFF4E5] border border-amber-200 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
                        <Tag className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-amber-900 mb-1">Mã Ưu Đãi Của Bạn</h3>
                        <div className="my-4 p-4 bg-white border-2 border-dashed border-amber-300 rounded-xl text-2xl font-black text-amber-600 tracking-widest">SUMMER20</div>
                        <button className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-amber-500 text-white shadow-lg shadow-amber-500/30">Sao chép mã</button>
                    </div>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
}
