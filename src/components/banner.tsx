import React from "react";
import { Link, useLocation } from "react-router-dom";

interface BannerProps {
  title?: string;
  subtitle?: string;
  text?: string;
  badge?: string;
}

const Banner: React.FC<BannerProps> = ({ title, subtitle, text, badge }) => {
  const displayTitle = title || text || "FC ONLINE TOURNAMENT";
  const location = useLocation();
  const isDthen = location.pathname.startsWith("/dthen");

  return (
    <div
      className={`w-full ${
        isDthen ? "bg-[#050f1f] border-b-2 border-blue-500/80" : "bg-[#051410] border-b-2 border-emerald-500/80"
      } text-white py-6 sm:py-10 md:py-14 px-3 sm:px-4 relative overflow-hidden`}
    >
      {/* 1. Dynamic Stadium Pitch Night Gradient */}
      <div
        className="absolute inset-0 pointer-events-none animate-floodlight"
        style={{
          background: isDthen
            ? `
              radial-gradient(ellipse 75% 65% at 50% -15%, rgba(14, 165, 233, 0.35), transparent 75%),
              radial-gradient(circle at 12% 85%, rgba(99, 102, 241, 0.2), transparent 50%),
              radial-gradient(circle at 88% 85%, rgba(245, 158, 11, 0.2), transparent 50%),
              linear-gradient(180deg, #07172d 0%, #030a14 100%)
            `
            : `
              radial-gradient(ellipse 75% 65% at 50% -15%, rgba(0, 229, 117, 0.35), transparent 75%),
              radial-gradient(circle at 12% 85%, rgba(14, 165, 233, 0.18), transparent 50%),
              radial-gradient(circle at 88% 85%, rgba(245, 158, 11, 0.18), transparent 50%),
              linear-gradient(180deg, #071f18 0%, #030e0b 100%)
            `,
        }}
      />

      {/* 2. Tactical Pitch Field Lines & Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, transparent 85px, rgba(255, 255, 255, 0.6) 86px, rgba(255, 255, 255, 0.6) 88px, transparent 89px),
            linear-gradient(90deg, transparent 49.8%, rgba(255, 255, 255, 0.5) 50%, transparent 50.2%),
            repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(255, 255, 255, 0.03) 48px, rgba(255, 255, 255, 0.03) 96px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 100% 100%",
        }}
      />

      {/* 3. HIGH-END 3D ESPORTS HOLOGRAPHIC TACTICAL MATCH ENGINE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-5 opacity-25 sm:opacity-55 transition-opacity">
        
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
            {/* Tactical Ring Aura */}
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
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white text-slate-950 border border-slate-300 flex items-center justify-center text-[10px] sm:text-sm shadow-[0_0_20px_rgba(255,255,255,1)]">
              <i className="fa-solid fa-futbol"></i>
            </div>
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#00e575] via-amber-400 to-rose-400 opacity-80 blur-xs -z-10" />
          </div>
        </div>
      </div>

      {/* 4. Floating Esports Decors (hidden on small mobile to avoid text overlapping) */}
      <div className="hidden sm:flex absolute top-1/2 left-3 sm:left-10 -translate-y-1/2 flex-col items-center space-y-3 pointer-events-none opacity-30 sm:opacity-50 animate-float-slow">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${
            isDthen
              ? "bg-blue-950/80 border border-blue-500/50 text-blue-400"
              : "bg-emerald-950/80 border border-emerald-500/50 text-emerald-400"
          } flex items-center justify-center text-lg sm:text-xl shadow-xl backdrop-blur-md`}
        >
          <i className="fa-solid fa-gamepad"></i>
        </div>
      </div>

      <div className="hidden sm:flex absolute top-1/2 right-6 sm:right-20 -translate-y-1/2 flex-col items-center space-y-3 pointer-events-none opacity-30 sm:opacity-50 animate-float-reverse">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-400 flex items-center justify-center text-lg sm:text-xl shadow-xl backdrop-blur-md">
          <i className="fa-solid fa-trophy"></i>
        </div>
      </div>

      {/* Banner Main Content */}
      <div className="max-w-4xl mx-auto text-center space-y-2 sm:space-y-3 relative z-20">
        {badge && (
          <div
            className={`inline-flex items-center space-x-1.5 sm:space-x-2 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full ${
              isDthen
                ? "bg-blue-900/80 border border-blue-400/60 text-blue-300"
                : "bg-emerald-900/80 border border-emerald-400/60 text-emerald-300"
            } text-[10px] sm:text-xs font-fco font-bold uppercase tracking-widest backdrop-blur-md shadow-sm transition-transform hover:scale-105`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDthen ? "bg-[#0ea5e9]" : "bg-[#00e575]"
              } animate-ping`}
            ></span>
            <span>{badge}</span>
          </div>
        )}

        <h1 className="font-fco font-black text-xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] leading-tight px-1">
          {displayTitle}
        </h1>

        {subtitle && (
          <p
            className={`${
              isDthen ? "text-blue-100/80" : "text-emerald-100/80"
            } text-[11px] sm:text-sm font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-sm px-2`}
          >
            {subtitle}
          </p>
        )}

        <div
          className={`pt-0.5 flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs ${
            isDthen ? "text-blue-400/90" : "text-emerald-400/90"
          } font-medium tracking-wide`}
        >
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            Hub Giải Đấu
          </Link>
          <span className="text-slate-600">/</span>
          <Link
            to={isDthen ? "/dthen" : "/saovang"}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {isDthen ? "ĐThén FCO" : "Sao Vàng Cup"}
          </Link>
          <span className="text-slate-600">/</span>
          <span className={isDthen ? "text-blue-300 font-semibold" : "text-emerald-300 font-semibold"}>
            {displayTitle}
          </span>
        </div>
      </div>

      {/* Bottom Animated Glowing Flow Line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r ${
          isDthen
            ? "from-blue-500 via-indigo-300 to-amber-400"
            : "from-emerald-500 via-teal-300 to-amber-400"
        } animate-gradient-flow`}
      />
    </div>
  );
};

export default Banner;
