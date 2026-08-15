import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navGroups = [
    {
      title: "NỘI QUY GIẢI ĐẤU",
      pathRoot: "/noiquy",
      items: [
        { label: "NỘI QUY THI ĐẤU", path: "/noiquy" },
        { label: "ĐIỀU KIỆN THAM DỰ", path: "/dieukienthamdu" },
        { label: "QUY ĐỊNH ĐỘI HÌNH", path: "/quydinh" },
      ],
    },
    {
      title: "THỂ THỨC & LỊCH ĐẤU",
      pathRoot: "/thethuc",
      items: [
        { label: "LỊCH ĐẤU & BXH", path: "/ltd" },
        { label: "THỂ THỨC THI ĐẤU", path: "/thethuc" },
        { label: "CƠ CẤU GIẢI THƯỞNG", path: "/giaithuong" },
      ],
    },
    {
      title: "PHÒNG TRUYỀN THỐNG",
      pathRoot: "/xephang",
      items: [
        { label: "BẢNG VÀNG VÔ ĐỊCH", path: "/xephang" },
      ],
    },
    {
      title: "BAN TỔ CHỨC",
      pathRoot: "/admin",
      items: [
        { label: "BAN TỔ CHỨC", path: "/admin" },
        { label: "CÁC NHÓM GIẢI", path: "/cacnhomgiai" },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#071322]/95 border-b border-emerald-500/30 backdrop-blur-md shadow-lg shadow-black/40">
      {/* Top Brand Banner */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3.5 group flex-shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0 drop-shadow-[0_0_8px_rgba(0,229,117,0.5)]">
            <img 
              src={require("../img/Logo.svg").default} 
              alt="Sao Vàng Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="whitespace-nowrap">
            <span className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wider text-white block leading-tight group-hover:text-[#00e575] transition-colors whitespace-nowrap drop-shadow">
              SAO VÀNG <span className="text-amber-400">CUP™</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-medium tracking-widest uppercase block whitespace-nowrap">
              Giải Đấu Cộng Đồng FC Online
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg font-oswald text-sm font-semibold uppercase tracking-wider transition-all ${
              location.pathname === "/"
                ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            Trang Chủ
          </Link>

          {navGroups.map((group, idx) => {
            const hasMultipleItems = group.items.length > 1;
            const isActive = group.items.some((i) => i.path === location.pathname) || group.pathRoot === location.pathname;
            const targetPath = group.items[0]?.path || group.pathRoot;

            if (!hasMultipleItems) {
              return (
                <Link
                  key={idx}
                  to={targetPath}
                  className={`px-3 py-1.5 rounded-lg font-oswald text-sm font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? "text-[#00e575] bg-emerald-950/60 border border-emerald-500/40"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  {group.title}
                </Link>
              );
            }

            return (
              <div key={idx} className="relative nav-dropdown-group py-1 group/menu">
                <Link
                  to={targetPath}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-oswald text-sm font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? "text-[#00e575] bg-emerald-950/60 border border-emerald-500/40"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <span>{group.title}</span>
                  <i className="fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5 transition-transform group-hover/menu:rotate-180"></i>
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 pt-1.5 w-56 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-50">
                  <div className="p-1.5 rounded-xl bg-[#09182b] border border-emerald-500/40 shadow-2xl space-y-0.5 backdrop-blur-xl">
                    {group.items.map((item, itemIdx) => {
                      const isItemActive = location.pathname === item.path;
                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          className={`block px-3.5 py-2 rounded-lg font-oswald text-xs uppercase tracking-wider font-semibold transition-colors ${
                            isItemActive
                              ? "bg-emerald-500 text-slate-950 font-bold"
                              : "text-slate-200 hover:bg-slate-800/90 hover:text-[#00e575]"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Access to Tournament Management */}
          <Link
            to="/quanlygiaidau"
            className="ml-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-oswald text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 hover:scale-105 flex items-center space-x-1.5"
            title="Quản trị giải đấu"
          >
            <i className="fa-solid fa-lock text-[11px]"></i>
            <span>BTC Portal</span>
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
          className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} text-lg`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#071322] border-t border-slate-800 px-4 py-4 space-y-3 shadow-2xl">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-lg font-oswald text-sm font-bold uppercase ${
              location.pathname === "/" ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-200"
            }`}
          >
            TRANG CHỦ
          </Link>

          {navGroups.map((g, idx) => {
            const hasMultiple = g.items.length > 1;
            const targetPath = g.items[0]?.path || g.pathRoot;

            if (!hasMultiple) {
              return (
                <Link
                  key={idx}
                  to={targetPath}
                  className={`block px-3 py-2 rounded-lg font-oswald text-sm font-bold uppercase border-t border-slate-800 pt-2 ${
                    location.pathname === targetPath
                      ? "text-[#00e575] bg-emerald-950/40"
                      : "text-slate-200"
                  }`}
                >
                  {g.title}
                </Link>
              );
            }

            return (
              <div key={idx} className="space-y-1 pt-2 border-t border-slate-800">
                <span className="px-3 text-[10px] font-oswald font-bold uppercase tracking-widest text-emerald-400 block">
                  {g.title}
                </span>
                {g.items.map((item, iIdx) => (
                  <Link
                    key={iIdx}
                    to={item.path}
                    className={`block px-4 py-2 rounded-lg font-oswald text-xs uppercase font-medium ${
                      location.pathname === item.path
                        ? "bg-emerald-500 text-slate-950 font-bold"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            );
          })}

          <Link
            to="/quanlygiaidau"
            className="block text-center py-2.5 rounded-lg bg-amber-500 text-slate-950 font-oswald text-xs font-black uppercase tracking-wider mt-2"
          >
            <i className="fa-solid fa-lock mr-1.5"></i>
            BTC Portal (Quản trị)
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
