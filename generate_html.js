const fs = require('fs');
const path = require('path');

const outDir = "D:\\65KTPM\\nam3\\Tuong Tac Nguoi May\\figma";
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const outFile = path.join(outDir, "17_Screens_Figma_Import.html");

function renderSidebar() {
    return `
    <aside class="w-[260px] bg-[#171f2c] flex flex-col text-[#94a3b8] z-10 shrink-0">
        <div class="h-[70px] flex items-center px-6 border-b border-white/5">
            <h1 class="text-xl font-black text-white tracking-widest">THAD<span class="text-blue-500 font-medium tracking-normal">HOTEL</span></h1>
        </div>
        <nav class="flex-1 py-6 flex flex-col gap-2">
            <div class="flex items-center gap-3 px-6 py-3 font-medium text-sm"><i data-lucide="home" class="w-5 h-5"></i> Bảng điều khiển & Check-in</div>
            <div class="flex items-center gap-3 px-6 py-3 font-medium text-sm"><i data-lucide="bed" class="w-5 h-5"></i> Quản lý phòng</div>
            <div class="flex items-center gap-3 px-6 py-3 font-medium text-sm"><i data-lucide="check-square" class="w-5 h-5"></i> Thủ tục Check-out</div>
            <div class="flex items-center gap-3 px-3 py-3 mx-3 font-medium text-sm bg-[#1e2e42] text-white border-l-4 border-blue-500 rounded-lg"><i data-lucide="gift" class="w-5 h-5 text-blue-400"></i> Sự kiện & Ưu đãi</div>
        </nav>
        <div class="p-6 border-t border-white/5 flex items-center gap-3 font-medium text-sm">
            <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-slate-600">N</div>
            Đăng xuất
        </div>
    </aside>`;
}

function renderHeader() {
    return `
    <header class="h-[70px] bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
        <h2 class="text-lg font-bold text-slate-800">Hệ thống Quản lý Khách sạn</h2>
        <div class="flex items-center gap-4">
            <div class="text-right"><p class="text-sm font-bold text-slate-800">Quản trị viên THAD</p><p class="text-xs text-slate-500">Quản lý hệ thống</p></div>
            <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">Q</div>
        </div>
    </header>`;
}

function renderTable(rows) {
    const tbody = rows.map(r => `
        <tr class="hover:bg-slate-50/50">
            <td class="p-5 font-bold text-slate-800 text-sm">${r.id}</td>
            <td class="p-5 text-slate-800 text-sm font-semibold">${r.title}</td>
            <td class="p-5 text-slate-600 text-sm">${r.type}</td>
            <td class="p-5"><span class="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">Đang hoạt động <i data-lucide="chevron-down" class="h-3 w-3"></i></span></td>
            <td class="p-5 text-slate-600 text-sm">${r.views}</td>
            <td class="p-5 text-center flex justify-center gap-2">
                <button class="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-semibold text-slate-600 bg-white shadow-sm">Sửa</button>
                <button class="px-3 py-1.5 border border-red-200 rounded-md text-xs font-semibold text-red-600 bg-white shadow-sm">Xóa</button>
            </td>
        </tr>
    `).join('');
    
    return `
    <div class="p-8 flex-1 flex flex-col space-y-6">
        <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div class="flex gap-4">
                <div class="relative"><i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"></i><input type="text" placeholder="Tìm kiếm sự kiện, ưu đãi..." class="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-72 outline-none"></div>
                <div class="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 flex items-center gap-2">Tất cả phân loại <i data-lucide="chevron-down" class="h-4 w-4 text-slate-400"></i></div>
            </div>
            <button class="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm"><i data-lucide="plus" class="h-4 w-4"></i> Soạn bài viết mới</button>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <th class="p-5">Mã</th><th class="p-5">Tiêu đề bài viết</th><th class="p-5">Phân loại</th><th class="p-5">Trạng thái</th><th class="p-5">Lượt xem</th><th class="p-5 text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">${tbody}</tbody>
            </table>
        </div>
    </div>`;
}

