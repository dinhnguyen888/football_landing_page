import React, { useState } from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import CardSection from "../components/cardsection";

const Thethuc: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "SWISS_DETAIL" | "KNOCKOUT_RULES">("OVERVIEW");
  const [selectedBranch, setSelectedBranch] = useState<"A" | "B">("A");

  return (
    <>
      <Banner
        title="THỂ THỨC THI ĐẤU"
        subtitle="Hệ thống Vòng Swiss FVPL (32 VĐV • 2 Nhánh độc lập) & Vòng chung kết Knockout 16 tuyển thủ"
        badge="FVPL SWISS FORMAT"
      />

      <Body>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Main Navigation Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 gap-2 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("OVERVIEW")}
              className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "OVERVIEW"
                  ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/30"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-sitemap text-sm"></i>
              <span>1. Tổng Quan 2 Giai Đoạn (32 VĐV)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("SWISS_DETAIL")}
              className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "SWISS_DETAIL"
                  ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/30"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-code-branch text-sm"></i>
              <span>2. Chi Tiết 5 Vòng Swiss FVPL</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("KNOCKOUT_RULES")}
              className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "KNOCKOUT_RULES"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-black"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-trophy text-sm text-amber-600"></i>
              <span>3. Vòng Knockout & Điểm BM</span>
            </button>
          </div>

          {/* ================= TAB 1: TỔNG QUAN 2 GIAI ĐOẠN (32 VĐV) ================= */}
          {activeTab === "OVERVIEW" && (
            <div className="space-y-6">
              {/* Highlight Hero Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border-2 border-emerald-500/40 text-white shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-xl font-black shadow-lg shadow-emerald-600/40">
                      32
                    </div>
                    <div>
                      <span className="font-fco text-[11px] font-black uppercase text-amber-400 tracking-wider block">
                        ĐÁ CÁ NHÂN 1VS1 • CHUẨN THỂ THỨC FVPL GARENA
                      </span>
                      <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-white">
                        MÔ HÌNH VÒNG SWISS 2 NHÁNH & KNOCKOUT
                      </h2>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-fco font-bold text-xs uppercase tracking-wider">
                    3 THẮNG ĐI TIẾP • 3 THUA BỊ LOẠI
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Giải đấu quy tụ <strong>32 Huấn luyện viên (VĐV)</strong> tranh tài cá nhân 1vs1. Toàn bộ giải đấu được chia thành <strong>02 Nhánh độc lập (Nhánh A: 16 VĐV và Nhánh B: 16 VĐV)</strong>, mỗi nhánh thi đấu theo thể thức <strong>Vòng Swiss 5 Round chuẩn FVPL</strong> để chọn ra <strong>Top 16 tuyển thủ xuất sắc nhất</strong> tiến vào Vòng Chung Kết Loại Trực Tiếp.
                </p>

                {/* 2-Stage Visual Roadmap */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Stage 1 Box */}
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-fco font-bold text-[10px] uppercase">
                        GIAI ĐOẠN 1
                      </span>
                      <span className="text-xs font-oswald text-slate-400 font-bold">32 VĐV ➔ 16 VĐV</span>
                    </div>
                    <h4 className="font-oswald text-base font-bold text-white uppercase">
                      VÒNG SWISS (2 NHÁNH ĐỘC LẬP)
                    </h4>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      <li><strong>Nhánh A:</strong> 16 VĐV đá Swiss 5 Rounds ➔ Lấy <strong>8 VĐV đi tiếp</strong></li>
                      <li><strong>Nhánh B:</strong> 16 VĐV đá Swiss 5 Rounds ➔ Lấy <strong>8 VĐV đi tiếp</strong></li>
                      <li>Cùng hệ số gặp nhau, không gặp lại đối thủ cũ</li>
                      <li>Đạt <strong>3 trận thắng</strong> giành vé đi tiếp, thua <strong>3 trận</strong> bị loại</li>
                    </ul>
                  </div>

                  {/* Stage 2 Box */}
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-fco font-bold text-[10px] uppercase">
                        GIAI ĐOẠN 2
                      </span>
                      <span className="text-xs font-oswald text-slate-400 font-bold">16 VĐV ➔ VÔ ĐỊCH</span>
                    </div>
                    <h4 className="font-oswald text-base font-bold text-white uppercase">
                      VÒNG CHUNG KẾT KNOCKOUT (PLAYOFFS)
                    </h4>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      <li><strong>16 VĐV</strong> (8 Nhánh A + 8 Nhánh B) ghép cặp chéo hạt giống</li>
                      <li>Thi đấu loại trực tiếp: <strong>Vòng 1/8 ➔ Tứ kết ➔ Bán kết ➔ CK</strong></li>
                      <li>Toàn bộ trận đấu áp dụng thể thức <strong>BO3 (Chạm 2 ván thắng)</strong></li>
                      <li>Tranh ngôi Quán quân, Á quân & Hạng Ba chung cuộc</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Branch Selector Banner */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-oswald text-lg font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2">
                    <i className="fa-solid fa-code-compare text-emerald-600"></i>
                    <span>CẤU TRÚC PHÂN CHIA 2 NHÁNH ĐẤU (MỖI NHÁNH 16 VĐV)</span>
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedBranch("A")}
                      className={`px-3 py-1 rounded-lg text-xs font-fco font-bold uppercase cursor-pointer transition-all ${
                        selectedBranch === "A"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      NHÁNH A (16 VĐV)
                    </button>
                    <button
                      onClick={() => setSelectedBranch("B")}
                      className={`px-3 py-1 rounded-lg text-xs font-fco font-bold uppercase cursor-pointer transition-all ${
                        selectedBranch === "B"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      NHÁNH B (16 VĐV)
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black font-fco flex items-center justify-center text-sm">
                        {selectedBranch}
                      </span>
                      <div>
                        <h4 className="font-oswald text-base font-bold uppercase text-slate-900 dark:text-white">
                          BẢNG ĐẤU NHÁNH {selectedBranch} (16 TUYỂN THỦ CÁ NHÂN)
                        </h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Bốc thăm ngẫu nhiên 16 VĐV từ danh sách 32 VĐV đăng ký hợp lệ
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-fco font-black text-xs border border-emerald-200 dark:border-emerald-800">
                      LẤY 8 SUẤT VÀO KNOCKOUT
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-center space-y-1">
                      <span className="font-fco text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">
                        VÉ HẠT GIỐNG 1 (THẮNG 3-0)
                      </span>
                      <span className="font-oswald text-2xl font-black text-emerald-700 dark:text-emerald-400 block">
                        2 SUẤT
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Vượt qua Swiss chỉ sau 3 Vòng đấu
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 text-center space-y-1">
                      <span className="font-fco text-[11px] font-bold text-sky-800 dark:text-sky-300 uppercase block">
                        VÉ HẠT GIỐNG 2 (THẮNG 3-1)
                      </span>
                      <span className="font-oswald text-2xl font-black text-sky-700 dark:text-sky-400 block">
                        3 SUẤT
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Giành vé đi tiếp tại Vòng 4 Swiss
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-center space-y-1">
                      <span className="font-fco text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase block">
                        VÉ HẠT GIỐNG 3 (THẮNG 3-2)
                      </span>
                      <span className="font-oswald text-2xl font-black text-amber-700 dark:text-amber-400 block">
                        3 SUẤT
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Giành vé tại loạt trận sinh tử Vòng 5
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    * Cả 2 Nhánh A và Nhánh B vận hành song song và độc lập hoàn toàn ở Giai đoạn 1. Các VĐV của Nhánh A chỉ gặp các VĐV của Nhánh B khi bước sang Giai đoạn 2 (Vòng Chung Kết Knockout).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: CHI TIẾT 5 VÒNG SWISS FVPL ================= */}
          {activeTab === "SWISS_DETAIL" && (
            <div className="space-y-6">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-fco font-black text-xs uppercase tracking-wider">
                  TIẾN TRÌNH CHI TIẾT 5 ROUNDS
                </span>
                <h3 className="font-oswald text-2xl font-bold uppercase text-slate-900 dark:text-white">
                  CƠ CHẾ GHÉP CẶP VÀ ĐIỀU KIỆN ĐI TIẾP VÒNG SWISS
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Áp dụng giống nhau cho từng nhánh 16 VĐV: Các VĐV có cùng hệ số thắng - thua đối đầu trực tiếp, không tái đấu đối thủ cũ.
                </p>
              </div>

              {/* 5 Rounds Timeline Cards */}
              <div className="space-y-4">
                {/* Round 1 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-8 h-8 rounded-lg bg-slate-900 text-white dark:bg-emerald-600 font-oswald font-black text-sm flex items-center justify-center">
                        R1
                      </span>
                      <h4 className="font-oswald text-base font-bold uppercase text-slate-900 dark:text-white">
                        VÒNG 1: KHỞI TRANH (HỆ SỐ 0 - 0)
                      </h4>
                    </div>
                    <span className="text-xs font-fco font-bold text-slate-500 dark:text-slate-400">
                      8 CẶP ĐẤU
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    16 VĐV (hệ số 0-0) được xếp 8 cặp đấu ngẫu nhiên.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800">
                      🟢 <strong>8 VĐV Thắng</strong>: Lên nhóm hệ số <strong>(1 - 0)</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-medium border border-rose-200 dark:border-rose-800">
                      🔴 <strong>8 VĐV Thua</strong>: Xuống nhóm hệ số <strong>(0 - 1)</strong>
                    </div>
                  </div>
                </div>

                {/* Round 2 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-8 h-8 rounded-lg bg-slate-900 text-white dark:bg-emerald-600 font-oswald font-black text-sm flex items-center justify-center">
                        R2
                      </span>
                      <h4 className="font-oswald text-base font-bold uppercase text-slate-900 dark:text-white">
                        VÒNG 2: PHÂN NHÁNH THẮNG & THUA
                      </h4>
                    </div>
                    <span className="text-xs font-fco font-bold text-slate-500 dark:text-slate-400">
                      8 CẶP ĐẤU
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 block font-oswald uppercase">
                        Nhánh Thắng (1-0 gặp 1-0): 4 cặp đấu
                      </span>
                      <p className="text-slate-600 dark:text-slate-300">
                        • 4 người thắng ➔ Lên hệ số <strong>(2 - 0)</strong><br />
                        • 4 người thua ➔ Thành hệ số <strong>(1 - 1)</strong>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-rose-700 dark:text-rose-400 block font-oswald uppercase">
                        Nhánh Thua (0-1 gặp 0-1): 4 cặp đấu
                      </span>
                      <p className="text-slate-600 dark:text-slate-300">
                        • 4 người thắng ➔ Lên hệ số <strong>(1 - 1)</strong><br />
                        • 4 người thua ➔ Xuống hệ số <strong>(0 - 2)</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Round 3 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400/80 dark:border-emerald-500/80 shadow-md space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-oswald font-black text-sm flex items-center justify-center">
                        R3
                      </span>
                      <div>
                        <h4 className="font-oswald text-base font-bold uppercase text-slate-900 dark:text-white">
                          VÒNG 3: VÉ ĐI TIẾP ĐẦU TIÊN & LOẠI ĐẦU TIÊN
                        </h4>
                        <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block">
                          ⭐ XUẤT HIỆN 2 VÉ ĐI TIẾP (3-0) & 2 VĐV BỊ LOẠI (0-3)
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-fco font-bold text-slate-500 dark:text-slate-400">
                      8 CẶP ĐẤU
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-1">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 font-oswald uppercase block">
                        Nhánh (2-0): 2 cặp
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">
                        🎉 <strong>2 VĐV Thắng (3-0)</strong>: Giành 2 tấm vé đầu tiên vào Knockout!<br />
                        • 2 VĐV Thua: Xuống nhóm (2-1).
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-oswald uppercase block">
                        Nhánh (1-1): 4 cặp
                      </span>
                      <p className="text-slate-600 dark:text-slate-300">
                        • 4 người thắng lên <strong>(2-1)</strong>.<br />
                        • 4 người thua xuống <strong>(1-2)</strong>.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 space-y-1">
                      <span className="font-bold text-rose-800 dark:text-rose-300 font-oswald uppercase block">
                        Nhánh (0-2 Sinh Tử): 2 cặp
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">
                        • 2 VĐV Thắng: Lên nhóm (1-2).<br />
                        ❌ <strong>2 VĐV Thua (0-3)</strong>: Chính thức bị loại khỏi giải.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Round 4 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-8 h-8 rounded-lg bg-slate-900 text-white dark:bg-emerald-600 font-oswald font-black text-sm flex items-center justify-center">
                        R4
                      </span>
                      <h4 className="font-oswald text-base font-bold uppercase text-slate-900 dark:text-white">
                        VÒNG 4: TRANH VÉ VÒNG 4 & SINH TỬ
                      </h4>
                    </div>
                    <span className="text-xs font-fco font-bold text-slate-500 dark:text-slate-400">
                      6 CẶP ĐẤU
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 font-oswald uppercase block">
                        Nhánh Tranh Vé (2-1 gặp 2-1): 3 cặp
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        🎉 <strong>3 VĐV Thắng (3-1)</strong>: Giành 3 tấm vé tiếp theo vào Knockout!<br />
                        • 3 VĐV Thua: Xuống nhóm (2-2).
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-1">
                      <span className="font-bold text-rose-800 dark:text-rose-300 font-oswald uppercase block">
                        Nhánh Sinh Tử (1-2 gặp 1-2): 3 cặp
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        • 3 VĐV Thắng: Lên nhóm (2-2).<br />
                        ❌ <strong>3 VĐV Thua (1-3)</strong>: Chính thức bị loại khỏi giải.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Round 5 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-500 shadow-md space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-oswald font-black text-sm flex items-center justify-center">
                        R5
                      </span>
                      <div>
                        <h4 className="font-oswald text-base font-bold uppercase text-slate-900 dark:text-white">
                          VÒNG 5: CHUNG KẾT SWISS (HỆ SỐ 2 - 2)
                        </h4>
                        <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold block">
                          🔥 3 TRẬN ĐẤU QUYẾT ĐỊNH 3 TẤM VÉ CUỐI CÙNG
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-fco font-bold text-slate-500 dark:text-slate-400">
                      3 CẶP ĐẤU
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Còn lại 6 VĐV có cùng hệ số <strong>(2 - 2)</strong> thi đấu 3 cặp đấu một mất một còn để phân định số phận:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-1">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 font-oswald uppercase block">
                        🎉 3 VĐV THẮNG (HỆ SỐ 3 - 2)
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">
                        Giành 3 tấm vé cuối cùng của nhánh đấu bước vào Vòng Knockout 16 đội!
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 space-y-1">
                      <span className="font-bold text-rose-800 dark:text-rose-300 font-oswald uppercase block">
                        ❌ 3 VĐV THUA (HỆ SỐ 2 - 3)
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">
                        Dừng bước và kết thúc hành trình thi đấu tại Vòng Swiss.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: VÒNG KNOCKOUT & QUY CHẾ BM ================= */}
          {activeTab === "KNOCKOUT_RULES" && (
            <div className="space-y-6">
              {/* Section 1: Playoffs bracket setup */}
              <CardSection
                badgeNumber={1}
                title="GIAI ĐOẠN 2 – VÒNG CHUNG KẾT KNOCKOUT (16 VĐV)"
              >
                <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed pl-2 sm:pl-11">
                  <p>
                    <strong>16 Tuyển thủ xuất sắc nhất</strong> (8 VĐV Nhánh A + 8 VĐV Nhánh B) bước vào vòng loại trực tiếp theo nguyên tắc ghép cặp chéo hạt giống Swiss:
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <h5 className="font-oswald text-sm font-bold uppercase text-slate-900 dark:text-white">
                      Nguyên tắc ghép cặp Vòng 1/8 (Round of 16):
                    </h5>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                      <li><strong>Hạt giống số 1 (3-0 Nhánh A/B):</strong> Đối đầu với các VĐV hạt giống số 3 (3-2 của Nhánh đối diện).</li>
                      <li><strong>Hạt giống số 2 (3-1 Nhánh A/B):</strong> Đối đầu chéo với các VĐV hạt giống số 2 hoặc số 3 của Nhánh đối diện.</li>
                      <li>Các VĐV cùng nhánh ở Vòng Swiss sẽ chỉ có thể tái đấu nhau tại Bán kết hoặc Chung kết.</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-center font-oswald uppercase">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                      <span className="text-xs text-slate-500 dark:text-slate-400 block font-bold">VÒNG 1/8</span>
                      <span className="text-base font-black text-emerald-700 dark:text-emerald-300">16 VĐV</span>
                    </div>
                    <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                      <span className="text-xs text-slate-500 dark:text-slate-400 block font-bold">TỨ KẾT</span>
                      <span className="text-base font-black text-sky-700 dark:text-sky-300">8 VĐV</span>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                      <span className="text-xs text-slate-500 dark:text-slate-400 block font-bold">BÁN KẾT</span>
                      <span className="text-base font-black text-amber-700 dark:text-amber-300">4 VĐV</span>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                      <span className="text-xs text-slate-500 dark:text-slate-400 block font-bold">CHUNG KẾT</span>
                      <span className="text-base font-black text-rose-700 dark:text-rose-300">TOP 1 & 2</span>
                    </div>
                  </div>
                </div>
              </CardSection>

              {/* Section 2: Match Rules BO3 */}
              <CardSection
                badgeNumber={2}
                title="QUY CHẾ THI ĐẤU BO3 & PHÂN ĐỊNH THẮNG THUA"
              >
                <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed pl-2 sm:pl-11">
                  <ul className="list-disc list-inside space-y-2 text-slate-800 dark:text-slate-200">
                    <li>
                      <strong>Thể thức loạt trận:</strong> Toàn bộ các trận đấu từ Vòng Swiss đến Vòng Knockout đều áp dụng <strong>BO3 (Best of 3 - Chạm 2 ván thắng)</strong>. HLV giành 2 ván thắng trước sẽ chiến thắng cả loạt trận.
                    </li>
                    <li>
                      <strong>Không có kết quả hòa:</strong> Trong từng game đấu FC Online, 2 VĐV <strong>bắt buộc phải kích hoạt tùy chọn Hiệp phụ (ET) và Sút luân lưu (PK)</strong> nếu kết quả 90 phút thi đấu chính thức hòa.
                    </li>
                    <li>
                      <strong>Trận Tranh Hạng Ba:</strong> Diễn ra giữa 2 VĐV dừng bước tại Bán kết để phân định giải Ba (150.000đ).
                    </li>
                  </ul>
                </div>
              </CardSection>

              {/* Section 3: Fairplay & Unfair Play BM Rules */}
              <CardSection
                badgeNumber={3}
                title="HỆ THỐNG FAIR-PLAY & NGƯỠNG ĐIỂM BM INGAME"
              >
                <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed pl-2 sm:pl-11">
                  <p>
                    Giải đấu áp dụng <strong>hệ thống điểm Unfair Play (BM) trong game FC Online</strong> để kiểm soát và xử phạt nghiêm minh các hành vi câu giờ, thi đấu tiêu cực.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
                      <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-300 font-fco font-bold text-sm uppercase">
                        <i className="fa-solid fa-triangle-exclamation text-amber-600"></i>
                        <span>VÒNG SWISS: 8 ĐIỂM BM</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        VĐV tích lũy từ <strong>8 điểm BM</strong> trong 1 trận đấu ➔ Bị <strong>xử thua 0-3 ván đấu đó</strong>.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-1">
                      <div className="flex items-center space-x-2 text-rose-900 dark:text-rose-300 font-fco font-bold text-sm uppercase">
                        <i className="fa-solid fa-ban text-rose-600"></i>
                        <span>VÒNG KNOCKOUT: 12 ĐIỂM BM</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        VĐV tích lũy từ <strong>12 điểm BM</strong> trong 1 trận đấu ➔ Bị <strong>xử thua ván đấu đó</strong> trong loạt BO3.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-2 border-t border-slate-100 dark:border-slate-800">
                    * Khi phát hiện đối thủ đạt ngưỡng BM quy định, VĐV cần chụp ảnh hoặc quay video màn hình gửi ngay cho BTC để được xử lý theo quy chế.
                  </p>
                </div>
              </CardSection>
            </div>
          )}
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Thethuc;
