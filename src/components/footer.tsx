import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-[#0a192f] text-slate-300 border-t-2 border-emerald-600">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs mb-8">
          <div>
            <span className="font-oswald text-base font-bold uppercase tracking-wider text-white block mb-2">
              SAO VÀNG CUP ™
            </span>
            <p className="text-slate-400 leading-relaxed">
              Website thông tin & cẩm nang chính thức của giải đấu bóng đá điện tử FC Online Sao Vàng Cup.
            </p>
          </div>

          <div>
            <span className="font-oswald text-base font-bold uppercase tracking-wider text-white block mb-2">
              TRA CỨU NHANH
            </span>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link to="/noiquy" className="hover:text-emerald-400">Nội quy thi đấu & Sự cố out game</Link></li>
              <li><Link to="/thethuc" className="hover:text-emerald-400">Thể thức thi đấu & Luật Fair-play</Link></li>
              <li><Link to="/ltd" className="hover:text-emerald-400">Lịch thi đấu & Bảng xếp hạng trực tiếp</Link></li>
              <li><Link to="/xephang" className="hover:text-emerald-400">Bảng vàng nhà vô địch các mùa</Link></li>
            </ul>
          </div>

          <div>
            <span className="font-oswald text-base font-bold uppercase tracking-wider text-white block mb-2">
              KÊNH CỘNG ĐỒNG
            </span>
            <div className="space-y-2">
              <a
                href="https://www.facebook.com/groups/939885034118607"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 text-slate-300 hover:text-emerald-400 block"
              >
                <i className="fa-brands fa-facebook text-blue-400"></i>
                <span>Group Facebook Giải Đấu</span>
              </a>
              <a
                href="https://m.me/j/AbZDVIVQ5tc8dOpg/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 text-slate-300 hover:text-emerald-400 block"
              >
                <i className="fa-brands fa-facebook-messenger text-cyan-400"></i>
                <span>Box Chat Hẹn Đấu Messenger</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-medium">
          <p>© 2024 - 2026 SAO VÀNG CUP ™ (FC ONLINE). ALL RIGHTS RESERVED.</p>
          <p>BAN TỔ CHỨC: <strong className="text-slate-300">ADMIN PHAN LONG & DŨNG HUYỀN</strong></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