function renderModal(title, v, err) {
    const isError = err === true;
    const borderCls = isError ? "border-red-500 bg-[#fff5f5]" : "border-slate-200";
    const titleErr = isError ? `<p class="text-xs text-red-500 font-bold mt-1">Vui lòng nhập tiêu đề bài viết.</p>` : "";
    const descErr = isError ? `<p class="text-xs text-red-500 font-bold mt-1">Vui lòng nhập mô tả ngắn.</p>` : "";
    const date1Err = isError ? `<p class="text-xs text-red-500 font-bold mt-1">Vui lòng nhập thời gian bắt đầu.</p>` : "";
    const date2Err = isError ? `<p class="text-xs text-red-500 font-bold mt-1">Vui lòng nhập thời gian kết thúc.</p>` : "";
    const pErr = isError ? `<p class="text-xs text-red-500 font-bold mt-1">Sức chứa tối đa không hợp lệ ( > 0 ).</p>` : "";

    return `
    <div class="absolute inset-0 bg-slate-800/40 z-20 flex justify-center items-center">
        <div class="w-[850px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div class="px-6 py-5 flex justify-between items-center bg-white border-b border-transparent">
                <h2 class="text-xl font-bold text-slate-800">${title}</h2>
                <button class="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-500"><i data-lucide="x" class="h-5 w-5"></i></button>
            </div>
            <div class="px-6 pb-4 pt-2 grid grid-cols-[1fr_280px] gap-6 bg-white">
                <div class="space-y-5">
                    <div class="bg-white rounded-xl space-y-4">
                        <div class="space-y-1.5"><label class="text-sm font-bold text-slate-700">Tiêu đề bài viết <span class="text-red-500">*</span></label><input type="text" value="${v.title}" class="w-full px-4 py-2.5 border ${borderCls} rounded-lg text-sm outline-none font-medium text-slate-800" placeholder="Nhập tiêu đề...">${titleErr}</div>
                        <div class="space-y-1.5"><div class="flex justify-between items-center"><label class="text-sm font-bold text-slate-700">Mô tả ngắn</label><span class="text-xs text-slate-400 font-medium">${v.desc ? v.desc.length : 0}/150</span></div><textarea rows="3" class="w-full px-4 py-2.5 border ${borderCls} rounded-lg text-sm outline-none resize-none font-medium text-slate-800" placeholder="Tóm tắt nội dung chính...">${v.desc}</textarea>${descErr}</div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1.5"><label class="text-sm font-bold text-slate-700">Thời gian bắt đầu <span class="text-red-500">*</span></label><div class="relative"><input type="text" value="${v.d1}" class="w-full pl-4 pr-10 py-2.5 border ${borderCls} rounded-lg text-sm outline-none font-medium text-slate-800" placeholder="dd/mm/yyyy --:--"><i data-lucide="calendar" class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600"></i></div>${date1Err}</div>
                            <div class="space-y-1.5"><label class="text-sm font-bold text-slate-700">Thời gian kết thúc <span class="text-red-500">*</span></label><div class="relative"><input type="text" value="${v.d2}" class="w-full pl-4 pr-10 py-2.5 border ${err?'border-slate-200':'border-slate-200'} rounded-lg text-sm outline-none font-medium text-slate-800" placeholder="dd/mm/yyyy --:--"><i data-lucide="calendar" class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600"></i></div>${date2Err}</div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1.5"><label class="text-sm font-bold text-slate-700">Sức chứa tối đa (người) <span class="text-red-500">*</span></label><input type="text" value="${v.p}" class="w-full px-4 py-2.5 border ${borderCls} rounded-lg text-sm outline-none font-medium text-slate-800">${pErr}</div>
                            ${v.type === 'Ưu đãi' ? '<div class="space-y-1.5"><label class="text-sm font-bold text-slate-700">Ưu đãi (%) <span class="text-red-500">*</span></label><input type="text" value="' + v.discount + '" class="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none font-medium text-slate-800"></div>' : ''}
                        </div>
                        <div class="space-y-1.5"><label class="text-sm font-bold text-slate-700">Ảnh bìa (Tối đa 5MB)</label><div class="border-2 border-dashed border-slate-200 bg-[#f8fafc] rounded-xl p-8 text-center h-24 flex items-center justify-center relative overflow-hidden"><i data-lucide="upload-cloud" class="h-8 w-8 text-slate-400"></i></div></div>
                    </div>
                </div>
                <div class="space-y-6">
                    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                        <h3 class="font-bold text-slate-800 pb-2">Cấu hình xuất bản</h3>
                        <div class="space-y-2"><label class="text-sm font-bold text-slate-700">Phân loại</label><div class="relative"><select class="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none appearance-none font-medium text-slate-700"><option>${v.type}</option></select><i data-lucide="chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"></i></div></div>
                        <div class="pt-4 border-t border-slate-100"><div class="flex items-center justify-between"><label class="text-sm font-bold text-slate-700">Lên lịch tự động</label><i data-lucide="toggle-left" class="h-6 w-6 text-slate-300"></i></div></div>
                    </div>
                </div>
            </div>
            <div class="px-6 py-4 flex justify-end gap-3 bg-white mt-4 border-t border-slate-100">
                <button class="px-6 py-2 bg-slate-50 text-slate-700 font-semibold rounded-lg text-sm border border-slate-200">Hủy bỏ</button>
                <button class="px-8 py-2 bg-[#2563eb] text-white font-semibold rounded-lg text-sm shadow-md">${v.btnText || 'Xuất bản ngay'}</button>
            </div>
        </div>
    </div>`;
}

