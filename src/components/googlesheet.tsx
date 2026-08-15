import React, { useState } from 'react';

const GoogleSheetViewer: React.FC<{ sheetUrl: string }> = ({ sheetUrl }) => {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="w-full space-y-4">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl soft-card">
        <div className="flex items-center space-x-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-bold text-slate-800 tracking-tight">
            Dữ Liệu Trực Tiếp (Live Stream Google Sheets)
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href={sheetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            <span>Mở Bảng Gốc</span>
          </a>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <i className={`fa-solid ${fullscreen ? "fa-compress" : "fa-expand"} text-xs`}></i>
            <span>{fullscreen ? "Thu nhỏ" : "Phóng to"}</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div
        className={`relative w-full rounded-3xl overflow-hidden soft-card transition-all duration-300 ${
          fullscreen ? "h-[85vh]" : "h-[650px]"
        }`}
      >
        <iframe
          title="Google Sheet Tournament Standings"
          src={sheetUrl}
          className="w-full h-full border-0 bg-white"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default GoogleSheetViewer;
