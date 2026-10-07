import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import CardSection from "../components/cardsection";

const Giaithuong: React.FC = () => {
  const prizes = [
    {
      place: "GIẢI NHẤT (VÔ ĐỊCH)",
      badge: "CHAMPION 🥇",
      reward: "400.000đ",
      icon: "fa-trophy",
      subDesc: "Cúp Vàng Danh Giá + Khắc tên lên Ngôi Đền Huyền Thoại (Hall of Fame)",
      cardBg: "from-amber-500/20 via-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-900/30",
      borderColor: "border-amber-400 dark:border-amber-500",
      iconBg: "from-amber-400 to-amber-600 text-white shadow-amber-500/40",
      textColor: "text-amber-700 dark:text-amber-400",
      titleColor: "text-amber-950 dark:text-amber-200",
      badgeClass: "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700",
    },
    {
      place: "GIẢI NHÌ (Á QUÂN)",
      badge: "RUNNER-UP 🥈",
      reward: "250.000đ",
      icon: "fa-medal",
      subDesc: "Huy chương Bạc + Chứng nhận Á Quân giải đấu Sao Vàng Cup",
      cardBg: "from-slate-100 via-white to-slate-200/70 dark:from-slate-800/60 dark:via-slate-900 dark:to-slate-800/40",
      borderColor: "border-slate-300 dark:border-slate-700",
      iconBg: "from-slate-400 to-slate-600 text-white shadow-slate-500/30",
      textColor: "text-slate-700 dark:text-slate-300",
      titleColor: "text-slate-900 dark:text-slate-200",
      badgeClass: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600",
    },
    {
      place: "GIẢI BA (QUÝ QUÂN)",
      badge: "3RD PLACE 🥉",
      reward: "150.000đ",
      icon: "fa-award",
      subDesc: "Huy chương Đồng + Chiến thắng trận tranh Ba Tư kịch tính",
      cardBg: "from-orange-500/15 via-white to-orange-100/60 dark:from-orange-950/30 dark:via-slate-900 dark:to-orange-900/20",
      borderColor: "border-orange-300 dark:border-orange-600/70",
      iconBg: "from-orange-400 to-orange-600 text-white shadow-orange-500/40",
      textColor: "text-orange-700 dark:text-orange-400",
      titleColor: "text-orange-950 dark:text-orange-200",
      badgeClass: "bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700",
    },
    {
      place: "VUA PHÁ LƯỚI (VPL)",
      badge: "TÍNH TỪ VÒNG KNOCKOUT ⭐",
      reward: "60.000đ",
      icon: "fa-futbol",
      subDesc: "Chiếc Giày Vàng tính tổng số bàn thắng ghi được từ Vòng Knockout (từ Vòng 1/8 đến trận Chung kết)",
      cardBg: "from-emerald-500/15 via-emerald-50 to-teal-100/60 dark:from-emerald-950/30 dark:via-slate-900 dark:to-teal-900/20",
      borderColor: "border-emerald-300 dark:border-emerald-600/70",
      iconBg: "from-emerald-500 to-teal-600 text-white shadow-emerald-500/40",
      textColor: "text-emerald-700 dark:text-emerald-400",
      titleColor: "text-emerald-950 dark:text-emerald-200",
      badgeClass: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
    },
  ];

  return (
    <>
      <Banner
        title="CƠ CẤU GIẢI THƯỞNG"
        subtitle="Mức giải thưởng tiền mặt và danh hiệu trao tặng cho các HLV xuất sắc nhất giải đấu"
        badge="TOURNAMENT PRIZES"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Total Prize Pool Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 border-2 border-amber-400/80 text-white shadow-xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 relative z-10">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/60 text-amber-300 font-oswald text-xs font-bold uppercase tracking-wider">
                <i className="fa-solid fa-trophy text-amber-400"></i>
                <span>TỔNG GIÁ TRỊ GIẢI THƯỞNG</span>
              </span>
              <h2 className="font-oswald text-2xl sm:text-4xl font-black uppercase tracking-wide text-white drop-shadow">
                FC ONLINE SAO VÀNG CUP ™
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                Vinh danh các chiến lược gia xuất sắc nhất, tôn vinh lối đá cống hiến và tinh thần Fair-play trên sân cỏ điện tử.
              </p>
            </div>

            <div className="text-center sm:text-right shrink-0 relative z-10 bg-black/40 px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] sm:text-xs text-amber-300 font-oswald font-bold uppercase tracking-widest block">
                TỔNG TIỀN THƯỞNG
              </span>
              <span className="font-oswald text-3xl sm:text-4xl font-black text-amber-400 tracking-tight block">
                860.000đ
              </span>
              <span className="text-[10px] text-emerald-300 font-medium block mt-0.5">
                4 Hạng mục giải thưởng
              </span>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Prize Grid */}
          <CardSection badgeNumber="🏆" title="BẢNG PHÂN PHỐI GIẢI THƯỞNG">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prizes.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${p.cardBg} border-2 ${p.borderColor} shadow-sm hover:shadow-xl card-hover-fx transition-all group flex flex-col justify-between space-y-3.5`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.iconBg} flex items-center justify-center text-xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform`}
                      >
                        <i className={`fa-solid ${p.icon}`}></i>
                      </div>
                      <div>
                        <span
                          className={`font-fco text-sm font-black uppercase ${p.titleColor} block leading-tight`}
                        >
                          {p.place}
                        </span>
                        <span
                          className={`text-[9px] font-oswald font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${p.badgeClass} inline-block mt-1`}
                        >
                          {p.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {p.subDesc}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-oswald uppercase font-bold text-slate-500 dark:text-slate-400">
                      TIỀN THƯỞNG:
                    </span>
                    <span className={`font-fco text-2xl font-black ${p.textColor}`}>
                      {p.reward}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Rules and Disbursal terms */}
            <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <p>
                <strong className="text-slate-700 dark:text-slate-300">⚡ Hình thức trao giải:</strong> Tiền thưởng được Ban Tổ Chức chuyển khoản trực tiếp qua STK ngân hàng / ví điện tử cho HLV ngay sau khi trận Chung kết và trận Tranh Hạng 3 khép lại.
              </p>
              <p>
                <strong className="text-slate-700 dark:text-slate-300">⭐ Quy định Vua Phá Lưới (VPL):</strong> Giải Vua Phá Lưới <strong>chỉ tính tổng số bàn thắng ghi được từ Vòng Knockout</strong> (bắt đầu từ Vòng 1/8 đến hết trận Chung kết; không tính các bàn thắng ở Vòng Swiss). Trường hợp có từ 2 VĐV có cùng số bàn thắng, giải thưởng sẽ được chia đều hoặc căn cứ theo số pha kiến tạo (Assist) hợp lệ.
              </p>
            </div>
          </CardSection>

        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Giaithuong;