function renderConfirm(title, descTitle) {
    return `
    <div class="absolute inset-0 bg-slate-800/50 z-20 flex justify-center items-center">
        <div class="w-[450px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center">
            <h3 class="text-lg font-bold text-slate-900 mb-2">${title}</h3>
            <p class="text-sm text-slate-600 mb-6">Bạn chắc chắn muốn ${title.toLowerCase().replace('?', '')} bài viết <strong class="text-slate-800">${descTitle}</strong>?</p>
            <div class="flex gap-3 justify-center w-full">
                <button class="px-6 py-2.5 bg-[#f1f5f9] text-slate-700 font-bold rounded-lg text-sm">Hủy</button>
                <button class="px-6 py-2.5 bg-[#0d6efd] text-white font-bold rounded-lg text-sm shadow-md">Xác nhận</button>
            </div>
        </div>
    </div>`;
}

function renderToast(text) {
    return `
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <div class="bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] px-6 py-3 rounded-xl shadow-lg flex items-center justify-between gap-3 w-[500px]">
            <div class="flex items-center gap-2"><i data-lucide="check-circle-2" class="h-5 w-5 text-[#10b981]"></i><p class="font-semibold text-sm">${text}</p></div>
            <button><i data-lucide="x" class="h-4 w-4 text-[#34d399]"></i></button>
        </div>
    </div>`;
}

function renderGuestHeader() {
    return `
    <header class="h-20 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-20 shrink-0 w-full z-20 absolute top-0">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-[#0d6efd] rounded text-white flex items-center justify-center font-bold">T</div>
            <h1 class="text-lg font-black text-slate-900 tracking-tight">THAD HOTEL</h1>
        </div>
        <nav class="flex h-full items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#" class="h-full flex items-center hover:text-blue-600">Trang chủ</a>
            <a href="#" class="h-full flex items-center hover:text-blue-600">Phòng nghỉ</a>
            <a href="#" class="h-full flex items-center text-blue-600 border-b-2 border-blue-600">Sự kiện & Ưu đãi</a>
            <a href="#" class="h-full flex items-center hover:text-blue-600">Liên hệ</a>
        </nav>
        <button class="px-6 py-2 rounded-lg border border-slate-200 bg-transparent text-slate-800 text-sm font-bold hover:bg-slate-100">Đăng nhập</button>
    </header>`;
}

