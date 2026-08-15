import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";

const Xephang: React.FC = () => {
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
  ];

  return (
    <>
      <Banner
        title="BẢNG VÀNG VÔ ĐỊCH"
        subtitle="Phòng truyền thống Hall of Fame – Nơi vinh danh những nhà vô địch xuất sắc nhất lịch sử Sao Vàng Cup™"
        badge="HALL OF FAME"
      />

      <Body>
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header Section */}
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-fco font-bold uppercase tracking-wider shadow-2xs">
              <i className="fa-solid fa-crown text-amber-500"></i>
              <span>HALL OF CHAMPIONS</span>
            </div>
            <h2 className="font-fco text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight">
              NGÔI ĐỀN HUYỀN THOẠI SAO VÀNG CUP
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Nơi lưu giữ những khoảnh khắc đăng quang lịch sử và ghi nhận dấu ấn chiến thuật đỉnh cao của các nhà vô địch.
            </p>
          </div>

          {/* Champions Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {champions.map((champ, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl group flex flex-col justify-between ${
                  champ.isLatest
                    ? "bg-gradient-to-b from-amber-50/40 via-white to-slate-50 border-amber-300/80 shadow-md ring-1 ring-amber-400/30"
                    : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
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
                      <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 text-sm">
                        <i className="fa-solid fa-trophy"></i>
                      </span>
                      <span className="font-fco font-black text-lg sm:text-xl uppercase text-slate-900 tracking-wide">
                        {champ.season}
                      </span>
                    </div>
                    <span className="text-[11px] font-fco font-bold uppercase tracking-wider text-slate-400">
                      CHAMPION
                    </span>
                  </div>

                  {/* Photo with Frame */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-200/90 bg-slate-900 group-hover:border-amber-400/60 transition-colors shadow-inner">
                    <img
                      src={champ.image}
                      alt={champ.name}
                      className="w-full max-h-[380px] object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
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
                      <h3 className="font-fco font-black text-2xl text-slate-900 uppercase tracking-tight group-hover:text-emerald-700 transition-colors">
                        {champ.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-amber-500 text-xs">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">Hành Trình:</span>
                        <span className="font-bold text-slate-800">{champ.stats.matches}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">Thành Tích:</span>
                        <span className="font-bold text-emerald-800">{champ.stats.record}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inspirational Hall of Fame Callout */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#061124] via-[#091e3a] to-[#040c18] border border-amber-500/30 text-center text-white space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto text-lg shadow-inner">
              <i className="fa-solid fa-medal"></i>
            </div>
            <h3 className="font-fco text-lg sm:text-xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
              AI SẼ LÀ NHÀ VÔ ĐỊCH TIẾP THEO CỦA SAO VÀNG CUP™?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Mỗi mùa giải là một chương sử mới. Hãy sẵn sàng kiến tạo đội hình, vượt qua mọi thử thách để khắc tên mình vào Ngôi Đền Huyền Thoại!
            </p>
          </div>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Xephang;
