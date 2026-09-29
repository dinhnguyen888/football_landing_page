import React, { useState } from "react";
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import Body from "../../components/body";
import CardSection from "../../components/cardsection";

const DthenTheThuc: React.FC = () => {
  const [activeFormat, setActiveFormat] = useState<"DTHEN_34" | "GROUP_KNOCKOUT" | "PURE_KNOCKOUT">("DTHEN_34");

  return (
    <>
      <Banner
        title="THỂ THỨC THI ĐẤU ĐTHÉN FCO ™"
        subtitle="Chi tiết thể thức thi đấu giải ĐThén 34 VĐV (2 Đặc Cách), Vòng bảng và Cúp loại trực tiếp"
        badge="DTHEN FCO FORMAT"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Format Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 gap-2">
            <button
              type="button"
              onClick={() => setActiveFormat("DTHEN_34")}
              className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeFormat === "DTHEN_34"
                  ? "bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 text-white shadow-md font-black"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-crown text-amber-300"></i>
              <span>⭐ Sơ Đồ 34 VĐV (2 Đặc Cách)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFormat("GROUP_KNOCKOUT")}
              className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeFormat === "GROUP_KNOCKOUT"
                  ? "bg-blue-600 text-white shadow-md font-bold"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-layer-group text-sm"></i>
              <span>Vòng Bảng & Knockout (32 Đội)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFormat("PURE_KNOCKOUT")}
              className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeFormat === "PURE_KNOCKOUT"
                  ? "bg-indigo-600 text-white shadow-md font-black"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-trophy text-sm text-amber-300"></i>
              <span>Cúp Knockout Đơn Thuần</span>
            </button>
          </div>

          {/* ================= TAB 0: SƠ ĐỒ 34 VĐV (2 VĐV ĐẶC CÁCH) ================= */}
          {activeFormat === "DTHEN_34" && (
            <>
              <CardSection badgeNumber={1} title="SƠ ĐỒ GIẢI ĐẤU 34 VĐV (2 VĐV ĐẶC CÁCH)">
                <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed pl-2 sm:pl-11">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white border-2 border-amber-400/50 shadow-md">
                    <h3 className="font-oswald font-black uppercase text-base sm:text-lg text-amber-400 flex items-center gap-2">
                      <i className="fa-solid fa-shield-halved"></i>
                      <span>NGUYÊN TẮC VÀ ĐẶC QUYỀN ĐẶC CÁCH</span>
                    </h3>
                    <ul className="mt-2 text-xs sm:text-sm space-y-1 text-slate-200">
                      <li>• <strong>2 VĐV đặc cách: VĐV 1 – DTFx18 05 2024 (Phạm Quốc Minh) và VĐV 2 – ĐTFxGNOL04 (Phan Long)</strong> không thi đấu trước Top 16.</li>
                      <li>• <strong>32 VĐV còn lại</strong> thi đấu qua Play-off và Vòng Loại để chọn 14 người vào Top 16.</li>
                      <li>• <strong>Thắng 1 trận ở Top 16 là vào Top 8</strong>.</li>
                    </ul>
                  </div>

                  {/* 6 Stages Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                    {/* Stage 1 */}
                    <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-oswald font-black uppercase text-orange-700 dark:text-orange-400">
                        <span>1. VÒNG PLAY-OFF (4 TRẬN)</span>
                        <span className="px-2 py-0.5 rounded bg-orange-500 text-white">8 VĐV</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        8 VĐV thi đấu loại trực tiếp, lấy <strong>4 người thắng (W1, W2, W3, W4)</strong> tiến vào Vòng Loại.
                      </p>
                    </div>

                    {/* Stage 2 */}
                    <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-oswald font-black uppercase text-sky-700 dark:text-sky-400">
                        <span>2. VÒNG LOẠI (14 TRẬN)</span>
                        <span className="px-2 py-0.5 rounded bg-sky-500 text-white">28 VĐV</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        24 VĐV theo bốc thăm (T1–T12) + 2 cặp thắng Play-off (T13: W1 vs W2, T14: W3 vs W4) ➔ lấy <strong>14 người thắng (A1–A14)</strong>.
                      </p>
                    </div>

                    {/* Stage 3 */}
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-oswald font-black uppercase text-emerald-700 dark:text-emerald-400">
                        <span>3. TOP 16 (8 TRẬN)</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white">16 VĐV</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        2 VĐV đặc cách xuất quân: Trận 1 (VĐV 1 vs A1), Trận 8 (A14 vs VĐV 2), các trận 2–7 là các cặp A2–A13 đối đầu nhau. 8 người thắng vào Tứ Kết.
                      </p>
                    </div>

                    {/* Stage 4 */}
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-oswald font-black uppercase text-amber-700 dark:text-amber-400">
                        <span>4. TOP 8 / TỨ KẾT (4 TRẬN)</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">8 VĐV</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Q1 (Thắng T1 vs Thắng T2), Q2 (Thắng T3 vs Thắng T4), Q3 (Thắng T5 vs Thắng T6), Q4 (Thắng T7 vs Thắng T8). 4 người thắng vào Top 4.
                      </p>
                    </div>

                    {/* Stage 5 */}
                    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-oswald font-black uppercase text-indigo-700 dark:text-indigo-400">
                        <span>5. TOP 4 / BÁN KẾT (2 TRẬN)</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-600 text-white">4 VĐV</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Bán kết 1 (S1): Thắng Q1 vs Thắng Q2.<br />
                        Bán kết 2 (S2): Thắng Q3 vs Thắng Q4.
                      </p>
                    </div>

                    {/* Stage 6 */}
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-oswald font-black uppercase text-rose-700 dark:text-rose-400">
                        <span>6. CHUNG KẾT (1 TRẬN)</span>
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white">2 VĐV</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Thắng S1 vs Thắng S2. Tranh cúp vô địch danh giá ĐThén FCO ™!
                      </p>
                    </div>
                  </div>
                </div>
              </CardSection>

              <CardSection badgeNumber={2} title="XEM NHÁNH ĐẤU & LỊCH THI ĐẤU TRỰC TIẾP">
                <div className="space-y-3 pl-2 sm:pl-11">
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    Toàn bộ danh sách 34 VĐV cùng các cặp thi đấu bốc thăm V1 và V2 đã được cập nhật trực quan trên sơ đồ tương tác 6 cột:
                  </p>
                  <a
                    href="/dthen/ltd"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-oswald font-bold text-xs uppercase tracking-wider hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all"
                  >
                    <i className="fa-solid fa-sitemap"></i>
                    <span>Xem Sơ Đồ Nhánh Đấu Trực Tuyến (/dthen/ltd)</span>
                  </a>
                </div>
              </CardSection>
            </>
          )}

          {/* ================= TAB 1: GROUP + KNOCKOUT ================= */}
          {activeFormat === "GROUP_KNOCKOUT" && (
            <>
              {/* Section 1: Tournament Stages */}
              <CardSection badgeNumber={1} title="THỂ THỨC THI ĐẤU – ĐTHÉN FCO™">
                <div className="space-y-4 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
                  <p className="text-slate-800">
                    Giải đấu được tổ chức theo <strong>02 giai đoạn</strong> chính thức:
                  </p>

                  {/* Giai đoạn 1 */}
                  <div className="space-y-1.5 pt-1">
                    <h4 className="font-bold text-slate-900">Giai đoạn 1 – Vòng bảng (Group Stage)</h4>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      <li>32 Huấn luyện viên được chia đều vào <strong>8 bảng đấu (Bảng A, B, C, D, E, F, G, H)</strong>, mỗi bảng 4 HLV.</li>
                      <li>Thi đấu theo thể thức <strong>vòng tròn 1 lượt</strong> tính điểm (thắng 3 điểm, hòa 1 điểm, thua 0 điểm).</li>
                      <li><strong>Top 2 HLV dẫn đầu mỗi bảng (tổng cộng 16 HLV)</strong> sẽ giành vé chính thức tiến vào giai đoạn Knockout (Vòng 1/8).</li>
                    </ul>
                  </div>

                  {/* Giai đoạn 2 */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900">Giai đoạn 2 – Vòng loại trực tiếp (Knockout Stage)</h4>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      <li>16 HLV xuất sắc nhất thi đấu theo phân nhánh trực tiếp: <strong>Vòng 1/8 (Round of 16) ➔ Tứ Kết ➔ Bán Kết ➔ Chung Kết & Tranh Hạng Ba</strong>.</li>
                      <li>Các trận đấu Knockout áp dụng thể thức <strong>BO3 (Best of 3)</strong>: HLV thắng 2/3 trận sẽ giành quyền đi tiếp.</li>
                      <li>Trận Chung kết phân định ngôi vương đỉnh cao của giải đấu.</li>
                    </ul>
                  </div>
                </div>
              </CardSection>

              {/* Section 2: Points */}
              <CardSection badgeNumber={2} title="QUY TẮC TÍNH ĐIỂM & XẾP HẠNG VÒNG BẢNG">
                <div className="space-y-4 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="block font-black text-emerald-700 text-xl font-oswald">3 ĐIỂM</span>
                      <span className="text-xs text-slate-600 font-semibold uppercase">Chiến Thắng</span>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="block font-black text-amber-700 text-xl font-oswald">1 ĐIỂM</span>
                      <span className="text-xs text-slate-600 font-semibold uppercase">Trận Hòa</span>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                      <span className="block font-black text-rose-700 text-xl font-oswald">0 ĐIỂM</span>
                      <span className="text-xs text-slate-600 font-semibold uppercase">Thất Bại</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900">Thứ tự ưu tiên khi các đội bằng điểm nhau:</h4>
                    <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-700">
                      <li><strong>Hiệu số bàn thắng bại (Goal Difference)</strong>.</li>
                      <li><strong>Tổng số bàn thắng ghi được (Goals For)</strong>.</li>
                      <li><strong>Thành tích đối đầu trực tiếp (Head-to-Head)</strong>.</li>
                      <li><strong>Trận đấu Play-off hoặc bốc thăm may mắn</strong> (nếu mọi chỉ số đều trùng khớp).</li>
                    </ol>
                  </div>
                </div>
              </CardSection>
            </>
          )}

          {/* ================= TAB 2: PURE KNOCKOUT (CÚP LOẠI TRỰC TIẾP) ================= */}
          {activeFormat === "PURE_KNOCKOUT" && (
            <>
              {/* Section 1: Overview */}
              <CardSection badgeNumber={1} title="THỂ THỨC CÚP LOẠI TRỰC TIẾP – ĐTHÉN FCO™">
                <div className="space-y-4 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200">
                    <div className="flex items-center gap-2 font-bold font-oswald text-base text-blue-900 dark:text-blue-300 uppercase">
                      <i className="fa-solid fa-trophy text-amber-500"></i>
                      <span>Đỉnh Cao Đấu Cúp Knockout ĐThén FCO</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1">
                      Giải đấu loại trực tiếp đơn lẻ đưa các HLV vào ngay những cặp đấu một mất một còn. Không có cơ hội sửa sai, mỗi chiến thắng đưa người chơi tiến gần hơn đến chức vô địch danh giá!
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">Quy mô giải đấu tự chọn:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
                        <span className="font-oswald text-lg font-bold text-blue-600 dark:text-blue-400 block">8 HLV</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Tứ Kết ➔ Bán Kết ➔ CK</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
                        <span className="font-oswald text-lg font-bold text-indigo-600 dark:text-indigo-400 block">16 HLV</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Vòng 1/8 ➔ Tứ Kết ➔ CK</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
                        <span className="font-oswald text-lg font-bold text-violet-600 dark:text-violet-400 block">32 HLV</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Vòng 1/16 ➔ Vòng 1/8 ➔ CK</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardSection>

              {/* Section 2: Two Pairing Methods */}
              <CardSection badgeNumber={2} title="02 PHƯƠNG THỨC XẾP CẶP THI ĐẤU">
                <div className="space-y-4 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
                  <p className="text-slate-800 dark:text-slate-200">
                    Ban Tổ Chức và các HLV có thể lựa chọn 1 trong <strong>02 hình thức xếp cặp</strong>:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Cách 1: Ngẫu nhiên */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-oswald font-bold text-sm uppercase">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                          🎲
                        </span>
                        <span>1. XẾP CẶP NGẪU NHIÊN (AUTO RANDOM)</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Hệ thống tự động xáo trộn ngẫu nhiên toàn bộ danh sách HLV và ghép cặp vào các nhánh đấu Trận 1, Trận 2... ngay lập tức chỉ với 1 thao tác bấm.
                      </p>
                      <span className="inline-block text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                        Nhanh gọn • Tự động • Cân bằng
                      </span>
                    </div>

                    {/* Cách 2: Bốc thăm 3D */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-blue-200 dark:border-blue-800 space-y-2">
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-oswald font-bold text-sm uppercase">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
                          🏆
                        </span>
                        <span>2. BỐC THĂM TRỰC TIẾP (LIVE 3D DRAW)</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Ban Tổ Chức sẽ tổ chức bốc thăm trên sân khấu <strong>Bốc thăm 3D trực tuyến</strong> chuyên nghiệp (dành riêng cho Admin & BTC điều hành). Mở từng quả bóng chia lần lượt vào các cặp đấu Trận 1, Trận 2 công khai trước toàn thể cộng đồng.
                      </p>
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <i className="fa-solid fa-lock text-[10px] text-blue-500"></i>
                        <span>Sân khấu bốc thăm do Ban Tổ Chức vận hành</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardSection>

              {/* Section 3: Rules */}
              <CardSection badgeNumber={3} title="QUY CHẾ THI ĐẤU BO3 & PHÂN ĐỊNH THẮNG THUA">
                <div className="space-y-4 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
                  <ul className="list-disc list-inside space-y-2 text-slate-800 dark:text-slate-200">
                    <li>
                      <strong>Thể thức loạt trận:</strong> Toàn bộ các vòng Knockout áp dụng <strong>BO3 (Best of 3)</strong>, HLV giành 2 trận thắng trước sẽ đi tiếp.
                    </li>
                    <li>
                      <strong>Xử lý khi hòa ván đấu:</strong> Bắt buộc bật tính năng <strong>Hiệp phụ (ET) và Sút luân lưu (PK)</strong> trong game FC Online nếu tỷ số hòa sau 90 phút.
                    </li>
                    <li>
                      <strong>Trận Chung kết & Tranh Hạng Ba:</strong> Xác định đầy đủ Quán quân, Á quân và Top 3 toàn giải.
                    </li>
                    <li>
                      <strong>Điểm Fair-play / BM:</strong> Ngưỡng vi phạm 12 điểm BM trong 1 game đấu sẽ bị xử thua ngay ván đấu đó.
                    </li>
                  </ul>
                </div>
              </CardSection>
            </>
          )}
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default DthenTheThuc;
