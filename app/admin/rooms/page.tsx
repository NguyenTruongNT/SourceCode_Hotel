'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  X,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  Image as ImageIcon
} from 'lucide-react';
import { useAdmin } from '@/app/admin/AdminProvider';
import { Room, RoomStatus, RoomType } from '@/app/admin/types';
import SuccessToast from '@/components/admin/SuccessToast';
import { formatVND } from '@/lib/rooms';

export default function RoomsManagementPage() {
  const { rooms, setRooms } = useAdmin();
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Form states theo đặc tả F5 (3.9.2)
  const [formData, setFormData] = useState({
    code: '',
    floor: 3,
    type: RoomType.DELUXE,
    price: 1800000,
    capacity: 3,
    status: RoomStatus.EMPTY,
    photoName: '',
    photoSizeMB: 0,
  });

  // Validation error states E1 - E5
  const [errors, setErrors] = useState({
    code: '',
    floor: '',
    price: '',
    capacity: '',
    photo: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [toastMessage, setToastMessage] = useState('');
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  // Validation rules bám sát backend room.service.js & đặc tả 3.9 & 3.10
  const validateForm = () => {
    const errs = { code: '', floor: '', price: '', capacity: '', photo: '' };
    const code = formData.code.trim().toUpperCase();
    const floor = Number(formData.floor);
    const price = Number(formData.price);
    const capacity = Number(formData.capacity);

    // E1: Mã phòng bắt đầu bằng 'P' + số tầng + 2 số phòng (độ dài 3-6)
    if (!editingRoom) {
      if (!code || code.length < 3 || code.length > 6 || !/^P\d+$/.test(code)) {
        errs.code = 'Mã số phòng không hợp lệ (Phải bắt đầu bằng chữ "P", độ dài 3-6 ký tự, ví dụ: P302)!';
      } else if (rooms.some((r) => r.id === code)) {
        errs.code = 'Mã số phòng này đã tồn tại trong khách sạn (E1)!';
      } else {
        const prefix = Number(code.slice(1, code.length - 2));
        if (prefix !== floor) {
          errs.code = `Mã phòng ${code} không khớp với tầng ${floor} (Phải có dạng P${floor}xx)!`;
        }
      }
    }

    // E2: Tầng 1 đến 15
    if (isNaN(floor) || floor < 1 || floor > 15) {
      errs.floor = 'Tầng khách sạn chỉ từ tầng 1 đến 15 (E2)!';
    }

    // E3: Giá từ 200,000 đến 50,000,000 VNĐ
    if (isNaN(price) || price < 200000 || price > 50000000) {
      errs.price = 'Giá phòng phải nằm trong khoảng từ 200,000 đến 50,000,000 VNĐ (E3)!';
    }

    // E4: Sức chứa 1 đến 8 người
    if (isNaN(capacity) || capacity < 1 || capacity > 8) {
      errs.capacity = 'Sức chứa phòng phải từ 1 đến 8 người (E4)!';
    }

    // E5: Tệp ảnh
    if (formData.photoName) {
      const isAllowedExt = /\.(jpe?g|png)$/i.test(formData.photoName);
      if (!isAllowedExt || formData.photoSizeMB > 5) {
        errs.photo = 'Tệp ảnh phải thuộc định dạng JPG/PNG và dung lượng dưới 5MB (E5)!';
      }
    }

    setErrors(errs);
    return !errs.code && !errs.floor && !errs.price && !errs.capacity && !errs.photo;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = file.size / (1024 * 1024);
      setFormData((prev) => ({
        ...prev,
        photoName: file.name,
        photoSizeMB: sizeMB,
      }));

      const isAllowed = /\.(jpe?g|png)$/i.test(file.name);
      if (!isAllowed || sizeMB > 5) {
        setErrors((prev) => ({
          ...prev,
          photo: 'Tệp ảnh phải thuộc định dạng JPG/PNG và dung lượng dưới 5MB (E5)!',
        }));
      } else {
        setErrors((prev) => ({ ...prev, photo: '' }));
      }
    }
  };

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      code: 'P305',
      floor: 3,
      type: RoomType.DELUXE,
      price: 1800000,
      capacity: 3,
      status: RoomStatus.EMPTY,
      photoName: 'room-deluxe.jpg',
      photoSizeMB: 1.5,
    });
    setErrors({ code: '', floor: '', price: '', capacity: '', photo: '' });
    setIsAddPanelOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      code: room.id,
      floor: room.floor,
      type: room.type,
      price: room.price || 1200000,
      capacity: room.capacity || 2,
      status: room.status,
      photoName: '',
      photoSizeMB: 0,
    });
    setErrors({ code: '', floor: '', price: '', capacity: '', photo: '' });
    setIsAddPanelOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const code = formData.code.trim().toUpperCase();

    if (editingRoom) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === editingRoom.id
            ? {
                ...r,
                floor: Number(formData.floor),
                type: formData.type,
                price: Number(formData.price),
                capacity: Number(formData.capacity),
                status: formData.status,
              }
            : r
        )
      );
      setToastMessage(`Đã cập nhật cấu hình phòng ${editingRoom.id} thành công!`);
    } else {
      const newRoom: Room = {
        id: code,
        floor: Number(formData.floor),
        type: formData.type,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        status: formData.status,
      };
      setRooms((prev) => [...prev, newRoom]);
      setToastMessage(`Đã thêm phòng mới ${code} vào hệ thống (F5 - S1)!`);
    }

    setIsAddPanelOpen(false);
  };

  const handleDeleteRoom = () => {
    if (!roomToDelete) return;
    setRooms((prev) => prev.filter((r) => r.id !== roomToDelete.id));
    setToastMessage(`Đã xóa phòng ${roomToDelete.id} khỏi hệ thống.`);
    setRoomToDelete(null);
  };

  // Filter logic
  const filteredRooms = rooms.filter((room) => {
    const matchSearch = room.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === 'Tất cả' || room.type === typeFilter;
    let matchStatus = true;
    if (statusFilter !== 'Tất cả') {
      if (statusFilter === 'Trống - Sạch') matchStatus = room.status === RoomStatus.EMPTY;
      else if (statusFilter === 'Đang ở') matchStatus = room.status === RoomStatus.OCCUPIED;
      else if (statusFilter === 'Đã đặt') matchStatus = room.status === RoomStatus.BOOKED;
      else if (statusFilter === 'Chờ dọn (Dirty)') matchStatus = room.status === RoomStatus.CLEANING;
    }
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="p-8 space-y-6 relative min-h-screen bg-slate-50">
      <SuccessToast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Cấu hình Hạng phòng &amp; Giá tiêu chuẩn (F5)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quy tắc mã phòng chuẩn <strong className="font-mono">P&lt;Tầng&gt;xx</strong>, giá 200k-50tr, sức chứa 1-8 khách.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="size-4" /> Thêm phòng mới (+F5)
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="size-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã phòng (P201, P302...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 outline-none font-medium"
        >
          <option value="Tất cả">Tất cả hạng phòng</option>
          <option value="Standard">Standard (STD)</option>
          <option value="Superior">Superior (SUP)</option>
          <option value="Deluxe">Deluxe (DLX)</option>
          <option value="Suite">Suite Luxury (SUT)</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 outline-none font-medium"
        >
          <option value="Tất cả">Tất cả trạng thái</option>
          <option value="Trống - Sạch">Trống - Sạch (EMPTY)</option>
          <option value="Đang ở">Đang ở (OCCUPIED)</option>
          <option value="Đã đặt">Đã cọc (BOOKED)</option>
          <option value="Chờ dọn (Dirty)">Chờ dọn (CLEANING)</option>
        </select>
      </div>

      {/* Bảng danh sách phòng */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="p-4">Mã số phòng</th>
              <th className="p-4">Hạng phòng</th>
              <th className="p-4">Vị trí tầng</th>
              <th className="p-4">Giá niêm yết 1 đêm</th>
              <th className="p-4">Sức chứa</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-black font-mono text-sm text-slate-900">{room.id}</td>
                  <td className="p-4 font-semibold text-slate-800">{room.type}</td>
                  <td className="p-4 text-slate-600">Tầng {room.floor}</td>
                  <td className="p-4 font-bold text-blue-700">{formatVND(room.price || 800000)}</td>
                  <td className="p-4 text-slate-700">{room.capacity || 2} khách</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        room.status === RoomStatus.EMPTY
                          ? 'bg-emerald-100 text-emerald-800'
                          : room.status === RoomStatus.OCCUPIED
                          ? 'bg-rose-100 text-rose-800'
                          : room.status === RoomStatus.BOOKED
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {room.status === RoomStatus.EMPTY
                        ? 'Trống - Sạch'
                        : room.status === RoomStatus.OCCUPIED
                        ? 'Đang có khách'
                        : room.status === RoomStatus.BOOKED
                        ? 'Đã cọc'
                        : 'Chờ dọn'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleOpenEdit(room)}
                        className="px-2.5 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-semibold"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => setRoomToDelete(room)}
                        className="px-2.5 py-1 border border-red-200 rounded text-red-600 hover:bg-red-50 font-semibold"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Không tìm thấy phòng nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer Panel Thêm / Sửa cấu hình phòng */}
      {isAddPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsAddPanelOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-slate-900">
                {editingRoom ? `Sửa thông tin phòng ${editingRoom.id}` : 'Thêm phòng vật lý mới (F5)'}
              </h2>
              <button
                onClick={() => setIsAddPanelOpen(false)}
                className="size-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Mã phòng & Tầng (E1 & E2) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Mã số phòng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: P305"
                    value={formData.code}
                    disabled={!!editingRoom}
                    onChange={(e) => {
                      setFormData({ ...formData, code: e.target.value.toUpperCase() });
                      setErrors((prev) => ({ ...prev, code: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-xs font-mono font-bold uppercase outline-none ${
                      errors.code ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    } ${editingRoom ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                  />
                  <p className="text-[10px] text-slate-400">Quy tắc: P + số tầng + số phòng (P305)</p>
                  {errors.code && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="size-3" /> {errors.code}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Vị trí tầng (1 - 15) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={formData.floor}
                    onChange={(e) => {
                      setFormData({ ...formData, floor: parseInt(e.target.value) || 1 });
                      setErrors((prev) => ({ ...prev, floor: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-xs font-bold outline-none ${
                      errors.floor ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.floor && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="size-3" /> {errors.floor}
                    </p>
                  )}
                </div>
              </div>

              {/* Hạng phòng & Sức chứa (E4) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Tên hạng phòng <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const t = e.target.value as RoomType;
                      let p = 800000;
                      let cap = 2;
                      if (t === RoomType.SUPERIOR) { p = 1200000; cap = 2; }
                      if (t === RoomType.DELUXE) { p = 1800000; cap = 3; }
                      if (t === RoomType.SUITE) { p = 3500000; cap = 4; }
                      setFormData({ ...formData, type: t, price: p, capacity: cap });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none bg-white font-medium"
                  >
                    <option value={RoomType.STANDARD}>Standard (STD)</option>
                    <option value={RoomType.SUPERIOR}>Superior (SUP)</option>
                    <option value={RoomType.DELUXE}>Deluxe (DLX)</option>
                    <option value={RoomType.SUITE}>Suite Luxury (SUT)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Sức chứa tối đa (1 - 8) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={formData.capacity}
                    onChange={(e) => {
                      setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 });
                      setErrors((prev) => ({ ...prev, capacity: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-xs font-bold outline-none ${
                      errors.capacity ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.capacity && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="size-3" /> {errors.capacity}
                    </p>
                  )}
                </div>
              </div>

              {/* Giá niêm yết tiêu chuẩn (E3) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Giá niêm yết tiêu chuẩn (VNĐ / đêm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={200000}
                  max={50000000}
                  step={50000}
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({ ...formData, price: Number(e.target.value) });
                    setErrors((prev) => ({ ...prev, price: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-bold text-blue-700 outline-none ${
                    errors.price ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
                />
                <p className="text-[10px] text-slate-400">Ràng buộc: 200,000 VNĐ đến 50,000,000 VNĐ / đêm</p>
                {errors.price && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="size-3" /> {errors.price}
                  </p>
                )}
              </div>

              {/* Tệp hình ảnh phòng (E5) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Tệp hình ảnh phòng (JPG / PNG &lt;= 5MB)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative">
                  <UploadCloud className="size-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-slate-700">Nhấp để tải lên hình ảnh phòng</p>
                  <p className="text-[10px] text-slate-400">Chấp nhận JPG, PNG dung lượng dưới 5MB</p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf,.exe"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {formData.photoName && (
                  <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                    <ImageIcon className="size-3.5" /> Đã chọn: {formData.photoName} ({formData.photoSizeMB.toFixed(1)}MB)
                  </p>
                )}
                {errors.photo && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="size-3" /> {errors.photo}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddPanelOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition-colors"
                >
                  Lưu cấu hình phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup xác nhận xóa phòng */}
      {roomToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setRoomToDelete(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="size-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 className="size-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Xóa phòng {roomToDelete.id}?</h3>
            <p className="text-xs text-slate-500">
              Bạn có chắc chắn muốn xóa phòng này khỏi danh mục hệ thống? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setRoomToDelete(null)}
                className="flex-1 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteRoom}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
              >
                Xóa phòng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
