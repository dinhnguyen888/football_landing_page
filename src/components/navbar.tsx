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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Brand Banner */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3.5 group flex-shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <img 
              src={require("../img/Logo.svg").default} 
              alt="Sao Vàng Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="whitespace-nowrap">
            <span className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wider text-slate-900 block leading-tight group-hover:text-emerald-700 transition-colors whitespace-nowrap">
              SAO VÀNG <span className="text-amber-500">CUP™</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase block whitespace-nowrap">
              Giải Đấu Cộng Đồng FC Online
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-md font-oswald text-sm font-semibold uppercase tracking-wider transition-colors ${
              location.pathname === "/"
                ? "bg-emerald-50 text-emerald-800 font-bold border-b-2 border-emerald-700"
                : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
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
                  className={`px-3 py-1.5 rounded-md font-oswald text-sm font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-bold border-b-2 border-emerald-700"
                      : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
                  }`}
                >
                  {group.title}
                </Link>
              );
            }

            return (
              <div key={idx} className="relative nav-dropdown-group py-1">
                <Link
                  to={targetPath}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md font-oswald text-sm font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-bold border-b-2 border-emerald-700"
                      : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{group.title}</span>
                  <i className="fa-solid fa-chevron-down text-[9px] opacity-60 ml-0.5"></i>
                </Link>

                {/* Dropdown Menu */}
                <div className="nav-dropdown-menu absolute top-full left-0 w-60 pt-1 z-50">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-lg space-y-0.5">
                    {group.items.map((item, itemIdx) => {
                      const isItemActive = location.pathname === item.path;
                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          className={`block px-3 py-2 rounded font-oswald text-xs uppercase tracking-wider font-semibold transition-colors ${
                            isItemActive
                              ? "bg-emerald-50 text-emerald-800 font-bold"
                              : "text-slate-700 hover:bg-slate-100 hover:text-emerald-700"
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
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
          className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} text-lg`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-3">
          <Link
            to="/"
            className={`block px-3 py-2 rounded font-oswald text-sm font-bold uppercase ${
              location.pathname === "/" ? "bg-emerald-50 text-emerald-700" : "text-slate-700"
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
                  className={`block px-3 py-2 rounded font-oswald text-sm font-bold uppercase border-t border-slate-100 pt-2 ${
                    location.pathname === targetPath
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-700"
                  }`}
                >
                  {g.title}
                </Link>
              );
            }

            return (
              <div key={idx} className="space-y-1 pt-1 border-t border-slate-100">
                <Link
                  to={targetPath}
                  className="px-3 text-[11px] font-oswald font-bold uppercase tracking-wider text-slate-500 hover:text-emerald-700 block"
                >
                  {g.title} →
                </Link>
                {g.items.map((item, iIdx) => (
                  <Link
                    key={iIdx}
                    to={item.path}
                    className={`block px-4 py-1.5 rounded font-oswald text-xs uppercase font-medium ${
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
        </div>
      )}
    </header>
  );
};

export default Navbar;
