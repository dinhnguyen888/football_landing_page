import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggleButton } from '../../utils/themeContext';
import { isFirebaseConfigured } from '../../services/firebase';

export type AdminTab = 'LIST' | 'SCORES' | 'KNOCKOUT' | 'CREATE' | 'CLOUD';
export type TournamentSystem = 'SAO_VANG' | 'DTHEN';

interface AdminLayoutProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  tournamentSystem: TournamentSystem;
  onSwitchSystem: () => void;
  tournamentName: string;
  season: string;
  isCloudLoaded: boolean;
  isSyncing?: boolean;
  onSyncCloud?: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  setActiveTab,
  tournamentSystem,
  onSwitchSystem,
  tournamentName,
  season,
  isCloudLoaded,
  isSyncing = false,
  onSyncCloud,
  onLogout,
  children,
}) => {
  const tabs = [
    { id: 'LIST' as AdminTab, label: 'Danh Sách & Xuất Bản', icon: 'fa-list-check' },
    { id: 'SCORES' as AdminTab, label: 'Lịch Đấu & Tỉ Số', icon: 'fa-futbol' },
    { id: 'KNOCKOUT' as AdminTab, label: 'Vòng Knock-out', icon: 'fa-trophy' },
    { id: 'CREATE' as AdminTab, label: 'Tạo Giải Đấu Mới', icon: 'fa-plus-circle' },
    { id: 'CLOUD' as AdminTab, label: 'Firebase Cloud', icon: 'fa-cloud' },
  ];

  const isDthen = tournamentSystem === 'DTHEN';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070e17] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* ================= ADMIN TOPBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-xs px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Brand & Tournament System Selector */}
          <div className="flex items-center justify-between md:justify-start space-x-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 flex-shrink-0">
                <i className="fa-solid fa-shield-halved text-lg"></i>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-oswald text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    ADMIN PORTAL
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-oswald font-bold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800/60">
                    BTC CONTROL
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Giải đang quản lý: <strong className="text-amber-600 dark:text-amber-400 font-semibold">{tournamentName}</strong> ({season})
                </p>
              </div>
            </div>

            {/* Quick Switch Tournament Pill */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <span
                className={`px-2.5 py-1 rounded-lg font-oswald text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-2xs ${
                  isDthen
                    ? 'bg-blue-600 text-white'
                    : 'bg-emerald-700 text-white'
                }`}
              >
                <i className={`fa-solid ${isDthen ? 'fa-bolt text-amber-300' : 'fa-trophy text-amber-300'}`}></i>
                <span className="hidden sm:inline">{isDthen ? 'ĐTHÉN FCO' : 'SAO VÀNG'}</span>
              </span>

              <button
                type="button"
                onClick={onSwitchSystem}
                className="px-2 py-1 rounded-lg font-oswald text-xs font-bold uppercase text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-slate-900 transition-colors flex items-center space-x-1 cursor-pointer"
                title="Bấm để chọn đổi sang giải đấu khác"
              >
                <i className="fa-solid fa-repeat text-[11px]"></i>
                <span className="hidden sm:inline">Đổi Giải</span>
              </button>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-3">
            {/* Firebase Status Badge */}
            <div className="flex items-center">
              {isFirebaseConfigured ? (
                <div
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  title="Đã kết nối Firebase Cloud Firestore trực tuyến"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="hidden md:inline font-oswald text-[11px] tracking-wide uppercase">Firestore Online</span>
                  <span className="md:hidden text-[10px]">Cloud</span>
                </div>
              ) : (
                <div
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                  title="Chưa cấu hình Firebase - Dữ liệu đang lưu tại Local Storage"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="hidden md:inline font-oswald text-[11px] tracking-wide uppercase">Local Storage</span>
                  <span className="md:hidden text-[10px]">Local</span>
                </div>
              )}
            </div>

            {/* Manual Sync Button */}
            {onSyncCloud && (
              <button
                type="button"
                onClick={onSyncCloud}
                disabled={isSyncing}
                title="Đồng bộ dữ liệu giải này với Cloud Firestore"
                className="px-2.5 py-1.5 rounded-lg text-xs font-oswald font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <i className={`fa-solid fa-rotate ${isSyncing ? 'fa-spin text-amber-500' : ''}`}></i>
                <span className="hidden lg:inline">{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ'}</span>
              </button>
            )}

            {/* View Public Tournament */}
            <div className="relative group">
              <Link
                to={isDthen ? '/dthen/ltd' : '/ltd'}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-lg text-xs font-oswald font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center space-x-1.5"
                title="Mở trang Lịch đấu & BXH của giải này ở tab mới"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-[11px]"></i>
                <span className="hidden sm:inline">Xem Web Khán Giả</span>
              </Link>
            </div>

            {/* Dark Mode Toggle */}
            <ThemeToggleButton />

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-oswald font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              title="Khóa và Đăng xuất khỏi Admin Portal"
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-slate-200/70 dark:border-slate-800/80 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1 sm:space-x-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-lg font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center space-x-2 cursor-pointer ${
                    isActive
                      ? isDthen
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                        : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <i className={`fa-solid ${tab.icon} ${isActive ? (isDthen ? 'text-white' : 'text-slate-950') : 'text-slate-400'}`}></i>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* ================= ADMIN FOOTER ================= */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50">
        <p className="font-oswald uppercase tracking-wider text-[11px]">
          Sao Vàng Cup ™ & ĐThén FCO ™ — Cổng Quản Trị Giải Đấu Riêng Biệt (Admin Portal)
        </p>
      </footer>
    </div>
  );
};

export default AdminLayout;
