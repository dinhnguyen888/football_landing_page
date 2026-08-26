import React from "react";
import { Link, useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const location = useLocation();
  const isDthen = location.pathname.startsWith("/dthen");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className={`mt-20 relative ${
        isDthen ? "bg-[#030c18] border-blue-500" : "bg-[#04130d] border-emerald-500"
      } text-slate-300 border-t-2 overflow-hidden`}
    >
      {/* 1. Football Pitch Mowed Grass Stripes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDthen
            ? "repeating-linear-gradient(90deg, #051429 0px, #051429 60px, #020a16 60px, #020a16 120px)"
            : "repeating-linear-gradient(90deg, #051911 0px, #051911 60px, #03120c 60px, #03120c 120px)",
        }}
      />

      {/* 2. Stadium Floodlights & Pitch Radial Lighting */}
      <div
        className="absolute inset-0 pointer-events-none opacity-80 animate-floodlight"
        style={{
          background: isDthen
            ? `
              radial-gradient(ellipse 90% 60% at 50% 0%, rgba(14, 165, 233, 0.25), transparent 75%),
              radial-gradient(circle at 15% 10%, rgba(99, 102, 241, 0.15), transparent 40%),
              radial-gradient(circle at 85% 10%, rgba(245, 158, 11, 0.15), transparent 40%),
              linear-gradient(180deg, transparent 0%, rgba(1, 6, 15, 0.8) 100%)
            `
            : `
              radial-gradient(ellipse 90% 60% at 50% 0%, rgba(0, 229, 117, 0.25), transparent 75%),
              radial-gradient(circle at 15% 10%, rgba(255, 255, 255, 0.12), transparent 40%),
              radial-gradient(circle at 85% 10%, rgba(245, 158, 11, 0.12), transparent 40%),
              linear-gradient(180deg, transparent 0%, rgba(1, 10, 6, 0.8) 100%)
            `,
        }}
      />

      {/* 3. Glowing Neon LED Top Line with Flowing Animation */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${
          isDthen
            ? "from-[#0ea5e9] via-[#6366f1] to-[#f59e0b]"
            : "from-[#00e575] via-[#0ea5e9] to-[#f59e0b]"
        } animate-gradient-flow shadow-[0_0_15px_rgba(0,229,117,0.5)]`}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link
              to={isDthen ? "/dthen" : "/saovang"}
              className="inline-flex items-center space-x-3.5 group flex-shrink-0"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                {isDthen ? (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center text-2xl shadow-lg">
                    <i className="fa-solid fa-trophy text-amber-400"></i>
                  </div>
                ) : (
                  <img
                    src={require("../img/logo02.svg").default}
                    alt="Sao Vàng Cup Logo"
                    className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(0,229,117,0.6)]"
                  />
                )}
              </div>
              <div className="whitespace-nowrap">
                <span className="font-fco text-xl font-black uppercase tracking-wider text-white block leading-none whitespace-nowrap">
                  {isDthen ? "ĐTHÉN" : "SAO VÀNG"}{" "}
                  <span className="text-amber-400">{isDthen ? "FCO™" : "CUP™"}</span>
                </span>
                <span
                  className={`text-[10px] font-fco font-bold uppercase tracking-widest ${
                    isDthen ? "text-blue-400" : "text-emerald-400"
                  } block mt-1.5 whitespace-nowrap`}
                >
                  FC ONLINE ESPORTS HUB
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed">
              Cổng thông tin, bảng điểm và cẩm nang điều lệ giải đấu bóng đá điện tử FC Online uy tín & chuyên nghiệp dành cho cộng đồng game thủ.
            </p>
          </div>

          {/* Col 2: Quick Rules */}
          <div className="space-y-3">
            <span
              className={`font-fco text-xs font-bold uppercase tracking-widest ${
                isDthen ? "text-blue-400" : "text-emerald-400"
              } block pb-1 border-b border-slate-800`}
            >
              QUY ĐỊNH & THỂ THỨC
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to={isDthen ? "/dthen/noiquy" : "/noiquy"}
                  className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5 group"
                >
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500 group-hover:translate-x-1 transition-transform"></i>
                  <span>Nội quy thi đấu</span>
                </Link>
              </li>
              <li>
                <Link
                  to={isDthen ? "/dthen/dieukienthamdu" : "/dieukienthamdu"}
                  className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5 group"
                >
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500 group-hover:translate-x-1 transition-transform"></i>
                  <span>Điều kiện tham dự</span>
                </Link>
              </li>
              <li>
                <Link
                  to={isDthen ? "/dthen/quydinh" : "/quydinh"}
                  className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5 group"
                >
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500 group-hover:translate-x-1 transition-transform"></i>
                  <span>Quy định squad lương 300</span>
                </Link>
              </li>
              <li>
                <Link
                  to={isDthen ? "/dthen/thethuc" : "/thethuc"}
                  className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5 group"
                >
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500 group-hover:translate-x-1 transition-transform"></i>
                  <span>Thể thức thi đấu & BXH</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tournament Hub */}
          <div className="space-y-3">
            <span
              className={`font-fco text-xs font-bold uppercase tracking-widest ${
                isDthen ? "text-blue-400" : "text-emerald-400"
              } block pb-1 border-b border-slate-800`}
            >
              TRUNG TÂM GIẢI ĐẤU
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5 group"
                >
                  <i className="fa-solid fa-layer-group text-[9px] text-amber-400 group-hover:scale-110 transition-transform"></i>
                  <span className="font-semibold text-white">Hub Cổng Chọn Giải Đấu</span>
                </Link>
              </li>
              <li>
                <Link
                  to={isDthen ? "/dthen/ltd" : "/ltd"}
                  className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5 group"
                >
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500 group-hover:translate-x-1 transition-transform"></i>
                  <span>Lịch thi đấu & BXH trực tiếp</span>
                </Link>
              </li>
              <li>
                <Link
                  to={isDthen ? "/dthen/giaithuong" : "/giaithuong"}
                  className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5 group"
                >
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500 group-hover:translate-x-1 transition-transform"></i>
                  <span>Cơ cấu giải thưởng & Cúp</span>
                </Link>
              </li>
              <li>
                <Link
                  to={isDthen ? "/dthen/xephang" : "/xephang"}
                  className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5 group"
                >
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500 group-hover:translate-x-1 transition-transform"></i>
                  <span>Phòng truyền thống Hall of Fame</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Scroll to Top */}
          <div className="space-y-3">
            <span
              className={`font-fco text-xs font-bold uppercase tracking-widest ${
                isDthen ? "text-blue-400" : "text-emerald-400"
              } block pb-1 border-b border-slate-800`}
            >
              KÊNH CỘNG ĐỒNG
            </span>

            <div className="space-y-2.5 pt-1">
              <a
                href="https://www.facebook.com/groups/939885034118607"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-blue-600/30 border border-slate-800 hover:border-blue-500/60 flex items-center space-x-3 transition-all group card-hover-fx"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <i className="fa-brands fa-facebook-f"></i>
                </div>
                <div>
                  <span className="font-fco text-xs font-bold text-white block leading-tight">
                    Group Facebook
                  </span>
                  <span className="text-[10px] text-slate-400">Giao lưu & Thảo luận</span>
                </div>
              </a>

              <button
                onClick={scrollToTop}
                className={`w-full p-2.5 rounded-xl ${
                  isDthen ? "bg-blue-900/60 border-blue-500/40 text-blue-300" : "bg-emerald-900/60 border-emerald-500/40 text-emerald-300"
                } border hover:border-amber-400 font-oswald text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all hover:scale-105 btn-shimmer`}
              >
                <i className="fa-solid fa-arrow-up text-amber-400"></i>
                <span>LÊN ĐẦU TRANG</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & BTC Credits */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <p>
              © 2024 - 2026{" "}
              <strong className="text-white font-fco">
                {isDthen ? "ĐTHÉN FCO ™" : "SAO VÀNG CUP ™"}
              </strong>{" "}
              (FC ONLINE). ALL RIGHTS RESERVED.
            </p>
          </div>
          <p className="text-center sm:text-right">
            BAN TỔ CHỨC:{" "}
            <strong className={isDthen ? "text-blue-400" : "text-emerald-400"}>
              {isDthen ? "ADMIN ĐTHÉN & TỔ TRỌNG TÀI" : "ADMIN PHAN LONG & BẠCH MINH QUANG"}
            </strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
