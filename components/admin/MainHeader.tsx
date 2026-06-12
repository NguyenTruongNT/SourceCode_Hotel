import React, { useRef, useEffect } from 'react';
import { Search, X, Calendar } from 'lucide-react';
import { Booking } from '@/app/admin/types';

interface MainHeaderProps {
  searchText: string;
  setSearchText: (text: string) => void;
  searchResults: Booking[];
  setSelectedBooking: (booking: Booking) => void;
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
}

export default function MainHeader({
  searchText,
  setSearchText,
  searchResults,
  setSelectedBooking,
  showSearchResults,
  setShowSearchResults,
}: MainHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Lấy và format ngày hiện tại theo định dạng dd/mm/yyyy
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const yyyy = today.getFullYear();
  const currentDate = `${dd}/${mm}/${yyyy}`;

  // Click outside listener to dismiss search predict block
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSearchResults]);

  return (
<header className="-mt-5 flex justify-between items-center mb-8 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm shrink-0">      
<div className="flex items-center space-x-3">
        <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Sơ đồ phòng - {currentDate}
          </h2>
          
        </div>
      </div>

      {/* Predictive Search Input Container */}
      <div ref={containerRef} className="relative w-96">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
          <Search className="h-5 w-5" />
        </span>
        
        <input
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setShowSearchResults(true);
          }}
          onFocus={() => setShowSearchResults(true)}
          className={`block w-full pl-11 pr-11 py-2.5 border rounded-xl bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-2 transition-all text-slate-700 font-medium placeholder:text-slate-400 ${
            showSearchResults && searchText && searchResults.length === 0
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-600'
              : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600'
          }`}
          placeholder="Tìm theo mã đặt phòng, tên hoặc SĐT..."
        />

        {searchText && (
          <button
            onClick={() => {
              setSearchText('');
              setShowSearchResults(false);
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}

        {/* Prediction Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="p-2 border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-3">
              Mã đặt phòng khớp thông tin ({searchResults.length})
            </div>
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto custom-scrollbar">
              {searchResults.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowSearchResults(false);
                  }}
                  className="px-4 py-2.5 hover:bg-blue-50/50 hover:text-blue-900 cursor-pointer transition-colors"
                >
                  <p className="text-xs font-semibold text-slate-800">{booking.id}</p>
                  <p className="text-[10.5px] text-gray-400 mt-0.5">
                    {booking.guestName} • {booking.phone} {booking.roomType ? `• [${booking.roomType}]` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showSearchResults && searchText && searchResults.length === 0 && (
          <div className="absolute z-50 left-0 right-0 mt-2 bg-red-50 border border-red-200 rounded-xl shadow-xl overflow-hidden p-4 text-center text-xs text-red-600 font-medium">
            Không tìm thấy kết quả trùng khớp cho &quot;{searchText}&quot;
          </div>
        )}
      </div>
    </header>
  );
}
