import React, { useState } from 'react';
import { generateRoomCode } from '../../services/drawRoomService';

export type DrawSessionMode = 'SOLO' | 'CREATE_ROOM' | 'JOIN_ROOM';

export interface SoloSessionConfig {
  mode: 'SOLO';
  mcName: string;
}

export interface CreateRoomConfig {
  mode: 'CREATE_ROOM';
  roomId: string;
  adminName: string;
  mcName: string;
}

export interface JoinRoomConfig {
  mode: 'JOIN_ROOM';
  roomId: string;
  adminName: string;
  mcName: string;
}

export type SessionSelection = SoloSessionConfig | CreateRoomConfig | JoinRoomConfig;

interface OnlineRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSolo: (config: SoloSessionConfig) => void;
  onSelectCreateRoom: (config: CreateRoomConfig) => void;
  onSelectJoinRoom: (config: JoinRoomConfig) => void;
}

export const OnlineRoomModal: React.FC<OnlineRoomModalProps> = ({
  isOpen,
  onClose,
  onSelectSolo,
  onSelectCreateRoom,
  onSelectJoinRoom,
}) => {
  const [activeTab, setActiveTab] = useState<DrawSessionMode>('SOLO');

  // Solo Inputs
  const [soloMcName, setSoloMcName] = useState('MC Phan Long');

  // Create Room Inputs
  const [hostAdminName, setHostAdminName] = useState('Admin Phan Long (Trưởng BTC)');
  const [hostMcName, setHostMcName] = useState('MC Phan Long');
  const [customRoomCode, setCustomRoomCode] = useState(() => generateRoomCode('SAO_VANG'));

  // Join Room Inputs
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [guestAdminName, setGuestAdminName] = useState('Admin Minh Quân (Khách Mời)');
  const [guestMcName, setGuestMcName] = useState('MC Minh Quân');
  const [joinError, setJoinError] = useState('');

  if (!isOpen) return null;

  const handleSoloSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectSolo({
      mode: 'SOLO',
      mcName: soloMcName.trim() || 'MC Phan Long',
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectCreateRoom({
      mode: 'CREATE_ROOM',
      roomId: customRoomCode.trim().toUpperCase() || generateRoomCode('SAO_VANG'),
      adminName: hostAdminName.trim() || 'Admin 1 (Host)',
      mcName: hostMcName.trim() || 'MC Phan Long',
    });
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinRoomCode.trim()) {
      setJoinError('Vui lòng nhập mã phòng bốc thăm!');
      return;
    }
    setJoinError('');
    onSelectJoinRoom({
      mode: 'JOIN_ROOM',
      roomId: joinRoomCode.trim().toUpperCase(),
      adminName: guestAdminName.trim() || 'Admin 2 (Co-Host)',
      mcName: guestMcName.trim() || 'MC Minh Quân',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg font-bold shadow-inner">
              🎪
            </span>
            <div>
              <h2 className="font-oswald text-base sm:text-lg font-black uppercase text-white tracking-wider">
                CHỌN CHẾ ĐỘ BỐC THĂM 3D
              </h2>
              <p className="text-[11px] text-slate-400">
                Bốc thăm đơn lẻ hoặc kết nối phòng 2 Admin cùng bốc
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 p-2 bg-slate-950/40 border-b border-slate-800 gap-1.5 text-xs font-oswald font-bold uppercase">
          <button
            type="button"
            onClick={() => setActiveTab('SOLO')}
            className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'SOLO'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <i className="fa-solid fa-user text-sm"></i>
            <span>Bốc Solo (1 MC)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CREATE_ROOM')}
            className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'CREATE_ROOM'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <i className="fa-solid fa-crown text-sm"></i>
            <span>Tạo Phòng (Host)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('JOIN_ROOM')}
            className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'JOIN_ROOM'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <i className="fa-solid fa-right-to-bracket text-sm"></i>
            <span>Vào Phòng (Co-Host)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {/* 1. SOLO TAB */}
          {activeTab === 'SOLO' && (
            <form onSubmit={handleSoloSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
                <i className="fa-solid fa-circle-info text-amber-400 mt-0.5"></i>
                <div>
                  <strong className="text-amber-300 block mb-0.5">Chế độ 1 Quản trị viên:</strong>
                  Sân khấu 3D sẽ xuất hiện 1 MC duy nhất ở chính giữa. Bạn có thể đặt tên hiển thị cho MC bên dưới.
                </div>
              </div>

              <div>
                <label className="font-oswald font-bold uppercase text-xs text-slate-300 block mb-1.5">
                  Tên MC 3D Hiển Thị:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400">
                    <i className="fa-solid fa-microphone"></i>
                  </span>
                  <input
                    type="text"
                    value={soloMcName}
                    onChange={(e) => setSoloMcName(e.target.value)}
                    placeholder="Ví dụ: MC Phan Long - Trưởng BTC"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-medium text-xs outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Tên MC sẽ được khắc trên bảng tên 3D và thanh đồ họa truyền hình khi bốc thăm.
                </span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-oswald font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                >
                  <span>Tiếp Tục Chọn Giải & Bốc Thăm</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </form>
          )}

          {/* 2. CREATE ROOM TAB */}
          {activeTab === 'CREATE_ROOM' && (
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
                <i className="fa-solid fa-crown text-amber-400 mt-0.5"></i>
                <div>
                  <strong className="text-amber-300 block mb-0.5">Admin 1 (Chủ Phòng):</strong>
                  Bạn sẽ đại diện cho <strong>MC 1 (Vest Trắng Kim Gala)</strong>. Khi Admin 2 kết nối vào mã phòng này, sân khấu sẽ tự động xuất hiện thêm MC thứ 2!
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-oswald font-bold uppercase text-xs text-slate-300 block mb-1">
                    Tên Quản Trị Viên 1:
                  </label>
                  <input
                    type="text"
                    value={hostAdminName}
                    onChange={(e) => setHostAdminName(e.target.value)}
                    placeholder="Admin 1 (Host)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-oswald font-bold uppercase text-xs text-slate-300 block mb-1">
                    Tên MC 1 (Vest Trắng Kim):
                  </label>
                  <input
                    type="text"
                    value={hostMcName}
                    onChange={(e) => setHostMcName(e.target.value)}
                    placeholder="MC Phan Long"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-oswald font-bold uppercase text-xs text-slate-300 block mb-1">
                  Mã Phòng Bốc Thăm (Room Code):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customRoomCode}
                    onChange={(e) => setCustomRoomCode(e.target.value.toUpperCase())}
                    placeholder="SV-8888"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-mono text-sm font-bold tracking-widest outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setCustomRoomCode(generateRoomCode('SAO_VANG'))}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-oswald uppercase flex items-center gap-1.5"
                    title="Tạo mã ngẫu nhiên"
                  >
                    <i className="fa-solid fa-arrows-rotate"></i>
                    <span>Đổi Mã</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Gửi mã này cho Admin thứ 2 để họ kết nối vào bốc chung sân khấu 3D.
                </span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-oswald font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                >
                  <span>Thiết Lập Giải & Mở Phòng</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </form>
          )}

          {/* 3. JOIN ROOM TAB */}
          {activeTab === 'JOIN_ROOM' && (
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-cyan-200/90 leading-relaxed flex items-start gap-2.5">
                <i className="fa-solid fa-right-to-bracket text-cyan-400 mt-0.5"></i>
                <div>
                  <strong className="text-cyan-300 block mb-0.5">Admin 2 (Khách Mời / Co-Host):</strong>
                  Bạn sẽ đại diện cho <strong>MC 2 (Tuxedo Xanh Navy Hoàng Gia)</strong>. Dữ liệu giải đấu và nhóm hạt giống sẽ tự động đồng bộ từ Chủ phòng.
                </div>
              </div>

              <div>
                <label className="font-oswald font-bold uppercase text-xs text-slate-300 block mb-1">
                  Nhập Mã Phòng Từ Chủ Phòng:
                </label>
                <input
                  type="text"
                  value={joinRoomCode}
                  onChange={(e) => {
                    setJoinRoomCode(e.target.value.toUpperCase());
                    setJoinError('');
                  }}
                  placeholder="Ví dụ: SV-8888"
                  className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl p-2.5 text-cyan-300 font-mono text-base font-bold tracking-widest outline-none focus:ring-1 focus:ring-cyan-400 uppercase"
                />
                {joinError && <p className="text-red-400 text-xs mt-1">{joinError}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-oswald font-bold uppercase text-xs text-slate-300 block mb-1">
                    Tên Quản Trị Viên 2:
                  </label>
                  <input
                    type="text"
                    value={guestAdminName}
                    onChange={(e) => setGuestAdminName(e.target.value)}
                    placeholder="Admin 2 (Co-Host)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-oswald font-bold uppercase text-xs text-slate-300 block mb-1">
                    Tên MC 2 (Vest Xanh Navy):
                  </label>
                  <input
                    type="text"
                    value={guestMcName}
                    onChange={(e) => setGuestMcName(e.target.value)}
                    placeholder="MC Minh Quân"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-oswald font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                >
                  <i className="fa-solid fa-plug"></i>
                  <span>Kết Nối Vào Phòng Bốc Thăm</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
