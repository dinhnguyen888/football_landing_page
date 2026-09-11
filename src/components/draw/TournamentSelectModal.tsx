import React, { useState } from 'react';
import {
  TournamentData,
  fetchAndSyncSaoVangTournament,
  fetchAndSyncArchiveTournaments,
  fetchAndSyncDthenTournament,
  fetchAndSyncArchiveDthenTournaments,
} from '../../utils/tournamentEngine';
import { DrawTeam } from './DrawTypes';

const ADMIN_SECRET_PIN = '020604';
const SESSION_AUTH_KEY = 'admin_portal_authenticated_session';

export type TournamentSystemType = 'SAO_VANG' | 'DTHEN';

export interface SelectedTournamentConfig {
  system: TournamentSystemType;
  tournamentTitle: string;
  subTitle: string;
  season: string;
  numGroups: number;
  teamsPerGroup: number;
  teams: DrawTeam[];
  isSeeded: boolean;
  selectedTournamentData: TournamentData | null;
}

interface TournamentSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: SelectedTournamentConfig) => void;
}

type WizardStep = 'CHOOSE_SYSTEM' | 'ADMIN_LOGIN' | 'CHOOSE_SEASON' | 'CREATE_SEASON' | 'REVIEW_MEMBERS';

export const TournamentSelectModal: React.FC<TournamentSelectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [step, setStep] = useState<WizardStep>('CHOOSE_SYSTEM');
  const [selectedSystem, setSelectedSystem] = useState<TournamentSystemType | null>(null);

  // Admin Auth state
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState('');

  // Seasons state
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(false);
  const [availableSeasons, setAvailableSeasons] = useState<TournamentData[]>([]);
  const [selectedSeasonTour, setSelectedSeasonTour] = useState<TournamentData | null>(null);

  // Custom new season state
  const [newSeasonName, setNewSeasonName] = useState('MÙA 4');
  const [newTourTitle, setNewTourTitle] = useState('SAO VÀNG CUP ™');
  const [numGroupsInput, setNumGroupsInput] = useState(4);
  const [teamsPerGroupInput, setTeamsPerGroupInput] = useState(4);
  const [customMemberList, setCustomMemberList] = useState('');

  // Review & Seed state
  const [membersPool, setMembersPool] = useState<DrawTeam[]>([]);
  const [isSeeded, setIsSeeded] = useState(true);

  // Check if admin is already authenticated in session
  const isAlreadyAuth = sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';

  // Handle System Choice
  const handleSelectSystem = (sys: TournamentSystemType) => {
    setSelectedSystem(sys);
    setPinError('');
    setPin('');

    if (isAlreadyAuth) {
      setStep('CHOOSE_SEASON');
      loadSeasons(sys);
    } else {
      setStep('ADMIN_LOGIN');
    }
  };

  // Handle Admin PIN Login
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === ADMIN_SECRET_PIN) {
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
      setPinError('');
      setStep('CHOOSE_SEASON');
      if (selectedSystem) {
        loadSeasons(selectedSystem);
      }
    } else {
      setPinError('Mã PIN không đúng! Vui lòng nhập đúng mã PIN quản trị.');
    }
  };

  // Load Seasons for Selected System
  const loadSeasons = async (sys: TournamentSystemType) => {
    setIsLoadingSeasons(true);
    const seasonsList: TournamentData[] = [];

    try {
      if (sys === 'SAO_VANG') {
        const [active, archive] = await Promise.all([
          fetchAndSyncSaoVangTournament(),
          fetchAndSyncArchiveTournaments(),
        ]);
        if (active) seasonsList.push(active);
        if (archive && Array.isArray(archive)) {
          archive.forEach((t) => {
            if (!seasonsList.some((existing) => existing.id === t.id)) {
              seasonsList.push(t);
            }
          });
        }
      } else {
        // DTHEN
        const [active, archive] = await Promise.all([
          fetchAndSyncDthenTournament(),
          fetchAndSyncArchiveDthenTournaments(),
        ]);
        if (active) seasonsList.push(active);
        if (archive && Array.isArray(archive)) {
          archive.forEach((t) => {
            if (!seasonsList.some((existing) => existing.id === t.id)) {
              seasonsList.push(t);
            }
          });
        }
      }
    } catch (err) {
      console.warn('Error loading seasons:', err);
    } finally {
      setAvailableSeasons(seasonsList);
      setIsLoadingSeasons(false);
    }
  };

  // Check if a season is unstarted (no matches played yet)
  const isSeasonUnstarted = (tour: TournamentData): boolean => {
    if (!tour.groups || tour.groups.length === 0) return true;
    let playedCount = 0;
    tour.groups.forEach((g) => {
      if (g.matches) {
        playedCount += g.matches.filter((m) => m.played).length;
      }
    });
    return playedCount === 0;
  };

  // Pick an existing season to draw
  const handlePickSeason = (tour: TournamentData) => {
    setSelectedSeasonTour(tour);

    // Extract members from this season
    const teamsList: DrawTeam[] = [];
    let count = 1;
    tour.groups?.forEach((g) => {
      g.teams?.forEach((t) => {
        teamsList.push({
          id: t.id || `team-${count}`,
          name: t.name,
          club: t.club || '',
          pot: Math.min(4, Math.floor((count - 1) / (tour.numGroups || 4)) + 1),
        });
        count++;
      });
    });

    setMembersPool(teamsList);
    setNumGroupsInput(tour.numGroups || 4);
    setTeamsPerGroupInput(tour.teamsPerGroup || 4);
    setStep('REVIEW_MEMBERS');
  };

  // Handle Create New Season to Draw
  const handleProceedCreateSeason = () => {
    const lines = customMemberList
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const totalNeeded = numGroupsInput * teamsPerGroupInput;
    const generatedTeams: DrawTeam[] = [];

    for (let i = 0; i < totalNeeded; i++) {
      if (lines[i]) {
        const parts = lines[i].split('-').map((p) => p.trim());
        generatedTeams.push({
          id: `custom-team-${i + 1}`,
          name: parts[0] || `HLV ${i + 1}`,
          club: parts[1] || 'FC Online',
          pot: Math.min(4, Math.floor(i / numGroupsInput) + 1),
        });
      } else {
        generatedTeams.push({
          id: `custom-team-${i + 1}`,
          name: `HLV ${i + 1}`,
          club: 'CLB Chưa Đăng Ký',
          pot: Math.min(4, Math.floor(i / numGroupsInput) + 1),
        });
      }
    }

    setMembersPool(generatedTeams);
    setSelectedSeasonTour(null); // Indicates brand new tournament
    setStep('REVIEW_MEMBERS');
  };

  // Final confirmation to launch 3D draw
  const handleConfirmLaunch = () => {
    if (!selectedSystem) return;

    const title = selectedSeasonTour
      ? `${selectedSeasonTour.tournamentName} - ${selectedSeasonTour.season}`
      : selectedSystem === 'SAO_VANG'
      ? `${newTourTitle} - ${newSeasonName}`
      : `${newTourTitle} - ${newSeasonName}`;

    const subTitle = selectedSystem === 'SAO_VANG' ? 'SAO VÀNG CUP ™ LIVE CEREMONY' : 'ĐTHÉN FCO ™ LIVE CEREMONY';

    onConfirm({
      system: selectedSystem,
      tournamentTitle: title,
      subTitle,
      season: selectedSeasonTour ? selectedSeasonTour.season : newSeasonName,
      numGroups: numGroupsInput,
      teamsPerGroup: teamsPerGroupInput,
      teams: membersPool,
      isSeeded,
      selectedTournamentData: selectedSeasonTour,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base">
              🏆
            </span>
            <div>
              <h2 className="font-oswald text-lg font-black uppercase tracking-wider text-white">
                TÍCH HỢP BỐC THĂM 3D GIẢI ĐẤU
              </h2>
              <span className="text-[11px] font-mono text-cyan-400 block">
                {step === 'CHOOSE_SYSTEM' && 'BƯỚC 1/4: CHỌN HỆ THỐNG GIẢI ĐẤU'}
                {step === 'ADMIN_LOGIN' && 'BƯỚC 2/4: XÁC THỰC QUYỀN BAN TỔ CHỨC'}
                {step === 'CHOOSE_SEASON' && 'BƯỚC 3/4: CHỌN MÙA GIẢI CHƯA BẮT ĐẦU'}
                {step === 'CREATE_SEASON' && 'BƯỚC 3B: THIẾT LẬP MÙA GIẢI MỚI'}
                {step === 'REVIEW_MEMBERS' && 'BƯỚC 4/4: KIỂM TRA THÀNH VIÊN & HẠT GIỐNG'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* ================= STEP 1: CHOOSE TOURNAMENT SYSTEM ================= */}
          {step === 'CHOOSE_SYSTEM' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Vui lòng chọn hệ thống giải đấu bạn muốn tổ chức lễ bốc thăm 3D:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* SAO VANG CUP */}
                <button
                  type="button"
                  onClick={() => handleSelectSystem('SAO_VANG')}
                  className="p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-500/40 hover:border-amber-400 hover:scale-[1.02] text-left transition-all group cursor-pointer shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-oswald text-xs font-black uppercase">
                      ⭐ SAO VÀNG CUP ™
                    </span>
                    <i className="fa-solid fa-arrow-right text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all"></i>
                  </div>
                  <h3 className="font-oswald text-base font-black uppercase text-white mb-1">
                    Giải Bóng Đá FC Online
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    Sáng lập bởi Admin Phan Long. Bốc thăm chia bảng vòng tròn và vòng đấu loại trực tiếp Knockout.
                  </p>
                </button>

                {/* DTHEN FCO */}
                <button
                  type="button"
                  onClick={() => handleSelectSystem('DTHEN')}
                  className="p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-blue-500/40 hover:border-blue-400 hover:scale-[1.02] text-left transition-all group cursor-pointer shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-oswald text-xs font-black uppercase">
                      ⚡ ĐTHÉN FCO ™
                    </span>
                    <i className="fa-solid fa-arrow-right text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"></i>
                  </div>
                  <h3 className="font-oswald text-base font-black uppercase text-white mb-1">
                    Đấu Trường World Cup
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    Sáng lập bởi Admin Đức Thén. Quy mô chuẩn 32 hoặc 16 HLV, phân bảng và sơ đồ nhánh FIFA.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: ADMIN AUTHENTICATION ================= */}
          {step === 'ADMIN_LOGIN' && (
            <form onSubmit={handleVerifyPin} className="space-y-4 max-w-md mx-auto py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 text-xl flex items-center justify-center mx-auto mb-2">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h3 className="font-oswald text-lg font-black uppercase text-white">
                  XÁC THỰC QUYỀN BAN TỔ CHỨC
                </h3>
                <p className="text-xs text-slate-400">
                  Nhập mã PIN Admin để truy cập dữ liệu giải đấu{' '}
                  <span className="text-amber-400 font-bold uppercase">
                    {selectedSystem === 'SAO_VANG' ? 'Sao Vàng Cup' : 'ĐThén FCO'}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-xs font-oswald font-bold uppercase text-slate-300 block mb-1.5">
                  Mã PIN Bảo Mật:
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Nhập mã PIN Admin..."
                    maxLength={10}
                    autoFocus
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-center tracking-widest text-lg focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                  >
                    <i className={`fa-solid ${showPin ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {pinError && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1.5">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {pinError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('CHOOSE_SYSTEM')}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white font-oswald text-xs uppercase"
                >
                  ← Chọn Lại Giải
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-oswald font-black text-xs uppercase tracking-wider shadow-lg"
                >
                  Xác Nhận PIN →
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 3: CHOOSE UNSTARTED SEASON ================= */}
          {step === 'CHOOSE_SEASON' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="font-oswald text-base font-black uppercase text-white">
                    DANH SÁCH MÙA GIẢI - {selectedSystem === 'SAO_VANG' ? 'SAO VÀNG CUP' : 'ĐTHÉN FCO'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Chọn một mùa giải chưa diễn ra trận nào để tiến hành bốc thăm phân bảng.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNewTourTitle(selectedSystem === 'SAO_VANG' ? 'SAO VÀNG CUP ™' : 'ĐTHÉN FCO ™');
                    setNewSeasonName(`MÙA ${availableSeasons.length + 1}`);
                    setNumGroupsInput(selectedSystem === 'SAO_VANG' ? 4 : 8);
                    setTeamsPerGroupInput(4);
                    setStep('CREATE_SEASON');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-oswald text-xs font-bold uppercase shadow-md flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-plus"></i>
                  Tạo Mùa Mới
                </button>
              </div>

              {isLoadingSeasons ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <i className="fa-solid fa-spinner fa-spin text-2xl text-amber-400"></i>
                  <p className="text-xs font-mono">Đang đồng bộ dữ liệu từ Cloud Firestore...</p>
                </div>
              ) : availableSeasons.length === 0 ? (
                <div className="py-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-xs text-slate-400">Chưa tìm thấy mùa giải nào trên hệ thống.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setNewTourTitle(selectedSystem === 'SAO_VANG' ? 'SAO VÀNG CUP ™' : 'ĐTHÉN FCO ™');
                      setNewSeasonName('MÙA 1');
                      setStep('CREATE_SEASON');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-oswald text-xs font-bold uppercase"
                  >
                    Tạo Mùa Giải Đầu Tiên
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {availableSeasons.map((tour) => {
                    const unstarted = isSeasonUnstarted(tour);
                    const totalTeams = tour.groups?.reduce((acc, g) => acc + (g.teams?.length || 0), 0) || 0;
                    const totalMatches = tour.groups?.reduce((acc, g) => acc + (g.matches?.length || 0), 0) || 0;
                    const playedMatches = tour.groups?.reduce((acc, g) => acc + (g.matches?.filter((m) => m.played).length || 0), 0) || 0;

                    return (
                      <div
                        key={tour.id}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                          unstarted
                            ? 'bg-slate-800/80 border-emerald-500/50 hover:border-emerald-400'
                            : 'bg-slate-950/40 border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-oswald text-sm font-black uppercase text-white">
                              {tour.tournamentName} - {tour.season}
                            </span>
                            {unstarted ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-oswald text-[10px] font-bold uppercase flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                CHƯA BẮT ĐẦU (0 TRẬN)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-oswald text-[10px] font-bold uppercase">
                                ĐÃ ĐẤU {playedMatches}/{totalMatches} TRẬN
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {tour.numGroups} Bảng • {tour.teamsPerGroup} Đội/Bảng ({totalTeams} HLV) • Lượt đấu:{' '}
                            {tour.legType === 'double' ? 'Lượt đi & về' : '1 lượt'}
                          </div>
                        </div>

                        {unstarted ? (
                          <button
                            type="button"
                            onClick={() => handlePickSeason(tour)}
                            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-oswald font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
                          >
                            Chọn Mùa Này →
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Mùa này đã diễn ra ${playedMatches} trận. Bốc thăm lại sẽ xóa sạch tỉ số cũ. Bạn chắc chắn muốn bốc thăm lại?`)) {
                                handlePickSeason(tour);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg border border-red-500/40 hover:bg-red-500/20 text-red-400 font-oswald text-[10px] uppercase font-bold"
                          >
                            Bốc Lại (Cảnh báo)
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3B: CREATE NEW SEASON ================= */}
          {step === 'CREATE_SEASON' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-oswald text-base font-black uppercase text-white">
                    KHỞI TẠO MÙA GIẢI MỚI ĐỂ BỐC THĂM
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Cấu hình giải đấu và danh sách HLV tham gia.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('CHOOSE_SEASON')}
                  className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-oswald uppercase"
                >
                  ← Quay Lại
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-oswald font-bold uppercase text-slate-300 block mb-1">
                    Tên Giải Đấu:
                  </label>
                  <input
                    type="text"
                    value={newTourTitle}
                    onChange={(e) => setNewTourTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="font-oswald font-bold uppercase text-slate-300 block mb-1">
                    Tên Mùa Giải:
                  </label>
                  <input
                    type="text"
                    value={newSeasonName}
                    onChange={(e) => setNewSeasonName(e.target.value)}
                    placeholder="MÙA 4..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="font-oswald font-bold uppercase text-slate-300 block mb-1">
                    Số Bảng Đấu:
                  </label>
                  <select
                    value={numGroupsInput}
                    onChange={(e) => setNumGroupsInput(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value={2}>2 Bảng (A, B)</option>
                    <option value={4}>4 Bảng (A, B, C, D)</option>
                    <option value={8}>8 Bảng (A &rarr; H)</option>
                  </select>
                </div>
                <div>
                  <label className="font-oswald font-bold uppercase text-slate-300 block mb-1">
                    Số Đội / HLV Mỗi Bảng:
                  </label>
                  <select
                    value={teamsPerGroupInput}
                    onChange={(e) => setTeamsPerGroupInput(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value={3}>3 Đội/Bảng</option>
                    <option value={4}>4 Đội/Bảng (Chuẩn)</option>
                    <option value={5}>5 Đội/Bảng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-oswald font-bold uppercase text-slate-300 block mb-1">
                  Dán Danh Sách Thành Viên (Mỗi dòng: Tên HLV - CLB):
                </label>
                <textarea
                  rows={5}
                  value={customMemberList}
                  onChange={(e) => setCustomMemberList(e.target.value)}
                  placeholder={`Ví dụ:\nNguyễn Thành Long - Real Madrid\nTrần Văn Hoàng - Manchester City\nPhạm Đức Duy - Arsenal...`}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-slate-500">
                  Cần tối thiểu {numGroupsInput * teamsPerGroupInput} thành viên cho {numGroupsInput} bảng x {teamsPerGroupInput} đội.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleProceedCreateSeason}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-oswald font-black text-xs uppercase tracking-wider shadow-md"
                >
                  Tiếp Tục →
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: REVIEW MEMBERS & SEED POTS ================= */}
          {step === 'REVIEW_MEMBERS' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-oswald text-base font-black uppercase text-white">
                    DANH SÁCH THÀNH VIÊN SẴN SÀNG ({membersPool.length} HLV)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Kiểm tra phân nhóm hạt giống và bắt đầu vào lễ bốc thăm 3D.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('CHOOSE_SEASON')}
                  className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-oswald uppercase"
                >
                  ← Chọn Lại Mùa
                </button>
              </div>

              {/* Seeded Switch */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-oswald text-xs font-bold uppercase text-white block">
                    Chế Độ Bốc Thăm Hạt Giống (Seeded Pots)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Bốc theo từng Pot (Pot 1 &rarr; Pot 2 &rarr; Pot 3 &rarr; Pot 4) lần lượt vào Bảng A, B, C, D
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSeeded(!isSeeded)}
                  className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase transition-all ${
                    isSeeded
                      ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isSeeded ? 'BẬT (Pots 1-4)' : 'TẮT (Bốc Tự Do)'}
                </button>
              </div>

              {/* Members Grid Preview */}
              <div className="max-h-56 overflow-y-auto border border-slate-800 rounded-xl p-2.5 bg-slate-950/60 space-y-1.5">
                {membersPool.map((team, idx) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-white">{team.name}</span>
                      {team.club && <span className="text-[10px] text-slate-400">({team.club})</span>}
                    </div>
                    {isSeeded && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-oswald font-black text-[10px]">
                        POT {team.pot}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleConfirmLaunch}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-oswald font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                >
                  <i className="fa-solid fa-play"></i>
                  VÀO KHÁN PHÒNG BỐC THĂM 3D
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