function renderGuestHero() {
    return `
    <div class="w-full h-[600px] bg-slate-800 relative mt-20 flex flex-col items-center justify-center text-center px-4">
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40"></div>
        <h2 class="text-5xl font-black text-white relative z-10 mb-4 tracking-tight">Ưu đãi: Giảm ngay 10%</h2>
        <p class="text-lg text-slate-200 relative z-10 max-w-2xl mb-8 font-medium">Áp dụng mã SUMMER10 để nhận ưu đãi giảm giá 10% cho tất cả các dịch vụ Spa và thư giãn.</p>
        <button class="px-8 py-3 bg-[#0d6efd] text-white font-bold rounded-lg relative z-10 shadow-lg">Xem chi tiết ưu đãi</button>
        <button class="absolute left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-md z-10"><i data-lucide="chevron-left"></i></button>
        <button class="absolute right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-md z-10"><i data-lucide="chevron-right"></i></button>
    </div>
    <div class="w-[900px] bg-white rounded-2xl shadow-xl p-8 relative -mt-24 z-20 mx-auto border border-slate-100">
        <h3 class="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest">Thông tin tìm kiếm</h3>
        <div class="grid grid-cols-2 gap-6 mb-6">
            <div class="space-y-2"><label class="text-xs font-bold text-slate-500 flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4"></i> NGÀY NHẬN PHÒNG</label><div class="relative"><input type="text" value="06/06/2026" class="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm font-medium"><i data-lucide="calendar" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800"></i></div></div>
            <div class="space-y-2"><label class="text-xs font-bold text-slate-500 flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4"></i> NGÀY TRẢ PHÒNG</label><div class="relative"><input type="text" value="07/06/2026" class="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm font-medium"><i data-lucide="calendar" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800"></i></div></div>
            <div class="space-y-2"><label class="text-xs font-bold text-slate-500 flex items-center gap-2"><i data-lucide="users" class="w-4 h-4"></i> SỐ LƯỢNG KHÁCH</label><div class="flex items-center justify-between px-4 py-2.5 rounded-lg border border-slate-200"><button class="w-8 h-8 bg-slate-50 rounded text-slate-500 flex items-center justify-center"><i data-lucide="minus" class="w-4 h-4"></i></button><span class="text-sm font-bold">2 khách</span><button class="w-8 h-8 bg-slate-50 rounded text-slate-500 flex items-center justify-center"><i data-lucide="plus" class="w-4 h-4"></i></button></div></div>
            <div class="space-y-2"><label class="text-xs font-bold text-slate-500 flex items-center gap-2"><i data-lucide="bed" class="w-4 h-4"></i> LOẠI PHÒNG</label><div class="relative"><select class="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm font-medium appearance-none"><option>Tất cả</option></select><i data-lucide="chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800"></i></div></div>
        </div>
        <button class="w-full py-3.5 bg-[#0d6efd] text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-md"><i data-lucide="search" class="w-4 h-4"></i> Tìm phòng khả dụng</button>
    </div>
    <div class="flex-1 bg-slate-50 w-full mt-[-80px] pt-[120px]"></div>`;
}

