export default function Legend() {
  return (
    <div className="flex flex-wrap gap-5 text-xs text-slate-600 font-medium">
      
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 rounded-md border border-slate-200 bg-white shadow-sm flex-shrink-0"></div>
        <span className="text-slate-700">Trống</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 rounded-md bg-[#fef9c3] border border-[#fde047] shadow-sm flex-shrink-0"></div>
        <span className="text-slate-700">Đã đặt</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 rounded-md bg-[#fee2e2] border border-[#fecaca] shadow-sm flex-shrink-0"></div>
        <span className="text-slate-700">Đang ở</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 rounded-md bg-[#e5e7eb] border border-[#d1d5db] shadow-sm flex-shrink-0"></div>
        <span className="text-slate-700">Dọn dẹp</span>
      </div>
    </div>
  );
}