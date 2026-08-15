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
    <header className="sticky top-0 z-50 bg-white/95 border-b border-slate-200/90 backdrop-blur-md shadow-sm">
      {/* Top Brand Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
          <div className="w-11 h-11 sm:w-13 sm:h-13 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <img 
              src={require("../img/logo02.svg").default} 
              alt="Sao Vàng Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="whitespace-nowrap flex-shrink-0">
            <span className="font-oswald text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900 block leading-tight group-hover:text-emerald-700 transition-colors whitespace-nowrap">
              SAO VÀNG <span className="text-amber-500">CUP™</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase block whitespace-nowrap">
              Giải Đấu Cộng Đồng FC Online
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 flex-shrink-0">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg font-oswald text-xs xl:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap inline-flex items-center justify-center ${
              location.pathname === "/"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-700 hover:text-emerald-800 hover:bg-slate-100"
            }`}
          >
            TRANG CHỦ
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
                  className={`px-3 py-1.5 rounded-lg font-oswald text-xs xl:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap inline-flex items-center justify-center ${
                    isActive
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-slate-700 hover:text-emerald-800 hover:bg-slate-100"
                  }`}
                >
                  {group.title}
                </Link>
              );
            }

            return (
              <div key={idx} className="relative group/menu">
                <Link
                  to={targetPath}
                  className={`px-3 py-1.5 rounded-lg font-oswald text-xs xl:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap inline-flex items-center justify-center space-x-1 ${
                    isActive
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-slate-700 hover:text-emerald-800 hover:bg-slate-100"
                  }`}
                >
                  <span className="whitespace-nowrap">{group.title}</span>
                  <i className={`fa-solid fa-chevron-down text-[8px] ml-0.5 transition-transform group-hover/menu:rotate-180 ${
                    isActive ? "opacity-90 text-white" : "opacity-60"
                  }`}></i>
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 pt-1.5 w-56 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-50">
                  <div className="p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-0.5">
                    {group.items.map((item, itemIdx) => {
                      const isItemActive = location.pathname === item.path;
                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          className={`block px-3.5 py-2 rounded-xl font-oswald text-xs uppercase tracking-wider font-semibold transition-colors ${
                            isItemActive
                              ? "bg-emerald-700 text-white font-bold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
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
            className="ml-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-oswald text-xs xl:text-sm font-black uppercase tracking-wider transition-all shadow-xs hover:scale-105 inline-flex items-center justify-center space-x-1.5 whitespace-nowrap flex-shrink-0"
            title="Quản trị giải đấu"
          >
            <i className="fa-solid fa-lock text-[10px]"></i>
            <span>BTC Portal</span>
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
          className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none"
        >
          <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} text-lg`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-lg">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-lg font-oswald text-sm font-bold uppercase ${
              location.pathname === "/" ? "bg-emerald-700 text-white" : "text-slate-700"
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
                  className={`block px-3 py-2 rounded-lg font-oswald text-sm font-bold uppercase border-t border-slate-100 pt-2 ${
                    location.pathname === targetPath
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-slate-700"
                  }`}
                >
                  {g.title}
                </Link>
              );
            }

            return (
              <div key={idx} className="space-y-1 pt-2 border-t border-slate-100">
                <span className="px-3 text-[10px] font-oswald font-bold uppercase tracking-widest text-slate-400 block">
                  {g.title}
                </span>
                {g.items.map((item, iIdx) => (
                  <Link
                    key={iIdx}
                    to={item.path}
                    className={`block px-4 py-2 rounded-lg font-oswald text-xs uppercase font-medium ${
                      location.pathname === item.path
                        ? "bg-emerald-50 text-emerald-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
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
            className="block text-center py-2.5 rounded-lg bg-amber-500 text-white font-oswald text-xs font-black uppercase tracking-wider mt-2 shadow-sm"
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
