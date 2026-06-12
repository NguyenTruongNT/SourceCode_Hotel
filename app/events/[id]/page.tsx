'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Copy, Check, Calendar, Tag, AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EventDetailPage() {
  const params = useParams();
  const isVoucher = params.id === 'ev-002';
  
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('SUMMER20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="relative h-[400px] w-full">
          <Image 
            src={isVoucher ? "/images/exp-spa.png" : "/images/hero-hotel.png"} 
            alt="Event Cover" 
            fill 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                {isVoucher ? 'Ưu đãi đặc biệt' : 'Sự kiện nổi bật'}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {isVoucher ? 'Giảm ngay 20% Dịch vụ Spa' : 'Sự kiện Summer Wedding'}
              </h1>
              <p className="text-white/80 text-lg">
                Khám phá không gian tuyệt vời và nhận những ưu đãi hấp dẫn chỉ có trong mùa hè này.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6 text-slate-700 leading-relaxed">
              <h2 className="text-2xl font-bold text-slate-900">Thông tin chi tiết</h2>
              <p>
                {isVoucher 
                  ? 'Tận hưởng kỳ nghỉ dưỡng hoàn hảo tại THAD HOTEL và chăm sóc bản thân với dịch vụ Spa đẳng cấp. Áp dụng ngay mã giảm giá để nhận ưu đãi 20% cho tất cả các liệu trình massage và thư giãn.'
                  : 'Hãy để chúng tôi biến ngày trọng đại của bạn thành hiện thực với không gian lãng mạn bên bờ biển, thực đơn cao cấp và dịch vụ chuyên nghiệp. Gói Summer Wedding bao gồm trọn gói trang trí, tiệc và phòng nghỉ trăng mật.'
                }
              </p>
              <p>
                Đội ngũ chuyên gia của chúng tôi cam kết mang lại cho bạn những phút giây thư giãn tuyệt đối và những kỷ niệm khó quên. Hệ thống thiết bị hiện đại cùng kỹ thuật viên giàu kinh nghiệm sẽ giúp bạn tái tạo năng lượng sau chuỗi ngày làm việc căng thẳng.
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Điều khoản áp dụng</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Chương trình áp dụng từ ngày 01/06/2026 đến hết 31/08/2026.</li>
                <li>Không áp dụng đồng thời với các chương trình khuyến mãi khác.</li>
                <li>Vui lòng đặt trước ít nhất 24 giờ để được phục vụ tốt nhất.</li>
              </ul>
            </div>

            <div className="space-y-6">
              {isVoucher && (
                <div className="bg-[#FFF4E5] border border-amber-200 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500 rounded-bl-full opacity-10"></div>
                  <Tag className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-amber-900 mb-1">Mã Ưu Đãi Của Bạn</h3>
                  <div className="my-4 p-4 bg-white border-2 border-dashed border-amber-300 rounded-xl text-2xl font-black text-amber-600 tracking-widest">
                    SUMMER20
                  </div>
                  <button 
                    onClick={handleCopy}
                    className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      copied ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
                    } shadow-lg`}
                  >
                    {copied ? (
                      <><Check className="h-5 w-5" /> Đã sao chép</>
                    ) : (
                      <><Copy className="h-5 w-5" /> Sao chép mã</>
                    )}
                  </button>
                  <p className="text-[11px] text-amber-700 mt-4 italic">Sử dụng mã này tại bước thanh toán để được giảm giá.</p>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Thời gian diễn ra
                </h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Bắt đầu:</span>
                    <span className="font-semibold text-slate-800">01/06/2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kết thúc:</span>
                    <span className="font-semibold text-slate-800">31/08/2026</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-blue-800">
                  Nếu bạn cần hỗ trợ thêm thông tin, vui lòng liên hệ hotline: <strong className="block text-sm mt-1">1900 1234</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
