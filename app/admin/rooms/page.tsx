'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, X, UploadCloud, AlertCircle, Loader2 } from 'lucide-react';
import { useAdmin } from '@/app/admin/AdminProvider';
import SuccessToast from '@/components/admin/SuccessToast';

export default function RoomsManagementPage() {
  const { rooms, setRooms } = useAdmin();
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  
  // Edit state
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: '',
    floor: 1,
    type: 'Standard',
    price: 800000,
    status: 'EMPTY'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  // Thêm state cho task 3
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [keepForm, setKeepForm] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [roomExistsError, setRoomExistsError] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [errorToast, setErrorToast] = useState('');
  const [roomToDelete, setRoomToDelete] = useState<any>(null);

  const checkRoomExists = () => {
    if (editingRoom) return;
    if (rooms.find(r => r.id === formData.id)) {
      setRoomExistsError(true);
    } else {
      setRoomExistsError(false);
    }
  };

  // Filter logic
  const filteredRooms = rooms.filter(room => {
    const matchSearch = room.id.includes(searchQuery);
    
    let matchType = true;
    if (typeFilter !== 'Tất cả') {
      if (typeFilter === 'Suite VIP') matchType = room.type === 'Suite';
      else matchType = room.type === typeFilter;
    }

    let matchStatus = true;
    if (statusFilter !== 'Tất cả') {
      if (statusFilter === 'Sẵn sàng') matchStatus = room.status === 'EMPTY';
      else if (statusFilter === 'Đang ở') matchStatus = room.status === 'OCCUPIED';
      else if (statusFilter === 'Bảo trì') matchStatus = room.status === 'MAINTENANCE';
      else if (statusFilter === 'Đã đặt') matchStatus = room.status === 'BOOKED';
    }

    return matchSearch && matchType && matchStatus;
  });

  const getStatusSelect = (room: any) => {
    return (
      <select 
        value={room.status}
        onChange={(e) => {
          setRooms(prev => prev.map(r => r.id === room.id ? { ...r, status: e.target.value } : r));
          setToastMessage(`Đã cập nhật trạng thái phòng ${room.id}`);
        }}
        className={`px-2 py-1 rounded-full text-xs font-semibold outline-none border border-transparent hover:border-slate-300 focus:border-blue-500 transition-colors ${
          room.status === 'AVAILABLE' || room.status === 'EMPTY' ? 'bg-emerald-100 text-emerald-800' :
          room.status === 'MAINTENANCE' ? 'bg-amber-100 text-amber-800' :
          room.status === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
          'bg-rose-100 text-rose-800'
        }`}
      >
        <option value="EMPTY">Sẵn sàng</option>
        <option value="MAINTENANCE">Bảo trì</option>
        <option value="BOOKED">Đã đặt</option>
        <option value="OCCUPIED">Đang ở</option>
      </select>
    );
  };

  return (
    <div className="p-8 space-y-6 relative">
      <SuccessToast message={toastMessage} onClose={() => setToastMessage('')} />
      {errorToast && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p className="font-semibold text-sm">{errorToast}</p>
            <button onClick={() => setErrorToast('')} className="ml-2 hover:bg-red-600 p-1 rounded-full"><X className="h-4 w-4"/></button>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Gõ số phòng để tìm nhanh..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-700 outline-none"
          >
            <option value="Tất cả">Tất cả loại phòng</option>
            <option value="Standard">Standard</option>
            <option value="Superior">Superior</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite VIP">Suite VIP</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-700 outline-none"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Sẵn sàng">Sẵn sàng (EMPTY)</option>
            <option value="Đang ở">Đang ở (OCCUPIED)</option>
            <option value="Đã đặt">Đã đặt (BOOKED)</option>
            <option value="Bảo trì">Bảo trì (MAINTENANCE)</option>
          </select>
        </div>
        <button 
          onClick={() => {
            setEditingRoom(null);
            setFormData({ id: '', floor: 1, type: 'Standard', price: 800000, status: 'EMPTY' });
            setIsAddPanelOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm shadow-blue-600/20 transition-all"
        >
          <Plus className="h-4 w-4" /> Thêm phòng mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Số phòng</th>
              <th className="p-4 font-semibold">Loại phòng</th>
              <th className="p-4 font-semibold">Tầng</th>
              <th className="p-4 font-semibold">Giá (VNĐ/Đêm)</th>
              <th className="p-4 font-semibold">Tiện ích</th>
              <th className="p-4 font-semibold">Trạng thái</th>
              <th className="p-4 font-semibold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRooms.length > 0 ? filteredRooms.map((room) => (
              <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-800 text-base">{room.id}</td>
                <td className="p-4 text-slate-700 text-sm">{room.type}</td>
                <td className="p-4 text-slate-700 text-sm">Tầng {room.floor}</td>
                <td className="p-4 font-medium text-slate-800 text-sm">{room.type === 'Standard' ? '800.000' : room.type === 'Superior' ? '1.200.000' : room.type === 'Deluxe' ? '1.800.000' : '3.500.000'}</td>
                <td className="p-4 text-slate-500 text-xs">Wifi, Smart TV</td>
                <td className="p-4">{getStatusSelect(room)}</td>
                <td className="p-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button 
                      onClick={() => {
                        setEditingRoom(room);
                        setFormData({
                          id: room.id,
                          floor: room.floor || Math.floor(parseInt(room.id) / 100),
                          type: room.type,
                          price: room.type === 'Standard' ? 800000 : room.type === 'Superior' ? 1200000 : room.type === 'Deluxe' ? 1800000 : 3500000,
                          status: room.status
                        });
                        setIsAddPanelOpen(true);
                      }}
                      className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => setRoomToDelete(room)}
                      className="px-3 py-1.5 border border-red-200 rounded-md text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-10 w-10 text-slate-300 mb-3" />
                    <p className="font-semibold text-slate-600">Không tìm thấy phòng nào</p>
                    <p className="text-sm mt-1">Thử thay đổi từ khóa tìm kiếm hoặc điều kiện lọc.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide Overlay */}
      {isAddPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsAddPanelOpen(false)}></div>
          <div className="relative w-[500px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-slate-800">{editingRoom ? 'Sửa thông tin phòng' : 'Thêm phòng mới'}</h2>
              <button onClick={() => setIsAddPanelOpen(false)} className="h-8 w-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Số phòng <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="VD: 502" 
                    value={formData.id}
                    onChange={(e) => { setFormData({...formData, id: e.target.value}); setRoomExistsError(false); }}
                    onBlur={checkRoomExists}
                    disabled={!!editingRoom}
                    className={`w-full px-4 py-2.5 border ${(showError || roomExistsError) ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all ${editingRoom ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                  />
                  {(showError || roomExistsError) && <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1"><AlertCircle className="h-3.5 w-3.5"/> Số phòng đã tồn tại.</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Tầng <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    placeholder="VD: 5" 
                    value={formData.floor}
                    onChange={(e) => setFormData({...formData, floor: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Loại phòng <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.type}
                    onChange={(e) => {
                      const type = e.target.value;
                      let price = 800000;
                      if (type === 'Superior') price = 1200000;
                      if (type === 'Deluxe') price = 1800000;
                      if (type === 'Suite') price = 3500000;
                      setFormData({...formData, type, price});
                    }}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Superior">Superior</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite VIP</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Giá tiêu chuẩn (VNĐ) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tiện ích phòng</label>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-emerald-500 rounded" /> Wifi tốc độ cao
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-emerald-500 rounded" /> Smart TV 55"
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-emerald-500 rounded" /> Bồn tắm
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-emerald-500 rounded" /> Ban công
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Hình ảnh phòng (Tối đa 5MB)</label>
                <div 
                  className={`relative border-2 border-dashed ${fileError ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'} rounded-xl p-8 text-center cursor-pointer transition-colors`}
                >
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        if (e.target.files[0].size > 5 * 1024 * 1024) {
                          setFileError(true);
                        } else {
                          setFileError(false);
                        }
                      }
                    }}
                  />
                  <UploadCloud className={`h-10 w-10 mx-auto mb-3 ${fileError ? 'text-red-400' : 'text-slate-400'}`} />
                  <p className="text-sm text-slate-600">Kéo thả ảnh vào đây hoặc <span className="text-emerald-600 font-semibold underline">Duyệt file</span></p>
                  {fileError && <p className="text-xs text-red-500 font-medium mt-2">Tệp vượt quá 5MB. Vui lòng chọn tệp nhỏ gọn hơn.</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Trạng thái khởi tạo</label>
                <div className="flex gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="radio" name="status" checked={formData.status === 'EMPTY'} onChange={() => setFormData({...formData, status: 'EMPTY'})} className="w-4 h-4 accent-blue-600" /> Sẵn sàng
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="radio" name="status" checked={formData.status === 'MAINTENANCE'} onChange={() => setFormData({...formData, status: 'MAINTENANCE'})} className="w-4 h-4 accent-blue-600" /> Bảo trì
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-white">
              <label className="flex items-center gap-2 text-sm text-slate-600 font-medium mb-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={keepForm}
                  onChange={(e) => setKeepForm(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded" 
                /> 
                Duy trì biểu mẫu cho phòng tiếp theo
              </label>
              <div className="flex justify-end gap-3">
                <button 
                  disabled={isSaving}
                  onClick={() => setIsAddPanelOpen(false)}
                  className="px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button 
                  disabled={isSaving || roomExistsError || fileError}
                  onClick={() => {
                    if (!formData.id || roomExistsError || fileError) {
                      setShowError(true);
                      return;
                    }
                    setShowConfirmPopup(true);
                  }}
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingRoom ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Save Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-[60] flex justify-center items-center">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowConfirmPopup(false)}></div>
          <div className="relative bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận lưu?</h3>
            <p className="text-sm text-slate-500 mb-6">Bạn chắc chắn muốn lưu thông tin phòng {formData.id}?</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowConfirmPopup(false)}
                className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-semibold hover:bg-slate-200"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  setShowConfirmPopup(false);
                  setIsSaving(true);
                  
                  // Simulate 50% network error after 2s loading
                  setTimeout(() => {
                    setIsSaving(false);
                    const isNetworkError = Math.random() > 0.7; // 30% error
                    if (isNetworkError) {
                      setErrorToast("Lỗi mạng: Không thể kết nối đến máy chủ. Dữ liệu chưa bị xóa.");
                    } else {
                      // Success
                      if (editingRoom) {
                        setRooms(prev => prev.map(r => r.id === formData.id ? { ...r, ...formData } : r));
                      } else {
                        setRooms(prev => [...prev, { ...formData, id: formData.id } as any]);
                      }
                      setToastMessage("Lưu thành công!");
                      if (!keepForm) {
                        setIsAddPanelOpen(false);
                      } else {
                        // clear ID but keep form
                        setFormData(prev => ({...prev, id: ''}));
                      }
                    }
                  }, 2000);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Popup */}
      {roomToDelete && (
        <div className="fixed inset-0 z-[60] flex justify-center items-center">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setRoomToDelete(null)}></div>
          <div className="relative bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận xóa?</h3>
            <p className="text-sm text-slate-500 mb-6">Bạn chắc chắn muốn xóa phòng {roomToDelete.id}?</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setRoomToDelete(null)}
                className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  setRooms(prev => prev.filter(r => r.id !== roomToDelete.id));
                  setToastMessage(`Đã xóa phòng ${roomToDelete.id} thành công!`);
                  setRoomToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 shadow-sm transition-colors"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
