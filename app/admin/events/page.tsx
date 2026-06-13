'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreVertical, X, UploadCloud, AlertCircle, ToggleLeft, ToggleRight, Calendar, Loader2 } from 'lucide-react';
import SuccessToast from '@/components/admin/SuccessToast';
import { useAdmin } from '@/app/admin/AdminProvider';
import { EventStatus, HotelEvent } from '@/app/admin/types';

export default function EventsManagementPage() {
  const { events, setEvents } = useAdmin();
  
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorToast, setErrorToast] = useState('');
  
  // Edit & Delete states
  const [editingEvent, setEditingEvent] = useState<HotelEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<HotelEvent | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [showError, setShowError] = useState(false); // Form validation error
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    type: 'Sự kiện',
    isScheduled: false,
    publishDate: '',
    image: '/placeholder.svg',
    startDate: '',
    endDate: '',
    maxPeople: '',
    discountPercent: ''
  });

  const getStatusSelect = (event: HotelEvent) => {
    return (
      <select 
        value={event.status}
        onChange={(e) => {
          setEvents(prev => prev.map(ev => ev.id === event.id ? { ...ev, status: e.target.value as EventStatus } : ev));
          setToastMessage(`Đã cập nhật trạng thái bài viết ${event.id}`);
        }}
        className={`px-2 py-1 rounded-full text-xs font-semibold outline-none border border-transparent hover:border-slate-300 focus:border-blue-500 transition-colors ${
          event.status === EventStatus.ACTIVE ? 'bg-emerald-100 text-emerald-800' :
          event.status === EventStatus.SCHEDULED ? 'bg-blue-100 text-blue-800' :
          'bg-slate-100 text-slate-800'
        }`}
      >
        <option value="ACTIVE">Đang hoạt động</option>
        <option value="SCHEDULED">Đã lên lịch</option>
        <option value="INACTIVE">Đã ẩn</option>
      </select>
    );
  };

  const filteredEvents = events.filter(ev => {
    const matchSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || ev.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === 'all' || ev.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="p-8 space-y-6 relative h-full flex flex-col bg-[#f8fafc]">
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
              placeholder="Tìm kiếm sự kiện, ưu đãi..." 
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
            <option value="all">Tất cả phân loại</option>
            <option value="Sự kiện">Sự kiện</option>
            <option value="Ưu đãi">Ưu đãi</option>
          </select>
        </div>
        <button 
          onClick={() => {
            setEditingEvent(null);
            setFormData({ title: '', shortDesc: '', type: 'Sự kiện', isScheduled: false, publishDate: '', image: '/placeholder.svg', startDate: '', endDate: '', maxPeople: '', discountPercent: '' });
            setIsAddPanelOpen(true);
            setShowError(false);
            setFormErrors({});
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" /> Soạn bài viết mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Mã</th>
              <th className="p-4 font-semibold">Tiêu đề bài viết</th>
              <th className="p-4 font-semibold">Phân loại</th>
              <th className="p-4 font-semibold">Trạng thái</th>
              <th className="p-4 font-semibold">Lượt xem</th>
              <th className="p-4 font-semibold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEvents.length > 0 ? filteredEvents.map((ev) => (
              <tr key={ev.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-800 text-sm">{ev.id}</td>
                <td className="p-4 text-slate-800 text-sm font-semibold max-w-[200px] truncate" title={ev.title}>{ev.title}</td>
                <td className="p-4 text-slate-600 text-sm">{ev.type}</td>
                <td className="p-4">{getStatusSelect(ev)}</td>
                <td className="p-4 text-slate-600 text-sm">{ev.views}</td>
                <td className="p-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button 
                      onClick={() => {
                        setEditingEvent(ev);
                        setFormData({
                          title: ev.title,
                          shortDesc: ev.shortDesc,
                          type: ev.type,
                          isScheduled: ev.isScheduled || false,
                          publishDate: ev.publishDate || '',
                          image: ev.image || '/placeholder.svg',
                          startDate: ev.startDate || '',
                          endDate: ev.endDate || '',
                          maxPeople: ev.maxPeople?.toString() || '',
                          discountPercent: ev.discountPercent?.toString() || ''
                        });
                        setIsAddPanelOpen(true);
                        setShowError(false);
                        setFormErrors({});
                      }}
                      className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => setEventToDelete(ev)}
                      className="px-3 py-1.5 border border-red-200 rounded-md text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-10 w-10 text-slate-300 mb-3" />
                    <p className="font-semibold text-slate-600">Không tìm thấy bài viết nào</p>
                    <p className="text-sm">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Centered Edit/Add Modal */}
      {isAddPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsAddPanelOpen(false)}></div>
          <div className="relative w-[900px] max-w-full bg-white max-h-[95vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
              <h2 className="text-xl font-bold text-slate-800">{editingEvent ? 'Sửa bài viết' : 'Soạn bài viết mới'}</h2>
              <button onClick={() => setIsAddPanelOpen(false)} className="h-8 w-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-[1fr_300px] gap-8 bg-slate-50">
              {/* Cột trái (75%) */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Tiêu đề bài viết <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Nhập tiêu đề..." 
                      value={formData.title}
                      onChange={(e) => { setFormData({...formData, title: e.target.value}); setFormErrors({...formErrors, title: ''}); }}
                      className={`w-full px-4 py-2.5 border ${formErrors.title ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                    />
                    {formErrors.title && <p className="text-xs text-red-500 font-medium">{formErrors.title}</p>}
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-slate-700">Mô tả ngắn</label>
                      <span className={`text-xs ${formData.shortDesc.length >= 150 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                        {formData.shortDesc.length}/150
                      </span>
                    </div>
                    <textarea 
                      rows={3}
                      value={formData.shortDesc}
                      onChange={(e) => { setFormData({...formData, shortDesc: e.target.value.slice(0, 150)}); setFormErrors({...formErrors, shortDesc: ''}); }}
                      placeholder="Tóm tắt nội dung chính..."
                      className={`w-full px-4 py-2.5 border ${formErrors.shortDesc ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                    />
                    {formErrors.shortDesc && <p className="text-xs text-red-500 font-medium">{formErrors.shortDesc}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Thời gian bắt đầu <span className="text-red-500">*</span></label>
                      <input 
                        type="datetime-local" 
                        value={formData.startDate}
                        onChange={(e) => { setFormData({...formData, startDate: e.target.value}); setFormErrors({...formErrors, startDate: ''}); }}
                        className={`w-full px-4 py-2 border ${formErrors.startDate ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {formErrors.startDate && <p className="text-xs text-red-500 font-medium">{formErrors.startDate}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Thời gian kết thúc <span className="text-red-500">*</span></label>
                      <input 
                        type="datetime-local" 
                        value={formData.endDate}
                        onChange={(e) => { setFormData({...formData, endDate: e.target.value}); setFormErrors({...formErrors, endDate: ''}); }}
                        className={`w-full px-4 py-2 border ${formErrors.endDate ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {formErrors.endDate && <p className="text-xs text-red-500 font-medium">{formErrors.endDate}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Sức chứa tối đa (người) <span className="text-red-500">*</span></label>
                      <input 
                        type="number"
                        min="1"
                        value={formData.maxPeople}
                        onChange={(e) => { setFormData({...formData, maxPeople: e.target.value}); setFormErrors({...formErrors, maxPeople: ''}); }}
                        className={`w-full px-4 py-2 border ${formErrors.maxPeople ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {formErrors.maxPeople && <p className="text-xs text-red-500 font-medium">{formErrors.maxPeople}</p>}
                    </div>
                    {formData.type === 'Ưu đãi' && (
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Ưu đãi (%) <span className="text-red-500">*</span></label>
                        <input 
                          type="number"
                          min="1"
                          max="100"
                          value={formData.discountPercent}
                          onChange={(e) => { setFormData({...formData, discountPercent: e.target.value}); setFormErrors({...formErrors, discountPercent: ''}); }}
                          className={`w-full px-4 py-2 border ${formErrors.discountPercent ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {formErrors.discountPercent && <p className="text-xs text-red-500 font-medium">{formErrors.discountPercent}</p>}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Ảnh bìa (Tối đa 5MB)</label>
                    <div className={`relative border-2 border-dashed ${fileError ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'} rounded-xl p-8 text-center cursor-pointer transition-colors`}>
                      <input 
                        type="file" 
                        accept="image/*"
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
                      <p className="text-sm text-slate-600">Kéo thả ảnh vào đây hoặc <span className="text-blue-600 font-semibold underline">Duyệt file</span></p>
                      {fileError && <p className="text-xs text-red-500 font-medium mt-2">Tệp vượt quá 5MB. Vui lòng chọn tệp nhỏ hơn.</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Nội dung chi tiết</label>
                    <div className="min-h-[250px] border border-slate-300 rounded-lg bg-slate-50 p-4 text-slate-400 flex items-center justify-center text-sm">
                      (Trình soạn thảo Rich Text Editor)
                    </div>
                  </div>
                </div>
              </div>

              {/* Cột phải (25%) */}
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Cấu hình xuất bản</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Phân loại</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Sự kiện">Sự kiện</option>
                      <option value="Ưu đãi">Ưu đãi</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700">Lên lịch tự động</label>
                      <button onClick={() => setFormData({...formData, isScheduled: !formData.isScheduled})}>
                        {formData.isScheduled ? <ToggleRight className="h-6 w-6 text-blue-600" /> : <ToggleLeft className="h-6 w-6 text-slate-300" />}
                      </button>
                    </div>
                    {formData.isScheduled && (
                      <div className="mt-3 relative animate-in fade-in slide-in-from-top-2">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                          type="datetime-local" 
                          value={formData.publishDate}
                          onChange={(e) => { setFormData({...formData, publishDate: e.target.value}); setFormErrors({...formErrors, publishDate: ''}); }}
                          className={`w-full pl-9 pr-3 py-2 border ${formErrors.publishDate ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {formErrors.publishDate && <p className="text-xs text-red-500 font-medium mt-1">{formErrors.publishDate}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
              <button 
                disabled={isSaving}
                onClick={() => setIsAddPanelOpen(false)}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button 
                disabled={isSaving || fileError}
                onClick={() => {
                  let errors: { [key: string]: string } = {};
                  if (!formData.title.trim()) errors.title = "Vui lòng nhập tiêu đề bài viết.";
                  if (!formData.shortDesc.trim()) errors.shortDesc = "Vui lòng nhập mô tả ngắn.";
                  if (formData.isScheduled && !formData.publishDate) errors.publishDate = "Vui lòng chọn thời gian lên lịch xuất bản.";
                  if (!formData.startDate) errors.startDate = "Vui lòng nhập thời gian bắt đầu.";
                  if (!formData.endDate) errors.endDate = "Vui lòng nhập thời gian kết thúc.";
                  else if (formData.startDate && new Date(formData.startDate) >= new Date(formData.endDate)) errors.endDate = "Thời gian kết thúc phải lớn hơn thời gian bắt đầu.";
                  
                  if (!formData.maxPeople || isNaN(Number(formData.maxPeople)) || Number(formData.maxPeople) <= 0) errors.maxPeople = "Sức chứa tối đa không hợp lệ (> 0).";
                  
                  if (formData.type === 'Ưu đãi') {
                    if (!formData.discountPercent || isNaN(Number(formData.discountPercent)) || Number(formData.discountPercent) <= 0 || Number(formData.discountPercent) > 100) errors.discountPercent = "Phần trăm ưu đãi không hợp lệ (1-100).";
                  }

                  if (fileError) {
                    setErrorToast("Vui lòng chọn ảnh hợp lệ.");
                    return;
                  }

                  if (Object.keys(errors).length > 0) {
                    setFormErrors(errors);
                    return;
                  }
                  
                  setFormErrors({});
                  setShowConfirmPopup(true);
                }}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {formData.isScheduled ? 'Lưu lịch' : (editingEvent ? 'Cập nhật' : 'Xuất bản ngay')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Save Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-[60] flex justify-center items-center">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowConfirmPopup(false)}></div>
          <div className="relative bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận {editingEvent ? 'cập nhật' : 'lưu'}?</h3>
            <p className="text-sm text-slate-500 mb-6">Bạn chắc chắn muốn {editingEvent ? 'cập nhật' : 'lưu'} bài viết <strong>{formData.title}</strong>?</p>
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
                  
                  // Simulate 50% network error after loading
                  setTimeout(() => {
                    setIsSaving(false);
                    const isNetworkError = Math.random() > 0.7; // 30% error
                    if (isNetworkError) {
                      setErrorToast("Lỗi mạng: Không thể kết nối đến máy chủ. Dữ liệu chưa được lưu.");
                    } else {
                      // Success
                      if (editingEvent) {
                        setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? { 
                          ...ev, 
                          ...formData, 
                          maxPeople: Number(formData.maxPeople),
                          discountPercent: formData.type === 'Ưu đãi' ? Number(formData.discountPercent) : undefined,
                          status: formData.isScheduled ? EventStatus.SCHEDULED : (ev.status === EventStatus.SCHEDULED ? EventStatus.ACTIVE : ev.status) 
                        } : ev));
                      } else {
                        const newId = `EV-${(events.length + 1).toString().padStart(3, '0')}`;
                        setEvents(prev => [{ 
                          ...formData, 
                          maxPeople: Number(formData.maxPeople),
                          discountPercent: formData.type === 'Ưu đãi' ? Number(formData.discountPercent) : undefined,
                          id: newId, 
                          status: formData.isScheduled ? EventStatus.SCHEDULED : EventStatus.ACTIVE, 
                          views: 0,
                          link: `/events/${newId.toLowerCase()}`
                        }, ...prev]);
                      }
                      setToastMessage("Lưu bài viết thành công!");
                      setIsAddPanelOpen(false);
                    }
                  }, 1500);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />} Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Popup */}
      {eventToDelete && (
        <div className="fixed inset-0 z-[60] flex justify-center items-center">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setEventToDelete(null)}></div>
          <div className="relative bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận xóa?</h3>
            <p className="text-sm text-slate-500 mb-6">Bạn chắc chắn muốn xóa bài viết <strong>{eventToDelete.title}</strong>?</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  setEvents(prev => prev.filter(ev => ev.id !== eventToDelete.id));
                  setToastMessage(`Đã xóa bài viết ${eventToDelete.id} thành công!`);
                  setEventToDelete(null);
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
