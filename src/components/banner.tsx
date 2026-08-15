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
    <div className="w-full bg-[#050e1d] text-white py-14 px-4 border-b-2 border-emerald-500 relative overflow-hidden">
      {/* 1. Dynamic Pitch Grass Gradient & Deep Stadium Lighting */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 50% -20%, rgba(0, 229, 117, 0.22), transparent 70%),
            radial-gradient(circle at 10% 90%, rgba(14, 165, 233, 0.18), transparent 45%),
            radial-gradient(circle at 90% 90%, rgba(245, 158, 11, 0.15), transparent 45%),
            linear-gradient(180deg, #07152b 0%, #030814 100%)
          `
        }}
      />

      {/* 2. Tactical Football Pitch Lines (Vạch Kẻ Sân Bóng & Vòng Tròn Giữa Sân) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, transparent 80px, rgba(255, 255, 255, 0.1) 81px, rgba(255, 255, 255, 0.1) 83px, transparent 84px),
            linear-gradient(90deg, transparent 49.8%, rgba(255, 255, 255, 0.12) 50%, transparent 50.2%),
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px'
        }}
      />

      {/* 3. Dynamic Esports Cyber Hex & Speed Streaks */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(0, 229, 117, 0.03) 15px, rgba(0, 229, 117, 0.03) 30px)
          `
        }}
      />

      {/* Floating Soccer Elements (Decors) */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 hidden lg:flex items-center space-x-3 opacity-30 pointer-events-none">
        <div className="w-16 h-16 rounded-full border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl">
          <i className="fa-solid fa-futbol animate-pulse"></i>
        </div>
      </div>

      <div className="absolute top-1/2 right-8 -translate-y-1/2 hidden lg:flex items-center space-x-3 opacity-30 pointer-events-none">
        <div className="w-16 h-16 rounded-full border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl">
          <i className="fa-solid fa-trophy animate-pulse"></i>
        </div>
      </div>

      {/* Banner Main Content */}
      <div className="max-w-5xl mx-auto text-center space-y-3.5 relative z-10">
        {badge && (
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-xs font-fco font-bold uppercase tracking-widest shadow-lg shadow-emerald-950/50 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#00e575] animate-ping"></span>
            <span>{badge}</span>
          </div>
        )}

        <h1 className="font-fco font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          {displayTitle}
        </h1>

        {subtitle && (
          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-2xl mx-auto leading-relaxed drop-shadow">
            {subtitle}
          </p>
        )}

        <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-slate-400 font-fco uppercase tracking-wider">
          <Link to="/" className="hover:text-emerald-400 transition-colors">
            TRANG CHỦ
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-emerald-400 font-bold tracking-wide">
            {displayTitle}
          </span>
        </div>
      </div>

      {/* Bottom Glowing Accent Line (FC Online Neon Green & Cyan) */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#00e575] to-transparent shadow-[0_0_12px_#00e575]"></div>
    </div>
  );
};

export default Banner;
