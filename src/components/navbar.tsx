import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggleButton } from "../utils/themeContext";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Hide entire navbar when on the Home Hub page (/)
  if (location.pathname === "/") {
    return null;
  }

  const isDthen = location.pathname.startsWith("/dthen");

  // Navigation configuration for ĐThén FCO
  const dthenNavGroups = [
    {
      title: "NỘI QUY GIẢI ĐẤU",
      pathRoot: "/dthen/noiquy",
      items: [
        { label: "NỘI QUY THI ĐẤU", path: "/dthen/noiquy" },
        { label: "ĐIỀU KIỆN THAM DỰ", path: "/dthen/dieukienthamdu" },
        { label: "QUY ĐỊNH ĐỘI HÌNH", path: "/dthen/quydinh" },
      ],
    },
    {
      title: "THỂ THỨC & LỊCH ĐẤU",
      pathRoot: "/dthen/thethuc",
      items: [
        { label: "LỊCH ĐẤU & BXH", path: "/dthen/ltd" },
        { label: "THỂ THỨC THI ĐẤU", path: "/dthen/thethuc" },
        { label: "CƠ CẤU GIẢI THƯỞNG", path: "/dthen/giaithuong" },
      ],
    },
    {
      title: "PHÒNG TRUYỀN THỐNG",
      pathRoot: "/dthen/xephang",
      items: [
        { label: "BẢNG VÀNG VÔ ĐỊCH", path: "/dthen/xephang" },
      ],
    },
    {
      title: "BAN TỔ CHỨC",
      pathRoot: "/dthen/admin",
      items: [
        { label: "BAN TỔ CHỨC", path: "/dthen/admin" },
      ],
    },
  ];

  // Navigation configuration for Sao Vàng Cup
  const saoVangNavGroups = [
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
        { label: "TOP CÁC MÙA GIẢI", path: "/topcacmua" },
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

  const currentNavGroups = isDthen ? dthenNavGroups : saoVangNavGroups;
  const currentHomeLink = isDthen ? "/dthen" : "/saovang";
  const tournamentTitle = isDthen ? "ĐTHÉN" : "SAO VÀNG";
  const tournamentSuffix = isDthen ? "FCO™" : "CUP™";

  return (
    <header className="sticky top-0 z-50 bg-white/95 border-b border-slate-200 backdrop-blur-md shadow-xs">
      <div className="w-full max-w-[1480px] mx-auto px-3 sm:px-4 lg:px-6 py-2 flex items-center justify-between gap-2 xl:gap-4">
        {/* Left: Tournament Identity Brand Logo */}
        <Link
          to={currentHomeLink}
          className="flex items-center space-x-2 sm:space-x-2.5 group flex-shrink-0"
          title="Trang Chủ Giải Đấu"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            {isDthen ? (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center text-base shadow-md">
                <i className="fa-solid fa-trophy text-amber-400"></i>
              </div>
            ) : (
              <img
                src={require("../img/logo02.svg").default}
                alt="Sao Vàng Logo"
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="whitespace-nowrap flex-shrink-0">
            <span
              className={`font-oswald text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900 block leading-tight ${
                isDthen ? "group-hover:text-blue-700" : "group-hover:text-emerald-700"
              } transition-colors whitespace-nowrap`}
            >
              {tournamentTitle} <span className="text-amber-500">{tournamentSuffix}</span>
            </span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 font-semibold tracking-widest uppercase block whitespace-nowrap">
              GIẢI ĐẤU FC ONLINE
            </span>
          </div>
        </Link>

        {/* Center: Main Navigation Menu */}
        <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 flex-shrink-0">
          {/* Main Tournament Home Link */}
          <Link
            to={currentHomeLink}
            className={`px-2 xl:px-2.5 py-1.5 rounded-xl font-oswald text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap inline-flex items-center space-x-1 ${
              location.pathname === currentHomeLink
                ? isDthen
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <i className={`fa-solid fa-house text-[10px] ${isDthen ? 'text-blue-600' : 'text-emerald-600'}`}></i>
            <span>TRANG CHỦ</span>
          </Link>

          {/* Navigation Dropdown Groups */}
          {currentNavGroups.map((group, idx) => {
            const hasMultipleItems = group.items.length > 1;
            const isActive =
              group.items.some((i) => i.path === location.pathname) ||
              group.pathRoot === location.pathname;
            const targetPath = group.items[0]?.path || group.pathRoot;

            if (!hasMultipleItems) {
              return (
                <Link
                  key={idx}
                  to={targetPath}
                  className={`px-2 xl:px-2.5 py-1.5 rounded-xl font-oswald text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap inline-flex items-center justify-center ${
                    isActive
                      ? isDthen
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
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
                  className={`px-2 xl:px-2.5 py-1.5 rounded-xl font-oswald text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap inline-flex items-center justify-center space-x-1 ${
                    isActive
                      ? isDthen
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <span className="whitespace-nowrap">{group.title}</span>
                  <i
                    className={`fa-solid fa-chevron-down text-[7px] ml-0.5 transition-transform group-hover/menu:rotate-180 ${
                      isActive ? "text-emerald-700 opacity-90" : "opacity-50"
                    }`}
                  ></i>
                </Link>

                {/* Dropdown Menu Popup */}
                <div className="absolute top-full left-0 pt-1.5 w-52 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-180 z-50">
                  <div className="p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-0.5">
                    {group.items.map((item, itemIdx) => {
                      const isItemActive = location.pathname === item.path;
                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          className={`block px-3 py-2 rounded-xl font-oswald text-xs uppercase tracking-wider font-semibold transition-colors ${
                            isItemActive
                              ? isDthen
                                ? "bg-blue-700 text-white font-bold"
                                : "bg-emerald-700 text-white font-bold"
                              : isDthen
                              ? "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                              : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
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

        {/* Right: Quick Action - Admin Portal, Theme Toggle & Return to Hub */}
        <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
          <ThemeToggleButton />

          <Link
            to="/quanlygiaidau"
            className="px-2.5 xl:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-oswald text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap inline-flex items-center space-x-1.5 shadow-sm hover:scale-105 btn-shimmer"
            title="Quản Trị Giải Đấu BTC"
          >
            <i className="fa-solid fa-lock text-[9px]"></i>
            <span>BTC ADMIN</span>
          </Link>

          <Link
            to="/"
            className="px-2.5 xl:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-oswald text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap inline-flex items-center space-x-1.5 shadow-xs hover:scale-105 btn-shimmer"
            title="Quay lại Cổng Chọn Giải Đấu (Hub)"
          >
            <i className="fa-solid fa-layer-group text-[9px] text-amber-400"></i>
            <span>HUB GIẢI ĐẤU</span>
          </Link>
        </div>


        {/* Mobile menu toggle & quick theme button */}
        <div className="flex items-center space-x-2 lg:hidden">
          <ThemeToggleButton />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none"
          >
            <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} text-lg`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2.5 shadow-lg">
          <Link
            to="/"
            className="block px-3.5 py-2.5 rounded-xl font-oswald text-xs font-bold uppercase text-white bg-slate-900 dark:bg-slate-800 flex items-center justify-between"
          >
            <span className="flex items-center">
              <i className="fa-solid fa-layer-group mr-2 text-amber-400"></i>
              HUB CHỌN GIẢI ĐẤU
            </span>
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </Link>

          <Link
            to="/quanlygiaidau"
            className="block px-3.5 py-2.5 rounded-xl font-oswald text-xs font-bold uppercase text-white bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-between shadow-xs"
          >
            <span className="flex items-center">
              <i className="fa-solid fa-lock mr-2"></i>
              QUẢN TRỊ BTC (ADMIN PORTAL)
            </span>
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </Link>

          <Link
            to={currentHomeLink}
            className={`block px-3.5 py-2 rounded-xl font-oswald text-xs font-bold uppercase ${
              location.pathname === currentHomeLink
                ? isDthen
                  ? "bg-blue-700 text-white"
                  : "bg-emerald-700 text-white"
                : "text-slate-700 bg-slate-50"
            }`}
          >
            <i className="fa-solid fa-house mr-2 text-amber-500"></i>
            TRANG CHỦ ({tournamentTitle} {tournamentSuffix})
          </Link>

          {currentNavGroups.map((g, idx) => {
            const hasMultiple = g.items.length > 1;
            const targetPath = g.items[0]?.path || g.pathRoot;

            if (!hasMultiple) {
              return (
                <Link
                  key={idx}
                  to={targetPath}
                  className={`block px-3.5 py-2 rounded-xl font-oswald text-xs font-bold uppercase border-t border-slate-100 pt-2 ${
                    location.pathname === targetPath
                      ? isDthen
                        ? "text-blue-700 bg-blue-50"
                        : "text-emerald-700 bg-emerald-50"
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
                    className={`block px-4 py-1.5 rounded-lg font-oswald text-xs uppercase font-medium ${
                      location.pathname === item.path
                        ? isDthen
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "bg-emerald-50 text-emerald-700 font-bold"
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
