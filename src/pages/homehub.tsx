import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer";

const HomeHub: React.FC = () => {
  // Current tournament list - only active tournaments are shown.
  // Add new tournament objects here in the future to display more tournaments.
  const tournaments = [
    {
      id: "saovang",
      name: "FC ONLINE SAO VÀNG CUP ™",
      status: "ACTIVE",
      statusText: "ĐANG DIỄN RA",
      season: "MÙA 2 (2024 - 2025)",
      logo: require("../img/logo02.svg").default,
      link: "/saovang",
      subtitle: "Sân chơi thi đấu trực tuyến cộng đồng",
      theme: "emerald",
    },
    {
      id: "dthen",
      name: "FC ONLINE ĐTHÉN FCO ™",
      status: "ACTIVE",
      statusText: "ĐANG DIỄN RA",
      season: "MÙA 1 (2025)",
      logo: null,
      customIcon: "fa-trophy",
      link: "/dthen",
      subtitle: "Giải đấu do Admin ĐThén sáng lập & tổ chức",
      theme: "blue",
    },
  ];


  return (
    <div className="min-h-screen bg-[#f3f7f5] flex flex-col font-sans text-slate-800 animate-fade-in-up">
      {/* Hero Header Hub Section (Compact & Modern) */}
      <section className="relative w-full bg-[#051410] text-white py-9 sm:py-12 px-4 border-b-2 border-emerald-500/80 overflow-hidden">
        {/* Ambient Stadium Lighting Effect with Swaying Pulse */}
        <div
          className="absolute inset-0 pointer-events-none animate-floodlight"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0, 229, 117, 0.38), transparent 75%),
              radial-gradient(circle at 10% 90%, rgba(14, 165, 233, 0.18), transparent 50%),
              radial-gradient(circle at 90% 90%, rgba(245, 158, 11, 0.2), transparent 50%),
              linear-gradient(180deg, #071f18 0%, #030e0b 100%)
            `,
          }}
        />

        {/* Pitch Stripes Decor */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(255, 255, 255, 0.05) 48px, rgba(255, 255, 255, 0.05) 96px)`,
          }}
        />

        {/* HIGH-END 3D ESPORTS HOLOGRAPHIC TACTICAL MATCH ENGINE */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-5 opacity-40 sm:opacity-55 transition-opacity">
          
          {/* Left Goal Post Frame */}
          <div className="absolute bottom-2 left-1 w-3 sm:w-4 h-12 border-r-2 border-y-2 border-emerald-400/40 rounded-r-lg bg-emerald-500/10 flex items-center justify-center opacity-70">
            <span className="text-[7px] font-black text-emerald-400/60 -rotate-90">GOAL</span>
          </div>

          {/* Right Goal Post Frame */}
          <div className="absolute bottom-2 right-1 w-3 sm:w-4 h-12 border-l-2 border-y-2 border-amber-400/40 rounded-l-lg bg-amber-500/10 flex items-center justify-center opacity-70">
            <span className="text-[7px] font-black text-amber-400/60 rotate-90">GOAL</span>
          </div>

          {/* ================= TEAM A (HOME - EMERALD / CYAN) ================= */}
          {/* GK A: Goalkeeper (#1) */}
          <div className="absolute bottom-2 left-[4%] sm:left-[6%] animate-gk-a flex flex-col items-center">
            <div className="relative animate-token-bob">
              <div className="absolute -inset-1 rounded-full bg-emerald-400/30 blur-xs animate-ring-pulse" />
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-600 via-slate-900 to-slate-950 border-2 border-emerald-400 shadow-[0_0_12px_rgba(0,229,117,0.7)] flex flex-col items-center justify-center text-white">
                <i className="fa-solid fa-hands text-[10px] sm:text-xs text-emerald-300"></i>
                <span className="text-[7px] sm:text-[8px] font-black font-oswald text-emerald-300">#1 GK</span>
              </div>
            </div>
          </div>

          {/* CB A: Center Back (#3) */}
          <div className="absolute bottom-3 left-[16%] sm:left-[18%] animate-team-a-move flex flex-col items-center">
            <div className="relative animate-token-bob" style={{ animationDelay: "0.4s" }}>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-teal-700 via-slate-900 to-slate-950 border border-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)] flex flex-col items-center justify-center text-white">
                <i className="fa-solid fa-shield-halved text-[9px] sm:text-[10px] text-teal-300"></i>
                <span className="text-[6px] sm:text-[7px] font-black font-oswald text-teal-200">#3 CB</span>
              </div>
            </div>
          </div>

          {/* CM A: Central Midfielder (#8) */}
          <div className="absolute bottom-2 left-[28%] sm:left-[30%] animate-team-a-move flex flex-col items-center">
            <div className="relative animate-token-bob" style={{ animationDelay: "0.8s" }}>
              <div className="absolute -inset-1 rounded-full bg-cyan-400/30 blur-xs animate-ring-pulse" />
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-600 via-slate-900 to-slate-950 border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.7)] flex flex-col items-center justify-center text-white">
                <i className="fa-solid fa-bolt text-[10px] sm:text-xs text-cyan-300"></i>
                <span className="text-[7px] sm:text-[8px] font-black font-oswald text-cyan-200">#8 CM</span>
              </div>
            </div>
          </div>

          {/* ST A: Star Striker (#9) */}
          <div className="absolute bottom-1 left-[50%] sm:left-[52%] animate-team-a-move flex flex-col items-center">
            <div className="relative animate-token-bob" style={{ animationDelay: "1.2s" }}>
              <div className="absolute -inset-1.5 rounded-full bg-emerald-400/40 blur-xs animate-ring-pulse" />
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-emerald-500 via-teal-700 to-slate-950 border-2 border-amber-400 shadow-[0_0_16px_rgba(0,229,117,0.9)] flex flex-col items-center justify-center text-white">
                <i className="fa-solid fa-star text-[10px] sm:text-xs text-amber-300 animate-spin-slow"></i>
                <span className="text-[7px] sm:text-[9px] font-black font-oswald text-amber-300">#9 ST</span>
              </div>
            </div>
          </div>

          {/* ================= TEAM B (AWAY - ROSE / AMBER) ================= */}
          {/* ST B: Star Striker (#11) */}
          <div className="absolute bottom-2 left-[40%] sm:left-[42%] animate-team-b-move flex flex-col items-center">
            <div className="relative animate-token-bob" style={{ animationDelay: "0.6s" }}>
              <div className="absolute -inset-1.5 rounded-full bg-rose-500/40 blur-xs animate-ring-pulse" />
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-rose-600 via-red-800 to-slate-950 border-2 border-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.9)] flex flex-col items-center justify-center text-white">
                <i className="fa-solid fa-fire text-[10px] sm:text-xs text-rose-300"></i>
                <span className="text-[7px] sm:text-[9px] font-black font-oswald text-rose-200">#11 ST</span>
              </div>
            </div>
          </div>

          {/* CM B: Playmaker Midfielder (#10) */}
          <div className="absolute bottom-2 left-[68%] sm:left-[70%] animate-team-b-move flex flex-col items-center">
            <div className="relative animate-token-bob" style={{ animationDelay: "1.0s" }}>
              <div className="absolute -inset-1 rounded-full bg-orange-400/30 blur-xs animate-ring-pulse" />
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-600 via-amber-800 to-slate-950 border-2 border-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.7)] flex flex-col items-center justify-center text-white">
                <i className="fa-solid fa-crown text-[10px] sm:text-xs text-amber-300"></i>
                <span className="text-[7px] sm:text-[8px] font-black font-oswald text-amber-200">#10 CAM</span>
              </div>
            </div>
          </div>

          {/* CB B: Center Back (#4) */}
          <div className="absolute bottom-4 right-[16%] sm:right-[18%] animate-team-b-move flex flex-col items-center">
            <div className="relative animate-token-bob" style={{ animationDelay: "1.4s" }}>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-amber-700 via-slate-900 to-slate-950 border border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)] flex flex-col items-center justify-center text-white">
                <i className="fa-solid fa-shield text-[9px] sm:text-[10px] text-amber-300"></i>
                <span className="text-[6px] sm:text-[7px] font-black font-oswald text-amber-200">#4 CB</span>
              </div>
            </div>
          </div>

          {/* GK B: Goalkeeper (#1) */}
          <div className="absolute bottom-2 right-[4%] sm:right-[6%] animate-gk-b flex flex-col items-center">
            <div className="relative animate-token-bob" style={{ animationDelay: "0.2s" }}>
              <div className="absolute -inset-1 rounded-full bg-amber-400/30 blur-xs animate-ring-pulse" />
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-600 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.7)] flex flex-col items-center justify-center text-white">
                <i className="fa-solid fa-hands text-[10px] sm:text-xs text-amber-300"></i>
                <span className="text-[7px] sm:text-[8px] font-black font-oswald text-amber-300">#1 GK</span>
              </div>
            </div>
          </div>

          {/* ================= THE LIVE RALLY FOOTBALL ================= */}
          <div className="absolute animate-rally-ball pointer-events-none z-20">
            <div className="relative">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-slate-950 border border-slate-300 flex items-center justify-center text-xs sm:text-sm shadow-[0_0_20px_rgba(255,255,255,1)]">
                <i className="fa-solid fa-futbol"></i>
              </div>
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#00e575] via-amber-400 to-rose-400 opacity-80 blur-xs -z-10" />
            </div>
          </div>
        </div>





        {/* Dynamic Floating Esports Icons with Compact Dimensions */}
        <div className="absolute top-6 left-4 sm:left-10 pointer-events-none opacity-35 sm:opacity-50 animate-float-slow">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center text-lg sm:text-xl shadow-lg backdrop-blur-md">
            <i className="fa-solid fa-gamepad"></i>
          </div>
        </div>

        <div className="absolute top-8 right-4 sm:right-12 pointer-events-none opacity-35 sm:opacity-50 animate-float-reverse">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-400 flex items-center justify-center text-lg sm:text-xl shadow-lg backdrop-blur-md">
            <i className="fa-solid fa-trophy"></i>
          </div>
        </div>


        {/* Hero Content */}
        <div className="max-w-5xl mx-auto text-center space-y-3.5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/60 text-emerald-300 text-[11px] font-fco font-bold uppercase tracking-widest backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-105 hover:border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e575] animate-ping"></span>
            <span>FC ONLINE ESPORTS HUB • CỔNG HỆ THỐNG GIẢI ĐẤU</span>
          </div>

          <h1 className="font-fco font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-tight">
            HỆ THỐNG GIẢI ĐẤU <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e575] via-teal-300 to-amber-400 animate-gradient-flow">FC ONLINE</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto font-normal leading-relaxed">
            Chọn giải đấu bên dưới để tra cứu lịch thi đấu, bảng xếp hạng trực tiếp, thể thức, nội quy và hồ sơ các Huấn luyện viên tham dự.
          </p>

          {/* Quick Hub Stats Pills with Compact Sizing */}
          <div className="pt-1.5 flex flex-wrap items-center justify-center gap-2.5 text-[11px] sm:text-xs font-fco">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-emerald-300 flex items-center space-x-1.5 shadow-sm hover:border-emerald-400 hover:-translate-y-0.5 transition-all">
              <i className="fa-solid fa-gamepad text-emerald-400 text-[10px]"></i>
              <span>CỘNG ĐỒNG THI ĐẤU CHUYÊN NGHIỆP</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-300 flex items-center space-x-1.5 shadow-sm hover:border-amber-400 hover:-translate-y-0.5 transition-all">
              <i className="fa-solid fa-trophy text-amber-400 text-[10px]"></i>
              <span>BẢNG XẾP HẠNG REAL-TIME</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-sky-500/30 text-sky-300 flex items-center space-x-1.5 shadow-sm hover:border-sky-400 hover:-translate-y-0.5 transition-all">
              <i className="fa-solid fa-scale-balanced text-sky-400 text-[10px]"></i>
              <span>MINH BẠCH & CÔNG BẰNG</span>
            </div>
          </div>
        </div>

        {/* Bottom Flowing Neon Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-300 to-amber-400 animate-gradient-flow" />
      </section>

      {/* Live Tournament Ticker Bar (Compact) */}
      <div className="w-full bg-[#0a231b] border-b border-emerald-500/30 py-2 px-4 text-emerald-300 text-[11px] sm:text-xs font-fco font-semibold flex items-center justify-center space-x-2 overflow-hidden shadow-inner">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping mr-1"></span>
        <span className="text-white font-bold uppercase tracking-wider">THÔNG BÁO:</span>
        <span className="truncate">
          🔥 SAO VÀNG CUP ™ MÙA 2 ĐANG TRANH TÀI SÔI NỔI • CHÚC CÁC HLV THI ĐẤU CỐNG HIẾN & VĂN MINH!
        </span>
      </div>

      {/* Main Hub Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-emerald-700/80 pb-3">
          <div>
            <span className="text-xs font-fco font-bold uppercase tracking-widest text-emerald-700 block">
              TOURNAMENT SELECTION
            </span>
            <h2 className="font-oswald text-2xl sm:text-3xl font-bold uppercase text-slate-900 tracking-wide">
              DANH SÁCH GIẢI ĐẤU
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Chọn giải đấu bạn muốn theo dõi hoặc tham gia
          </span>
        </div>

        {/* Tournament Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch">
          {/* Active Tournament Cards */}
          {tournaments.map((tour) => {
            const isBlue = tour.theme === "blue";
            return (
              <div
                key={tour.id}
                className={`neon-ring-pulse rounded-3xl bg-white border-2 ${
                  isBlue ? "border-blue-500" : "border-emerald-500"
                } shadow-xl overflow-hidden card-hover-fx relative flex flex-col justify-between group p-6 sm:p-7 space-y-6`}
              >
                {/* Top Multi-Color Neon LED Header Stripe with animation */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
                    isBlue
                      ? "from-[#0ea5e9] via-indigo-400 to-amber-400"
                      : "from-[#00e575] via-teal-400 to-amber-400"
                  } animate-gradient-flow`}
                />

                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full ${
                        isBlue
                          ? "bg-blue-100 border-blue-300 text-blue-800"
                          : "bg-emerald-100 border-emerald-300 text-emerald-800"
                      } text-xs font-fco font-bold uppercase tracking-wider shadow-xs animate-pulse-halo`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isBlue ? "bg-blue-600" : "bg-emerald-600"
                        } animate-ping`}
                      ></span>
                      <span>{tour.statusText}</span>
                    </span>
                    <span className="text-xs font-fco font-bold text-amber-600 uppercase">
                      {tour.season}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 pt-2">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${
                        isBlue
                          ? "bg-gradient-to-br from-blue-600 to-indigo-800 text-white border-blue-300"
                          : "bg-slate-900/5 border-emerald-200"
                      } p-2 border flex items-center justify-center flex-shrink-0 group-hover:scale-110 ${
                        isBlue
                          ? "group-hover:border-blue-400 group-hover:shadow-blue-500/30"
                          : "group-hover:border-emerald-400 group-hover:shadow-emerald-500/30"
                      } group-hover:shadow-lg transition-all duration-300 shadow-xs`}
                    >
                      {tour.logo ? (
                        <img
                          src={tour.logo}
                          alt={tour.name}
                          className="w-full h-full object-contain drop-shadow-sm"
                        />
                      ) : (
                        <i className={`fa-solid ${tour.customIcon || "fa-trophy"} text-2xl ${isBlue ? 'text-amber-300' : 'text-emerald-600'}`}></i>
                      )}
                    </div>
                    <div>
                      <h3
                        className={`font-fco font-black text-xl sm:text-2xl uppercase tracking-tight text-slate-900 ${
                          isBlue ? "group-hover:text-blue-700" : "group-hover:text-emerald-700"
                        } transition-colors leading-tight`}
                      >
                        {tour.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {tour.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button with Dynamic Shimmer Effect */}
                <div className="pt-2 border-t border-slate-100">
                  <Link
                    to={tour.link}
                    className={`w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r ${
                      isBlue
                        ? "from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 shadow-blue-700/30"
                        : "from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 shadow-emerald-700/30"
                    } text-white font-oswald text-sm sm:text-base font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center space-x-2 shadow-lg hover:scale-[1.03] active:scale-95 btn-shimmer`}
                  >
                    <span>VÀO GIẢI ĐẤU</span>
                    <i className="fa-solid fa-arrow-right text-xs transform group-hover:translate-x-1.5 transition-transform"></i>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>


        {/* System Pillars & Handbook Section with 3D Pop on Hover */}
        <div className="pt-6 space-y-6">
          <div className="border-b-2 border-emerald-700/80 pb-2">
            <h3 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-slate-900 tracking-wide">
              TÍNH NĂNG & NỀN TẢNG HỆ THỐNG
            </h3>
            <span className="text-xs text-slate-500">
              Các tiện ích phục vụ cho vận hành và theo dõi giải đấu chuyên nghiệp
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                <i className="fa-solid fa-chart-simple"></i>
              </div>
              <h4 className="font-fco font-black text-slate-900 text-sm uppercase group-hover:text-emerald-700 transition-colors">
                BXH Tự Động
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tự động tính toán điểm số, hiệu số bàn thắng bại và phân nhánh knockout theo luật chuẩn.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 hover:border-sky-400 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center text-lg group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-xs">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h4 className="font-fco font-black text-slate-900 text-sm uppercase group-hover:text-sky-700 transition-colors">
                Luật Lệ Minh Bạch
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nội quy thi đấu, quy định squad lương và quy tắc xử lý sự cố mạng được công khai rõ ràng.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 hover:border-amber-400 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-xs">
                <i className="fa-solid fa-crown"></i>
              </div>
              <h4 className="font-fco font-black text-slate-900 text-sm uppercase group-hover:text-amber-700 transition-colors">
                Hall Of Fame
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Phòng truyền thống lưu trữ thành tích và vinh danh các nhà vô địch qua từng mùa giải.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 hover:border-teal-400 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-lg group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                <i className="fa-solid fa-trophy"></i>
              </div>
              <h4 className="font-fco font-black text-slate-900 text-sm uppercase group-hover:text-teal-700 transition-colors">
                Cơ Cấu Giải Thưởng
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hệ thống tiền thưởng, cúp lưu niệm và vinh danh xứng đáng cho các thứ hạng dẫn đầu.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomeHub;
