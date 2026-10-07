import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import CardSection from "../components/cardsection";

const Quydinh: React.FC = () => {
  return (
    <>
      <Banner
        title="QUY ĐỊNH ĐỘI HÌNH & CHIẾN THUẬT"
        subtitle="Đội hình tự do • Giới hạn mùa UC, ITM tối đa +6 • WS, WG, FAC, CH, 26TS, 26TY tối đa +7 • Cấm Prime, Infinity Prime"
        badge="SQUAD & TACTICS"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Section 1: Squad & Card Regulations */}
          <CardSection badgeNumber={1} title="QUY ĐỊNH ĐỘI HÌNH & GIỚI HẠN THẺ CẦU THỦ">
            <div className="space-y-6 text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
              
              {/* Rule 1: Free Squad Full Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-800 border-2 border-emerald-400 dark:border-emerald-600 shadow-sm space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-md shadow-emerald-500/30">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <div>
                    <span className="font-fco text-xs font-black uppercase text-emerald-800 dark:text-emerald-400 block">
                      ĐỘI HÌNH TỰ DO (OPEN SQUAD)
                    </span>
                    <h4 className="font-oswald text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      TỰ DO LỰA CHỌN CẦU THỦ &amp; TEAM COLOR
                    </h4>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-1 sm:pl-13">
                  Các Huấn luyện viên được tự do xây dựng đội hình theo CLB, Đội tuyển quốc gia hoặc kết hợp All-Star tùy ý. Tự do kích hoạt mọi Team Color và chiến thuật yêu thích, không giới hạn quốc tịch hay CLB.
                </p>
                <div className="pl-1 sm:pl-13 pt-1">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    <i className="fa-solid fa-check text-xs"></i>
                    <span>Tự do CLB • Tự do Quốc gia • Tự do Team Color</span>
                  </span>
                </div>
              </div>

              {/* Two Season Limit Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Tier 1: UC, ITM <= +6 */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-100/50 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-800 border-2 border-amber-400 dark:border-amber-500 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-lg font-black shadow-md shadow-amber-500/30">
                          +6
                        </div>
                        <div>
                          <span className="font-fco text-[11px] font-black uppercase text-amber-800 dark:text-amber-400 block">
                            GIỚI HẠN NHÓM 1
                          </span>
                          <h4 className="font-oswald text-base font-bold text-slate-900 dark:text-white">
                            TỐI ĐA CẤP THẺ +6
                          </h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-oswald font-black text-xs border border-amber-300 dark:border-amber-700">
                        MAX +6
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                        Áp dụng cho 02 mùa giải sau:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {["UC", "ITM"].map((season, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-400 text-amber-900 dark:text-amber-200 font-fco font-black text-xs tracking-wider"
                          >
                            MÙA {season}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Các thẻ thuộc mùa <strong>UC</strong> và <strong>ITM</strong> chỉ được sử dụng tối đa cấp thẻ <strong>+6</strong> (từ +1 đến +6).
                    </p>
                  </div>

                  <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/60">
                    <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-1.5">
                      <i className="fa-solid fa-circle-xmark"></i>
                      <span>Nghiêm cấm cấp thẻ từ +7 trở lên (+7, +8, +9, +10)</span>
                    </span>
                  </div>
                </div>

                {/* Tier 2: WS, WG, FAC, CH, 26TS, 26TY <= +7 */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 via-white to-sky-100/50 dark:from-sky-950/40 dark:via-slate-900 dark:to-slate-800 border-2 border-sky-400 dark:border-sky-500 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center text-lg font-black shadow-md shadow-sky-500/30">
                          +7
                        </div>
                        <div>
                          <span className="font-fco text-[11px] font-black uppercase text-sky-800 dark:text-sky-400 block">
                            GIỚI HẠN NHÓM 2
                          </span>
                          <h4 className="font-oswald text-base font-bold text-slate-900 dark:text-white">
                            TỐI ĐA CẤP THẺ +7
                          </h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 font-oswald font-black text-xs border border-sky-300 dark:border-sky-700">
                        MAX +7
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                        Áp dụng cho 06 mùa giải sau:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {["WS", "WG", "FAC", "CH", "26TS", "26TY"].map((season, idx) => (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 rounded-lg border font-fco font-black text-xs tracking-wider ${
                              season === "26TY"
                                ? "bg-amber-500/20 border-amber-400 text-amber-900 dark:text-amber-200"
                                : "bg-sky-500/15 border-sky-400 text-sky-900 dark:text-sky-200"
                            }`}
                          >
                            MÙA {season}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Các thẻ thuộc mùa <strong>WS</strong>, <strong>WG</strong>, <strong>FAC</strong>, <strong>CH</strong>, <strong>26TS</strong> và <strong>26TY</strong> được sử dụng tối đa cấp thẻ <strong>+7</strong> (từ +1 đến +7).
                    </p>
                  </div>

                  <div className="pt-2 border-t border-sky-200/60 dark:border-sky-800/60">
                    <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-1.5">
                      <i className="fa-solid fa-circle-xmark"></i>
                      <span>Nghiêm cấm cấp thẻ từ +8 trở lên (+8, +9, +10)</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* BANNED CARDS BANNER - Redesigned for Crystal Clear Readability */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-rose-950/40 dark:via-slate-900 dark:to-red-950/30 border-2 border-rose-400 dark:border-rose-500 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xl shadow-md shadow-rose-600/30 shrink-0">
                      <i className="fa-solid fa-ban text-2xl"></i>
                    </div>
                    <div>
                      <span className="font-fco text-[11px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 block">
                        QUY CHẾ THẺ CẤM HOÀN TOÀN
                      </span>
                      <h4 className="font-oswald text-lg sm:text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                        CẤM MÙA PRIME &amp; INFINITY PRIME
                      </h4>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto px-3.5 py-1 rounded-full bg-rose-600 text-white text-xs font-oswald font-black uppercase tracking-widest shadow-sm">
                    STRICT BANNED
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  Nhằm đảm bảo tính công bằng và cân bằng sức mạnh chuyên môn, giải đấu <strong>nghiêm cấm tuyệt đối</strong> tất cả các cầu thủ thuộc 02 mùa giải sau:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Prime Card */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border-2 border-rose-300 dark:border-rose-700 shadow-xs flex items-center space-x-3.5 hover:border-rose-500 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg font-bold shrink-0">
                      <i className="fa-solid fa-circle-xmark"></i>
                    </div>
                    <div>
                      <span className="font-fco font-black text-sm uppercase text-slate-900 dark:text-white block tracking-wide">
                        CẤM MÙA PRIME (ICON PRIME)
                      </span>
                      <span className="text-xs text-rose-700 dark:text-rose-300 font-semibold block mt-0.5">
                        Nghiêm cấm ở mọi cấp thẻ (+1 đến +10)
                      </span>
                    </div>
                  </div>

                  {/* Infinity Prime Card */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border-2 border-rose-300 dark:border-rose-700 shadow-xs flex items-center space-x-3.5 hover:border-rose-500 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg font-bold shrink-0">
                      <i className="fa-solid fa-circle-xmark"></i>
                    </div>
                    <div>
                      <span className="font-fco font-black text-sm uppercase text-slate-900 dark:text-white block tracking-wide">
                        CẤM MÙA INFINITY PRIME (IP)
                      </span>
                      <span className="text-xs text-rose-700 dark:text-rose-300 font-semibold block mt-0.5">
                        Nghiêm cấm cả đội hình chính &amp; ghế dự bị
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-100/70 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 flex items-start space-x-2 text-xs text-rose-900 dark:text-rose-200">
                  <i className="fa-solid fa-triangle-exclamation text-rose-600 dark:text-rose-400 mt-0.5 shrink-0"></i>
                  <span>
                    <strong>Quy định nghiêm ngặt:</strong> Áp dụng cho toàn bộ danh sách đăng ký thi đấu gồm 11 cầu thủ đá chính và ghế dự bị. Đội vi phạm sẽ bị xử thua 0-3 theo quy chế.
                  </span>
                </div>
              </div>

              {/* Wage Limit Standard */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center space-x-4 shadow-xs">
                <div className="w-14 h-14 rounded-xl bg-slate-900 dark:bg-emerald-700 text-white flex items-center justify-center text-2xl font-black font-fco shadow-sm flex-shrink-0">
                  305
                </div>
                <div>
                  <span className="text-xs font-fco font-bold uppercase text-slate-500 dark:text-emerald-400 block">
                    GIỚI HẠN QUỸ LƯƠNG IN-GAME
                  </span>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Tối đa 305/305 (hoặc theo mức lương chuẩn in-game FC Online)
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                    Bao gồm 11 cầu thủ đá chính + tối đa 7 cầu thủ dự bị trên bảng chiến thuật.
                  </span>
                </div>
              </div>

            </div>
          </CardSection>

          {/* Section 2: Formations */}
          <CardSection badgeNumber={2} title="DANH MỤC SƠ ĐỒ CHIẾN THUẬT MẶC ĐỊNH (22 SƠ ĐỒ)">
            <div className="space-y-6 text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
              <p className="text-slate-800 dark:text-slate-300">
                Các HLV tham gia giải đấu được phép sử dụng các <strong>sơ đồ đội hình mặc định trong FC Online</strong> theo danh mục dưới đây:
              </p>

              {/* Grid 2 Columns: 4 Defenders vs 3 Defenders Formations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 4 Defenders Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-fco font-bold text-sm sm:text-base text-blue-900 dark:text-blue-400 uppercase flex items-center space-x-2">
                      <i className="fa-solid fa-shield text-blue-600"></i>
                      <span>SƠ ĐỒ 4 HẬU VỆ (15 SƠ ĐỒ)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-fco font-bold text-xs">
                      4 DF
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 text-center">
                    {[
                      "4-1-3-2", "4-1-4-1", "4-2-3-1",
                      "4-2-2-1-1", "4-2-4", "4-3-1-2",
                      "4-3-3", "4-1-2-3", "4-2-1-3",
                      "4-2-2-2", "4-1-2-1-2", "4-4-2",
                      "4-4-1-1", "4-5-1", "4-3-2-1"
                    ].map((formation, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-2xs">
                        {formation}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Defenders Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-fco font-bold text-sm sm:text-base text-emerald-900 dark:text-emerald-400 uppercase flex items-center space-x-2">
                      <i className="fa-solid fa-shield-halved text-emerald-600"></i>
                      <span>SƠ ĐỒ 3 HẬU VỆ (7 SƠ ĐỒ)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-fco font-bold text-xs">
                      3 DF
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-center">
                    {[
                      "3-1-4-2", "3-4-1-2",
                      "3-4-3", "3-1-2-1-3",
                      "3-2-2-1-2", "3-2-3-2",
                      "3-4-2-1"
                    ].map((formation, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-600 transition-colors shadow-2xs">
                        {formation}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Allowed Features */}
              <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <h4 className="font-fco font-bold text-sm sm:text-base text-slate-900 dark:text-white uppercase flex items-center space-x-2">
                  <i className="fa-solid fa-circle-check text-emerald-600"></i>
                  <span>CÁC TÍNH NĂNG ĐƯỢC PHÉP SỬ DỤNG</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                    <i className="fa-solid fa-users text-amber-600 text-sm"></i>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Team Color</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                    <i className="fa-solid fa-user-tie text-blue-600 text-sm"></i>
                    <span className="font-bold text-slate-800 dark:text-slate-200">HLV Kỹ Năng</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                    <i className="fa-solid fa-id-card text-emerald-600 text-sm"></i>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Thẻ Cho Mượn (LOAN)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                    <i className="fa-solid fa-house-flag text-rose-600 text-sm"></i>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Club House</span>
                  </div>
                </div>
              </div>

            </div>
          </CardSection>

          {/* Section 3: Violations Handling Regulation */}
          <CardSection badgeNumber={3} title="QUY TRÌNH XỬ LÝ VI PHẠM ĐỘI HÌNH & THẺ CẦU THỦ">
            <div className="space-y-4 text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
              <p className="text-slate-800 dark:text-slate-300">
                Khi phát hiện đối phương vi phạm quy chế (sử dụng <strong>thẻ cấm Prime / Infinity Prime</strong>, thẻ <strong>UC, ITM vượt quá +6</strong>, thẻ <strong>WS, WG, FAC, CH, 26TS, 26TY vượt quá +7</strong>, hoặc sử dụng sơ đồ ngoài danh mục quy định), HLV cần <strong>chụp ảnh hoặc quay video làm bằng chứng</strong> và thực hiện theo quy trình:
              </p>

              {/* Case 1 */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-300 dark:border-slate-600">
                    1
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white">Phát hiện tại phòng chờ trước trận đấu</h4>
                </div>
                <p className="pl-8 text-slate-600 dark:text-slate-400">
                  → Nhắc nhở đối thủ chỉnh sửa lại đội hình/thẻ cầu thủ về đúng quy định trước khi bấm sẵn sàng vào trận.
                </p>
              </div>

              {/* Case 2 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-300 dark:border-slate-600">
                    2
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white">Phát hiện khi trận 1 đã bắt đầu (Bóng đã lăn từ 00:01s)</h4>
                </div>
                <p className="pl-8 text-slate-600 dark:text-slate-400">
                  → Hai bên thỏa thuận đá lại nếu đồng ý. Nếu không thống nhất được, <strong>bên vi phạm sẽ bị xử thua 0-3 ở trận 1</strong>.
                </p>
              </div>

              {/* Case 3 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-300 dark:border-slate-600">
                    3
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white">Phát hiện tại phòng chờ trước trận 2 (Lượt về)</h4>
                </div>
                <p className="pl-8 text-slate-600 dark:text-slate-400">
                  → Giữ nguyên kết quả trận 1 đã kết thúc. Bên vi phạm bắt buộc phải sửa lại đội hình hợp lệ trước khi bắt đầu trận 2.
                </p>
              </div>

              {/* Case 4 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-300 dark:border-slate-600">
                    4
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white">Phát hiện khi trận 2 đã bắt đầu (Bóng đã lăn từ 00:01s)</h4>
                </div>
                <p className="pl-8 text-slate-600 dark:text-slate-400">
                  → Hai bên thỏa thuận đá lại trận 2 nếu đồng ý. Nếu không thống nhất, <strong>bên vi phạm sẽ bị xử thua 0-3 ở trận 2</strong>.
                </p>
              </div>

              {/* Important Fair Play Note */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-white">
                  📌 Nguyên tắc kiểm tra chéo &amp; minh bạch:
                </p>
                <p>
                  Các HLV có quyền và trách nhiệm chủ động kiểm tra đội hình đối phương trước trận đấu. Mọi kết quả của các trận đấu đã kết thúc và xác nhận hợp lệ trước đó sẽ được bảo lưu.
                </p>
              </div>
            </div>
          </CardSection>

        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Quydinh;
