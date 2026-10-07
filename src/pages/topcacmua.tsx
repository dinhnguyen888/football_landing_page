import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";

const Topmua: React.FC = () => {
  const seasons = [
    {
      season: "MÙA 2",
      champion: "Vis's Sơn",
      tournament: "Sao Vàng Cup ™",
      img: require("../img/topcacmua.jpg"),
      badge: "ĐƯƠNG KIM",
    },
    {
      season: "MÙA 1",
      champion: "Nguyễn Duy Anh",
      tournament: "Sao Vàng Cup ™",
      img: require("../img/mua1.jpg"),
      badge: "MÙA 1",
    },
    {
      season: "MÙA ĐẶC BIỆT",
      champion: "Nguyễn Tấn Phát",
      tournament: "Giải ĐTHÉN FCO",
      img: require("../img/dthen_champion.jpg"),
      badge: "MÙA ĐẶC BIỆT",
    },
  ];

  return (
    <>
      <Banner
        title="TOP CÁC MÙA GIẢI"
        subtitle="Tổng kết và lưu trữ hình ảnh vinh danh thứ hạng các mùa giải đã qua"
        badge="SEASON ARCHIVES"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {seasons.map((s, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl border transition-all duration-300 shadow-md space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-0.5 rounded-full font-fco font-bold text-xs uppercase tracking-wider bg-amber-500 text-slate-950 shadow-sm">
                    {s.badge}
                  </span>
                  <div>
                    <h2 className="font-oswald text-xl font-bold uppercase text-slate-900 dark:text-white">
                      TỔNG KẾT {s.season}
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">
                      {s.tournament}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                    Nhà Vô Địch:
                  </span>
                  <span className="font-fco font-black text-base uppercase text-amber-600 dark:text-amber-400">
                    {s.champion}
                  </span>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 flex justify-center">
                <img
                  src={s.img}
                  alt={`Vinh danh ${s.season} - ${s.champion}`}
                  className="w-full max-h-[520px] object-contain sm:object-cover object-top"
                />
              </div>
            </div>
          ))}
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Topmua;
