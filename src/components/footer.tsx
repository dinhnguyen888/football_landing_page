import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 relative bg-[#04130d] text-slate-300 border-t-2 border-emerald-500 overflow-hidden">
      {/* 1. Football Pitch Mowed Grass Stripes (Sọc cỏ sân bóng) & Center Pitch Layout */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            /* Mowed grass vertical stripes */
            repeating-linear-gradient(90deg, #051911 0px, #051911 60px, #03120c 60px, #03120c 120px)
          `
        }}
      />

      {/* 2. Stadium Floodlights & Pitch Radial Lighting (Đèn pha sân vận động) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 50% 0%, rgba(0, 229, 117, 0.25), transparent 75%),
            radial-gradient(circle at 15% 10%, rgba(255, 255, 255, 0.12), transparent 40%),
            radial-gradient(circle at 85% 10%, rgba(255, 255, 255, 0.12), transparent 40%),
            linear-gradient(180deg, transparent 0%, rgba(1, 10, 6, 0.7) 100%)
          `
        }}
      />

      {/* 3. Pitch Tactical Markings (Vòng tròn giữa sân + Vạch 16m50 + Vạch kẻ trắng) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            /* Center Circle (Vòng tròn giữa sân) */
            radial-gradient(circle at 50% 50%, transparent 95px, rgba(255, 255, 255, 0.8) 96px, rgba(255, 255, 255, 0.8) 98px, transparent 99px),
            /* Half-way line (Đường giữa sân) */
            linear-gradient(90deg, transparent 49.8%, rgba(255, 255, 255, 0.6) 50%, transparent 50.2%),
            /* Outer touchlines & Goal boxes */
            linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 80px 80px, 80px 80px'
        }}
      />

      {/* 4. Glowing Neon LED Top Line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#00e575] to-transparent shadow-[0_0_15px_#00e575]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-3.5 group flex-shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                <img 
                  src={require("../img/logo02.svg").default} 
                  alt="Sao Vàng Cup Logo" 
                  className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(0,229,117,0.6)]"
                />
              </div>
              <div className="whitespace-nowrap">
                <span className="font-fco text-xl font-black uppercase tracking-wider text-white block leading-none whitespace-nowrap">
                  SAO VÀNG <span className="text-amber-400">CUP™</span>
                </span>
                <span className="text-[10px] font-fco font-bold uppercase tracking-widest text-emerald-400 block mt-1.5 whitespace-nowrap">
                  FC ONLINE TOURNAMENT
                </span>
              </div>
            </Link>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Cổng thông tin, bảng điểm và cẩm nang điều lệ giải đấu bóng đá điện tử FC Online uy tín & chuyên nghiệp dành cho cộng đồng game thủ.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <span className="font-fco text-xs font-bold uppercase tracking-widest text-emerald-400 block pb-1 border-b border-slate-800">
              QUY ĐỊNH & THỂ THỨC
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/noiquy" className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>Nội quy thi đấu</span>
                </Link>
              </li>
              <li>
                <Link to="/dieukienthamdu" className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>Điều kiện tham dự & Lệ phí</span>
                </Link>
              </li>
              <li>
                <Link to="/quydinh" className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>Quy định sơ đồ & Lương 300</span>
                </Link>
              </li>
              <li>
                <Link to="/thethuc" className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>Thể thức thi đấu & Fair-play</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tournament Hub */}
          <div className="space-y-3">
            <span className="font-fco text-xs font-bold uppercase tracking-widest text-emerald-400 block pb-1 border-b border-slate-800">
              TRUNG TÂM GIẢI ĐẤU
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/ltd" className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>Lịch thi đấu & BXH trực tiếp</span>
                </Link>
              </li>
              <li>
                <Link to="/giaithuong" className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>Cơ cấu giải thưởng & Cúp</span>
                </Link>
              </li>
              <li>
                <Link to="/xephang" className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>Phòng truyền thống Vô địch</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>Liên hệ Ban Tổ Chức</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Contact */}
          <div className="space-y-3">
            <span className="font-fco text-xs font-bold uppercase tracking-widest text-emerald-400 block pb-1 border-b border-slate-800">
              KÊNH CỘNG ĐỒNG
            </span>
            
            <div className="space-y-2.5 pt-1">
              <a
                href="https://www.facebook.com/groups/939885034118607"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500/50 flex items-center space-x-3 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <i className="fa-brands fa-facebook-f"></i>
                </div>
                <div>
                  <span className="font-fco text-xs font-bold text-white block leading-tight">Group Facebook</span>
                  <span className="text-[10px] text-slate-400">Giao lưu & Thảo luận</span>
                </div>
              </a>

              <a
                href="https://m.me/j/AbZDVIVQ5tc8dOpg/"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-600/20 border border-slate-800 hover:border-cyan-500/50 flex items-center space-x-3 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center text-sm group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <i className="fa-brands fa-facebook-messenger"></i>
                </div>
                <div>
                  <span className="font-fco text-xs font-bold text-white block leading-tight">Box Messenger</span>
                  <span className="text-[10px] text-slate-400">Hẹn đấu & Báo kết quả</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & BTC Credits */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p>© 2024 - 2026 <strong className="text-white font-fco">SAO VÀNG CUP ™</strong> (FC ONLINE). ALL RIGHTS RESERVED.</p>
          </div>
          <p className="text-center sm:text-right">
            BAN TỔ CHỨC: <strong className="text-emerald-400">ADMIN PHAN LONG</strong> & <strong className="text-emerald-400">BẠCH MINH QUANG</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
