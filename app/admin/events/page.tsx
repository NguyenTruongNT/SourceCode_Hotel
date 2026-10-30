'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  X,
  AlertCircle,
  Tag,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit3,
  Percent,
  Layers,
  PauseCircle,
  PlayCircle,
  Sparkles
} from 'lucide-react';
import SuccessToast from '@/components/admin/SuccessToast';
import { useAdmin } from '@/app/admin/AdminProvider';
import { Voucher } from '@/app/admin/types';

export default function EventsManagementPage() {
  const { vouchers, setVouchers, addVoucher, updateVoucher } = useAdmin();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [voucherToDelete, setVoucherToDelete] = useState<Voucher | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const todayStr = new Date().toISOString().slice(0, 10);

  // Form states theo đặc tả F6 (3.11.2)
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    percent: 15,
    startDate: todayStr,
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    quantity: 500,
  });

  // Validation errors E1 - E6
  const [errors, setErrors] = useState({
    title: '',
    code: '',
    percent: '',
    startDate: '',
    endDate: '',
    quantity: '',
  });

  const validateForm = () => {
    const errs = { title: '', code: '', percent: '', startDate: '', endDate: '', quantity: '' };
    const title = formData.title.trim();
    const code = formData.code.trim().toUpperCase();
    const percent = Number(formData.percent);
    const quantity = Number(formData.quantity);

    // E1: Tên sự kiện 5 đến 100 ký tự, không chứa <, >, script
    if (title.length < 5 || title.length > 100 || /[<>]/.test(title) || /script/i.test(title)) {
      errs.title = 'Tên sự kiện phải từ 5 đến 100 ký tự và không chứa ký tự độc hại (E1)!';
    }

    // E2: Mã voucher 4-15 ký tự chữ số in hoa không dấu, không trùng
    if (!/^[A-Z0-9]{4,15}$/.test(code)) {
      errs.code = 'Mã Voucher phải gồm 4 đến 15 ký tự chữ và số in hoa không dấu (E2)!';
    } else {
      const isDuplicate = vouchers.some(
        (v) => v.code.toUpperCase() === code && (!editingVoucher || v.id !== editingVoucher.id)
      );
      if (isDuplicate) {
        errs.code = 'Mã Voucher này đã tồn tại trên hệ thống (E2)!';
      }
    }

    // E3: Tỷ lệ giảm giá 1% đến 70%
    if (isNaN(percent) || percent < 1 || percent > 70) {
      errs.percent = 'Mức giảm giá voucher phải từ 1% đến 70% (E3)!';
    }

    // E4: Ngày bắt đầu >= Ngày hiện tại
    if (!formData.startDate || formData.startDate < todayStr) {
      errs.startDate = 'Ngày bắt đầu không thể nhỏ hơn ngày hiện tại (E4)!';
    }

    // E5: Ngày kết thúc >= Ngày bắt đầu
    if (!formData.endDate || formData.endDate < formData.startDate) {
      errs.endDate = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu (E5)!';
    }

    // E6: Số lượng phát hành 1 đến 10,000 lượt
    if (isNaN(quantity) || quantity < 1 || quantity > 10000) {
      errs.quantity = 'Số lượng voucher phát hành phải từ 1 đến 10,000 lượt (E6)!';
    }

    setErrors(errs);
    return !errs.title && !errs.code && !errs.percent && !errs.startDate && !errs.endDate && !errs.quantity;
  };

  const handleOpenAdd = () => {
    setEditingVoucher(null);
    setFormData({
      title: 'Chào hè rực rỡ 2026',
      code: 'SUMMER2026',
      percent: 20,
      startDate: todayStr,
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      quantity: 500,
    });
    setErrors({ title: '', code: '', percent: '', startDate: '', endDate: '', quantity: '' });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      title: voucher.title,
      code: voucher.code,
      percent: voucher.percent,
      startDate: voucher.startDate,
      endDate: voucher.endDate,
      quantity: voucher.quantity,
    });
    setErrors({ title: '', code: '', percent: '', startDate: '', endDate: '', quantity: '' });
    setIsAddModalOpen(true);
  };

  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const code = formData.code.trim().toUpperCase();

    if (editingVoucher) {
      updateVoucher(editingVoucher.id, {
        title: formData.title.trim(),
        code,
        percent: Number(formData.percent),
        startDate: formData.startDate,
        endDate: formData.endDate,
        quantity: Number(formData.quantity),
      });
      setToastMessage(`Đã cập nhật chiến dịch voucher ${code} thành công!`);
    } else {
      const newV: Voucher = {
        id: `VOUCHER-${Date.now()}`,
        title: formData.title.trim(),
        code,
        percent: Number(formData.percent),
        startDate: formData.startDate,
        endDate: formData.endDate,
        quantity: Number(formData.quantity),
        used: 0,
        status: 'Active',
      };
      addVoucher(newV);
      setToastMessage(`Đã kích hoạt phát hành chiến dịch Voucher ${code} (F6 - S1)!`);
    }

    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (voucher: Voucher) => {
    const nextStatus = voucher.status === 'Active' ? 'Suspended' : 'Active';
    updateVoucher(voucher.id, { status: nextStatus });
    setToastMessage(`Đã chuyển trạng thái Voucher ${voucher.code} sang ${nextStatus === 'Active' ? 'Hoạt động' : 'Tạm dừng'}`);
  };

  const handleDeleteVoucher = () => {
    if (!voucherToDelete) return;
    setVouchers((prev) => prev.filter((v) => v.id !== voucherToDelete.id));
    setToastMessage(`Đã xóa voucher ${voucherToDelete.code}.`);
    setVoucherToDelete(null);
  };

  // Tính trạng thái thực tế bám sát quy tắc BR_F6_02:
  // Khi qua hạn ngày kết thúc hoặc số lượng used >= quantity -> Expired
  const getEvaluatedStatus = (v: Voucher) => {
    if (v.status === 'Suspended') return 'Suspended';
    if (v.endDate && v.endDate < todayStr) return 'Expired';
    if (v.used >= v.quantity) return 'Expired';
    return 'Active';
  };

  const filteredVouchers = vouchers.filter((v) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = v.code.toLowerCase().includes(q) || v.title.toLowerCase().includes(q);
    const evalStatus = getEvaluatedStatus(v);
    const matchStatus = statusFilter === 'all' || evalStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8 space-y-6 relative min-h-screen bg-slate-50 flex flex-col">
      <SuccessToast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Quản lý Sự kiện &amp; Mã giảm giá Voucher (F6)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Thiết lập chiến dịch coupon, kiểm soát hạn mức % (1-70%), ngân sách phát hành và vòng đời voucher.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="size-4" /> Tạo sự kiện ưu đãi mới (+F6)
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="size-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã coupon (SUMMER20, HST2026...) hoặc tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 outline-none font-medium"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Active">Đang hoạt động (Active)</option>
          <option value="Expired">Hết hạn / Hết lượt (Expired)</option>
          <option value="Suspended">Tạm ngưng (Suspended)</option>
        </select>
      </div>

      {/* Bảng danh sách Voucher */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="p-4">Mã Coupon (Code)</th>
              <th className="p-4">Tên chương trình ưu đãi</th>
              <th className="p-4 text-center">Mức giảm (%)</th>
              <th className="p-4">Thời gian hiệu lực</th>
              <th className="p-4 text-center">Tiến độ sử dụng</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredVouchers.length > 0 ? (
              filteredVouchers.map((v) => {
                const status = getEvaluatedStatus(v);
                const percentUsed = Math.round((v.used / v.quantity) * 100);

                return (
                  <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-black text-sm text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                        {v.code}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-800 max-w-[240px]">
                      <p className="truncate" title={v.title}>{v.title}</p>
                    </td>
                    <td className="p-4 text-center font-bold text-emerald-700 text-sm">
                      {v.percent}%
                    </td>
                    <td className="p-4 text-slate-600">
                      {v.startDate} → {v.endDate}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-slate-700 text-[11px]">
                          {v.used} / {v.quantity} lượt ({percentUsed}%)
                        </span>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full ${percentUsed >= 100 ? 'bg-red-500' : 'bg-blue-600'}`}
                            style={{ width: `${Math.min(100, percentUsed)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'Expired'
                            ? 'bg-slate-200 text-slate-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {status === 'Active'
                          ? 'Hoạt động'
                          : status === 'Expired'
                          ? 'Hết hạn / Kín lượt'
                          : 'Tạm ngưng'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center gap-1.5 justify-center">
                        <button
                          onClick={() => handleToggleStatus(v)}
                          title={status === 'Active' ? 'Tạm ngưng mã' : 'Kích hoạt lại mã'}
                          className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                        >
                          {status === 'Active' ? (
                            <PauseCircle className="size-4 text-amber-600" />
                          ) : (
                            <PlayCircle className="size-4 text-emerald-600" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="px-2 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-semibold"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setVoucherToDelete(v)}
                          className="px-2 py-1 border border-red-200 rounded text-red-600 hover:bg-red-50 font-semibold"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Không tìm thấy chiến dịch Voucher nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tạo / Sửa Voucher */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Tag className="size-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingVoucher ? `Chỉnh sửa Voucher ${editingVoucher.code}` : 'Tạo sự kiện & Phát hành Voucher mới (F6)'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVoucher} className="space-y-4">
              {/* Tên chương trình (E1) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Tên chương trình sự kiện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  placeholder="VD: Chào hè rực rỡ 2026"
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg text-xs outline-none ${
                    errors.title ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
                />
                <p className="text-[10px] text-slate-400">Độ dài 5-100 ký tự, không chứa &lt;, &gt;, script.</p>
                {errors.title && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="size-3" /> {errors.title}
                  </p>
                )}
              </div>

              {/* Mã Coupon & Tỷ lệ giảm (E2 & E3) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Mã Voucher phát hành <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    placeholder="VD: SUMMER2026"
                    onChange={(e) => {
                      setFormData({ ...formData, code: e.target.value.toUpperCase() });
                      setErrors((prev) => ({ ...prev, code: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-xs font-mono font-bold uppercase outline-none ${
                      errors.code ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  <p className="text-[10px] text-slate-400">4-15 ký tự chữ &amp; số in hoa.</p>
                  {errors.code && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="size-3" /> {errors.code}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Tỷ lệ giảm giá (%) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={70}
                      value={formData.percent}
                      onChange={(e) => {
                        setFormData({ ...formData, percent: Number(e.target.value) });
                        setErrors((prev) => ({ ...prev, percent: '' }));
                      }}
                      className={`w-full px-3 py-2 border rounded-lg text-xs font-bold text-emerald-700 outline-none ${
                        errors.percent ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                    />
                    <Percent className="size-3.5 absolute right-3 top-2.5 text-slate-400" />
                  </div>
                  <p className="text-[10px] text-slate-400">Quy tắc: từ 1% đến 70%.</p>
                  {errors.percent && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="size-3" /> {errors.percent}
                    </p>
                  )}
                </div>
              </div>

              {/* Ngày bắt đầu & Ngày kết thúc (E4 & E5) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Ngày bắt đầu hiệu lực <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => {
                      setFormData({ ...formData, startDate: e.target.value });
                      setErrors((prev) => ({ ...prev, startDate: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-none ${
                      errors.startDate ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="size-3" /> {errors.startDate}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Ngày kết thúc hiệu lực <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      setFormData({ ...formData, endDate: e.target.value });
                      setErrors((prev) => ({ ...prev, endDate: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-none ${
                      errors.endDate ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="size-3" /> {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Số lượng phát hành (E6) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Số lượng voucher phát hành (1 - 10,000 lượt) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={formData.quantity}
                  onChange={(e) => {
                    setFormData({ ...formData, quantity: Number(e.target.value) });
                    setErrors((prev) => ({ ...prev, quantity: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-bold outline-none ${
                    errors.quantity ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {errors.quantity && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="size-3" /> {errors.quantity}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow"
                >
                  Kích hoạt phát hành
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup xác nhận xóa voucher */}
      {voucherToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setVoucherToDelete(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="size-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 className="size-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Xóa Voucher {voucherToDelete.code}?</h3>
            <p className="text-xs text-slate-500">
              Bạn có chắc chắn muốn xóa mã ưu đãi này? Khách hàng sẽ không thể nhập mã này tại bước thanh toán cọc nữa.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setVoucherToDelete(null)}
                className="flex-1 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteVoucher}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
              >
                Xóa voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
