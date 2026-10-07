import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggleButton } from "../utils/themeContext";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Track scroll direction for mobile smart auto-hide / show
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || document.documentElement.scrollTop || 0;
          if (currentY < 65) {
            setNavVisible(true);
          } else {
            const diff = currentY - lastScrollYRef.current;
            if (diff > 6) {
              setNavVisible(false); // scrolling down
            } else if (diff < -6) {
              setNavVisible(true); // scrolling up
            }
          }
          lastScrollYRef.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation configuration for Sao Vàng Cup
  const navGroups = [
    {
      title: "NỘI QUY GIẢI ĐẤU",
      pathRoot: "/noiquy",
      items: [
        { label: "NỘI QUY THI ĐẤU", path: "/noiquy", icon: "fa-clipboard-list" },
        { label: "ĐIỀU KIỆN THAM DỰ", path: "/dieukienthamdu", icon: "fa-shield-halved" },
        { label: "QUY ĐỊNH ĐỘI HÌNH", path: "/quydinh", icon: "fa-users-gear" },
      ],
    },
    {
      title: "THỂ THỨC & GIẢI THƯỞNG",
      pathRoot: "/thethuc",
      items: [
        { label: "THỂ THỨC THI ĐẤU", path: "/thethuc", icon: "fa-sitemap" },
        { label: "CƠ CẤU GIẢI THƯỞNG", path: "/giaithuong", icon: "fa-gift" },
      ],
    },
    {
      title: "PHÒNG TRUYỀN THỐNG",
      pathRoot: "/xephang",
      items: [
        { label: "PHÒNG TRUYỀN THỐNG", path: "/xephang", icon: "fa-award" },
      ],
    },
    {
      title: "BAN TỔ CHỨC",
      pathRoot: "/admin",
      items: [
        { label: "BAN TỔ CHỨC", path: "/admin", icon: "fa-user-tie" },
        { label: "CÁC NHÓM GIẢI", path: "/cacnhomgiai", icon: "fa-network-wired" },
      ],
    },
  ];

  const isHomeActive = location.pathname === "/" || location.pathname === "/saovang";

  return (
    <>
      {/* ================= TOP HEADER BAR ================= */}
      <header
        className={`sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-xs transition-transform duration-300 ease-in-out ${
          navVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="w-full max-w-[1480px] mx-auto px-3 sm:px-4 lg:px-6 py-2 flex items-center justify-between gap-2 xl:gap-4">
          {/* Left: Tournament Identity Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-2.5 group shrink-0"
            title="Trang Chủ Sao Vàng Cup"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <img
                src={require("../img/logo02.svg").default}
                alt="Sao Vàng Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="whitespace-nowrap shrink-0">
              <span className="font-oswald text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white block leading-tight group-hover:text-emerald-600 transition-colors whitespace-nowrap">
                SAO VÀNG <span className="text-amber-500">CUP™</span>
              </span>
              <span className="text-[8px] sm:text-[9px] text-slate-400 font-semibold tracking-widest uppercase block whitespace-nowrap">
                GIẢI ĐẤU FC ONLINE
              </span>
            </div>
          </Link>

          {/* Center: Main Navigation Menu (Desktop Only) */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 shrink-0">
            {/* Main Tournament Home Link */}
            <Link
              to="/"
              className={`px-2 xl:px-2.5 py-1.5 rounded-xl font-oswald text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap inline-flex items-center space-x-1 ${
                isHomeActive
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <i className="fa-solid fa-house text-[10px] text-emerald-600"></i>
              <span>TRANG CHỦ</span>
            </Link>

            {/* Navigation Dropdown Groups */}
            {navGroups.map((group, idx) => {
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
                        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs"
                        : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
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
                        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs"
                        : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="whitespace-nowrap">{group.title}</span>
                    <i
                      className={`fa-solid fa-chevron-down text-[7px] ml-0.5 transition-transform group-hover/menu:rotate-180 ${
                        isActive ? "text-emerald-600 opacity-90" : "opacity-50"
                      }`}
                    ></i>
                  </Link>

                  {/* Dropdown Menu Popup */}
                  <div className="absolute top-full left-0 pt-1.5 w-52 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-180 z-50">
                    <div className="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-0.5">
                      {group.items.map((item, itemIdx) => {
                        const isItemActive = location.pathname === item.path;
                        return (
                          <Link
                            key={itemIdx}
                            to={item.path}
                            className={`block px-3 py-2 rounded-xl font-oswald text-xs uppercase tracking-wider font-semibold transition-colors ${
                              isItemActive
                                ? "bg-emerald-700 text-white font-bold"
                                : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700"
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

          {/* Right: Quick Action - Theme Toggle & Hamburger Button */}
          <div className="flex items-center space-x-2 shrink-0">
            <ThemeToggleButton />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              title="Menu Điều Hướng"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none flex items-center justify-center cursor-pointer shadow-2xs"
            >
              <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} text-base`}></i>
            </button>
          </div>
        </div>
      </header>

      {/* ================= FIXED MOBILE BOTTOM NAVIGATION ================= */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden transition-transform duration-300 ease-in-out ${
          navVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="grid grid-cols-4 h-15 max-w-md mx-auto px-1 items-center">
          {/* 1. Trang chủ giải */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              isHomeActive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <i className="fa-solid fa-house text-base mb-0.5"></i>
            <span className="font-oswald text-[10px] font-bold uppercase tracking-wider">Trang chủ</span>
            {isHomeActive && <span className="w-1 h-1 rounded-full mt-0.5 bg-emerald-500" />}
          </Link>

          {/* 2. Thể thức thi đấu */}
          <Link
            to="/thethuc"
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              location.pathname === "/thethuc"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <i className="fa-solid fa-sitemap text-base mb-0.5"></i>
            <span className="font-oswald text-[10px] font-bold uppercase tracking-wider">Thể thức</span>
            {location.pathname === "/thethuc" && (
              <span className="w-1 h-1 rounded-full mt-0.5 bg-emerald-500" />
            )}
          </Link>

          {/* 3. BXH / Phòng truyền thống */}
          <Link
            to="/xephang"
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              location.pathname === "/xephang"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <i className="fa-solid fa-trophy text-base mb-0.5"></i>
            <span className="font-oswald text-[10px] font-bold uppercase tracking-wider">Bảng Vàng</span>
            {location.pathname === "/xephang" && (
              <span className="w-1 h-1 rounded-full mt-0.5 bg-emerald-500" />
            )}
          </Link>

          {/* 4. Menu Khác (Mở Drawer đầy đủ) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
              mobileMenuOpen
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <i className="fa-solid fa-bars text-base mb-0.5"></i>
            <span className="font-oswald text-[10px] font-bold uppercase tracking-wider">Khác</span>
          </button>
        </div>
      </nav>

      {/* ================= MOBILE SLIDE-OVER DRAWER MENU ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-over Panel from Right */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/60">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    <i className="fa-solid fa-futbol text-amber-300"></i>
                  </div>
                  <div>
                    <h3 className="font-oswald text-sm font-bold uppercase text-slate-900 dark:text-white leading-tight">
                      SAO VÀNG CUP™
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                      CẨM NANG GIẢI ĐẤU
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {/* Section 1: Tournament Menu Items */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-oswald font-bold uppercase tracking-wider text-slate-400 block px-1">
                    DANH MỤC GIẢI ĐẤU
                  </span>

                  <div className="space-y-1">
                    {/* Home */}
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-oswald text-xs font-bold uppercase transition-all ${
                        isHomeActive
                          ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <i className="fa-solid fa-house w-4 text-center text-emerald-500"></i>
                      <span>Trang chủ giải đấu</span>
                    </Link>

                    {/* Flatten all sub-items from navGroups */}
                    {navGroups
                      .flatMap((grp) => grp.items)
                      .map((item, idx) => {
                        const isItemActive = location.pathname === item.path;
                        return (
                          <Link
                            key={idx}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-oswald text-xs font-bold uppercase transition-all ${
                              isItemActive
                                ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            <i
                              className={`fa-solid ${
                                item.icon || "fa-circle-dot"
                              } w-4 text-center text-slate-400`}
                            ></i>
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Giao diện hệ thống
                </span>
                <ThemeToggleButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
