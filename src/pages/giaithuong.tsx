import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import CardSection from "../components/cardsection";

const Giaithuong: React.FC = () => {
  return (
    <>
      <Banner
        title="CƠ CẤU GIẢI THƯỞNG"
        subtitle="Mức giải thưởng tiền mặt và danh hiệu trao tặng cho các HLV xuất sắc"
        badge="TOURNAMENT PRIZES"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-6">
          <CardSection badgeNumber="🏆" title="BẢNG PHÂN PHỐI GIẢI THƯỞNG">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Champion */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-50 to-amber-100/40 border border-amber-300 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-xl shadow-sm shadow-amber-500/40 group-hover:scale-105 transition-transform">
                    <i className="fa-solid fa-trophy"></i>
                  </div>
                  <div>
                    <span className="font-fco text-xs font-black uppercase text-amber-950 block">VÔ ĐỊCH (HẠNG 1)</span>
                    <span className="text-xs text-amber-800/80 font-medium">Cúp Vàng + Ghi danh Hall of Fame</span>
                  </div>
                </div>
                <span className="font-fco text-2xl font-black text-amber-700">250.000đ</span>
              </div>

              {/* Runner Up */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200/50 border border-slate-300 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 text-white flex items-center justify-center text-xl shadow-sm shadow-slate-500/30 group-hover:scale-105 transition-transform">
                    <i className="fa-solid fa-medal"></i>
                  </div>
                  <div>
                    <span className="font-fco text-xs font-black uppercase text-slate-900 block">Á QUÂN (HẠNG 2)</span>
                    <span className="text-xs text-slate-600 font-medium">Huy chương Bạc</span>
                  </div>
                </div>
                <span className="font-fco text-2xl font-black text-slate-700">170.000đ</span>
              </div>

              {/* 3rd Place */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 via-orange-50 to-orange-100/40 border border-orange-300 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-xl shadow-sm shadow-orange-500/40 group-hover:scale-105 transition-transform">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div>
                    <span className="font-fco text-xs font-black uppercase text-orange-950 block">HẠNG 3 (QUÝ QUÂN)</span>
                    <span className="text-xs text-orange-800/80 font-medium">Huy chương Đồng</span>
                  </div>
                </div>
                <span className="font-fco text-2xl font-black text-orange-700">100.000đ</span>
              </div>

              {/* 4th Place */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div>
                    <span className="font-fco text-xs font-black uppercase text-slate-800 block">HẠNG TƯ</span>
                    <span className="text-xs text-slate-500 font-medium">Khuyến khích Top 4</span>
                  </div>
                </div>
                <span className="font-fco text-2xl font-black text-slate-600">60.000đ</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic pt-2 border-t border-slate-100">
              * Toàn bộ tiền thưởng được chuyển khoản trực tiếp cho HLV ngay sau khi trận Chung kết và tranh hạng 3 kết thúc hợp lệ.
            </p>
          </CardSection>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Giaithuong;
