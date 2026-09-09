import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import { ThemeToggleButton } from "../utils/themeContext";

const HomeHub: React.FC = () => {
  const [goalCelebration, setGoalCelebration] = useState<boolean>(false);
  
  // Interactive Penalty Minigame State
  const [penaltyScore, setPenaltyScore] = useState<number>(0);
  const [penaltyStreak, setPenaltyStreak] = useState<number>(0);
  const [penaltyResult, setPenaltyResult] = useState<string | null>(null);
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [gkDive, setGkDive] = useState<"left" | "right" | "center" | "idle">("idle");
  const [ballPosition, setBallPosition] = useState<{ x: string; y: string }>({ x: "50%", y: "82%" });

  // Trigger celebration
  const triggerHeroGoal = () => {
    setGoalCelebration(true);
    setTimeout(() => setGoalCelebration(false), 3500);
  };

  // Penalty Shootout logic
  const shootPenalty = (target: "top-left" | "top-right" | "bottom-left" | "bottom-right") => {
    if (isShooting) return;
    setIsShooting(true);
    setPenaltyResult(null);

    // Random GK dive
    const directions: ("left" | "right" | "center")[] = ["left", "right", "center"];
    const chosenGkDive = directions[Math.floor(Math.random() * directions.length)];
    setGkDive(chosenGkDive);

    // Ball coordinate mapping
    const targetMap = {
      "top-left": { x: "22%", y: "26%", gkSide: "left" },
      "top-right": { x: "78%", y: "26%", gkSide: "right" },
      "bottom-left": { x: "24%", y: "58%", gkSide: "left" },
      "bottom-right": { x: "76%", y: "58%", gkSide: "right" },
    };

    const targetPos = targetMap[target];
    setBallPosition({ x: targetPos.x, y: targetPos.y });

    setTimeout(() => {
      const isSaved = (targetPos.gkSide === chosenGkDive && Math.random() < 0.7);

      if (isSaved) {
        setPenaltyResult("SAVED");
        setPenaltyStreak(0);
      } else {
        setPenaltyResult("GOAL");
        setPenaltyScore((prev) => prev + 1);
        setPenaltyStreak((prev) => prev + 1);
      }

      setTimeout(() => {
        setIsShooting(false);
        setGkDive("idle");
        setBallPosition({ x: "50%", y: "82%" });
      }, 1500);
    }, 600);
  };

  // Tournament list
  const tournaments = [
    {
      id: "saovang",
      name: "FC ONLINE SAO VÀNG CUP ™",
      status: "ACTIVE",
      statusText: "ĐANG KHỞI TRANH",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700",
      season: "MÙA GIẢI 2 (2024 - 2025)",
      logo: require("../img/logo02.svg").default,
      link: "/saovang",
      ltdLink: "/ltd",
      bxhLink: "/xephang",
      rulesLink: "/quydinh",
      subtitle: "Giải bóng đá trực tuyến thường niên quy mô lớn, tôn vinh kỹ thuật cá nhân và lối đá cống hiến.",
      organizer: "Ban Tổ Chức Sao Vàng",
      theme: "emerald",
      squadCap: "Quỹ Lương 305/305",
      mode: "1v1 Loại Trực Tiếp (Knockout)",
      prize: "Cúp Vàng Danh Giá + Tiền Thưởng BTC",
      playersCount: "32 Huấn Luyện Viên",
      highlights: ["⚽ Thể thức 1v1 đỉnh cao", "🏆 Cúp vàng khắc tên HLV", "⚡ Cập nhật kết quả tức thì"],
    },
    {
      id: "dthen",
      name: "FC ONLINE ĐTHÉN FCO ™",
      status: "ACTIVE",
      statusText: "ĐANG DIỄN RA",
      badgeClass: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-700",
      season: "MÙA GIẢI 1 (2025)",
      logo: null,
      customIcon: "fa-trophy",
      link: "/dthen",
      ltdLink: "/dthen/ltd",
      bxhLink: "/dthen/xephang",
      rulesLink: "/dthen/quydinh",
      subtitle: "Đấu trường sân cỏ phong trào do Admin ĐThén sáng lập, đề cao tinh thần Fair-play và sự gắn kết cộng đồng.",
      organizer: "Admin ĐThén & Tổ Trọng Tài Phan Long",
      theme: "blue",
      squadCap: "Quỹ Lương 305 Chuẩn",
      mode: "32 Đội • 8 Bảng Đấu (Chuẩn World Cup)",
      prize: "Cúp Lưu Niệm + Tiền Thưởng Nóng",
      playersCount: "32 Huấn Luyện Viên",
      highlights: ["🌍 Chuẩn thể thức World Cup 32 đội", "🔥 8 bảng đấu tranh vé Vòng 1/8", "🛡️ Giám sát đội hình nghiêm ngặt"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f6f4] dark:bg-[#07130e] flex flex-col font-sans text-slate-800 dark:text-slate-100 selection:bg-emerald-600 selection:text-white transition-colors duration-300">
      
      {/* ================= GOAL CELEBRATION MODAL ================= */}
      {goalCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/60 backdrop-blur-xs transition-all animate-goal-pop">
          <div className="text-center p-8 rounded-3xl bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 border-4 border-amber-400 shadow-2xl relative max-w-md mx-4">
            <div className="text-6xl mb-2 animate-bounce">⚽</div>
            <h2 className="font-oswald font-black text-4xl sm:text-5xl uppercase tracking-wider text-amber-300 drop-shadow-md">
              VÀOOOOOO!
            </h2>
            <p className="font-oswald text-lg sm:text-xl text-white font-bold tracking-widest mt-1 uppercase">
              BÀN THẮNG TUYỆT ĐẸP! 🎉
            </p>
            <p className="text-xs text-emerald-200 mt-2">
              Chào mừng bạn đến với Cổng hệ thống giải đấu bóng đá FC Online!
            </p>
          </div>
        </div>
      )}

      {/* ================= HERO HEADER: NATURAL FOOTBALL STADIUM PITCH ================= */}
      <section className="relative w-full text-white py-8 sm:py-14 md:py-16 px-3 sm:px-4 border-b-4 border-emerald-700 shadow-xl overflow-hidden pitch-turf-pattern">
        
        {/* Stadium Floodlights Glow from Upper Corners */}
        <div className="absolute -top-10 left-1/4 w-80 h-72 bg-radial from-amber-200/20 via-emerald-300/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-1/4 w-80 h-72 bg-radial from-amber-200/20 via-emerald-300/10 to-transparent blur-3xl pointer-events-none" />

        {/* Natural Chalk Pitch Markings (Vạch vôi sân cỏ tự nhiên) */}
        <div className="absolute inset-0 pointer-events-none opacity-25 flex items-center justify-center">
          <div className="w-[94%] h-[90%] border-2 border-white/80 rounded-xl relative chalk-line">
            {/* Halfway Line */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-white/80" />
            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-60 sm:h-60 rounded-full border-2 border-white/80 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white/90 shadow-sm" />
            </div>
            {/* Left Penalty Area (16m50) */}
            <div className="absolute top-1/4 bottom-1/4 left-0 w-24 sm:w-36 border-r-2 border-y-2 border-white/80 rounded-r-lg" />
            {/* Right Penalty Area (16m50) */}
            <div className="absolute top-1/4 bottom-1/4 right-0 w-24 sm:w-36 border-l-2 border-y-2 border-white/80 rounded-l-lg" />
          </div>
        </div>

        {/* Top-Right Theme Toggle Button */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
          <ThemeToggleButton />
        </div>

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto text-center space-y-3 sm:space-y-4 relative z-10">
          
          {/* Tournament Badge */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-950/85 border border-emerald-400/50 text-emerald-200 text-[10px] sm:text-xs font-oswald font-bold uppercase tracking-widest shadow-md backdrop-blur-xs">
            <i className="fa-solid fa-trophy text-amber-400 text-xs sm:text-sm"></i>
            <span>HỆ THỐNG GIẢI ĐẤU BÓNG ĐÁ FC ONLINE</span>
          </div>

          {/* Main Title */}
          <h1 className="font-oswald font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-tight px-1">
            ĐẠI ĐẤU TRƯỜNG <span className="text-amber-300">SÂN CỎ FC ONLINE</span>
          </h1>

          <p className="text-emerald-100 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-sm px-2">
            Nơi hội tụ các trận cầu kịch tính, tra cứu lịch thi đấu, bảng xếp hạng trực tiếp, thể thức và hồ sơ các Huấn luyện viên tham dự.
          </p>

          {/* Quick Kick-off & Action Buttons */}
          <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full max-w-md mx-auto sm:max-w-none">
            <button
              onClick={triggerHeroGoal}
              className="w-full sm:w-auto py-3 sm:py-3.5 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-oswald text-sm sm:text-base font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <i className="fa-solid fa-futbol text-base sm:text-lg animate-spin-slow"></i>
              <span>SÚT BÓNG GIAO HỮU!</span>
            </button>

            <a
              href="#tournaments-section"
              className="w-full sm:w-auto py-3 sm:py-3.5 px-6 sm:px-7 rounded-2xl bg-emerald-900/90 border border-emerald-400/60 hover:border-emerald-300 text-white font-oswald text-sm sm:text-base font-bold uppercase tracking-wider hover:bg-emerald-800 transition-all flex items-center justify-center space-x-2 shadow-md hover:scale-105"
            >
              <i className="fa-solid fa-list-ol text-amber-300"></i>
              <span>XEM CÁC GIẢI ĐẤU</span>
            </a>
          </div>

          {/* Matchday Preview Bar on the Grass */}
          <div className="mt-4 sm:mt-6 pt-2.5 sm:pt-3 border-t border-emerald-600/40 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2 sm:py-2.5 bg-emerald-950/60 rounded-2xl border border-emerald-500/30 backdrop-blur-xs text-[11px] sm:text-xs font-oswald">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00e575] animate-ping" />
              <span className="text-emerald-300 uppercase font-bold">KHỞI TRANH MÙA GIẢI MỚI</span>
            </div>
            <div className="text-slate-200 hidden sm:block">
              ⚽ 2 Đại Giải Đấu Đang Tranh Tài Sôi Nổi
            </div>
            <div className="text-amber-300 font-bold uppercase flex items-center space-x-1">
              <i className="fa-solid fa-medal"></i>
              <span>QUỸ LƯƠNG CHUẨN 305</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
        
        {/* ================= TOURNAMENT SELECTION SECTION ================= */}
        <section id="tournaments-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b-2 border-emerald-600 pb-3">
            <div>
              <span className="text-xs font-oswald font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center space-x-1.5">
                <i className="fa-solid fa-trophy"></i>
                <span>OFFICIAL TOURNAMENT SCHEDULE</span>
              </span>
              <h2 className="font-oswald text-2xl sm:text-3xl font-black uppercase text-slate-900 dark:text-white tracking-wide mt-1">
                DANH SÁCH GIẢI ĐẤU CHÍNH THỨC
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Lựa chọn giải đấu bạn muốn theo dõi hoặc tra cứu lịch thi đấu
            </span>
          </div>

          {/* Tournament Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {tournaments.map((tour) => {
              const isBlue = tour.theme === "blue";
              return (
                <div
                  key={tour.id}
                  className={`rounded-3xl border-2 ${
                    isBlue
                      ? "border-blue-400/40 dark:border-blue-600/50 hover:border-cyan-400 dark:hover:border-cyan-400 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 dark:from-[#0c223e] dark:via-[#07172c] dark:to-[#040e1b]"
                      : "border-emerald-400/40 dark:border-emerald-600/50 hover:border-amber-400 dark:hover:border-amber-400 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 dark:from-[#0b291d] dark:via-[#071d14] dark:to-[#04110c]"
                  } shadow-xl dark:shadow-2xl overflow-hidden relative flex flex-col justify-between group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
                >
                  {/* Subtle Background Stadium Floodlight Glow */}
                  <div
                    className={`absolute -top-12 -right-12 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-20 dark:opacity-30 ${
                      isBlue ? "bg-cyan-400" : "bg-amber-400"
                    }`}
                  />

                  {/* Top Stadium Header Strip with Matchday Banner */}
                  <div
                    className={`py-1.5 sm:py-2 px-3.5 sm:px-6 bg-gradient-to-r ${
                      isBlue
                        ? "from-blue-800 via-indigo-900 to-blue-950 text-cyan-200 border-b border-blue-500/30"
                        : "from-emerald-900 via-emerald-950 to-slate-950 text-amber-200 border-b border-emerald-500/30"
                    } flex items-center justify-between text-[10px] sm:text-[11px] font-oswald font-bold uppercase tracking-widest`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${isBlue ? "bg-cyan-400" : "bg-[#00e575]"} animate-ping`} />
                      <span>{isBlue ? "⚡ ĐẤU TRƯỜNG ĐTHÉN FCO" : "🏆 GIẢI ĐẤU QUỐC GIA CHÍNH THỨC"}</span>
                    </div>
                    <span className="text-white/80 font-normal hidden sm:inline">
                      {isBlue ? "COMMUNITY LEAGUE" : "CHAMPIONSHIP SERIES"}
                    </span>
                  </div>

                  <div className="p-4 sm:p-7 space-y-4 sm:space-y-5 flex-1 flex flex-col justify-between relative z-10">
                    
                    {/* Top Status & Season */}
                    <div className="space-y-3.5 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border ${
                            isBlue
                              ? "bg-blue-100/90 text-blue-900 border-blue-300 dark:bg-blue-950/90 dark:text-cyan-300 dark:border-cyan-500/50"
                              : "bg-emerald-100/90 text-emerald-900 border-emerald-300 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-500/50"
                          } text-[10px] sm:text-xs font-oswald font-bold uppercase tracking-wider shadow-xs`}
                        >
                          <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isBlue ? "bg-cyan-500" : "bg-emerald-500"} animate-pulse`} />
                          <span>{tour.statusText}</span>
                        </span>

                        <span className="text-[10px] sm:text-xs font-oswald font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wide flex items-center space-x-1 sm:space-x-1.5 bg-amber-500/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-amber-500/20">
                          <i className="fa-solid fa-medal text-amber-500 text-[10px] sm:text-xs"></i>
                          <span>{tour.season}</span>
                        </span>
                      </div>

                      {/* Crest & Title */}
                      <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 pt-0.5 sm:pt-1">
                        <div
                          className={`w-13 h-13 sm:w-18 sm:h-18 rounded-2xl ${
                            isBlue
                              ? "bg-gradient-to-br from-blue-900/80 via-blue-950 to-slate-950 border-2 border-cyan-400/60 shadow-[0_0_15px_rgba(14,165,233,0.3)] text-cyan-300"
                              : "bg-gradient-to-br from-emerald-900/80 via-emerald-950 to-slate-950 border-2 border-emerald-400/60 shadow-[0_0_15px_rgba(0,229,117,0.3)] text-emerald-300"
                          } p-1.5 sm:p-2 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}
                        >
                          {tour.logo ? (
                            <img
                              src={tour.logo}
                              alt={tour.name}
                              className="w-full h-full max-h-12 max-w-12 sm:max-h-14 sm:max-w-14 object-contain drop-shadow-md"
                            />
                          ) : (
                            <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-600 via-indigo-700 to-cyan-800 text-white flex flex-col items-center justify-center text-lg sm:text-xl shadow-xs">
                              <i className="fa-solid fa-trophy text-amber-300"></i>
                            </div>
                          )}
                        </div>

                        <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                          <span className="text-[10px] sm:text-[11px] font-oswald font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center space-x-1 truncate">
                            <i className="fa-solid fa-shield-halved text-xs"></i>
                            <span className="truncate">{tour.organizer}</span>
                          </span>
                          <h3
                            className={`font-oswald font-black text-xl sm:text-3xl uppercase tracking-tight text-slate-900 dark:text-white ${
                              isBlue ? "group-hover:text-cyan-400" : "group-hover:text-amber-300"
                            } transition-colors leading-tight drop-shadow-xs`}
                          >
                            {tour.name}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-normal line-clamp-2 leading-relaxed">
                            {tour.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Football Match Specs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2 text-xs">
                        <div className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl ${
                          isBlue 
                            ? "bg-blue-500/10 dark:bg-blue-950/60 border border-blue-500/20 dark:border-blue-800/60" 
                            : "bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/20 dark:border-emerald-800/60"
                        } flex flex-col justify-between`}>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-oswald font-bold flex items-center space-x-1.5">
                            <i className="fa-solid fa-futbol text-emerald-500 dark:text-emerald-400"></i>
                            <span>Thể Thức</span>
                          </span>
                          <span className="font-oswald font-bold text-slate-900 dark:text-white text-xs sm:text-base mt-1 leading-snug">
                            {tour.mode}
                          </span>
                        </div>

                        <div className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl ${
                          isBlue 
                            ? "bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 dark:border-amber-700/50" 
                            : "bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 dark:border-amber-700/50"
                        } flex flex-col justify-between`}>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-oswald font-bold flex items-center space-x-1.5">
                            <i className="fa-solid fa-trophy text-amber-500"></i>
                            <span>Giải Thưởng</span>
                          </span>
                          <span className="font-oswald font-bold text-amber-600 dark:text-amber-300 text-xs sm:text-base mt-1 truncate leading-snug">
                            {tour.prize}
                          </span>
                        </div>
                      </div>

                      {/* Bullet Highlights */}
                      <div className="space-y-1 sm:space-y-1.5 pt-1 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                        {tour.highlights.map((hl, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Nav Links */}
                    <div className="pt-3 sm:pt-4 border-t border-slate-200/80 dark:border-slate-800/80 mt-3 sm:mt-4">
                      {/* Primary Button */}
                      <Link
                        to={tour.link}
                        className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r ${
                          isBlue
                            ? "from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-[0_4px_20px_rgba(14,165,233,0.35)]"
                            : "from-emerald-700 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-500 shadow-[0_4px_20px_rgba(0,229,117,0.35)]"
                        } text-white font-oswald text-sm sm:text-base font-black uppercase tracking-wider text-center transition-all flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-95 btn-shimmer cursor-pointer`}
                      >
                        <i className="fa-solid fa-futbol text-sm sm:text-base animate-spin-slow"></i>
                        <span>VÀO SÂN THI ĐẤU</span>
                        <i className="fa-solid fa-arrow-right text-xs transform group-hover:translate-x-1.5 transition-transform"></i>
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= ULTRA-CUSTOMIZED REALISTIC PENALTY SHOOTOUT ================= */}
        <section className="rounded-2xl sm:rounded-3xl border-2 border-emerald-600/80 dark:border-emerald-700 bg-gradient-to-b from-[#0e442c] via-[#093522] to-[#052115] text-white p-4 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Ambient Floodlight Beam */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-radial from-amber-200/25 via-emerald-300/10 to-transparent blur-2xl pointer-events-none" />

          {/* Section Header with Stadium Scoreboard */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-b border-white/20 pb-4 sm:pb-5 mb-4 sm:mb-6 relative z-10">
            <div className="text-center sm:text-left">
              <span className="text-[10px] sm:text-xs font-oswald font-bold uppercase tracking-widest text-amber-300 flex items-center justify-center sm:justify-start space-x-1.5 sm:space-x-2">
                <i className="fa-solid fa-bullseye text-xs sm:text-sm animate-pulse"></i>
                <span>GÓC SÚT PHẠT ĐỀN 11M THỰC CHIẾN</span>
              </span>
              <h3 className="font-oswald text-xl sm:text-4xl font-black uppercase text-white tracking-wide mt-1 drop-shadow-sm">
                ⚽ ĐẤU TRÍ TRÊN CHẤM LUÂN LƯU 11M
              </h3>
              <p className="text-[11px] sm:text-sm text-emerald-100 mt-1 max-w-xl">
                Chọn góc sút hiểm hóc (Góc chữ A hoặc Sút chìm mép lưới) để đánh bại thủ môn và thiết lập kỷ lục chuỗi bàn thắng!
              </p>
            </div>

            {/* Stadium LED Scoreboard */}
            <div className="flex items-center space-x-2.5 sm:space-x-4 bg-black/60 border-2 border-emerald-500/50 px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-md">
              <div className="text-center">
                <span className="text-[9px] sm:text-[10px] text-emerald-400 uppercase font-oswald font-bold block tracking-wider">BÀN THẮNG</span>
                <span className="font-oswald font-black text-xl sm:text-3xl text-amber-400">{penaltyScore}</span>
              </div>
              <div className="w-px h-7 sm:h-9 bg-emerald-600/60" />
              <div className="text-center">
                <span className="text-[9px] sm:text-[10px] text-emerald-400 uppercase font-oswald font-bold block tracking-wider">CHUỖI THẮNG</span>
                <span className="font-oswald font-black text-xl sm:text-3xl text-[#00e575]">{penaltyStreak} 🔥</span>
              </div>
              {penaltyScore > 0 && (
                <button
                  onClick={() => { setPenaltyScore(0); setPenaltyStreak(0); }}
                  className="ml-1 sm:ml-2 p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 text-xs text-slate-300 hover:text-white transition-colors"
                  title="Đặt lại điểm số"
                >
                  <i className="fa-solid fa-rotate-left"></i>
                </button>
              )}
            </div>
          </div>

          {/* ================= 3D STADIUM GOAL & PITCH ARENA ================= */}
          <div className="relative w-full max-w-3xl mx-auto h-72 sm:h-96 bg-gradient-to-b from-[#072418] via-[#0b3826] to-[#072519] rounded-2xl border-4 border-emerald-500/80 shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-between p-2 sm:p-6 select-none">
            
            {/* Background Stadium Spectators Silhouette */}
            <div className="absolute top-0 left-0 right-0 h-16 opacity-30 pointer-events-none flex items-end justify-around px-8">
              <div className="w-full h-8 bg-repeat-x opacity-40" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)`, backgroundSize: '12px 12px' }} />
            </div>

            {/* Realistic 3D Goal Structure (Crossbar & Posts) */}
            <div className="absolute top-3 sm:top-5 left-2 sm:left-8 right-2 sm:right-8 bottom-14 sm:bottom-16 border-t-[5px] sm:border-t-[7px] border-x-[5px] sm:border-x-[7px] border-slate-100 rounded-t-xl shadow-[0_10px_25px_rgba(0,0,0,0.7)] z-10 pointer-events-none">
              {/* Metallic Goal Post Highlighting */}
              <div className="absolute -top-1 left-0 right-0 h-1 bg-white/90" />
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-white/90" />
              <div className="absolute top-0 bottom-0 right-0 w-1 bg-white/90" />

              {/* Goal Depth Hex Netting Pattern */}
              <div 
                className="absolute inset-0 bg-[#051c13]/85 rounded-t-lg"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(0deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 1.5px, transparent 1.5px, transparent 20px),
                    repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 1.5px, transparent 1.5px, transparent 20px),
                    repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 28px)
                  `
                }}
              />

              {/* Goal Line (Vạch Vôi Cầu Môn) */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            </div>

            {/* Goalkeeper with Realistic Stance & Diving Animation */}
            <div 
              className={`absolute bottom-20 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out z-20 flex flex-col items-center pointer-events-none ${
                gkDive === "left" ? "-translate-x-24 sm:-translate-x-44 -translate-y-6 sm:-translate-y-8 -rotate-45 scale-105 sm:scale-110" :
                gkDive === "right" ? "translate-x-20 sm:translate-x-40 -translate-y-6 sm:-translate-y-8 rotate-45 scale-105 sm:scale-110" :
                gkDive === "center" ? "-translate-y-4 scale-115" : "animate-bounce"
              }`}
            >
              <div className="relative">
                {/* GK Body / Jersey */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 border-2 border-white shadow-xl flex items-center justify-center text-slate-950 text-base sm:text-xl font-bold">
                  <i className="fa-solid fa-hands"></i>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 border border-white text-[8px] sm:text-[9px] font-black text-white flex items-center justify-center font-oswald">
                  #1
                </div>
              </div>
              <span className="text-[9px] sm:text-[10px] font-oswald font-black bg-black/80 px-2 sm:px-2.5 py-0.5 rounded-full text-amber-300 mt-1 border border-amber-400/50 shadow-md">
                THỦ MÔN
              </span>
            </div>

            {/* 4 PRECISION INTERACTIVE CROSSHAIR TARGETS */}
            {!isShooting && (
              <div className="absolute top-5 sm:top-8 left-2 sm:left-11 right-2 sm:right-11 bottom-16 sm:bottom-20 grid grid-cols-2 grid-rows-2 gap-1.5 sm:gap-4 z-30 pointer-events-auto">
                
                {/* Target 1: Top Left (Góc Chữ A Trái) */}
                <button
                  onClick={() => shootPenalty("top-left")}
                  className="group flex flex-col items-start justify-start p-1 sm:p-2.5 rounded-xl sm:rounded-2xl border border-transparent hover:border-amber-400 hover:bg-amber-400/15 transition-all cursor-pointer text-left relative overflow-hidden"
                >
                  <div className="flex items-center space-x-1 sm:space-x-1.5 bg-black/75 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-amber-400/50 group-hover:scale-105 group-hover:border-amber-300 transition-all shadow-md">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-amber-400 flex items-center justify-center text-amber-300 text-[10px] sm:text-xs animate-spin-slow">
                      <i className="fa-solid fa-crosshairs"></i>
                    </div>
                    <div>
                      <span className="text-[9px] sm:text-[11px] font-oswald font-black text-amber-300 block uppercase leading-none">
                        GÓC CHỮ A TRÁI
                      </span>
                      <span className="text-[7px] sm:text-[8px] text-slate-300 font-mono">Nóc Lưới</span>
                    </div>
                  </div>
                </button>

                {/* Target 2: Top Right (Góc Chữ A Phải) */}
                <button
                  onClick={() => shootPenalty("top-right")}
                  className="group flex flex-col items-end justify-start p-1 sm:p-2.5 rounded-xl sm:rounded-2xl border border-transparent hover:border-amber-400 hover:bg-amber-400/15 transition-all cursor-pointer text-right relative overflow-hidden"
                >
                  <div className="flex items-center space-x-1 sm:space-x-1.5 bg-black/75 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-amber-400/50 group-hover:scale-105 group-hover:border-amber-300 transition-all shadow-md">
                    <div>
                      <span className="text-[9px] sm:text-[11px] font-oswald font-black text-amber-300 block uppercase leading-none">
                        GÓC CHỮ A PHẢI
                      </span>
                      <span className="text-[7px] sm:text-[8px] text-slate-300 font-mono">Nóc Lưới</span>
                    </div>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-amber-400 flex items-center justify-center text-amber-300 text-[10px] sm:text-xs animate-spin-slow">
                      <i className="fa-solid fa-crosshairs"></i>
                    </div>
                  </div>
                </button>

                {/* Target 3: Bottom Left (Góc Sệt Trái) */}
                <button
                  onClick={() => shootPenalty("bottom-left")}
                  className="group flex flex-col items-start justify-end p-1 sm:p-2.5 rounded-xl sm:rounded-2xl border border-transparent hover:border-amber-400 hover:bg-amber-400/15 transition-all cursor-pointer text-left relative overflow-hidden"
                >
                  <div className="flex items-center space-x-1 sm:space-x-1.5 bg-black/75 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-emerald-400/50 group-hover:scale-105 group-hover:border-emerald-300 transition-all shadow-md">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-emerald-400 flex items-center justify-center text-emerald-300 text-[10px] sm:text-xs">
                      <i className="fa-solid fa-angles-down"></i>
                    </div>
                    <div>
                      <span className="text-[9px] sm:text-[11px] font-oswald font-black text-emerald-300 block uppercase leading-none">
                        GÓC CHÌM TRÁI
                      </span>
                      <span className="text-[7px] sm:text-[8px] text-slate-300 font-mono">Cột Dọc</span>
                    </div>
                  </div>
                </button>

                {/* Target 4: Bottom Right (Góc Sệt Phải) */}
                <button
                  onClick={() => shootPenalty("bottom-right")}
                  className="group flex flex-col items-end justify-end p-1 sm:p-2.5 rounded-xl sm:rounded-2xl border border-transparent hover:border-amber-400 hover:bg-amber-400/15 transition-all cursor-pointer text-right relative overflow-hidden"
                >
                  <div className="flex items-center space-x-1 sm:space-x-1.5 bg-black/75 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-emerald-400/50 group-hover:scale-105 group-hover:border-emerald-300 transition-all shadow-md">
                    <div>
                      <span className="text-[9px] sm:text-[11px] font-oswald font-black text-emerald-300 block uppercase leading-none">
                        GÓC CHÌM PHẢI
                      </span>
                      <span className="text-[7px] sm:text-[8px] text-slate-300 font-mono">Cột Dọc</span>
                    </div>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-emerald-400 flex items-center justify-center text-emerald-300 text-[10px] sm:text-xs">
                      <i className="fa-solid fa-angles-down"></i>
                    </div>
                  </div>
                </button>

              </div>
            )}

            {/* Pitch Grass Forefront (11m Penalty Spot Chalk Line) */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#0a3824] to-[#082e1e] border-t-2 border-white/40 flex items-center justify-center z-15">
              {/* 11M Penalty Spot Chalk Circle */}
              <div className="w-6 h-6 rounded-full border-2 border-white/80 bg-white flex items-center justify-center shadow-md">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-900" />
              </div>
            </div>

            {/* The Football with Trajectory Spin & Dynamic Scaling */}
            <div 
              className="absolute transition-all duration-500 ease-out z-35 pointer-events-none"
              style={{
                left: ballPosition.x,
                top: ballPosition.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className={`relative ${isShooting ? "scale-75" : "scale-100"} transition-transform duration-500`}>
                {/* Ball Shadow */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-black/60 rounded-full blur-2xs" />
                {/* Ball Body */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-950 border border-slate-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center text-base sm:text-lg ${isShooting ? "animate-spin" : ""}`}>
                  <i className="fa-solid fa-futbol"></i>
                </div>
              </div>
            </div>

            {/* Result Message Overlay with Goal Banner */}
            {penaltyResult && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center animate-goal-pop">
                {penaltyResult === "GOAL" ? (
                  <div className="text-center p-6 rounded-3xl bg-gradient-to-b from-emerald-900 via-emerald-950 to-black border-2 border-amber-400 shadow-2xl">
                    <div className="text-5xl animate-bounce">⚽</div>
                    <div className="font-oswald font-black text-3xl sm:text-5xl text-amber-300 uppercase tracking-wider mt-1">
                      VÀOOOOOO! GOAL!
                    </div>
                    <div className="text-xs sm:text-sm font-oswald text-emerald-200 font-bold mt-2 uppercase tracking-wide">
                      CÚ SÚT HOÀN HẢO ĐÁNH BẠI THỦ MÔN! 🎉
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-red-950 to-black border-2 border-rose-400 shadow-2xl">
                    <div className="text-5xl animate-pulse">🧤</div>
                    <div className="font-oswald font-black text-3xl sm:text-4xl text-rose-300 uppercase tracking-wider mt-1">
                      BỊ CẢN PHÁ!
                    </div>
                    <div className="text-xs sm:text-sm font-oswald text-slate-300 font-bold mt-2 uppercase tracking-wide">
                      THỦ MÔN ĐÃ PHÁN ĐOÁN ĐÚNG HƯỚNG BÓNG!
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-center mt-4 relative z-10">
            <span className="text-xs text-emerald-100/90 font-medium">
              💡 Bấm vào 1 trong 4 hồng tâm ngắm (Góc Chữ A / Góc Chìm) để tung cú sút quyết định!
            </span>
          </div>
        </section>

        {/* ================= 4 PILLARS OF FOOTBALL SPIRIT ================= */}
        <section className="space-y-6">
          <div className="border-b-2 border-emerald-600 pb-3">
            <span className="text-xs font-oswald font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              COMMUNITY & FAIR PLAY
            </span>
            <h3 className="font-oswald text-2xl sm:text-3xl font-black uppercase text-slate-900 dark:text-white tracking-wide mt-1">
              TINH THẦN & QUY TẮC BÓNG ĐÁ
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Các nguyên tắc cốt lõi xây dựng giải đấu bóng đá văn minh, minh bạch và cống hiến
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c2419] border border-slate-200 dark:border-emerald-800/70 shadow-sm hover:border-emerald-500 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl shadow-xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <i className="fa-solid fa-trophy"></i>
              </div>
              <h4 className="font-oswald font-bold text-slate-900 dark:text-white text-base uppercase">
                Vinh Quang & Cúp Vô Địch
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Khắc tên nhà vô địch vào phòng truyền thống và nhận phần thưởng danh giá từ Ban Tổ Chức.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c2419] border border-slate-200 dark:border-emerald-800/70 shadow-sm hover:border-sky-500 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center text-xl shadow-xs group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <h4 className="font-oswald font-bold text-slate-900 dark:text-white text-base uppercase">
                Fair-play & Quy Định Lương
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Chấp hành nghiêm quy định quỹ lương 305/305, tôn trọng đối thủ và quyết định của trọng tài.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c2419] border border-slate-200 dark:border-emerald-800/70 shadow-sm hover:border-amber-500 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xl shadow-xs group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <i className="fa-solid fa-ranking-star"></i>
              </div>
              <h4 className="font-oswald font-bold text-slate-900 dark:text-white text-base uppercase">
                Bảng Điểm Real-time
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Tự động tính toán điểm số, hiệu số bàn thắng bại và phân nhánh thi đấu knockout minh bạch.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c2419] border border-slate-200 dark:border-emerald-800/70 shadow-sm hover:border-teal-500 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xl shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <i className="fa-solid fa-users"></i>
              </div>
              <h4 className="font-oswald font-bold text-slate-900 dark:text-white text-base uppercase">
                Cộng Đồng HLV Đam Mê
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Sân chơi giao lưu, học hỏi chiến thuật và kết nối cộng đồng người chơi FC Online nhiệt huyết.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default HomeHub;
