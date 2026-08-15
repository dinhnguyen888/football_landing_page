import React from "react";
import { Link } from "react-router-dom";

interface BannerProps {
  title?: string;
  subtitle?: string;
  text?: string;
  badge?: string;
}

const Banner: React.FC<BannerProps> = ({ title, subtitle, text, badge }) => {
  const displayTitle = title || text || "FC ONLINE TOURNAMENT";

  return (
    <div className="w-full bg-[#051410] text-white py-12 sm:py-16 px-4 border-b-2 border-emerald-500/80 relative overflow-hidden">
      {/* 1. Lush Stadium Pitch Night Gradient (Mặt sân cỏ đêm xanh thẫm mềm mại) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            /* Soft Stadium Floodlight Dome (Đèn vòm sân vận động dịu mắt) */
            radial-gradient(ellipse 75% 65% at 50% -15%, rgba(0, 229, 117, 0.28), transparent 75%),
            /* Dual Stadium Corner Lighting (Ánh sáng 2 cánh khán đài) */
            radial-gradient(circle at 12% 85%, rgba(14, 165, 233, 0.12), transparent 50%),
            radial-gradient(circle at 88% 85%, rgba(245, 158, 11, 0.12), transparent 50%),
            /* Pitch Night Base (Nền cỏ đêm mượt) */
            linear-gradient(180deg, #071f18 0%, #030e0b 100%)
          `
        }}
      />

      {/* 2. Soft Tactical Pitch Markings (Vạch sân cỏ mờ nhẹ nhàng, tự nhiên) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `
            /* Center Circle (Vòng tròn giữa sân mềm mại) */
            radial-gradient(circle at 50% 50%, transparent 85px, rgba(255, 255, 255, 0.5) 86px, rgba(255, 255, 255, 0.5) 88px, transparent 89px),
            /* Halfway pitch line (Đường biên chia đôi sân) */
            linear-gradient(90deg, transparent 49.8%, rgba(255, 255, 255, 0.4) 50%, transparent 50.2%),
            /* Vertical grass stripes (Sọc cỏ sân bóng) */
            repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(255, 255, 255, 0.02) 48px, rgba(255, 255, 255, 0.02) 96px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%'
        }}
      />

      {/* 3. Floating Esports Football Thematic Decors (Tay cầm game, Cúp vàng, Bóng đá, Vương miện) */}
      {/* Left Wing Elements */}
      <div className="absolute top-1/2 -left-6 sm:left-6 -translate-y-1/2 flex flex-col items-center space-y-4 pointer-events-none opacity-40 hover:opacity-70 transition-opacity">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl sm:text-2xl shadow-lg backdrop-blur-xs transform -rotate-12">
          <i className="fa-solid fa-gamepad"></i>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-400 flex items-center justify-center text-sm transform rotate-6">
          <i className="fa-solid fa-futbol"></i>
        </div>
      </div>

      {/* Right Wing Elements */}
      <div className="absolute top-1/2 -right-6 sm:right-6 -translate-y-1/2 flex flex-col items-center space-y-4 pointer-events-none opacity-40 hover:opacity-70 transition-opacity">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-amber-400 flex items-center justify-center text-xl sm:text-2xl shadow-lg backdrop-blur-xs transform rotate-12">
          <i className="fa-solid fa-trophy"></i>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-900/60 border border-slate-700/50 text-amber-300 flex items-center justify-center text-sm transform -rotate-6">
          <i className="fa-solid fa-crown"></i>
        </div>
      </div>

      {/* Banner Main Content */}
      <div className="max-w-4xl mx-auto text-center space-y-3.5 relative z-10">
        {badge && (
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-900/70 border border-emerald-400/50 text-emerald-300 text-xs font-fco font-semibold tracking-wider backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e575] animate-pulse"></span>
            <span>{badge}</span>
          </div>
        )}

        <h1 className="font-fco font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          {displayTitle}
        </h1>

        {subtitle && (
          <p className="text-emerald-100/80 text-xs sm:text-sm font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            {subtitle}
          </p>
        )}

        <div className="pt-1 flex items-center justify-center space-x-2 text-xs text-emerald-400/80 font-medium tracking-wide">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            Trang Chủ
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-emerald-300 font-semibold">
            {displayTitle}
          </span>
        </div>
      </div>

      {/* Bottom Soft Turf Line Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00e575] to-transparent opacity-80" />
    </div>
  );
};

export default Banner;
