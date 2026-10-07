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
        isDthen
          ? "bg-[#040e1f] border-b-2 border-blue-600/80"
          : "bg-[#03170f] border-b-2 border-emerald-600/80"
      } text-white py-8 sm:py-12 md:py-14 px-4 sm:px-6 relative overflow-hidden`}
    >
      {/* 1. Natural Stadium Pitch Lighting & Atmospheric Floodlights */}
      <div
        className="absolute inset-0 pointer-events-none animate-floodlight-soft"
        style={{
          background: isDthen
            ? `
              radial-gradient(ellipse 70% 60% at 50% -10%, rgba(2, 132, 199, 0.35), transparent 75%),
              radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.15), transparent 45%),
              radial-gradient(circle at 90% 20%, rgba(245, 158, 11, 0.12), transparent 45%),
              linear-gradient(180deg, #05152e 0%, #020914 100%)
            `
            : `
              radial-gradient(ellipse 75% 65% at 50% -10%, rgba(16, 185, 129, 0.30), transparent 75%),
              radial-gradient(circle at 10% 20%, rgba(5, 150, 105, 0.18), transparent 45%),
              radial-gradient(circle at 90% 20%, rgba(217, 119, 6, 0.15), transparent 45%),
              linear-gradient(180deg, #041c13 0%, #020c08 100%)
            `,
        }}
      />

      {/* 2. Realistic Stadium Grass Turf & Subtle Chalk Field Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0px, rgba(255, 255, 255, 0.02) 60px, transparent 60px, transparent 120px),
            radial-gradient(circle at 50% 120%, transparent 140px, rgba(255, 255, 255, 0.25) 141px, rgba(255, 255, 255, 0.25) 143px, transparent 144px),
            linear-gradient(90deg, transparent 49.8%, rgba(255, 255, 255, 0.2) 50%, transparent 50.2%)
          `,
        }}
      />

      {/* 3. Subtle Organic Floodlight Cones (Left & Right Stadium Towers) */}
      <div className="absolute -top-10 left-4 sm:left-12 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-4 sm:right-12 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Banner Main Content */}
      <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 relative z-20">
        {/* Live / Official Status Badge */}
        {badge && (
          <div
            className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full ${
              isDthen
                ? "bg-blue-900/60 border border-blue-400/40 text-blue-200"
                : "bg-emerald-900/60 border border-emerald-400/40 text-emerald-200"
            } text-[10px] sm:text-xs font-fco font-bold uppercase tracking-widest backdrop-blur-md shadow-sm transition-transform hover:scale-105`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDthen ? "bg-sky-400" : "bg-emerald-400"
              } animate-live-pulse`}
            />
            <span>{badge}</span>
          </div>
        )}

        {/* Tournament Title */}
        <h1 className="font-fco font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)] leading-tight px-1">
          {displayTitle}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className={`${
              isDthen ? "text-blue-100/90" : "text-emerald-100/90"
            } text-xs sm:text-sm font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-sm px-2`}
          >
            {subtitle}
          </p>
        )}

        {/* Breadcrumbs Navigation */}
        <div
          className={`pt-1 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs ${
            isDthen ? "text-blue-300" : "text-emerald-300"
          } font-medium tracking-wide`}
        >
          <Link
            to="/"
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors flex items-center space-x-1.5"
          >
            <i className="fa-solid fa-house text-[9px] text-amber-400"></i>
            <span>Trang Chủ</span>
          </Link>
          <span className="text-slate-500">/</span>
          <Link
            to={isDthen ? "/dthen" : "/saovang"}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
          >
            {isDthen ? "ĐThén FCO" : "Sao Vàng Cup"}
          </Link>
          <span className="text-slate-500">/</span>
          <span
            className={`px-2.5 py-1 rounded-lg ${
              isDthen
                ? "bg-blue-500/25 text-blue-200 border border-blue-400/30"
                : "bg-emerald-500/25 text-emerald-200 border border-emerald-400/30"
            } font-semibold truncate max-w-[220px] sm:max-w-none`}
          >
            {displayTitle}
          </span>
        </div>

        {/* Tournament Quick Facts Strip (UEFA / Sports Broadcast style) */}
        {!isDthen && (
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-slate-200">
              <span className="text-amber-400">🏆</span>
              <span className="font-oswald font-bold">32 VẬN ĐỘNG VIÊN</span>
              <span className="text-slate-400 hidden sm:inline">• 1vs1</span>
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-slate-200">
              <span className="text-emerald-400">⚡</span>
              <span className="font-oswald font-bold">SWISS FVPL</span>
              <span className="text-slate-400 hidden sm:inline">• 2 Nhánh</span>
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-slate-200">
              <span className="text-amber-300">💰</span>
              <span className="font-oswald font-bold">TỔNG THƯỞNG 860K</span>
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-slate-200">
              <span className="text-emerald-300">⚽</span>
              <span className="font-oswald font-bold">VPL 60K</span>
              <span className="text-slate-400 hidden sm:inline">• Từ Knockout</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Natural Gradient Accent Line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r ${
          isDthen
            ? "from-blue-600 via-sky-400 to-amber-500"
            : "from-emerald-600 via-teal-400 to-amber-500"
        } opacity-90`}
      />
    </div>
  );
};

export default Banner;
