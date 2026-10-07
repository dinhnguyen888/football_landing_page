import React, { useState } from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import Fireworks from "../components/fireworks";

const Xephang: React.FC = () => {
  const [fireworksKey, setFireworksKey] = useState(0);

  const triggerFireworks = () => {
    setFireworksKey((prev) => prev + 1);
  };

  const champions = [
    {
      season: "MÙA 2",
      name: "VIS'S SƠN",
      title: "ĐƯƠNG KIM VÔ ĐỊCH SAO VÀNG CUP",
      image: require("../img/mua2.jpg"),
      isLatest: true,
      stats: {
        matches: "Bất Bại",
        record: "Cúp Vàng Danh Giá",
      },
    },
    {
      season: "MÙA 1",
      name: "NGUYỄN DUY ANH",
      title: "NHÀ VÔ ĐỊCH MÙA ĐẦU TIÊN",
      image: require("../img/mua1.jpg"),
      isLatest: false,
      stats: {
        matches: "Lịch Sử",
        record: "Nhà Vô Địch Đầu Tiên",
      },
    },
    {
      season: "MÙA ĐẶC BIỆT",
      name: "NGUYỄN TẤN PHÁT",
      title: "VÔ ĐỊCH GIẢI ĐTHÉN FCO",
      image: require("../img/dthen_champion.jpg"),
      isLatest: false,
      stats: {
        matches: "Bất Bại",
        record: "Cúp Vàng ĐThén FCO",
      },
    },
  ];

  return (
    <>
      {/* Dynamic Celebration Fireworks on entering the page */}
      <Fireworks key={fireworksKey} durationMs={6000} />

      <Banner
        title="BẢNG VÀNG VÔ ĐỊCH"
        subtitle="Phòng truyền thống Hall of Fame – Nơi vinh danh những nhà vô địch xuất sắc nhất qua từng mùa giải"
        badge="HALL OF FAME"
      />

      <Body>
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header Section with Interactive Fireworks Button */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 text-xs font-fco font-bold uppercase tracking-wider shadow-2xs">
              <i className="fa-solid fa-crown text-amber-500"></i>
              <span>HALL OF CHAMPIONS • PHÒNG TRUYỀN THỐNG</span>
            </div>

            <h2 className="font-fco text-2xl sm:text-3xl font-black uppercase text-slate-900 dark:text-white tracking-tight">
              NGÔI ĐỀN HUYỀN THOẠI
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
              Nơi lưu giữ những khoảnh khắc đăng quang lịch sử và ghi nhận dấu ấn đỉnh cao của các nhà vô địch.
            </p>

            {/* Re-trigger celebration button */}
            <div className="pt-2">
              <button
                onClick={triggerFireworks}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white font-oswald text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center space-x-2 btn-shimmer cursor-pointer"
              >
                <span>🎆</span>
                <span>BẮN PHÁO HOA VINH DANH</span>
                <span>🎉</span>
              </button>
            </div>
          </div>

          {/* Champions Showcase Grid - 3 cards side by side with identical prestigious styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {champions.map((champ, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-2xl card-hover-fx group flex flex-col justify-between ${
                  champ.isLatest
                    ? "neon-ring-pulse bg-gradient-to-b from-amber-50/60 via-white to-slate-50 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border-amber-400 dark:border-amber-500 shadow-lg ring-2 ring-amber-400/40"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Crown watermark badge for reigning champion */}
                {champ.isLatest && (
                  <div className="absolute top-0 right-0 z-20 overflow-hidden w-28 h-28 pointer-events-none">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-fco font-bold text-[10px] uppercase py-1 text-center transform rotate-45 translate-x-7 translate-y-3 shadow-sm">
                      ĐƯƠNG KIM
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-5">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 text-sm">
                        <i className="fa-solid fa-trophy"></i>
                      </span>
                      <span className="font-fco font-black text-lg sm:text-xl uppercase text-slate-900 dark:text-white tracking-wide">
                        {champ.season}
                      </span>
                    </div>
                    <span className="text-[11px] font-fco font-bold uppercase tracking-wider text-slate-400">
                      CHAMPION
                    </span>
                  </div>

                  {/* Photo with Frame */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-700 bg-slate-900 group-hover:border-amber-400/60 transition-colors shadow-inner aspect-[4/5]">
                    <img
                      src={champ.image}
                      alt={champ.name}
                      className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 pointer-events-none" />

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white font-fco font-bold text-[10px] uppercase tracking-wider backdrop-blur-xs">
                        {champ.title}
                      </span>
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-fco font-black text-xl uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {champ.name}
                      </h3>
                      <span className="text-xs font-fco font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {champ.stats.matches}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Danh hiệu:{" "}
                      <strong className="text-slate-800 dark:text-slate-200">
                        {champ.stats.record}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Vinh danh tại Phòng truyền thống</span>
                  <i className="fa-solid fa-medal text-amber-500"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Xephang;
