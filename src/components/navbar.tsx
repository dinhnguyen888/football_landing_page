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

        {/* Right: Quick Action - Theme Toggle & 3-gạch Menu Button */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <ThemeToggleButton />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            title="Menu Điều Hướng (Dấu 3 Gạch)"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none flex items-center justify-center cursor-pointer shadow-2xs"
          >
            <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} text-base`}></i>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Appbar Nav: Always visible on the Appbar */}
      <div className="lg:hidden w-full border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 px-2.5 py-1.5 overflow-x-auto no-scrollbar flex items-center space-x-1.5">
        <Link
          to={currentHomeLink}
          className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex items-center space-x-1 flex-shrink-0 ${
            location.pathname === currentHomeLink
              ? isDthen
                ? "bg-blue-700 text-white shadow-2xs"
                : "bg-emerald-700 text-white shadow-2xs"
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
          }`}
        >
          <i className="fa-solid fa-house text-[10px]"></i>
          <span>Trang chủ</span>
        </Link>

        {isDthen ? (
          <>
            <Link
              to="/dthen/noiquy"
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                location.pathname === "/dthen/noiquy"
                  ? "bg-blue-700 text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Nội quy
            </Link>
            <Link
              to="/dthen/thethuc"
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                location.pathname === "/dthen/thethuc"
                  ? "bg-blue-700 text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Thể thức
            </Link>
            <Link
              to="/dthen/ltd"
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                location.pathname === "/dthen/ltd"
                  ? "bg-blue-700 text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Lịch đấu & BXH
            </Link>
            <Link
              to="/dthen/quydinh"
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                location.pathname === "/dthen/quydinh"
                  ? "bg-blue-700 text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Quy định
            </Link>
            <Link
              to="/dthen/giaithuong"
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                location.pathname === "/dthen/giaithuong"
                  ? "bg-blue-700 text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Giải thưởng
            </Link>
            <Link
              to="/dthen/xephang"
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                location.pathname === "/dthen/xephang"
                  ? "bg-blue-700 text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Bảng vàng
            </Link>
            <Link
              to="/dthen/admin"
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                location.pathname === "/dthen/admin"
                  ? "bg-blue-700 text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Ban tổ chức
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/noiquy"
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                location.pathname === "/noiquy"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Nội quy
            </Link>
            <Link
              to="/thethuc"
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                location.pathname === "/thethuc"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Thể thức
            </Link>
            <Link
              to="/ltd"
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                location.pathname === "/ltd"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Lịch đấu & BXH
            </Link>
            <Link
              to="/quydinh"
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                location.pathname === "/quydinh"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Quy định
            </Link>
            <Link
              to="/giaithuong"
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                location.pathname === "/giaithuong"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Giải thưởng
            </Link>
            <Link
              to="/xephang"
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                location.pathname === "/xephang"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Bảng vàng
            </Link>
            <Link
              to="/admin"
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                location.pathname === "/admin"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Ban tổ chức
            </Link>
          </>
        )}
      </div>

      {/* Backdrop overlay for 3-gạch menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-2xs z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Menu Dấu 3 Gạch: CHỈ CÓ 3 MỤC (HUB CHỌN GIẢI, QUẢN TRỊ BTC, TRANG CHỦ) */}
      {mobileMenuOpen && (
        <div className="absolute right-3 sm:right-4 lg:right-6 top-full mt-2 w-72 max-w-[calc(100vw-24px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-2xl space-y-2 z-50 animate-fade-in">
          <div className="text-[10px] font-oswald font-bold uppercase tracking-wider text-slate-400 px-1">
            MENU ĐIỀU HƯỚNG HỆ THỐNG
          </div>

          <Link
            to={currentHomeLink}
            onClick={() => setMobileMenuOpen(false)}
            className={`px-3.5 py-2.5 rounded-xl font-oswald text-xs font-bold uppercase transition-all flex items-center justify-between ${
              location.pathname === currentHomeLink
                ? isDthen
                  ? "bg-blue-700 text-white shadow-xs"
                  : "bg-emerald-700 text-white shadow-xs"
                : "text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <span className="flex items-center space-x-2.5">
              <i className="fa-solid fa-house text-amber-400 text-sm"></i>
              <span>TRANG CHỦ ({tournamentTitle} {tournamentSuffix})</span>
            </span>
            <i className="fa-solid fa-chevron-right text-[10px] opacity-70"></i>
          </Link>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3.5 py-2.5 rounded-xl font-oswald text-xs font-bold uppercase text-white bg-slate-900 hover:bg-slate-800 flex items-center justify-between shadow-xs transition-all"
          >
            <span className="flex items-center space-x-2.5">
              <i className="fa-solid fa-layer-group text-amber-400 text-sm"></i>
              <span>HUB CHỌN GIẢI ĐẤU</span>
            </span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70"></i>
          </Link>

          <Link
            to="/quanlygiaidau"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3.5 py-2.5 rounded-xl font-oswald text-xs font-bold uppercase text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 flex items-center justify-between shadow-xs transition-all btn-shimmer"
          >
            <span className="flex items-center space-x-2.5">
              <i className="fa-solid fa-lock text-white text-sm"></i>
              <span>QUẢN TRỊ BTC (ADMIN PORTAL)</span>
            </span>
            <i className="fa-solid fa-shield-halved text-[10px] opacity-70"></i>
          </Link>
        </div>
      )}

    </header>
  );
};

export default Navbar;
