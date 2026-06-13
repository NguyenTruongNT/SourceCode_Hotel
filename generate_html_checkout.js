const fs = require('fs');

const globalCSS = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
body { background: #f8fafc; color: #1e293b; overflow-x: auto; display: flex; flex-direction: column; gap: 40px; padding: 40px; }
.frame-container { position: relative; width: 1440px; height: 900px; background: #f8fafc; overflow: hidden; border: 1px solid #e2e8f0; flex-shrink: 0; }
.frame-title { position: absolute; top: -30px; left: 0; font-weight: bold; color: #64748b; font-size: 14px; z-index: 1000; }

/* Sidebar */
.sidebar { width: 260px; height: 100%; background: #0f172a; position: absolute; left: 0; top: 0; border-right: 1px solid #1e293b; display: flex; flex-direction: column; z-index: 10;}
.logo-area { padding: 24px; color: white; font-size: 24px; font-weight: 900; letter-spacing: 1px; border-bottom: 1px solid #1e293b; display: flex; align-items: center; gap: 8px;}
.logo-text span { color: #3b82f6; font-weight: 500; letter-spacing: normal;}
.nav-menu { flex: 1; padding: 24px 16px; display: flex; flex-direction: column; gap: 8px; }
.nav-item { padding: 12px 16px; border-radius: 8px; color: #94a3b8; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 12px; }
.nav-item.active { background: rgba(59, 130, 246, 0.1); color: white; border-left: 3px solid #3b82f6; }
.nav-item svg { width: 20px; height: 20px; }
.user-profile { padding: 20px 16px; border-top: 1px solid #1e293b; display: flex; align-items: center; gap: 12px; color: #94a3b8; font-size: 14px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: #000; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }

/* Header */
.header { height: 70px; background: white; border-bottom: 1px solid #e2e8f0; position: absolute; top: 0; left: 260px; right: 0; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; z-index: 9;}
.header-title { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 16px; }
.header-right { display: flex; align-items: center; gap: 12px; }
.header-user-info { text-align: right; line-height: 1.2; }
.header-name { font-size: 14px; font-weight: 600; }
.header-role { font-size: 12px; color: #64748b; }
.header-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(to bottom right, #3b82f6, #1d4ed8); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
.reset-btn { font-size: 12px; padding: 6px 12px; background: #ffe4e6; color: #be123c; font-weight: 600; border-radius: 4px; border: none;}

/* Main Content */
.main-content { position: absolute; top: 70px; left: 260px; right: 0; bottom: 0; padding: 32px; overflow-y: auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-title h2 { font-size: 24px; font-weight: 700; color: #1e293b; }
.page-title p { font-size: 14px; color: #64748b; margin-top: 4px; }
.page-actions { display: flex; gap: 16px; }
.search-box { position: relative; width: 256px; }
.search-box input { width: 100%; padding: 8px 16px 8px 40px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; }
.search-box svg { position: absolute; left: 12px; top: 10px; width: 16px; height: 16px; color: #94a3b8; }
.filter-btn { display: flex; align-items: center; gap: 8px; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #334155; background: white; }

/* Room Grid */
.room-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.room-card { background: white; border: 2px solid #fecdd3; border-radius: 12px; padding: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.room-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.room-number { font-size: 24px; font-weight: 900; color: #e11d48; }
.room-badge { padding: 4px 10px; background: #ffe4e6; color: #9f1239; font-size: 12px; font-weight: 700; border-radius: 4px; }
.room-info { margin-bottom: 24px; }
.room-info p { font-size: 12px; color: #64748b; margin-bottom: 8px; }
.room-info p span { font-weight: 600; font-size: 14px; color: #475569; }
.checkout-btn { width: 100%; background: #2563eb; color: white; font-weight: 600; padding: 10px; border-radius: 8px; font-size: 14px; text-align: center; border: none; }

/* Modal Overlay */
.modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); z-index: 50; display: flex; align-items: center; justify-content: center; }
.modal-content { background: white; border-radius: 16px; width: 896px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; }
.modal-header { padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
.modal-header h3 { font-size: 20px; font-weight: 700; }
.modal-body { padding: 24px; display: flex; gap: 24px; background: #f8fafc; }

/* Left Column */
.modal-left { flex: 2; display: flex; flex-direction: column; gap: 24px; }
.info-box { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.info-box-title { font-weight: 700; color: #1e293b; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px; }
.info-grid p { color: #64748b; }
.info-grid span { font-weight: 600; color: #1e293b; }
.warning-text { color: #e11d48; font-weight: 600; grid-column: span 2; margin-top: 8px; }
.fee-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 12px; }
.fee-row:last-child { margin-bottom: 0; }
.fee-label { color: #475569; }
.fee-value { font-weight: 500; color: #1e293b; }
.fee-row.red { color: #e11d48; font-weight: 600; }
.fee-row.red .fee-value { font-weight: 700; color: #e11d48; }
.add-fee-btn { color: #2563eb; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 4px; }

/* Right Column */
.modal-right { flex: 1; display: flex; flex-direction: column; }
.payment-box { background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.05); flex: 1; display: flex; flex-direction: column; }
.payment-total-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
.total-label { font-size: 18px; font-weight: 700; color: #334155; }
.total-amount { font-size: 30px; font-weight: 900; color: #2563eb; }
.payment-methods { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.method-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; border-radius: 8px; border: 2px solid #e2e8f0; color: #475569; transition: all 0.2s; }
.method-btn.active { border-color: #3b82f6; background: #eff6ff; color: #1d4ed8; }
.method-btn svg { width: 24px; height: 24px; margin-bottom: 4px; }
.method-btn span { font-size: 12px; font-weight: 700; text-align: center; }
.preview-invoice-btn { margin-top: 16px; width: 100%; background: #1e293b; color: white; font-weight: 700; padding: 12px; border-radius: 8px; display: flex; justify-content: center; align-items: center; gap: 8px; border: none; }

/* Warning yellow box */
.yellow-warning { background: #fefce8; border: 1px solid #fef08a; padding: 12px; border-radius: 8px; color: #854d0e; font-size: 14px; display: flex; gap: 8px; margin-bottom: 16px; }

/* Success Modal */
.success-modal { background: white; padding: 32px; border-radius: 16px; display: flex; flex-direction: column; align-items: center; width: 450px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
.success-icon { width: 80px; height: 80px; background: #d1fae5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.success-icon svg { width: 40px; height: 40px; }
.success-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
.success-desc { text-align: center; color: #64748b; margin-bottom: 24px; font-size: 14px; line-height: 1.5; }
.success-actions { display: flex; gap: 12px; }
.btn-close { border: none; padding: 10px 24px; background: #f1f5f9; color: #334155; font-weight: 600; border-radius: 8px; font-size: 14px; }
.btn-export { border: none; padding: 10px 24px; background: #1e293b; color: white; font-weight: 600; border-radius: 8px; font-size: 14px; display: flex; align-items: center; gap: 8px; }

/* Printable Invoice */
.invoice-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: white; z-index: 100; padding: 32px; overflow-y: auto; }
.invoice-container { max-width: 768px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); position: relative; }
.invoice-header-flex { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1e293b; padding-bottom: 24px; margin-bottom: 32px; }
.invoice-logo h1 { font-size: 30px; font-weight: 900; letter-spacing: 2px; color: #0f172a; }
.invoice-logo h1 span { color: #2563eb; font-weight: 500; letter-spacing: normal; }
.invoice-title h2 { font-size: 24px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 2px; }
.invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
.invoice-table th { background: #f1f5f9; color: #475569; padding: 12px 16px; text-align: left; font-size: 14px; font-weight: 600; }
.invoice-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
.print-btn-float { position: absolute; bottom: 32px; right: 32px; background: #2563eb; color: white; padding: 12px 32px; border-radius: 999px; font-weight: 700; display: flex; align-items: center; gap: 8px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }

/* Fake Print Dialog */
.fake-print-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); z-index: 200; display: flex; align-items: center; justify-content: center; }
.fake-print-dialog { width: 100%; height: 100%; background: #e5e5e5; display: flex; }
.print-preview-area { flex: 1; padding: 40px; display: flex; justify-content: center; overflow-y: auto; }
.print-paper { width: 595px; height: 842px; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); transform: scale(0.9); transform-origin: top center; overflow: hidden;}
.print-sidebar { width: 350px; background: white; border-left: 1px solid #d4d4d4; padding: 24px; display: flex; flex-direction: column; }
.print-btn-green { background: #10b981; color: white; padding: 8px 32px; border-radius: 999px; font-weight: 500; font-size: 14px; border: none;}
.print-btn-cancel { border: 1px solid #10b981; color: #10b981; padding: 8px 32px; border-radius: 999px; font-weight: 500; font-size: 14px; background: transparent;}
</style>
`;

const icons = {
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  filter: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
  printer: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`,
  creditCard: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`,
  banknote: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>`,
  edit3: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  home: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  bed: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path></svg>`,
  checkSquare: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`,
  gift: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>`,
  logOut: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`
};

function renderSidebar() {
  return `
    <div class="sidebar">
      <div class="logo-area">THAD<span>HOTEL</span></div>
      <div class="nav-menu">
        <div class="nav-item">${icons.home} Bảng điều khiển & Check-in</div>
        <div class="nav-item">${icons.bed} Quản lý phòng</div>
        <div class="nav-item active">${icons.checkSquare} Thủ tục Check-out</div>
        <div class="nav-item">${icons.gift} Sự kiện & Ưu đãi</div>
      </div>
      <div class="user-profile">
        <div class="avatar">N</div>
        <span>Đăng xuất</span>
      </div>
    </div>
  `;
}

function renderHeader(showResetBtn = false) {
  return `
    <div class="header">
      <div class="header-title">
        Hệ thống Quản lý Khách sạn
        ${showResetBtn ? `<button class="reset-btn">Khôi phục dữ liệu gốc</button>` : ''}
      </div>
      <div class="header-right">
        <div class="header-user-info">
          <div class="header-name">Quản trị viên THAD</div>
          <div class="header-role">Quản lý hệ thống</div>
        </div>
        <div class="header-avatar">Q</div>
      </div>
    </div>
  `;
}

function renderRoomGrid(rooms) {
  return `
    <div class="main-content">
      <div class="page-header">
        <div class="page-title">
          <h2>Quản lý Check-out</h2>
          <p>Chọn phòng đang có khách để tiến hành thanh toán và trả phòng.</p>
        </div>
        <div class="page-actions">
          <div class="search-box">
            ${icons.search}
            <input type="text" placeholder="Tìm theo số phòng...">
          </div>
          <div class="filter-btn">${icons.filter} Lọc phòng</div>
        </div>
      </div>
      <div class="room-grid">
        ${rooms.map(r => `
          <div class="room-card">
            <div class="room-header">
              <span class="room-number">${r.id}</span>
              <span class="room-badge">Đang ở</span>
            </div>
            <div class="room-info">
              <p>Khách: <span>${r.name}</span></p>
              <p>Vào: <span>-</span></p>
              <p>Ra (dự kiến): <span>-</span></p>
            </div>
            <button class="checkout-btn">Tiến hành Check-out</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderCheckoutModal(paymentMethod = null, showWarning = false) {
  const cardActive = paymentMethod === 'card' ? 'active' : '';
  const cashActive = paymentMethod === 'cash' ? 'active' : '';
  
  return `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Thủ tục Check-out - Phòng 206</h3>
          <span style="color:#94a3b8; cursor:pointer;">${icons.x}</span>
        </div>
        <div class="modal-body">
          <div class="modal-left">
            <div class="info-box">
              <div class="info-box-title">Thông tin lưu trú</div>
              <div class="info-grid">
                <p>Khách hàng: <span>Khách vãng lai</span></p>
                <p>Loại phòng: <span>Standard</span></p>
                <p>Nhận phòng: <span>-</span></p>
                <p>Trả phòng: <span>-</span></p>
                <div class="warning-text">Đã quá giờ trả phòng 120 phút (Phụ phí tự động tính)</div>
              </div>
            </div>
            <div class="info-box">
              <div class="info-box-title">
                Dịch vụ & Phụ phí
                <span class="add-fee-btn">${icons.edit3} Thêm phí</span>
              </div>
              <div class="fee-row">
                <span class="fee-label">Nước suối x2</span>
                <span class="fee-value">40.000đ</span>
              </div>
              <div class="fee-row">
                <span class="fee-label">Giặt ủi</span>
                <span class="fee-value">150.000đ</span>
              </div>
              <div class="fee-row red">
                <span class="fee-label">Phụ thu trả phòng trễ</span>
                <span class="fee-value">300.000đ</span>
              </div>
            </div>
          </div>
          <div class="modal-right">
            <div class="payment-box">
              <div class="info-box-title">Chi tiết thanh toán</div>
              <div class="fee-row"><span class="fee-label">Tiền phòng (1 đêm)</span><span class="fee-value">800.000đ</span></div>
              <div class="fee-row"><span class="fee-label">Dịch vụ & Phụ phí</span><span class="fee-value">490.000đ</span></div>
              <div class="fee-row" style="color:#10b981; font-weight:500; margin-bottom: 24px;"><span class="fee-label" style="color:#10b981;">Đã cọc trước</span><span class="fee-value" style="color:#10b981;">-1.000.000đ</span></div>
              
              <div style="border-top:1px solid #f1f5f9; padding-top:16px; margin-bottom:24px;">
                <div class="payment-total-row">
                  <span class="total-label">Cần<br>thanh<br>toán</span>
                  <span class="total-amount">290.000đ</span>
                </div>
                
                ${showWarning ? `
                  <div class="yellow-warning">
                    ${icons.alertCircle}
                    <div>Hóa đơn đã được tạo tạm thời. Xác nhận thanh toán để hoàn tất quá trình Check-out.</div>
                  </div>
                  <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:24px;">
                    <button style="padding:10px 20px; background:#f1f5f9; border-radius:8px; font-weight:600; border:none; color: #334155;">Quay lại</button>
                    <button style="padding:10px 20px; background:#2563eb; color:white; border-radius:8px; font-weight:600; border:none; display:flex; align-items:center; gap:8px;"><span style="width:16px; height:16px; border-radius:50%; border:2px solid white; border-top-color:transparent;"></span> Hoàn tất thanh toán</button>
                  </div>
                ` : `
                  <div style="font-size:12px; font-weight:600; color:#64748b; margin-bottom:8px; text-transform:uppercase;">Phương thức thanh toán</div>
                  <div class="payment-methods">
                    <div class="method-btn ${cardActive}">
                      ${icons.creditCard}
                      <span>Thẻ tín dụng / CK</span>
                    </div>
                    <div class="method-btn ${cashActive}">
                      ${icons.banknote}
                      <span>Tiền mặt</span>
                    </div>
                  </div>
                  <button class="preview-invoice-btn">
                    ${icons.printer} Xem trước hóa đơn
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSuccessModal() {
  return `
    <div class="modal-overlay">
      <div class="success-modal">
        <div class="success-icon">${icons.checkCircle}</div>
        <h3 class="success-title">Check-out thành công!</h3>
        <p class="success-desc">Phòng 206 đã được chuyển sang trạng thái chờ dọn dẹp.<br>Hóa đơn đã được gửi qua email cho khách hàng.</p>
        <div class="success-actions">
          <button class="btn-close">Đóng</button>
          <button class="btn-export">${icons.printer} Xuất hóa đơn (PDF)</button>
        </div>
      </div>
    </div>
  `;
}

function renderPrintableInvoice() {
  return `
    <div class="invoice-overlay">
      <span style="position:absolute; top:24px; right:24px; color:#94a3b8;">${icons.x}</span>
      <div class="invoice-container">
        <div class="invoice-header-flex">
          <div class="invoice-logo">
            <h1>THAD<span>HOTEL</span></h1>
            <p style="font-size:12px; color:#64748b; margin-top:4px;">123 Đường Ven Biển, Quận Sơn Trà, Đà Nẵng</p>
            <p style="font-size:12px; color:#64748b;">Tel: 0236 3838 888 | Email: contact@thadhotel.vn</p>
          </div>
          <div class="invoice-title" style="text-align:right;">
            <h2>Hóa đơn</h2>
            <p style="font-size:12px; color:#64748b; margin-top:4px;">Số: <span style="font-weight:600; color:#1e293b;">INV-369495</span></p>
            <p style="font-size:12px; color:#64748b;">Ngày: <span style="font-weight:600; color:#1e293b;">13/6/2026</span></p>
          </div>
        </div>
        
        <div style="display:flex; justify-content:space-between; margin-bottom:32px;">
          <div>
            <p style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">Khách hàng</p>
            <p style="font-size:16px; font-weight:700; color:#1e293b;">Khách vãng lai</p>
          </div>
          <div style="text-align:right;">
            <p style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">Thông tin phòng</p>
            <p style="font-weight:600; color:#1e293b;">Phòng 206 (Standard)</p>
            <p style="font-size:12px; color:#64748b;">- - -</p>
            <p style="font-size:12px; color:#64748b;">1 đêm</p>
          </div>
        </div>

        <table class="invoice-table">
          <thead>
            <tr>
              <th style="border-top-left-radius:8px; border-bottom-left-radius:8px;">Hạng mục</th>
              <th style="text-align:center;">Đơn giá</th>
              <th style="text-align:center;">SL</th>
              <th style="text-align:right; border-top-right-radius:8px; border-bottom-right-radius:8px;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tiền phòng (Standard)</td>
              <td style="text-align:center;">800.000đ</td>
              <td style="text-align:center;">1</td>
              <td style="text-align:right; font-weight:500; color:#1e293b;">800.000đ</td>
            </tr>
            <tr>
              <td>Nước suối x2</td>
              <td style="text-align:center;">20.000đ</td>
              <td style="text-align:center;">2</td>
              <td style="text-align:right; font-weight:500; color:#1e293b;">40.000đ</td>
            </tr>
            <tr>
              <td>Giặt ủi</td>
              <td style="text-align:center;">150.000đ</td>
              <td style="text-align:center;">1</td>
              <td style="text-align:right; font-weight:500; color:#1e293b;">150.000đ</td>
            </tr>
            <tr>
              <td style="color:#e11d48;">Phụ thu trả phòng trễ</td>
              <td style="text-align:center;">300.000đ</td>
              <td style="text-align:center;">1</td>
              <td style="text-align:right; font-weight:500; color:#e11d48;">300.000đ</td>
            </tr>
          </tbody>
        </table>

        <div style="display:flex; justify-content:flex-end; margin-bottom:48px;">
          <div style="width:320px;">
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#64748b; margin-bottom:12px;">
              <span>Cộng tiền dịch vụ</span>
              <span style="font-weight:600; color:#1e293b;">1.290.000đ</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#10b981; margin-bottom:12px;">
              <span>Trừ tiền cọc (Deposit)</span>
              <span style="font-weight:600;">-1.000.000đ</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:16px; border-top:2px solid #1e293b; padding-top:12px; margin-bottom:8px;">
              <span style="font-weight:700; color:#1e293b;">Tổng thanh toán</span>
              <span style="font-weight:900; color:#2563eb;">290.000đ</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:10px; color:#64748b;">
              <span>Phương thức:</span>
              <span style="font-weight:600; text-transform:uppercase;">TIỀN MẶT</span>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; text-align:center; padding-top:32px;">
          <div>
            <p style="font-weight:700; color:#1e293b; margin-bottom:64px; font-size:14px;">Khách hàng</p>
            <p style="font-size:12px; color:#64748b; font-style:italic;">(Ký, ghi rõ họ tên)</p>
          </div>
          <div>
            <p style="font-weight:700; color:#1e293b; margin-bottom:64px; font-size:14px;">Nhân viên Lễ tân</p>
            <p style="font-size:12px; color:#64748b; font-style:italic;">(Ký, ghi rõ họ tên)</p>
          </div>
        </div>
        
        <div style="margin-top:48px; text-align:center; font-size:10px; color:#94a3b8; border-top:1px solid #f1f5f9; padding-top:24px;">
          Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của THAD HOTEL!
        </div>
      </div>
      
      <div class="print-btn-float">
        ${icons.printer} In hóa đơn ngay
      </div>
    </div>
  `;
}

function renderFakePrintDialog() {
  return `
    <div class="fake-print-overlay">
      <div class="fake-print-dialog">
        <div class="print-preview-area">
          <div class="print-paper">
            <!-- Inject simplified printable version here to look like a preview -->
            <div style="padding: 40px; transform: scale(0.95); transform-origin: top center;">
              ${renderPrintableInvoice().replace('<div class="invoice-overlay">', '<div>').replace('<div class="print-btn-float">', '<div style="display:none;">')}
            </div>
          </div>
        </div>
        <div class="print-sidebar">
          <h3 style="font-size:20px; font-weight:400; margin-bottom:32px; display:flex; justify-content:space-between;">In <span style="font-size:14px; font-weight:600;">1 tờ giấy</span></h3>
          
          <div style="display:flex; justify-content:space-between; margin-bottom:24px; align-items:center;">
            <span style="font-size:14px;">Máy in đích</span>
            <div style="border:1px solid #cbd5e1; padding:8px 12px; border-radius:4px; font-size:14px; display:flex; align-items:center; gap:8px;">${icons.printer} Microsoft Print to PDF <span style="font-size:10px;">▼</span></div>
          </div>
          
          <div style="display:flex; justify-content:space-between; margin-bottom:24px; align-items:center;">
            <span style="font-size:14px;">Trang</span>
            <div style="border:1px solid #cbd5e1; padding:8px 12px; border-radius:4px; font-size:14px; width:190px; display:flex; justify-content:space-between;">Tất cả <span style="font-size:10px;">▼</span></div>
          </div>
          
          <div style="display:flex; justify-content:space-between; margin-bottom:24px; align-items:center;">
            <span style="font-size:14px;">Bố cục</span>
            <div style="border:1px solid #cbd5e1; padding:8px 12px; border-radius:4px; font-size:14px; width:190px; display:flex; justify-content:space-between;">Khổ dọc <span style="font-size:10px;">▼</span></div>
          </div>
          
          <div style="display:flex; justify-content:space-between; margin-bottom:24px; align-items:center;">
            <span style="font-size:14px;">Màu</span>
            <div style="border:1px solid #cbd5e1; padding:8px 12px; border-radius:4px; font-size:14px; width:190px; display:flex; justify-content:space-between;">Màu <span style="font-size:10px;">▼</span></div>
          </div>
          
          <div style="border-top:1px solid #e2e8f0; margin-top:16px; padding-top:24px; display:flex; justify-content:space-between; font-size:14px;">
            Chế độ cài đặt khác
            <span style="font-size:10px; font-weight:bold;">▼</span>
          </div>

          <div style="margin-top:auto; display:flex; gap:12px; justify-content:flex-end;">
            <button class="print-btn-green">In</button>
            <button class="print-btn-cancel">Huỷ</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildFrame(content, title) {
  return `
    <div class="frame-container">
      <div class="frame-title">${title}</div>
      ${content}
    </div>
  `;
}

const roomsInitial = [
  {id: '206', name: 'Khách vãng lai'},
  {id: '303', name: 'Khách vãng lai'},
  {id: '402', name: 'Khách vãng lai'},
  {id: '405', name: 'Khách vãng lai'},
  {id: '501', name: 'Khách vãng lai'}
];

const roomsAfter = [
  {id: '303', name: 'Khách vãng lai'},
  {id: '305', name: 'Khách vãng lai'},
  {id: '402', name: 'Khách vãng lai'},
  {id: '405', name: 'Khách vãng lai'},
  {id: '501', name: 'Khách vãng lai'}
];

const frames = [
  // Màn hình 1
  buildFrame(renderSidebar() + renderHeader(false) + renderRoomGrid(roomsInitial), "Màn hình 1: Danh sách phòng Check-out"),
  // Màn hình 2
  buildFrame(renderSidebar() + renderHeader(false) + renderRoomGrid(roomsInitial) + renderCheckoutModal(null, false), "Màn hình 2: Mở Modal Check-out phòng 206 (Chưa chọn thanh toán)"),
  // Màn hình 3
  buildFrame(renderSidebar() + renderHeader(false) + renderRoomGrid(roomsInitial) + renderCheckoutModal('cash', false), "Màn hình 3: Mở Modal Check-out phòng 206 (Đã chọn Tiền mặt)"),
  // Màn hình 4
  buildFrame(renderSidebar() + renderHeader(false) + renderRoomGrid(roomsInitial) + renderCheckoutModal('cash', true), "Màn hình 4: Mở Modal Check-out phòng 206 (Xác nhận hóa đơn)"),
  // Màn hình 5
  buildFrame(renderSidebar() + renderHeader(false) + renderRoomGrid(roomsInitial) + renderSuccessModal(), "Màn hình 5: Check-out thành công"),
  // Màn hình 6
  buildFrame(renderSidebar() + renderHeader(false) + renderRoomGrid(roomsInitial) + renderSuccessModal(), "Màn hình 6: Check-out thành công (Ảnh 2)"),
  // Màn hình 7
  buildFrame(renderSidebar() + renderHeader(false) + renderRoomGrid(roomsInitial) + renderPrintableInvoice(), "Màn hình 7: Giao diện Hóa đơn toàn màn hình"),
  // Màn hình 8
  buildFrame(renderSidebar() + renderHeader(false) + renderRoomGrid(roomsInitial) + renderPrintableInvoice() + renderFakePrintDialog(), "Màn hình 8: Giao diện giả lập chức năng In"),
  // Màn hình 9
  buildFrame(renderSidebar() + renderHeader(true) + renderRoomGrid(roomsAfter), "Màn hình 9: Danh sách phòng sau Check-out (Có nút Khôi phục dữ liệu)"),
];

const htmlOutput = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>9 Screens Checkout - Figma Import</title>
${globalCSS}
</head>
<body>
${frames.join('\\n')}
</body>
</html>`;

fs.writeFileSync('D:\\\\65KTPM\\\\nam3\\\\Tuong Tac Nguoi May\\\\figma\\\\9_Screens_Checkout_Figma_Import.html', htmlOutput);
console.log('Successfully generated 9_Screens_Checkout_Figma_Import.html');
