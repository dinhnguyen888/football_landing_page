import React, { useState } from "react";
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import Body from "../../components/body";
import Fireworks from "../../components/fireworks";
import { Link } from "react-router-dom";

const DthenXephang: React.FC = () => {
  const [fireworksKey, setFireworksKey] = useState(0);

  const triggerFireworks = () => {
    setFireworksKey((prev) => prev + 1);
  };

  return (
    <>
      {/* Dynamic Celebration Fireworks on entering the page */}
      <Fireworks key={fireworksKey} durationMs={6000} />

      <Banner
        title="BẢNG VÀNG VÔ ĐỊCH ĐTHÉN FCO ™"
        subtitle="Phòng truyền thống Hall of Fame – Nơi tôn vinh các nhà vô địch xuất sắc nhất qua các mùa giải ĐThén FCO"
        badge="HALL OF FAME"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header Section */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-fco font-bold uppercase tracking-wider shadow-2xs">
              <i className="fa-solid fa-crown text-amber-500"></i>
              <span>HALL OF CHAMPIONS</span>
            </div>

            <h2 className="font-fco text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight">
              NGÔI ĐỀN HUYỀN THOẠI ĐTHÉN FCO ™
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm">
              Nơi lưu giữ những khoảnh khắc đăng quang lịch sử và tôn vinh dấu ấn chiến thuật đỉnh cao.
            </p>

            {/* Re-trigger celebration button */}
            <div className="pt-2">
              <button
                onClick={triggerFireworks}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white font-oswald text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center space-x-2 btn-shimmer"
              >
                <span>🎆</span>
                <span>BẮN PHÁO HOA VINH DANH</span>
                <span>🎉</span>
              </button>
            </div>
          </div>

          {/* Empty State Card - Awaiting Season 1 Champion */}
          <div className="rounded-2xl sm:rounded-3xl border-2 border-dashed border-amber-300/80 bg-gradient-to-b from-amber-50/50 via-white to-slate-50 p-5 sm:p-14 text-center space-y-5 sm:space-y-6 shadow-sm card-hover-fx">
            {/* Glowing Golden Trophy Pedestal */}
            <div className="relative inline-block mx-auto">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white flex items-center justify-center text-3xl sm:text-5xl shadow-xl shadow-amber-500/25 animate-float-slow">
                <i className="fa-solid fa-trophy"></i>
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-fco font-bold uppercase tracking-wider border border-amber-400/50">
                MÙA 1
              </span>
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="font-fco font-black text-lg sm:text-2xl uppercase text-slate-900 tracking-wide">
                CHƯA CÓ NHÀ VÔ ĐỊCH ĐƯỢC GHI DANH
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Mùa giải đầu tiên của <strong className="text-blue-900">FC ONLINE ĐTHÉN FCO ™</strong> đang chính thức khởi tranh. Hãy thi đấu bản lĩnh, vượt qua vòng bảng và giai đoạn Knockout để trở thành Huấn luyện viên đầu tiên khắc tên lên Bảng Vàng!
              </p>
            </div>

            <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-2.5 sm:gap-3">
              <Link
                to="/dthen/ltd"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-600/25 flex items-center justify-center space-x-2 hover:scale-105 btn-shimmer"
              >
                <i className="fa-solid fa-table-list"></i>
                <span>Xem Lịch Thi Đấu & BXH Mùa 1</span>
              </Link>

              <Link
                to="/dthen"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center"
              >
                <span>Về Cẩm Nang Giải</span>
              </Link>
            </div>
          </div>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default DthenXephang;
