import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout, { AdminTab, TournamentSystem } from '../components/admin/AdminLayout';
import { StandingsTable } from '../components/StandingsTable';
import {
  TournamentData,
  calculateGroupStandings,
  loadTournamentData,
  saveTournamentData,
  createDefaultTournament,
  loadDthenTournamentData,
  saveDthenTournamentData,
  createDefaultDthenTournament,
  generateRoundRobinMatches,
  loadArchiveTournaments,
  saveArchiveTournaments,
  loadArchiveDthenTournaments,
  saveArchiveDthenTournaments,
  buildFIFABracketFromGroups,
  Team,
  Group,
  fetchAndSyncSaoVangTournament,
  fetchAndSyncArchiveTournaments,
  fetchAndSyncDthenTournament,
  fetchAndSyncArchiveDthenTournaments,
} from '../utils/tournamentEngine';
import { isFirebaseConfigured } from '../services/firebase';
import {
  saveTournamentToFirestore,
  getTournamentFromFirestore,
  CLOUD_KEYS,
} from '../services/tournamentService';

const SECRET_PIN = '020604';
const SESSION_AUTH_KEY = 'admin_portal_authenticated_session';
const SESSION_SYSTEM_KEY = 'admin_portal_selected_system';

const AdminPortal: React.FC = () => {
  // Session authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');

  // Selected Tournament System: 'SAO_VANG' | 'DTHEN' | null
  const [selectedSystem, setSelectedSystem] = useState<TournamentSystem | null>(() => {
    const saved = sessionStorage.getItem(SESSION_SYSTEM_KEY);
    return saved === 'SAO_VANG' || saved === 'DTHEN' ? saved : null;
  });

  // Active tab in Admin Dashboard
  const [activeTab, setActiveTab] = useState<AdminTab>('LIST');

  // Cloud sync status
  const [isCloudLoaded, setIsCloudLoaded] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string>('');

  // Active tournament state
  const [tournament, setTournament] = useState<TournamentData>(() => {
    return createDefaultTournament();
  });

  // Archive list of tournaments state
  const [savedTournaments, setSavedTournaments] = useState<TournamentData[]>([]);

  // Match score editing states
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const [activeRoundFilter, setActiveRoundFilter] = useState<number | 'ALL'>('ALL');

  // Create wizard states
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [tourNameInput, setTourNameInput] = useState('SAO VÀNG CUP ™');
  const [seasonInput, setSeasonInput] = useState('MÙA 3');
  const [numGroupsInput, setNumGroupsInput] = useState<number>(4);
  const [teamsPerGroupInput, setTeamsPerGroupInput] = useState<number>(5);
  const [legTypeInput, setLegTypeInput] = useState<'single' | 'double'>('double');
  const [groupTeamsInput, setGroupTeamsInput] = useState<{ name: string; club: string }[][]>([]);

  // Load data for the selected tournament system
  const loadSystemData = useCallback(async (sys: TournamentSystem) => {
    setIsCloudLoaded(false);

    if (sys === 'SAO_VANG') {
      // 1. Local fallback initial load
      const existing = loadTournamentData();
      const initial = existing && existing.groups?.length > 0 ? existing : createDefaultTournament();
      setTournament(initial);

      const archive = loadArchiveTournaments();
      setSavedTournaments(archive.length > 0 ? archive : [initial]);

      // 2. Fetch from Cloud Firestore
      try {
        const cloud = await fetchAndSyncSaoVangTournament();
        if (cloud && cloud.groups?.length > 0) {
          setTournament(cloud);
        }
        const cloudArchive = await fetchAndSyncArchiveTournaments();
        if (cloudArchive && cloudArchive.length > 0) {
          setSavedTournaments(cloudArchive);
        }
      } catch (err) {
        console.warn('Error fetching Sao Vang cloud data:', err);
      }

      setTourNameInput('SAO VÀNG CUP ™');
      setSeasonInput('MÙA 3');
      setNumGroupsInput(4);
      setTeamsPerGroupInput(5);
      setLegTypeInput('double');
    } else {
      // DTHEN system
      const existing = loadDthenTournamentData();
      const initial = existing && existing.groups?.length > 0 ? existing : createDefaultDthenTournament();
      setTournament(initial);

      const archive = loadArchiveDthenTournaments();
      setSavedTournaments(archive.length > 0 ? archive : [initial]);

      // Fetch from Cloud Firestore
      try {
        const cloud = await fetchAndSyncDthenTournament();
        if (cloud && cloud.groups?.length > 0) {
          setTournament(cloud);
        }
        const cloudArchive = await fetchAndSyncArchiveDthenTournaments();
        if (cloudArchive && cloudArchive.length > 0) {
          setSavedTournaments(cloudArchive);
        }
      } catch (err) {
        console.warn('Error fetching Dthen cloud data:', err);
      }

      setTourNameInput('ĐTHÉN FCO ™');
      setSeasonInput('MÙA 2');
      setNumGroupsInput(8);
      setTeamsPerGroupInput(4);
      setLegTypeInput('single');
    }

    setIsCloudLoaded(true);
    setActiveGroupIndex(0);
    setActiveRoundFilter('ALL');
  }, []);

  // When selectedSystem changes, trigger data loading
  useEffect(() => {
    if (selectedSystem) {
      loadSystemData(selectedSystem);
    }
  }, [selectedSystem, loadSystemData]);

  // Synchronize state when active tournament updates (only after initial cloud load)
  useEffect(() => {
    if (!isCloudLoaded || !selectedSystem) return;

    if (selectedSystem === 'SAO_VANG') {
      saveTournamentData(tournament);
    } else {
      saveDthenTournamentData(tournament);
    }
  }, [tournament, isCloudLoaded, selectedSystem]);

  // Synchronize archive state
  useEffect(() => {
    if (!isCloudLoaded || !selectedSystem || savedTournaments.length === 0) return;

    if (selectedSystem === 'SAO_VANG') {
      saveArchiveTournaments(savedTournaments);
    } else {
      saveArchiveDthenTournaments(savedTournaments);
    }
  }, [savedTournaments, isCloudLoaded, selectedSystem]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === SECRET_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
      setPinError('');
    } else {
      setPinError('Mã PIN không chính xác. Vui lòng kiểm tra lại!');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi Admin Portal?')) {
      setIsAuthenticated(false);
      sessionStorage.removeItem(SESSION_AUTH_KEY);
      sessionStorage.removeItem(SESSION_SYSTEM_KEY);
      setSelectedSystem(null);
      setPinInput('');
    }
  };

  // Select tournament system
  const handleSelectSystem = (sys: TournamentSystem) => {
    setSelectedSystem(sys);
    sessionStorage.setItem(SESSION_SYSTEM_KEY, sys);
    setActiveTab('LIST');
  };

  // Return to tournament selection screen
  const handleSwitchSystem = () => {
    setSelectedSystem(null);
    sessionStorage.removeItem(SESSION_SYSTEM_KEY);
  };

  // Manual Push to Cloud Firestore
  const handleManualSync = async () => {
    if (!selectedSystem) return;
    setIsSyncing(true);
    setSyncFeedback('Đang đồng bộ với Cloud Firestore...');
    try {
      const docKey = selectedSystem === 'SAO_VANG' ? CLOUD_KEYS.SAO_VANG : CLOUD_KEYS.DTHEN;
      const archiveKey = selectedSystem === 'SAO_VANG' ? CLOUD_KEYS.ARCHIVE : CLOUD_KEYS.ARCHIVE_DTHEN;

      const successTour = await saveTournamentToFirestore(docKey, tournament);
      const successArchive = await saveTournamentToFirestore(archiveKey, savedTournaments);

      if (successTour && successArchive) {
        setSyncFeedback(`✓ Đã đồng bộ thành công dữ liệu ${tournament.tournamentName} lên Cloud Firestore!`);
      } else if (!isFirebaseConfigured) {
        setSyncFeedback('⚠ Firebase chưa cấu hình biến môi trường, dữ liệu đã lưu an toàn tại Local Storage.');
      } else {
        setSyncFeedback('⚠ Đã gửi lệnh lưu, vui lòng kiểm tra kết nối Firestore.');
      }
    } catch (err) {
      console.error(err);
      setSyncFeedback('❌ Lỗi khi đồng bộ lên Cloud.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(''), 4000);
    }
  };

  // Manual Pull from Cloud Firestore
  const handlePullFromCloud = async () => {
    if (!selectedSystem) return;
    setIsSyncing(true);
    setSyncFeedback('Đang tải dữ liệu mới nhất từ Cloud...');
    try {
      const docKey = selectedSystem === 'SAO_VANG' ? CLOUD_KEYS.SAO_VANG : CLOUD_KEYS.DTHEN;
      const archiveKey = selectedSystem === 'SAO_VANG' ? CLOUD_KEYS.ARCHIVE : CLOUD_KEYS.ARCHIVE_DTHEN;

      const cloudTour = await getTournamentFromFirestore<TournamentData>(docKey);
      const cloudArchive = await getTournamentFromFirestore<TournamentData[]>(archiveKey);

      if (cloudTour) {
        setTournament(cloudTour);
        if (selectedSystem === 'SAO_VANG') {
          saveTournamentData(cloudTour);
        } else {
          saveDthenTournamentData(cloudTour);
        }
      }
      if (cloudArchive && cloudArchive.length > 0) {
        setSavedTournaments(cloudArchive);
        if (selectedSystem === 'SAO_VANG') {
          saveArchiveTournaments(cloudArchive);
        } else {
          saveArchiveDthenTournaments(cloudArchive);
        }
      }
      setSyncFeedback(`✓ Đã tải và cập nhật dữ liệu ${tournament.tournamentName} mới nhất từ Cloud Firestore!`);
    } catch (err) {
      console.error(err);
      setSyncFeedback('❌ Lỗi khi tải dữ liệu từ Cloud.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(''), 4000);
    }
  };

  // Toggle Visibility of a Tournament
  const handleToggleVisibility = (tourId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    const updatedList = savedTournaments.map((t) => {
      if (t.id === tourId) {
        return { ...t, isVisible: newStatus };
      }
      return newStatus ? { ...t, isVisible: false } : t;
    });

    setSavedTournaments(updatedList);

    const activeTour = updatedList.find((t) => t.isVisible);
    if (activeTour) {
      setTournament(activeTour);
      if (selectedSystem === 'SAO_VANG') {
        saveTournamentData(activeTour);
      } else {
        saveDthenTournamentData(activeTour);
      }
    } else {
      const updatedCurr = { ...tournament, isVisible: false };
      setTournament(updatedCurr);
      if (selectedSystem === 'SAO_VANG') {
        saveTournamentData(updatedCurr);
      } else {
        saveDthenTournamentData(updatedCurr);
      }
    }
  };

  // Switch active editing tournament within archive
  const handleSelectTournament = (selected: TournamentData) => {
    setTournament(selected);
    if (selectedSystem === 'SAO_VANG') {
      saveTournamentData(selected);
    } else {
      saveDthenTournamentData(selected);
    }
    setActiveTab('SCORES');
    setActiveGroupIndex(0);
    setActiveRoundFilter('ALL');
  };

  // Delete from archive
  const handleDeleteTournament = (tourId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giải đấu này?')) {
      const list = savedTournaments.filter((t) => t.id !== tourId);
      setSavedTournaments(list);
      if (list.length > 0) {
        setTournament(list[0]);
      }
    }
  };

  // Score change in group matches
  const handleScoreChange = (matchId: string, field: 'homeScore' | 'awayScore', value: string) => {
    const numericValue = value === '' ? null : Math.max(0, parseInt(value, 10));

    const updatedGroups = tournament.groups.map((g, gIdx) => {
      if (gIdx !== activeGroupIndex) return g;

      const updatedMatches = g.matches.map((m) => {
        if (m.id !== matchId) return m;

        const newHomeScore = field === 'homeScore' ? numericValue : m.homeScore;
        const newAwayScore = field === 'awayScore' ? numericValue : m.awayScore;
        const isPlayed = newHomeScore !== null && newAwayScore !== null;

        return {
          ...m,
          homeScore: newHomeScore,
          awayScore: newAwayScore,
          played: isPlayed,
        };
      });

      return {
        ...g,
        matches: updatedMatches,
      };
    });

    const updatedTour: TournamentData = {
      ...tournament,
      groups: updatedGroups,
    };

    setTournament(updatedTour);

    const updatedList = savedTournaments.map((t) => (t.id === tournament.id ? updatedTour : t));
    setSavedTournaments(updatedList);
  };

  // Wizard: Step 1 -> Step 2
  const handleSetupStep2 = () => {
    const initialGroups: { name: string; club: string }[][] = [];
    for (let g = 0; g < numGroupsInput; g++) {
      const teams: { name: string; club: string }[] = [];
      for (let t = 0; t < teamsPerGroupInput; t++) {
        teams.push({
          name: `HLV ${String.fromCharCode(65 + g)}${t + 1}`,
          club: `CLB ${t + 1}`,
        });
      }
      initialGroups.push(teams);
    }
    setGroupTeamsInput(initialGroups);
    setCreateStep(2);
  };

  // Wizard: Change team name/club
  const handleTeamNameChange = (gIdx: number, tIdx: number, field: 'name' | 'club', val: string) => {
    const updated = [...groupTeamsInput];
    updated[gIdx][tIdx][field] = val;
    setGroupTeamsInput(updated);
  };

  // Wizard: Finish create tournament
  const handleFinishCreateTournament = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const groups: Group[] = groupTeamsInput.map((teamsInput, gIdx) => {
      const groupLetter = alphabet[gIdx] || `${gIdx + 1}`;
      const teams: Team[] = teamsInput.map((t, tIdx) => ({
        id: `g${gIdx + 1}_t${tIdx + 1}`,
        name: t.name.trim() || `Đội ${tIdx + 1}`,
        club: t.club.trim() || '',
      }));

      const matches = generateRoundRobinMatches(teams, legTypeInput);

      return {
        id: `group_${gIdx + 1}`,
        name: `BẢNG ${groupLetter}`,
        teams,
        matches,
      };
    });

    const newTour: TournamentData = {
      id: `tour_${selectedSystem?.toLowerCase()}_${Date.now()}`,
      tournamentName: tourNameInput,
      season: seasonInput,
      numGroups: numGroupsInput,
      teamsPerGroup: teamsPerGroupInput,
      legType: legTypeInput,
      groups,
      createdAt: new Date().toISOString(),
      isVisible: true,
    };

    const updatedArchive = savedTournaments.map((t) => ({ ...t, isVisible: false }));
    const finalList = [newTour, ...updatedArchive];

    setTournament(newTour);
    setSavedTournaments(finalList);

    setActiveTab('SCORES');
    setCreateStep(1);
    setActiveGroupIndex(0);
    setActiveRoundFilter('ALL');
    alert(`🎉 Đã tạo giải đấu mới cho ${selectedSystem === 'DTHEN' ? 'ĐThén FCO' : 'Sao Vàng Cup'} & xuất bản thành công!`);
  };

  // Active Group Standings
  const activeGroup = tournament.groups[activeGroupIndex] || tournament.groups[0];
  const standings = activeGroup ? calculateGroupStandings(activeGroup) : [];

  const teamMap = activeGroup
    ? activeGroup.teams.reduce<{ [id: string]: { name: string; club?: string } }>((acc, t) => {
        acc[t.id] = { name: t.name, club: t.club };
        return acc;
      }, {})
    : {};

  const distinctRounds = activeGroup
    ? Array.from(new Set(activeGroup.matches.map((m) => m.round))).sort((a, b) => a - b)
    : [];

  const filteredMatches = activeGroup
    ? activeRoundFilter === 'ALL'
      ? activeGroup.matches
      : activeGroup.matches.filter((m) => m.round === activeRoundFilter)
    : [];

  // ================= 1. RENDER: LOGIN FORM =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070e17] flex flex-col justify-center items-center px-4 py-12 font-sans relative overflow-hidden">
        {/* Background ambient glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 flex items-center justify-center mx-auto text-slate-950 text-2xl font-black shadow-lg shadow-amber-500/25">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-oswald font-black uppercase tracking-widest bg-amber-500/15 text-amber-400 border border-amber-500/30">
                RESTRICTED AREA
              </span>
              <h1 className="font-oswald text-2xl sm:text-3xl font-black uppercase text-white mt-2 tracking-wider">
                CỔNG QUẢN TRỊ BTC
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Hệ thống nội bộ quản lý tất cả giải đấu: <strong>Sao Vàng Cup ™</strong> & <strong>ĐThén FCO ™</strong>
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-oswald font-bold uppercase tracking-wider text-slate-300">
                Nhập Mã PIN Bảo Mật
              </label>
              
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••••"
                  maxLength={12}
                  className="w-full px-4 py-3.5 text-center text-2xl font-mono font-bold tracking-widest bg-slate-950/80 border-2 border-slate-700 rounded-xl text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-sm p-1.5 cursor-pointer"
                  title={showPin ? 'Ẩn PIN' : 'Hiện PIN'}
                >
                  <i className={`fa-solid ${showPin ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>

              {pinError && (
                <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-400 text-xs text-center font-semibold">
                  <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>
                  {pinError}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-oswald text-sm font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 cursor-pointer flex items-center justify-center space-x-2"
            >
              <i className="fa-solid fa-lock-open text-xs"></i>
              <span>MỞ BẢNG ĐIỀU KHIỂN QUẢN TRỊ</span>
            </button>
          </form>

          {/* Quick return link */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <Link
              to="/saovang"
              className="text-xs font-oswald uppercase tracking-wider text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-arrow-left text-[10px]"></i>
              <span>Quay Lại Trang Chủ Giải Đấu</span>
            </Link>
          </div>

        </div>

        <p className="text-slate-600 text-[11px] font-oswald uppercase tracking-wider mt-8 text-center relative z-10">
          Hệ thống bảo mật giải đấu Sao Vàng ™ & ĐThén FCO ™
        </p>
      </div>
    );
  }

  // ================= 2. RENDER: TOURNAMENT SELECTOR HUB =================
  if (!selectedSystem) {
    return (
      <div className="min-h-screen bg-[#070e17] flex flex-col justify-center items-center px-4 py-12 font-sans relative overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 -right-32 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-4xl relative z-10 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-oswald font-black uppercase tracking-widest bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <i className="fa-solid fa-layer-group text-amber-400"></i>
              <span>CHỌN HỆ THỐNG GIẢI ĐẤU</span>
            </div>
            
            <h1 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-wide">
              BẠN MUỐN QUẢN TRỊ GIẢI ĐẤU NÀO?
            </h1>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Hệ thống quản lý thống nhất tất cả các giải đấu. Vui lòng chọn giải đấu bạn muốn cập nhật tỉ số, bảng xếp hạng và vòng knock-out.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: SAO VÀNG CUP */}
            <div
              onClick={() => handleSelectSystem('SAO_VANG')}
              className="group p-8 rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-emerald-950/40 border-2 border-emerald-500/40 hover:border-emerald-400 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1.5 cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-6"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-trophy"></i>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-oswald font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    MÙA 2 ĐANG DIỄN RA
                  </span>
                </div>

                <div>
                  <h2 className="font-oswald text-2xl sm:text-3xl font-black uppercase text-white tracking-wide group-hover:text-emerald-300 transition-colors">
                    SAO VÀNG CUP ™
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    Giải bóng đá điện tử truyền thống Sao Vàng Cup. Quản lý 4 bảng đấu (20 HLV), vòng tròn 2 lượt và cây phân nhánh Tứ kết, Bán kết, Chung kết.
                  </p>
                </div>

                {/* Specs Pill List */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 text-xs font-semibold font-mono">
                    4 Bảng (A-D)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 text-xs font-semibold font-mono">
                    20 HLV
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 text-xs font-semibold font-mono">
                    2 Lượt (Đi/Về)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 text-xs font-semibold font-mono border border-emerald-800/60">
                    Firebase: sao_vang
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:from-emerald-500 group-hover:to-teal-500 text-white font-oswald text-sm font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
              >
                <span>VÀO QUẢN TRỊ SAO VÀNG CUP</span>
                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>

            {/* Card 2: ĐTHÉN FCO */}
            <div
              onClick={() => handleSelectSystem('DTHEN')}
              className="group p-8 rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-blue-950/40 border-2 border-blue-500/40 hover:border-blue-400 transition-all duration-300 shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1.5 cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-6"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-bolt"></i>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-oswald font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    QUY MÔ 32 ĐỘI
                  </span>
                </div>

                <div>
                  <h2 className="font-oswald text-2xl sm:text-3xl font-black uppercase text-white tracking-wide group-hover:text-blue-300 transition-colors">
                    ĐTHÉN FCO ™
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    Giải đấu đỉnh cao ĐThén FCO do Founder Đức Thén sáng lập. Quy mô 8 bảng đấu (32 HLV), thi đấu vòng 1/8, Tứ kết, Bán kết và Chung kết.
                  </p>
                </div>

                {/* Specs Pill List */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 text-xs font-semibold font-mono">
                    8 Bảng (A-H)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 text-xs font-semibold font-mono">
                    32 HLV
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 text-xs font-semibold font-mono">
                    Vòng 1 Lượt
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-950 text-blue-400 text-xs font-semibold font-mono border border-blue-800/60">
                    Firebase: dthen_fco
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-500 group-hover:to-indigo-500 text-white font-oswald text-sm font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
              >
                <span>VÀO QUẢN TRỊ ĐTHÉN FCO</span>
                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>

          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <Link
              to="/"
              className="text-xs font-oswald uppercase tracking-wider text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-layer-group text-[10px]"></i>
              <span>Về Hub Công Khai</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 text-xs font-oswald font-bold uppercase transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
              <span>Đăng Xuất Khỏi Portal</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ================= 3. RENDER: DEDICATED ADMIN DASHBOARD =================
  const isDthen = selectedSystem === 'DTHEN';

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tournamentSystem={selectedSystem}
      onSwitchSystem={handleSwitchSystem}
      tournamentName={tournament.tournamentName}
      season={tournament.season}
      isCloudLoaded={isCloudLoaded}
      isSyncing={isSyncing}
      onSyncCloud={handleManualSync}
      onLogout={handleLogout}
    >
      {/* Sync Feedback Alert */}
      {syncFeedback && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-sm font-medium flex items-center space-x-2 animate-fade-in">
          <i className="fa-solid fa-circle-info"></i>
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* ================= TAB 1: DANH SÁCH GIẢI & BẬT/TẮT HIỂN THỊ ================= */}
      {activeTab === 'LIST' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-oswald font-black uppercase tracking-wider ${
                    isDthen ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {isDthen ? 'HỆ THỐNG ĐTHÉN FCO' : 'HỆ THỐNG SAO VÀNG CUP'}
                  </span>
                </div>
                <h2 className="font-oswald text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white tracking-wide mt-1">
                  DANH SÁCH GIẢI ĐẤU & XUẤT BẢN RA WEB
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Bật công tắc giải đấu bạn muốn xuất bản ra trang Lịch đấu & Bảng xếp hạng cho khán giả.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSwitchSystem}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-oswald text-xs font-bold uppercase tracking-wider shadow-xs flex items-center space-x-1.5 cursor-pointer"
                  title="Chuyển sang quản lý giải đấu khác"
                >
                  <i className="fa-solid fa-repeat"></i>
                  <span>Đổi Giải Đấu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('CREATE')}
                  className={`px-4 py-2 rounded-xl font-oswald text-xs font-black uppercase tracking-wider shadow-sm flex items-center space-x-2 flex-shrink-0 cursor-pointer ${
                    isDthen
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Tạo Giải Mới</span>
                </button>
              </div>
            </div>

            {savedTournaments.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <i className="fa-solid fa-folder-open text-4xl text-slate-400 mb-2 block"></i>
                <p className="font-oswald text-sm uppercase font-bold">Chưa có giải đấu nào trong hệ thống này</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedTournaments.map((tour) => {
                  const isVisible = !!tour.isVisible;

                  return (
                    <div
                      key={tour.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                        isVisible
                          ? isDthen
                            ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800/80 shadow-xs'
                            : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                          : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="space-y-1.5 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                          <h3 className="font-oswald font-bold text-lg text-slate-900 dark:text-white uppercase tracking-wide">
                            {tour.tournamentName} - {tour.season}
                          </h3>
                          {isVisible ? (
                            <span className={`px-2.5 py-0.5 rounded-full text-white text-[11px] font-bold font-oswald uppercase tracking-wider flex items-center space-x-1.5 shadow-2xs ${
                              isDthen ? 'bg-blue-700' : 'bg-emerald-700'
                            }`}>
                              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
                              <span>ĐANG HIỂN THỊ CÔNG KHAI</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold font-oswald uppercase">
                              ĐANG TẮT (ẨN)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {tour.numGroups} Bảng • {tour.teamsPerGroup} Đội/bảng •{' '}
                          {tour.legType === 'double' ? 'Vòng tròn 2 lượt (Đi & Về)' : 'Vòng tròn 1 lượt'}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        {/* Visibility Toggle */}
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs font-oswald font-bold uppercase ${
                              isVisible
                                ? isDthen ? 'text-blue-700 dark:text-blue-400' : 'text-emerald-700 dark:text-emerald-400'
                                : 'text-slate-500'
                            }`}
                          >
                            {isVisible ? 'BẬT' : 'TẮT'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(tour.id, isVisible)}
                            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shadow-inner cursor-pointer ${
                              isVisible
                                ? isDthen ? 'bg-blue-600' : 'bg-emerald-600'
                                : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                                isVisible ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Edit Scores Button */}
                        <button
                          type="button"
                          onClick={() => handleSelectTournament(tour)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-oswald font-bold uppercase flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer ${
                            isDthen
                              ? 'bg-blue-600 hover:bg-blue-500 text-white'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          }`}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                          <span>Chỉnh Tỉ Số</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteTournament(tour.id)}
                          className="p-2 rounded-xl text-rose-500 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
                          title="Xóa giải đấu"
                        >
                          <i className="fa-solid fa-trash text-sm"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: LỊCH ĐẤU & CHỈNH SỬA TỈ SỐ ================= */}
      {activeTab === 'SCORES' && (
        <div className="space-y-6">
          {/* Season Switcher Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-oswald font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              MÙA GIẢI ĐANG CHỌN CHỈNH SỬA:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {savedTournaments.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTournament(t)}
                  className={`px-3.5 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    tournament.id === t.id
                      ? isDthen ? 'bg-blue-600 text-white shadow-sm' : 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {t.season || t.tournamentName}
                  {t.isVisible && ' (Đang bật)'}
                </button>
              ))}
            </div>
          </div>

          {/* Current Tournament Info Header */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-oswald font-bold uppercase text-amber-700 dark:text-amber-400 block">
                ĐANG CHỈNH SỬA KẾT QUẢ CHO GIẢI:
              </span>
              <h2 className="font-oswald text-xl font-black uppercase text-slate-900 dark:text-white">
                {tournament.tournamentName} - {tournament.season}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold font-oswald uppercase ${
                  tournament.isVisible
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                }`}
              >
                {tournament.isVisible ? '✓ Đang xuất bản ra web' : '⚠ Đang ẩn khỏi web'}
              </span>
            </div>
          </div>

          {/* Group Tabs Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            {tournament.groups.map((grp, idx) => (
              <button
                key={grp.id}
                onClick={() => {
                  setActiveGroupIndex(idx);
                  setActiveRoundFilter('ALL');
                }}
                className={`px-5 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeGroupIndex === idx
                    ? isDthen
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {grp.name}
              </button>
            ))}
          </div>

          {/* Live Standings Table */}
          <StandingsTable
            groupName={activeGroup.name}
            standings={standings}
            matches={activeGroup.matches}
            theme={isDthen ? 'blue' : 'emerald'}
            qualificationNote="Top 1 & Top 2 giành quyền vào vòng Knockout"
          />

          {/* Match Score Input Section */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-oswald text-lg font-black uppercase text-slate-900 dark:text-white">
                  ĐIỀN TỈ SỐ TRẬN ĐẤU ({activeGroup.name})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nhập số bàn thắng vào các ô tỉ số bên dưới. Dữ liệu sẽ tự động lưu và đồng bộ tức thì.
                </p>
              </div>

              {/* Round Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveRoundFilter('ALL')}
                  className={`px-3 py-1 text-xs font-oswald font-bold uppercase rounded-lg cursor-pointer ${
                    activeRoundFilter === 'ALL'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Tất cả vòng
                </button>
                {distinctRounds.map((rnd) => (
                  <button
                    key={rnd}
                    type="button"
                    onClick={() => setActiveRoundFilter(rnd)}
                    className={`px-2.5 py-1 text-xs font-oswald font-bold rounded-lg cursor-pointer ${
                      activeRoundFilter === rnd
                        ? isDthen ? 'bg-blue-600 text-white' : 'bg-amber-500 text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Vòng {rnd}
                  </button>
                ))}
              </div>
            </div>

            {/* Matches list */}
            <div className="space-y-3">
              {filteredMatches.map((match) => {
                const home = teamMap[match.homeTeamId] || { name: match.homeTeamId };
                const away = teamMap[match.awayTeamId] || { name: match.awayTeamId };

                return (
                  <div
                    key={match.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 hover:bg-white dark:hover:bg-slate-900 transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-oswald text-xs font-bold uppercase flex-shrink-0">
                      VÒNG {match.round}
                    </span>

                    <div className="flex-1 flex items-center justify-center space-x-3 sm:space-x-6 w-full max-w-xl">
                      <div className="flex-1 text-right">
                        <span className="font-bold text-sm text-slate-900 dark:text-white block leading-tight">
                          {home.name}
                        </span>
                        {home.club && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                            {home.club}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={match.homeScore !== null ? match.homeScore : ''}
                          onChange={(e) => handleScoreChange(match.id, 'homeScore', e.target.value)}
                          placeholder="-"
                          className={`w-12 h-10 text-center font-oswald font-bold text-xl border-2 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 shadow-inner ${
                            isDthen ? 'border-blue-500 focus:ring-blue-400' : 'border-amber-500 focus:ring-amber-400'
                          }`}
                        />
                        <span className="font-bold text-slate-400 text-sm">:</span>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={match.awayScore !== null ? match.awayScore : ''}
                          onChange={(e) => handleScoreChange(match.id, 'awayScore', e.target.value)}
                          placeholder="-"
                          className={`w-12 h-10 text-center font-oswald font-bold text-xl border-2 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 shadow-inner ${
                            isDthen ? 'border-blue-500 focus:ring-blue-400' : 'border-amber-500 focus:ring-amber-400'
                          }`}
                        />
                      </div>

                      <div className="flex-1 text-left">
                        <span className="font-bold text-sm text-slate-900 dark:text-white block leading-tight">
                          {away.name}
                        </span>
                        {away.club && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                            {away.club}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {match.played ? (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                          <i className="fa-solid fa-circle-check"></i>
                          <span>Đã ghi nhận</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Chưa đá</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: VÒNG KNOCK-OUT ================= */}
      {activeTab === 'KNOCKOUT' && (
        <div className="space-y-6">
          {/* Action Bar: Hoàn thành vòng bảng / Tạo cây Knockout */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold font-oswald uppercase border border-amber-500/30">
                <i className="fa-solid fa-sitemap text-amber-400"></i>
                <span>SƠ ĐỒ PHÂN NHÁNH TRỰC TIẾP</span>
              </div>
              <h3 className="font-oswald text-xl font-bold uppercase text-white">
                {tournament.knockoutStage?.isCompletedGroupStage
                  ? '✓ ĐÃ TẠO SƠ ĐỒ KNOCK-OUT TỪ BẢNG ĐIỂM'
                  : 'KẾT THÚC VÒNG BẢNG & TẠO SƠ ĐỒ VÒNG TRỰC TIẾP'}
              </h3>
              <p className="text-xs text-slate-300">
                Hệ thống tự động lấy Top 1 & Top 2 mỗi bảng theo điểm, hiệu số và ghép cặp chéo nhánh (Nhất A vs Nhì B...).
              </p>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  const newBracket = buildFIFABracketFromGroups(tournament.groups);
                  const updatedTour = { ...tournament, knockoutStage: newBracket };
                  setTournament(updatedTour);
                  if (selectedSystem === 'SAO_VANG') {
                    saveTournamentData(updatedTour);
                  } else {
                    saveDthenTournamentData(updatedTour);
                  }
                  const updatedArchive = savedTournaments.map((t) => (t.id === updatedTour.id ? updatedTour : t));
                  setSavedTournaments(updatedArchive);
                  if (selectedSystem === 'SAO_VANG') {
                    saveArchiveTournaments(updatedArchive);
                  } else {
                    saveArchiveDthenTournaments(updatedArchive);
                  }
                  alert(`🏆 Đã tạo và kích hoạt sơ đồ Vòng Loại Trực Tiếp cho ${tournament.tournamentName}!`);
                }}
                className={`px-5 py-2.5 rounded-xl font-oswald text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center space-x-2 ${
                  isDthen
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/30'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/30'
                }`}
              >
                <i className={`fa-solid fa-trophy ${isDthen ? 'text-white' : 'text-slate-950'}`}></i>
                <span>{tournament.knockoutStage?.isCompletedGroupStage ? 'Cập Nhật Lại Cây Knockout' : 'Tạo Cây Knockout Ngay'}</span>
              </button>

              {tournament.knockoutStage?.isCompletedGroupStage && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn mở lại vòng bảng và xóa dữ liệu Knockout?')) {
                      const updatedTour = { ...tournament, knockoutStage: undefined };
                      setTournament(updatedTour);
                      if (selectedSystem === 'SAO_VANG') {
                        saveTournamentData(updatedTour);
                      } else {
                        saveDthenTournamentData(updatedTour);
                      }
                      const updatedArchive = savedTournaments.map((t) => (t.id === updatedTour.id ? updatedTour : t));
                      setSavedTournaments(updatedArchive);
                      if (selectedSystem === 'SAO_VANG') {
                        saveArchiveTournaments(updatedArchive);
                      } else {
                        saveArchiveDthenTournaments(updatedArchive);
                      }
                    }
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-oswald uppercase transition-colors cursor-pointer"
                  title="Xóa sơ đồ Knockout"
                >
                  <i className="fa-solid fa-rotate-left"></i>
                </button>
              )}
            </div>
          </div>

          {/* Knockout Match Editor */}
          {tournament.knockoutStage?.isCompletedGroupStage ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-oswald text-lg font-black uppercase text-slate-900 dark:text-white">
                  ĐIỀN KẾT QUẢ VÒNG LOẠI TRỰC TIẾP ({tournament.tournamentName})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nhập tỉ số trận đấu (nếu hòa có thể nhập thêm tỉ số Penalty). Đội thắng sẽ tự động nhảy vào trận kế tiếp!
                </p>
              </div>

              <div className="space-y-6">
                {tournament.knockoutStage.rounds.map((rnd, rIdx) => (
                  <div key={rIdx} className="space-y-3">
                    <span className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider inline-block ${
                      isDthen ? 'bg-blue-600 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {rnd.name}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rnd.matches.map((kMatch) => {
                        const isDraw =
                          kMatch.homeScore !== null &&
                          kMatch.awayScore !== null &&
                          kMatch.homeScore === kMatch.awayScore;

                        return (
                          <div
                            key={kMatch.id}
                            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 hover:border-amber-400 transition-all space-y-3 shadow-2xs"
                          >
                            <div className="flex items-center justify-between text-xs font-oswald text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1.5">
                              <span className={`font-bold uppercase ${isDthen ? 'text-blue-500' : 'text-amber-600'}`}>
                                TRẬN #{kMatch.matchOrder}
                              </span>
                              <span>{kMatch.roundName}</span>
                            </div>

                            {/* Teams and Score inputs */}
                            <div className="flex items-center justify-between gap-2">
                              {/* Home Team */}
                              <div className="flex-1 text-right">
                                <span
                                  className={`font-bold text-xs sm:text-sm block leading-tight ${
                                    kMatch.winnerTeamName === kMatch.homeTeamName
                                      ? 'text-amber-500 font-black'
                                      : 'text-slate-900 dark:text-white'
                                  }`}
                                >
                                  {kMatch.homeTeamName}
                                </span>
                                <span className="text-[10px] text-slate-500 block">
                                  {kMatch.homeTeamClub ? `(${kMatch.homeTeamClub})` : kMatch.homeSourceText}
                                </span>
                              </div>

                              {/* Score Box */}
                              <div className="flex items-center space-x-1.5 flex-shrink-0">
                                <input
                                  type="number"
                                  min="0"
                                  max="99"
                                  value={kMatch.homeScore !== null ? kMatch.homeScore : ''}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? null : Number(e.target.value);
                                    const updatedRounds = [...tournament.knockoutStage!.rounds];
                                    const curMatch = updatedRounds[rIdx].matches.find((m) => m.id === kMatch.id)!;
                                    curMatch.homeScore = val;
                                    curMatch.played = curMatch.homeScore !== null && curMatch.awayScore !== null;

                                    if (curMatch.played) {
                                      if (curMatch.homeScore! > curMatch.awayScore!) {
                                        curMatch.winnerTeamName = curMatch.homeTeamName;
                                      } else if (curMatch.awayScore! > curMatch.homeScore!) {
                                        curMatch.winnerTeamName = curMatch.awayTeamName;
                                      } else if (curMatch.homePenScore !== null && curMatch.awayPenScore !== null) {
                                        curMatch.winnerTeamName =
                                          curMatch.homePenScore! > curMatch.awayPenScore!
                                            ? curMatch.homeTeamName
                                            : curMatch.awayTeamName;
                                      }
                                    } else {
                                      curMatch.winnerTeamName = undefined;
                                    }

                                    // Propagate to next match if defined
                                    if (curMatch.nextMatchId && curMatch.winnerTeamName) {
                                      for (const round of updatedRounds) {
                                        const nextM = round.matches.find((m) => m.id === curMatch.nextMatchId);
                                        if (nextM) {
                                          if (curMatch.nextMatchSlot === 'home') {
                                            nextM.homeTeamName = curMatch.winnerTeamName;
                                          } else {
                                            nextM.awayTeamName = curMatch.winnerTeamName;
                                          }
                                        }
                                      }
                                    }

                                    const updatedTour: TournamentData = {
                                      ...tournament,
                                      knockoutStage: {
                                        ...tournament.knockoutStage!,
                                        rounds: updatedRounds,
                                      },
                                    };
                                    setTournament(updatedTour);
                                    if (selectedSystem === 'SAO_VANG') {
                                      saveTournamentData(updatedTour);
                                    } else {
                                      saveDthenTournamentData(updatedTour);
                                    }
                                  }}
                                  placeholder="-"
                                  className="w-10 h-9 text-center font-oswald font-bold text-lg border-2 border-amber-500 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                                />
                                <span className="font-bold text-slate-400 text-xs">:</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="99"
                                  value={kMatch.awayScore !== null ? kMatch.awayScore : ''}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? null : Number(e.target.value);
                                    const updatedRounds = [...tournament.knockoutStage!.rounds];
                                    const curMatch = updatedRounds[rIdx].matches.find((m) => m.id === kMatch.id)!;
                                    curMatch.awayScore = val;
                                    curMatch.played = curMatch.homeScore !== null && curMatch.awayScore !== null;

                                    if (curMatch.played) {
                                      if (curMatch.homeScore! > curMatch.awayScore!) {
                                        curMatch.winnerTeamName = curMatch.homeTeamName;
                                      } else if (curMatch.awayScore! > curMatch.homeScore!) {
                                        curMatch.winnerTeamName = curMatch.awayTeamName;
                                      } else if (curMatch.homePenScore !== null && curMatch.awayPenScore !== null) {
                                        curMatch.winnerTeamName =
                                          curMatch.homePenScore! > curMatch.awayPenScore!
                                            ? curMatch.homeTeamName
                                            : curMatch.awayTeamName;
                                      }
                                    } else {
                                      curMatch.winnerTeamName = undefined;
                                    }

                                    if (curMatch.nextMatchId && curMatch.winnerTeamName) {
                                      for (const round of updatedRounds) {
                                        const nextM = round.matches.find((m) => m.id === curMatch.nextMatchId);
                                        if (nextM) {
                                          if (curMatch.nextMatchSlot === 'home') {
                                            nextM.homeTeamName = curMatch.winnerTeamName;
                                          } else {
                                            nextM.awayTeamName = curMatch.winnerTeamName;
                                          }
                                        }
                                      }
                                    }

                                    const updatedTour: TournamentData = {
                                      ...tournament,
                                      knockoutStage: {
                                        ...tournament.knockoutStage!,
                                        rounds: updatedRounds,
                                      },
                                    };
                                    setTournament(updatedTour);
                                    if (selectedSystem === 'SAO_VANG') {
                                      saveTournamentData(updatedTour);
                                    } else {
                                      saveDthenTournamentData(updatedTour);
                                    }
                                  }}
                                  placeholder="-"
                                  className="w-10 h-9 text-center font-oswald font-bold text-lg border-2 border-amber-500 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                                />
                              </div>

                              {/* Away Team */}
                              <div className="flex-1 text-left">
                                <span
                                  className={`font-bold text-xs sm:text-sm block leading-tight ${
                                    kMatch.winnerTeamName === kMatch.awayTeamName
                                      ? 'text-amber-500 font-black'
                                      : 'text-slate-900 dark:text-white'
                                  }`}
                                >
                                  {kMatch.awayTeamName}
                                </span>
                                <span className="text-[10px] text-slate-500 block">
                                  {kMatch.awayTeamClub ? `(${kMatch.awayTeamClub})` : kMatch.awaySourceText}
                                </span>
                              </div>
                            </div>

                            {/* Penalty input if draw */}
                            {isDraw && (
                              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                                <span className="font-oswald text-[11px] uppercase font-bold text-amber-500">
                                  Penalty (PEN):
                                </span>
                                <div className="flex items-center space-x-1.5">
                                  <input
                                    type="number"
                                    min="0"
                                    max="30"
                                    placeholder="Pen H"
                                    value={kMatch.homePenScore !== null && kMatch.homePenScore !== undefined ? kMatch.homePenScore : ''}
                                    onChange={(e) => {
                                      const val = e.target.value === '' ? null : Number(e.target.value);
                                      const updatedRounds = [...tournament.knockoutStage!.rounds];
                                      const curMatch = updatedRounds[rIdx].matches.find((m) => m.id === kMatch.id)!;
                                      curMatch.homePenScore = val;
                                      if (val !== null && curMatch.awayPenScore !== null && curMatch.awayPenScore !== undefined) {
                                        curMatch.winnerTeamName = val > curMatch.awayPenScore ? curMatch.homeTeamName : curMatch.awayTeamName;
                                      }
                                      const updatedTour = { ...tournament, knockoutStage: { ...tournament.knockoutStage!, rounds: updatedRounds } };
                                      setTournament(updatedTour);
                                      if (selectedSystem === 'SAO_VANG') {
                                        saveTournamentData(updatedTour);
                                      } else {
                                        saveDthenTournamentData(updatedTour);
                                      }
                                    }}
                                    className="w-12 h-7 text-center font-mono font-bold text-xs border border-amber-400 rounded bg-white dark:bg-slate-900"
                                  />
                                  <span>-</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max="30"
                                    placeholder="Pen A"
                                    value={kMatch.awayPenScore !== null && kMatch.awayPenScore !== undefined ? kMatch.awayPenScore : ''}
                                    onChange={(e) => {
                                      const val = e.target.value === '' ? null : Number(e.target.value);
                                      const updatedRounds = [...tournament.knockoutStage!.rounds];
                                      const curMatch = updatedRounds[rIdx].matches.find((m) => m.id === kMatch.id)!;
                                      curMatch.awayPenScore = val;
                                      if (val !== null && curMatch.homePenScore !== null && curMatch.homePenScore !== undefined) {
                                        curMatch.winnerTeamName = curMatch.homePenScore > val ? curMatch.homeTeamName : curMatch.awayTeamName;
                                      }
                                      const updatedTour = { ...tournament, knockoutStage: { ...tournament.knockoutStage!, rounds: updatedRounds } };
                                      setTournament(updatedTour);
                                      if (selectedSystem === 'SAO_VANG') {
                                        saveTournamentData(updatedTour);
                                      } else {
                                        saveDthenTournamentData(updatedTour);
                                      }
                                    }}
                                    className="w-12 h-7 text-center font-mono font-bold text-xs border border-amber-400 rounded bg-white dark:bg-slate-900"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Winner announcement */}
                            {kMatch.winnerTeamName && (
                              <div className="text-center pt-1 text-[11px] font-oswald uppercase text-emerald-500 font-bold">
                                🏆 Thắng: <strong>{kMatch.winnerTeamName}</strong>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <i className="fa-solid fa-trophy text-4xl text-slate-400 block"></i>
              <h3 className="font-oswald text-lg font-bold uppercase text-slate-900 dark:text-white">
                Chưa khởi tạo sơ đồ Vòng Knock-out cho {tournament.tournamentName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Sau khi các đội hoàn thành vòng bảng, hãy bấm nút <strong>"Tạo Cây Knockout Ngay"</strong> ở trên để tự động bốc nhánh.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: TẠO GIẢI ĐẤU MỚI ================= */}
      {activeTab === 'CREATE' && (
        <div className="space-y-6">
          {createStep === 1 && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-oswald font-black uppercase tracking-wider ${
                    isDthen ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300'
                  }`}>
                    {isDthen ? 'TẠO GIẢI CHO ĐTHÉN FCO' : 'TẠO GIẢI CHO SAO VÀNG CUP'}
                  </span>
                </div>
                <h2 className="font-oswald text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white mt-1">
                  BƯỚC 1: CẤU HÌNH THỂ THỨC GIẢI ĐẤU
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Thiết lập số bảng, số lượng thành viên mỗi bảng và thể thức thi đấu vòng tròn.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-oswald font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Tên Giải Đấu:
                  </label>
                  <input
                    type="text"
                    value={tourNameInput}
                    onChange={(e) => setTourNameInput(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-oswald font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Mùa Giải:
                  </label>
                  <input
                    type="text"
                    value={seasonInput}
                    onChange={(e) => setSeasonInput(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-oswald font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Số Lượng Bảng Đấu:
                  </label>
                  <select
                    value={numGroupsInput}
                    onChange={(e) => setNumGroupsInput(Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-sm font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value={2}>2 Bảng (A, B)</option>
                    <option value={4}>4 Bảng (A, B, C, D)</option>
                    <option value={8}>8 Bảng (32 Đội)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-oswald font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Số Đội / HLV Mỗi Bảng:
                  </label>
                  <select
                    value={teamsPerGroupInput}
                    onChange={(e) => setTeamsPerGroupInput(Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-sm font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value={3}>3 Đội/bảng</option>
                    <option value={4}>4 Đội/bảng</option>
                    <option value={5}>5 Đội/bảng</option>
                    <option value={6}>6 Đội/bảng</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-oswald font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Thể Thức Vòng Bảng:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 cursor-pointer">
                      <input
                        type="radio"
                        name="legType"
                        checked={legTypeInput === 'double'}
                        onChange={() => setLegTypeInput('double')}
                        className="mr-3 text-amber-500 focus:ring-amber-400"
                      />
                      <div>
                        <strong className="block text-sm font-oswald uppercase text-slate-900 dark:text-white">
                          Vòng tròn 2 lượt (Lượt đi & Lượt về)
                        </strong>
                        <span className="text-xs text-slate-500">Mỗi cặp đấu gặp nhau 2 lần</span>
                      </div>
                    </label>

                    <label className="flex items-center p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 cursor-pointer">
                      <input
                        type="radio"
                        name="legType"
                        checked={legTypeInput === 'single'}
                        onChange={() => setLegTypeInput('single')}
                        className="mr-3 text-amber-500 focus:ring-amber-400"
                      />
                      <div>
                        <strong className="block text-sm font-oswald uppercase text-slate-900 dark:text-white">
                          Vòng tròn 1 lượt
                        </strong>
                        <span className="text-xs text-slate-500">Mỗi cặp đấu chỉ gặp nhau 1 trận</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSetupStep2}
                  className={`px-6 py-2.5 rounded-xl font-oswald text-sm font-bold uppercase tracking-wider cursor-pointer ${
                    isDthen
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  Tiếp Tục Điền Tên Đội →
                </button>
              </div>
            </div>
          )}

          {createStep === 2 && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-oswald text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white">
                    BƯỚC 2: NHẬP TÊN THÀNH VIÊN TỪNG BẢNG
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Điền tên HLV và câu lạc bộ cho từng bảng đấu.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateStep(1)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-oswald font-bold uppercase cursor-pointer"
                >
                  ← Quay Lại
                </button>
              </div>

              <div className="space-y-6">
                {groupTeamsInput.map((teamsInGroup, gIdx) => {
                  const groupLetter = String.fromCharCode(65 + gIdx);
                  return (
                    <div
                      key={gIdx}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <span className={`font-oswald font-bold text-base uppercase block border-b border-slate-200 dark:border-slate-800 pb-1 ${
                        isDthen ? 'text-blue-500' : 'text-amber-500'
                      }`}>
                        BẢNG {groupLetter} ({teamsInGroup.length} Đội)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {teamsInGroup.map((team, tIdx) => (
                          <div
                            key={tIdx}
                            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                          >
                            <input
                              type="text"
                              value={team.name}
                              onChange={(e) => handleTeamNameChange(gIdx, tIdx, 'name', e.target.value)}
                              placeholder={`Tên HLV ${tIdx + 1}`}
                              className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              value={team.club}
                              onChange={(e) => handleTeamNameChange(gIdx, tIdx, 'club', e.target.value)}
                              placeholder="Câu lạc bộ"
                              className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCreateStep(1)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-oswald font-bold uppercase cursor-pointer"
                >
                  ← Quay Lại
                </button>
                <button
                  type="button"
                  onClick={handleFinishCreateTournament}
                  className={`px-6 py-2.5 rounded-xl font-oswald text-sm font-bold uppercase tracking-wider cursor-pointer shadow-md ${
                    isDthen
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
                  }`}
                >
                  HOÀN TẤT & TẠO GIẢI NGAY
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: FIREBASE CLOUD STATUS & SYNC ================= */}
      {activeTab === 'CLOUD' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="font-oswald text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white">
                TRẠNG THÁI CLOUD FIRESTORE & ĐỒNG BỘ DỮ LIỆU ({tournament.tournamentName})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Xem tình trạng kết nối Firebase Cloud Firestore và quản lý đồng bộ dữ liệu giải đấu.
              </p>
            </div>

            {/* Connection Status Card */}
            <div
              className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                isFirebaseConfigured
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                    isFirebaseConfigured
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  <i className={`fa-solid ${isFirebaseConfigured ? 'fa-cloud-arrow-up' : 'fa-database'}`}></i>
                </div>
                <div>
                  <h3 className="font-oswald font-bold text-base uppercase text-slate-900 dark:text-white">
                    {isFirebaseConfigured
                      ? `Firebase Cloud Firestore: ĐÃ KẾT NỐI (Key: ${isDthen ? 'dthen_fco' : 'sao_vang'})`
                      : 'Chế độ Lưu trữ: LOCAL STORAGE (NỘI BỘ)'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {isFirebaseConfigured
                      ? `Mọi thay đổi tỉ số và giải đấu của ${tournament.tournamentName} được lưu tự động lên Google Cloud Firestore theo thời gian thực.`
                      : 'Dữ liệu hiện đang lưu tại trình duyệt máy tính của bạn. Để đồng bộ lên đám mây, hãy cấu hình các biến môi trường Firebase trên Vercel.'}
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-oswald font-bold uppercase flex-shrink-0 ${
                  isFirebaseConfigured
                    ? 'bg-emerald-700 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {isFirebaseConfigured ? 'Online' : 'Offline Mode'}
              </span>
            </div>

            {/* Sync Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
                <h4 className="font-oswald font-bold text-sm uppercase text-slate-900 dark:text-white">
                  Đẩy Dữ Liệu Lên Cloud (Push to Cloud)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ép đẩy giải đấu <strong>{tournament.tournamentName}</strong> hiện tại lên Firestore document <code className="text-amber-500 font-bold">{isDthen ? 'dthen_fco' : 'sao_vang'}</code>.
                </p>
                <button
                  type="button"
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className={`px-4 py-2 rounded-xl text-xs font-oswald font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer ${
                    isDthen
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  <i className={`fa-solid fa-cloud-arrow-up ${isSyncing ? 'fa-spin' : ''}`}></i>
                  <span>{isSyncing ? 'Đang gửi...' : `Đẩy Lên Firestore (${isDthen ? 'ĐThén' : 'Sao Vàng'})`}</span>
                </button>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
                <h4 className="font-oswald font-bold text-sm uppercase text-slate-900 dark:text-white">
                  Tải Dữ Liệu Từ Cloud (Pull from Cloud)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Kéo bản ghi mới nhất từ Cloud Firestore của <strong>{tournament.tournamentName}</strong> về máy ghi đè vào bộ nhớ tạm.
                </p>
                <button
                  type="button"
                  onClick={handlePullFromCloud}
                  disabled={isSyncing}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-oswald text-xs font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer"
                >
                  <i className={`fa-solid fa-cloud-arrow-down ${isSyncing ? 'fa-spin' : ''}`}></i>
                  <span>{isSyncing ? 'Đang tải...' : 'Kéo Về Từ Cloud'}</span>
                </button>
              </div>
            </div>

            {/* Firebase Config Checklist */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 space-y-3">
              <h4 className="font-oswald font-bold text-sm uppercase text-slate-900 dark:text-white">
                Danh sách biến môi trường Firebase (.env)
              </h4>
              <div className="font-mono text-xs text-slate-600 dark:text-slate-400 space-y-1 bg-slate-100 dark:bg-slate-950 p-3 rounded-lg overflow-x-auto">
                <div>REACT_APP_FIREBASE_API_KEY: {process.env.REACT_APP_FIREBASE_API_KEY ? '✓ Có sẵn' : 'Chưa thiết lập'}</div>
                <div>REACT_APP_FIREBASE_AUTH_DOMAIN: {process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? '✓ Có sẵn' : 'Chưa thiết lập'}</div>
                <div>REACT_APP_FIREBASE_PROJECT_ID: {process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✓ Có sẵn' : 'Chưa thiết lập'}</div>
                <div>REACT_APP_FIREBASE_STORAGE_BUCKET: {process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ? '✓ Có sẵn' : 'Chưa thiết lập'}</div>
                <div>REACT_APP_FIREBASE_MESSAGING_SENDER_ID: {process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ? '✓ Có sẵn' : 'Chưa thiết lập'}</div>
                <div>REACT_APP_FIREBASE_APP_ID: {process.env.REACT_APP_FIREBASE_APP_ID ? '✓ Có sẵn' : 'Chưa thiết lập'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPortal;