function renderGuestList() {
    return `
    <div class="flex-1 bg-slate-50 w-full mt-20 pt-16 px-20 flex justify-center">
        <div class="max-w-6xl w-full grid grid-cols-2 gap-8">
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div class="h-64 bg-slate-800 relative">
                    <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-80"></div>
                    <div class="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Hot Deal</div>
                </div>
                <div class="p-8 flex flex-col flex-1">
                    <h3 class="text-2xl font-bold text-slate-800 mb-3">Gói Nghỉ Dưỡng Mùa Hè & Spa Trị Liệu</h3>
                    <p class="text-slate-500 text-sm mb-8 leading-relaxed flex-1">Tận hưởng không gian thư giãn tuyệt đối với gói nghỉ dưỡng bao gồm phòng Superior và 1 liệu trình massage toàn thân miễn phí dành cho 2 người.</p>
                    <div class="flex items-center justify-between font-bold text-sm">
                        <span class="text-slate-400">Áp dụng đến 30/08/2026</span>
                        <a href="#" class="text-blue-600 flex items-center gap-1 hover:underline">Xem chi tiết <i data-lucide="arrow-right" class="w-4 h-4"></i></a>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div class="h-64 bg-slate-800 relative">
                    <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-80"></div>
                    <div class="absolute top-4 left-4 bg-[#f59e0b] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Sự kiện</div>
                </div>
                <div class="p-8 flex flex-col flex-1">
                    <h3 class="text-2xl font-bold text-slate-800 mb-3">Tiệc Hồ Bơi Chào Đón Mùa Hè Đầy Sôi Động</h3>
                    <p class="text-slate-500 text-sm mb-8 leading-relaxed flex-1">Hòa mình vào không khí sôi động với DJ quốc tế, đồ uống nhiệt đới không giới hạn và tiệc nướng BBQ hấp dẫn bên cạnh hồ bơi vô cực.</p>
                    <div class="flex items-center justify-between font-bold text-sm">
                        <span class="text-slate-400">Diễn ra vào Thứ 7 hàng tuần</span>
                        <a href="#" class="text-blue-600 flex items-center gap-1 hover:underline">Xem chi tiết <i data-lucide="arrow-right" class="w-4 h-4"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderGuestDetail(type, isPromo, copied) {
    const heroTitle = isPromo ? 'Giảm ngay 10% Dịch vụ Spa' : 'Sự kiện Summer Wedding';
    const heroTag = isPromo ? 'Ưu đãi đặc biệt' : 'Sự kiện nổi bật';
    const tagBg = isPromo ? 'bg-[#0d6efd]' : 'bg-[#0ea5e9]';
    
    let rightCol = '';
    if (isPromo) {
        const btnCls = copied ? 'bg-[#10b981] text-white' : 'bg-[#f59e0b] text-white';
        const btnIcon = copied ? 'check' : 'copy';
        const btnText = copied ? 'Đã sao chép' : 'Sao chép mã';
        rightCol = `
        <div class="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#f59e0b] shadow-sm mb-4"><i data-lucide="tag" class="w-6 h-6"></i></div>
            <h4 class="font-bold text-[#b45309] mb-4">Mã Ưu Đãi Của Bạn</h4>
            <div class="w-full py-4 border-2 border-dashed border-[#fcd34d] rounded-xl bg-white mb-4">
                <span class="text-2xl font-black tracking-widest text-[#d97706]">SUMMER10</span>
            </div>
            <button class="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${btnCls} shadow-md transition-colors"><i data-lucide="${btnIcon}" class="w-5 h-5"></i> ${btnText}</button>
            <p class="text-[11px] text-[#d97706] italic mt-4 font-medium">Sử dụng mã này tại bước thanh toán để được giảm giá.</p>
        </div>`;
    } else {
        rightCol = `
        <div class="space-y-6">
            <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
                <h4 class="font-bold text-slate-800 flex items-center gap-2"><i data-lucide="calendar" class="w-5 h-5 text-blue-600"></i> Thời gian diễn ra</h4>
                <div class="space-y-3 pt-2 border-t border-slate-50">
                    <div class="flex justify-between items-center text-sm font-medium"><span class="text-slate-500">Bắt đầu:</span><span class="text-slate-900 font-bold">01/06/2026</span></div>
                    <div class="flex justify-between items-center text-sm font-medium"><span class="text-slate-500">Kết thúc:</span><span class="text-slate-900 font-bold">31/08/2026</span></div>
                </div>
            </div>
            <div class="bg-[#f0f9ff] border border-[#e0f2fe] rounded-xl p-5 flex items-start gap-4">
                <i data-lucide="info" class="w-5 h-5 text-[#0284c7] shrink-0 mt-0.5"></i>
                <div>
                    <p class="text-sm text-[#0369a1] mb-1 font-medium">Nếu bạn cần hỗ trợ thêm thông tin, vui lòng liên hệ hotline:</p>
                    <p class="text-base font-black text-[#0284c7]">1900 1234</p>
                </div>
            </div>
        </div>`;
    }

    return `
    <div class="w-full bg-slate-50 mt-20 flex flex-col flex-1">
        <div class="w-full h-[400px] bg-slate-900 relative flex flex-col items-center justify-center text-center px-4">
            <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30"></div>
            <div class="${tagBg} text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm relative z-10 mb-6">${heroTag}</div>
            <h2 class="text-5xl font-black text-white relative z-10 mb-4 tracking-tight">${heroTitle}</h2>
            <p class="text-lg text-slate-200 relative z-10 max-w-2xl font-medium">Khám phá không gian tuyệt vời và nhận những ưu đãi hấp dẫn chỉ có trong mùa hè này.</p>
        </div>
        <div class="max-w-5xl w-full mx-auto py-16 grid grid-cols-[1fr_380px] gap-16">
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-slate-800">Thông tin chi tiết</h3>
                <div class="text-slate-600 leading-relaxed space-y-4">
                    <p>Tận hưởng kỳ nghỉ dưỡng hoàn hảo tại THAD HOTEL và chăm sóc bản thân với dịch vụ Spa đẳng cấp. Áp dụng ngay mã giảm giá để nhận ưu đãi 10% cho tất cả các liệu trình massage và thư giãn.</p>
                    <p>Đội ngũ chuyên gia của chúng tôi cam kết mang lại cho bạn những phút giây thư giãn tuyệt đối và những kỷ niệm khó quên. Hệ thống thiết bị hiện đại cùng kỹ thuật viên giàu kinh nghiệm sẽ giúp bạn tái tạo năng lượng sau chuỗi ngày làm việc căng thẳng.</p>
                </div>
            </div>
            <div>
                ${rightCol}
            </div>
        </div>
    </div>`;
}

function buildGuestFrame(content) {
    return `
    <div class="w-[1440px] h-[900px] bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col relative shrink-0">
        ${renderGuestHeader()}
        ${content}
    </div>`;
}


function buildFrame(content) {
    return `
    <div class="w-[1440px] h-[900px] bg-white shadow-2xl rounded-lg overflow-hidden flex relative shrink-0">
        ${renderSidebar()}
        <div class="flex-1 flex flex-col bg-[#f8fafc]">
            ${renderHeader()}
            <div class="flex-1 flex flex-col relative">
                ${content}
            </div>
        </div>
    </div>`;
}

const rowsBase = [
    {id: 'EV-001', title: 'Sự kiện: Summer Wedding', type: 'Sự kiện', views: '1250'},
    {id: 'EV-002', title: 'Ưu đãi: Giảm ngay 20%', type: 'Ưu đãi', views: '3420'},
    {id: 'EV-003', title: 'Tiệc nướng BBQ bãi biển', type: 'Sự kiện', views: '890'},
];

const rowsDemo1 = [
    {id: 'EV-004', title: 'demo1', type: 'Sự kiện', views: '0'},
    ...rowsBase
];

const rowsDemo2 = [
    {id: 'EV-005', title: 'demo2', type: 'Ưu đãi', views: '0'},
    ...rowsDemo1
];

const rowsUpdated = rowsDemo2.map(r => r.id === 'EV-002' ? {...r, title: 'Ưu đãi: Giảm ngay 10%'} : r);
const rowsDeleted = rowsUpdated.filter(r => r.id !== 'EV-001');

const vBlank = {title: '', desc: '', d1: '', d2: '', p: '', type: 'Sự kiện'};
const vDemo1 = {title: 'demo1', desc: 'demo1', d1: '13/06/2026 05:42 CH', d2: '14/06/2026 05:42 CH', p: '100', type: 'Sự kiện'};
const vDemo2 = {title: 'demo2', desc: 'demo2', d1: '13/06/2026', d2: '14/06/2026', p: '50', type: 'Ưu đãi', discount: '10'};
const vUpdateOriginal = {title: 'Ưu đãi: Giảm ngay 20%', desc: 'Áp dụng mã SUMMER20 để nhận ưu đãi giảm giá 20% cho tất cả các dịch vụ Spa và thư giãn.', d1: '13/06/2026 05:45 CH', d2: '14/06/2026 05:45 CH', p: '100', type: 'Ưu đãi', discount: '20', btnText: 'Cập nhật'};
const vUpdateNew = {title: 'Ưu đãi: Giảm ngay 10%', desc: 'Áp dụng mã SUMMER10 để nhận ưu đãi giảm giá 10% cho tất cả các dịch vụ Spa và thư giãn.', d1: '13/06/2026 05:45 CH', d2: '14/06/2026 05:45 CH', p: '100', type: 'Ưu đãi', discount: '10', btnText: 'Cập nhật'};

const vBlankPromo = {title: '', desc: '', d1: '', d2: '', p: '', type: 'Ưu đãi', discount: ''};

const frames = [
    buildFrame(renderTable(rowsBase)), // 1
    buildFrame(renderTable(rowsBase) + '<div class="absolute inset-0 bg-slate-800/40 z-10"></div>' + renderModal('Soạn bài viết mới', vBlank, false)), // 2
    buildFrame(renderTable(rowsBase) + '<div class="absolute inset-0 bg-slate-800/40 z-10"></div>' + renderModal('Soạn bài viết mới', vBlank, true)), // 3 (Error Modal inserted here)
    buildFrame(renderTable(rowsBase) + '<div class="absolute inset-0 bg-slate-800/40 z-10"></div>' + renderModal('Soạn bài viết mới', vDemo1, false)), // 4
    buildFrame(renderTable(rowsBase) + '<div class="absolute inset-0 bg-slate-800/40 z-10"></div>' + renderConfirm('Xác nhận lưu?', 'demo1')), // 5
    buildFrame(renderToast('Lưu bài viết thành công!') + renderTable(rowsDemo1)), // 6
    buildFrame(renderTable(rowsDemo1) + '<div class="absolute inset-0 bg-slate-800/40 z-10"></div>' + renderModal('Soạn bài viết mới', vBlankPromo, false)), // 7 (NEW)
    buildFrame(renderTable(rowsDemo1) + '<div class="absolute inset-0 bg-slate-800/40 z-10"></div>' + renderModal('Soạn bài viết mới', vBlankPromo, true)), // 8
    buildFrame(renderTable(rowsDemo1) + '<div class="absolute inset-0 bg-slate-800/40 z-10"></div>' + renderModal('Soạn bài viết mới', vDemo2, false)), // 9
    buildFrame(renderTable(rowsDemo1) + '<div class="absolute inset-0 bg-slate-800/40 z-10"></div>' + renderConfirm('Xác nhận lưu?', 'demo2')), // 10
    buildFrame(renderTable(rowsDemo2)), // 11
    buildFrame(renderTable(rowsDemo2) + '<div class="absolute inset-0 bg-slate-800/40 z-10"></div>' + renderModal('Sửa bài viết', vUpdateOriginal, false)), // 12 (Original 20%)
    buildFrame(renderTable(rowsDemo2) + '<div class="absolute inset-0 bg-slate-800/40 z-10"></div>' + renderModal('Sửa bài viết', vUpdateNew, false)), // 13 (Updated 10%)
    buildFrame(renderTable(rowsDemo2) + '<div class="absolute inset-0 bg-slate-800/40 z-10"></div>' + renderConfirm('Xác nhận cập nhật?', 'Ưu đãi: Giảm ngay 10%')), // 14
    buildFrame(renderToast('Cập nhật bài viết thành công!') + renderTable(rowsUpdated)), // 15
    buildFrame(renderTable(rowsUpdated) + '<div class="absolute inset-0 bg-slate-800/40 z-10"></div>' + renderConfirm('Xác nhận xóa?', 'Sự kiện: Summer Wedding')), // 16
    buildFrame(renderToast('Đã xóa bài viết EV-001 thành công!') + renderTable(rowsDeleted)), // 17
    
    // NEW GUEST SCREENS
    buildGuestFrame(renderGuestHero()), // 18
    buildGuestFrame(renderGuestList()), // 19
    buildGuestFrame(renderGuestDetail('promo', true, false)), // 20
    buildGuestFrame(renderGuestDetail('promo', true, true)), // 21
    buildGuestFrame(renderGuestDetail('event', false, false)) // 22
];

const html = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>17 Screens Export</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #cbd5e1; padding: 40px; margin: 0; }
        .canvas { display: flex; flex-direction: column; gap: 100px; align-items: center; }
    </style>
</head>
<body>
    <div class="canvas">
        ${frames.map((frame, i) => `
        <div class="flex flex-col gap-4">
            <div class="text-4xl font-black text-slate-700 bg-white px-8 py-4 rounded-xl shadow-md w-max border-l-8 border-blue-500">Màn hình ${i + 1}</div>
            ${frame}
        </div>
        `).join('\n')}
    </div>
    <script>lucide.createIcons();</script>
</body>
</html>`;

fs.writeFileSync(outFile, html, 'utf8');
console.log("Generated HTML with " + frames.length + " frames to " + outFile);
