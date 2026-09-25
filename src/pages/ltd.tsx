import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Banner from '../components/banner';
import Footer from '../components/footer';
import Body from '../components/body';
import { StandingsTable } from '../components/StandingsTable';
import { TournamentStatsView } from '../components/TournamentStatsView';
import {
  TournamentData,
  calculateGroupStandings,
  loadTournamentData,
  loadArchiveTournaments,
  fetchAndSyncSaoVangTournament,
  isValidTournament,
} from '../utils/tournamentEngine';
import {
  subscribeTournamentFromFirestore,
  CLOUD_KEYS,
} from '../services/tournamentService';

const Ltd: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [archiveList, setArchiveList] = useState<TournamentData[]>(() => loadArchiveTournaments());

  const [tournament, setTournament] = useState<TournamentData | null>(() => {
    const tourIdParam = new URLSearchParams(window.location.search).get('tourId');
    const archive = loadArchiveTournaments();
    if (tourIdParam) {
      const match = archive.find((t) => t.id === tourIdParam);
      if (match) return match;
    }
    // 1. Check direct active data
    const active = loadTournamentData();
    if (active && isValidTournament(active) && active.isVisible !== false) {
      return active;
    }
    // 2. Check archive for visible tournament
    const visibleInArchive = archive.find((t) => isValidTournament(t) && t.isVisible !== false);
    if (visibleInArchive) {
      return visibleInArchive;
    }
    // If archive is empty and active is null, return null
    return null;
  });

  const [viewStage, setViewStage] = useState<'GROUP' | 'KNOCKOUT' | 'STATS'>(() => {
    const tabParam = searchParams.get('tab') || searchParams.get('stage');
    if (tabParam) {
      const upper = tabParam.toUpperCase();
      if (upper === 'STATS' || upper === 'THONGKE') return 'STATS';
      if (upper === 'KNOCKOUT') return 'KNOCKOUT';
      if (upper === 'GROUP') return 'GROUP';
    }
    if (tournament?.format === 'pure_knockout') return 'KNOCKOUT';
    return tournament?.knockoutStage?.isCompletedGroupStage ? 'KNOCKOUT' : 'GROUP';
  });

  const handleStageChange = (stage: 'GROUP' | 'KNOCKOUT' | 'STATS') => {
    setViewStage(stage);
    const params: { [k: string]: string } = { tab: stage.toLowerCase() };
    if (tournament?.id) params.tourId = tournament.id;
    setSearchParams(params);
  };

  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const [activeRoundFilter, setActiveRoundFilter] = useState<number | 'ALL'>('ALL');
  const [koRoundFilter, setKoRoundFilter] = useState<number | 'ALL'>('ALL');

  useEffect(() => {
    // Initial fetch from cloud
    fetchAndSyncSaoVangTournament().then((cloud) => {
      const currentArchive = loadArchiveTournaments();
      setArchiveList(currentArchive);
      const tourIdParam = searchParams.get('tourId');
      if (tourIdParam) {
        const match = currentArchive.find((t) => t.id === tourIdParam);
        if (match) {
          setTournament(match);
          if (match.format === 'pure_knockout') setViewStage('KNOCKOUT');
          return;
        }
      }
      if (cloud && isValidTournament(cloud) && cloud.isVisible !== false) {
        setTournament(cloud);
        if (cloud.format === 'pure_knockout' || cloud.knockoutStage?.isCompletedGroupStage) {
          setViewStage('KNOCKOUT');
        }
      }
    });

    // Realtime subscription from Cloud
    const unsubscribe = subscribeTournamentFromFirestore<TournamentData>(
      CLOUD_KEYS.SAO_VANG,
      (cloudData) => {
        const currentArchive = loadArchiveTournaments();
        setArchiveList(currentArchive);
        const tourIdParam = searchParams.get('tourId');
        if (tourIdParam) {
          const match = currentArchive.find((t) => t.id === tourIdParam);
          if (match) return;
        }
        if (cloudData && isValidTournament(cloudData) && cloudData.isVisible !== false) {
          setTournament(cloudData);
          if (cloudData.format === 'pure_knockout' || cloudData.knockoutStage?.isCompletedGroupStage) {
            setViewStage('KNOCKOUT');
          }
        }
      }
    );

    const handleStorage = () => {
      const currentArchive = loadArchiveTournaments();
      setArchiveList(currentArchive);
      const tourIdParam = searchParams.get('tourId');
      if (tourIdParam) {
        const match = currentArchive.find((t) => t.id === tourIdParam);
        if (match) {
          setTournament(match);
          return;
        }
      }
      const active = loadTournamentData();
      if (active && isValidTournament(active) && active.isVisible !== false) {
        setTournament(active);
        if (active.format === 'pure_knockout' || active.knockoutStage?.isCompletedGroupStage) {
          setViewStage('KNOCKOUT');
        }
      } else {
        const vis = currentArchive.find((t) => isValidTournament(t) && t.isVisible !== false);
        setTournament(vis || null);
        if (vis?.format === 'pure_knockout' || vis?.knockoutStage?.isCompletedGroupStage) {
          setViewStage('KNOCKOUT');
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
    };
  }, [searchParams]);

  // If no tournament is currently published / active
  if (!tournament || !tournament.isVisible) {
    return (
      <>
        <Banner
          title="LỊCH THI ĐẤU & BẢNG XẾP HẠNG"
          subtitle="Cổng thông tin bảng điểm và lịch trình giải đấu FC Online Sao Vàng Cup ™"
          badge="TOURNAMENT NOTICE"
        />

        <Body>
          <div className="max-w-2xl mx-auto my-12 p-8 sm:p-12 rounded-2xl portal-card text-center bg-white shadow-sm space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl border border-amber-200">
              <i className="fa-solid fa-hourglass-half animate-spin text-xl"></i>
            </div>

            <div className="space-y-2">
              <h2 className="font-oswald text-2xl font-bold uppercase text-slate-900 tracking-wide">
                HIỆN CHƯA CÓ GIẢI ĐẤU NÀO ĐANG DIỄN RA
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Mùa giải trước đã kết thúc thành công. Ban Tổ Chức đang chuẩn bị các công tác thiết lập cho <strong>MÙA GIẢI TIẾP THEO</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 max-w-lg mx-auto">
              📢 Vui lòng theo dõi các thông báo chính thức và lịch đăng ký tham gia trên <strong>Group Facebook</strong> & <strong>Box Messenger</strong> của Sao Vàng Cup!
            </div>

            <div className="pt-2 flex items-center justify-center space-x-3">
              <a
                href="https://www.facebook.com/groups/939885034118607"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-oswald text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Group Facebook
              </a>
              <a
                href="https://m.me/j/AbZDVIVQ5tc8dOpg/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-oswald text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Box Chat Messenger
              </a>
            </div>
          </div>
        </Body>

        <Footer />
      </>
    );
  }

  const activeGroup = (tournament.groups && tournament.groups.length > 0)
    ? (tournament.groups[activeGroupIndex] || tournament.groups[0])
    : null;
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

  const publishedTournaments = archiveList.filter((t) => t.isVisible !== false);

  const koStage = tournament.knockoutStage;

  return (
    <>
      <Banner
        title="LỊCH THI ĐẤU & BẢNG XẾP HẠNG"
        subtitle="Bảng điểm trực tiếp và lịch thi đấu các bảng đấu của giải Sao Vàng Cup ™"
        badge="STANDINGS & FIXTURES"
      />

      <Body>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Season / Tournament Switcher Bar */}
          {publishedTournaments.length > 1 && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-trophy text-amber-500 text-sm"></i>
                <span className="font-oswald text-xs font-bold uppercase tracking-wider text-slate-700">
                  CÁC GIẢI ĐẤU ĐANG DIỄN RA:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {publishedTournaments.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTournament(t);
                      setSearchParams({
                        tourId: t.id,
                        tab: t.format === 'pure_knockout' ? 'knockout' : 'group',
                      });
                      if (t.format === 'pure_knockout') {
                        setViewStage('KNOCKOUT');
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-oswald text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      tournament.id === t.id
                        ? 'bg-emerald-700 text-white shadow-sm font-black'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {t.season || t.tournamentName}
                    {t.format === 'pure_knockout' ? ' (Cúp Knockout 🏆)' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Header Info */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-oswald text-xs font-bold uppercase text-emerald-800 tracking-wider block">
                {tournament.tournamentName} - {tournament.season}
              </span>
              <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-slate-900">
                {viewStage === 'STATS'
                  ? 'SỐ LIỆU THỐNG KÊ TOÀN DIỆN GIẢI ĐẤU'
                  : tournament.format === 'pure_knockout'
                  ? `CÚP LOẠI TRỰC TIẾP (${tournament.totalTeams || (tournament.knockoutStage ? tournament.knockoutStage.rounds[0]?.matches.length * 2 : 16)} HLV) - KNOCKOUT CUP`
                  : tournament.knockoutStage?.isCompletedGroupStage && viewStage === 'KNOCKOUT'
                  ? 'VÒNG LOẠI TRỰC TIẾP (KNOCKOUT STAGE)'
                  : `${tournament.numGroups} BẢNG ĐẤU (${tournament.teamsPerGroup} ĐỘI/BẢNG) - ${tournament.legType === 'double' ? 'VÒNG TRÒN 2 LƯỢT' : 'VÒNG TRÒN 1 LƯỢT'}`}
              </h2>
            </div>
            
            {/* Stage Switcher: Vòng Bảng / Vòng Knockout / Thống Kê */}
            <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {tournament.format !== 'pure_knockout' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('GROUP')}
                  className={`px-3.5 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all flex items-center cursor-pointer ${
                    viewStage === 'GROUP'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <i className="fa-solid fa-list-ol mr-1.5"></i>
                  Vòng Bảng
                </button>
              )}

              <button
                type="button"
                onClick={() => handleStageChange('KNOCKOUT')}
                className={`px-3.5 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all flex items-center cursor-pointer ${
                  viewStage === 'KNOCKOUT'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <i className="fa-solid fa-trophy mr-1.5 text-amber-500"></i>
                {tournament.format === 'pure_knockout' ? 'Cây Nhánh Knockout' : 'Vòng Knockout'}
              </button>

              <button
                type="button"
                onClick={() => handleStageChange('STATS')}
                className={`px-3.5 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all flex items-center cursor-pointer ${
                  viewStage === 'STATS'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <i className="fa-solid fa-chart-column mr-1.5 text-amber-300"></i>
                Thống Kê
              </button>
            </div>
          </div>

          {/* ================= STAGE 1: KNOCKOUT BRACKET VIEW ================= */}
          {viewStage === 'KNOCKOUT' && (
            (koStage && (tournament.format === 'pure_knockout' ? ((koStage.rounds?.length || 0) > 0) : koStage.isCompletedGroupStage)) ? (
            <div className="space-y-8">
              {/* Bracket Tree */}
              <div className="p-6 sm:p-8 rounded-2xl portal-card space-y-6">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm">
                      <i className="fa-solid fa-sitemap"></i>
                    </div>
                    <h3 className="font-oswald text-xl font-bold uppercase text-slate-900">
                      SƠ ĐỒ CÂY VÒNG LOẠI TRỰC TIẾP (KNOCKOUT BRACKET)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Chuẩn phân nhánh FIFA</span>
                </div>

                {/* Mobile Knockout View: Round Selector & Vertical Cards */}
                <div className="block md:hidden space-y-4">
                  {/* Round Selector Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setKoRoundFilter('ALL')}
                      className={`px-3 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-all ${
                        koRoundFilter === 'ALL'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      Tất cả
                    </button>
                    {koStage.rounds?.map((rnd, rIdx) => {
                      const totalRounds = koStage.rounds.length;
                      const label = rnd.name || (
                        rIdx === totalRounds - 1
                          ? 'Chung Kết 🏆'
                          : rIdx === totalRounds - 2
                          ? 'Bán Kết'
                          : rIdx === totalRounds - 3
                          ? 'Tứ Kết'
                          : `Vòng ${rIdx + 1}`
                      );
                      return (
                        <button
                          key={rIdx}
                          type="button"
                          onClick={() => setKoRoundFilter(rIdx)}
                          className={`px-3 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-all ${
                            koRoundFilter === rIdx
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Filtered Rounds & Matches */}
                  <div className="space-y-4">
                    {koStage.rounds
                      ?.map((rnd, rIdx) => ({ rnd, rIdx }))
                      .filter(({ rIdx }) => koRoundFilter === 'ALL' || koRoundFilter === rIdx)
                      .map(({ rnd, rIdx }) => {
                        const totalRounds = koStage.rounds.length;
                        const roundTitle = rnd.name || (
                          rIdx === totalRounds - 1
                            ? 'CHUNG KẾT TRANH NGÔI VƯƠNG'
                            : rIdx === totalRounds - 2
                            ? 'VÒNG BÁN KẾT'
                            : rIdx === totalRounds - 3
                            ? 'VÒNG TỨ KẾT'
                            : `VÒNG ĐẤU #${rIdx + 1}`
                        );

                        return (
                          <div key={rIdx} className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                              <span className="font-oswald text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <i className={`fa-solid ${rIdx === totalRounds - 1 ? 'fa-crown text-amber-500' : 'fa-sitemap text-emerald-600'}`}></i>
                                <span>{roundTitle}</span>
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold">{rnd.matches?.length || 0} Trận</span>
                            </div>

                            <div className="space-y-2.5">
                              {rnd.matches?.map((m) => {
                                const isHomeWinner = m.winnerTeamName && m.winnerTeamName === m.homeTeamName;
                                const isAwayWinner = m.winnerTeamName && m.winnerTeamName === m.awayTeamName;
                                return (
                                  <div
                                    key={m.id}
                                    className="reveal-on-scroll p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
                                  >
                                    <div className="flex items-center justify-between text-[10px] font-oswald border-b border-slate-100 dark:border-slate-800 pb-1.5">
                                      <span className="font-bold text-slate-500 uppercase">Trận #{m.matchOrder}</span>
                                      <span
                                        className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                                          m.played
                                            ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                        }`}
                                      >
                                        {m.played ? "Đã đấu" : "Chờ đấu"}
                                      </span>
                                    </div>

                                    {/* Home Team */}
                                    <div
                                      className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl transition-colors ${
                                        isHomeWinner
                                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-700"
                                          : "text-slate-800 dark:text-slate-200"
                                      }`}
                                    >
                                      <div className="flex items-center space-x-2 truncate pr-2">
                                        {isHomeWinner && <i className="fa-solid fa-check text-emerald-600 text-xs"></i>}
                                        <span className="truncate">{m.homeTeamName}</span>
                                      </div>
                                      <span className="font-oswald font-black text-sm text-slate-900 dark:text-white shrink-0 min-w-[20px] text-right">
                                        {m.homeScore !== null ? m.homeScore : "-"}
                                      </span>
                                    </div>

                                    {/* Away Team */}
                                    <div
                                      className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl transition-colors ${
                                        isAwayWinner
                                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-700"
                                          : "text-slate-800 dark:text-slate-200"
                                      }`}
                                    >
                                      <div className="flex items-center space-x-2 truncate pr-2">
                                        {isAwayWinner && <i className="fa-solid fa-check text-emerald-600 text-xs"></i>}
                                        <span className="truncate">{m.awayTeamName}</span>
                                      </div>
                                      <span className="font-oswald font-black text-sm text-slate-900 dark:text-white shrink-0 min-w-[20px] text-right">
                                        {m.awayScore !== null ? m.awayScore : "-"}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Desktop View: Full 5-Column FIFA Convergence Architecture */}
                <div className="hidden md:block relative w-full max-w-full p-4 sm:p-10 rounded-2xl bg-gradient-to-b from-slate-50 via-emerald-50/20 to-teal-50/30 border border-slate-200 shadow-sm overflow-x-auto overscroll-x-contain">
                  
                  <div className="text-center mb-8">
                    <span className="text-[11px] font-oswald font-bold uppercase tracking-[0.25em] text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">
                      SAO VÀNG CUP ™ TOURNAMENT BRACKET
                    </span>
                    <h2 className="font-oswald text-2xl sm:text-3xl font-bold uppercase tracking-wide text-slate-900 mt-2">
                      CON ĐƯỜNG ĐẾN NGÔI VƯƠNG (PATHWAYS)
                    </h2>
                  </div>

                  {/* 5-Column FIFA Convergence Architecture with SVG Branch Lines */}
                  <div className="relative grid grid-cols-5 gap-3 items-center min-w-[840px]">
                    
                    {/* SVG Connector Overlay for precise branch lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
                      {/* Left QF1 & QF2 to SF1 */}
                      {/* QF1 to SF1 */}
                      <path d="M 18% 28% L 20% 28% L 20% 50% L 21% 50%" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
                      {/* QF2 to SF1 */}
                      <path d="M 18% 72% L 20% 72% L 20% 50% L 21% 50%" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
                      {/* SF1 to Final */}
                      <path d="M 39% 50% L 41% 50%" fill="none" stroke="#f59e0b" strokeWidth="2.5" />

                      {/* Right QF3 & QF4 to SF2 */}
                      {/* QF3 to SF2 */}
                      <path d="M 82% 28% L 80% 28% L 80% 50% L 79% 50%" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
                      {/* QF4 to SF2 */}
                      <path d="M 82% 72% L 80% 72% L 80% 50% L 79% 50%" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
                      {/* SF2 to Final */}
                      <path d="M 61% 50% L 59% 50%" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                    </svg>

                    {/* COL 1: TỨ KẾT 1 & 2 (Nhánh Trái - Pastel Sky Blue nhạt) */}
                    <div className="space-y-6 relative z-10">
                      <div className="text-center pb-1 border-b-2 border-sky-400">
                        <span className="font-oswald font-bold text-xs uppercase tracking-wider text-sky-800">
                          TỨ KẾT 1 & 2
                        </span>
                      </div>
                      
                      {koStage.rounds[0]?.matches.slice(0, 2).map((m) => (
                        <div key={m.id} className="p-3 rounded-xl bg-white border border-sky-200 shadow-sm space-y-1.5 hover:border-sky-400 transition-all">
                          <div className="flex items-center justify-between text-[10px] font-oswald text-sky-700 border-b border-sky-100 pb-1">
                            <span className="font-bold">TRẬN #{m.matchOrder}</span>
                            <span className="bg-sky-50 px-1.5 py-0.2 rounded font-semibold">{m.played ? 'ĐÃ ĐẤU' : 'CHƯA ĐẤU'}</span>
                          </div>
                          {/* Home */}
                          <div className={`flex items-center justify-between text-xs px-2 py-1 rounded ${m.winnerTeamName === m.homeTeamName ? 'bg-sky-100 text-sky-950 font-bold border border-sky-200' : 'text-slate-800'}`}>
                            <span className="truncate pr-1">{m.homeTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-sky-900">{m.homeScore !== null ? m.homeScore : '-'}</span>
                          </div>
                          {/* Away */}
                          <div className={`flex items-center justify-between text-xs px-2 py-1 rounded ${m.winnerTeamName === m.awayTeamName ? 'bg-sky-100 text-sky-950 font-bold border border-sky-200' : 'text-slate-800'}`}>
                            <span className="truncate pr-1">{m.awayTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-sky-900">{m.awayScore !== null ? m.awayScore : '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* COL 2: BÁN KẾT 1 (Nhánh Trái - Pastel Teal nhạt) */}
                    <div className="space-y-4 flex flex-col justify-center relative z-10">
                      <div className="text-center pb-1 border-b-2 border-teal-500">
                        <span className="font-oswald font-bold text-xs uppercase tracking-wider text-teal-900">
                          BÁN KẾT 1
                        </span>
                      </div>
                      {koStage.rounds[1]?.matches.slice(0, 1).map((m) => (
                        <div key={m.id} className="p-3.5 rounded-xl bg-white border-2 border-teal-200 shadow-md space-y-1.5 hover:border-teal-400 transition-all">
                          <div className="flex items-center justify-between text-[10px] font-oswald text-teal-800 border-b border-teal-100 pb-1">
                            <span className="font-bold">BÁN KẾT 1</span>
                            <span className="bg-teal-50 px-1.5 py-0.2 rounded font-semibold">{m.played ? 'ĐÃ ĐẤU' : 'CHỜ ĐẤU'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1 rounded ${m.winnerTeamName === m.homeTeamName ? 'bg-teal-100 text-teal-950 font-bold border border-teal-300' : 'text-slate-800'}`}>
                            <span className="truncate pr-1">{m.homeTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-teal-900">{m.homeScore !== null ? m.homeScore : '-'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1 rounded ${m.winnerTeamName === m.awayTeamName ? 'bg-teal-100 text-teal-950 font-bold border border-teal-300' : 'text-slate-800'}`}>
                            <span className="truncate pr-1">{m.awayTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-teal-900">{m.awayScore !== null ? m.awayScore : '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* COL 3: TRUNG TÂM - CHUNG KẾT CÚP (Vàng Ánh Kim Sang Trọng) */}
                    <div className="space-y-4 flex flex-col justify-center items-center py-2 relative z-10">
                      <div className="w-full text-center pb-1 border-b-2 border-amber-500">
                        <span className="font-oswald font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center justify-center space-x-1">
                          <i className="fa-solid fa-crown text-amber-500"></i>
                          <span>CHUNG KẾT CÚP</span>
                        </span>
                      </div>

                      {/* Final Trophy Box with Golden Floating Animation */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-amber-500/30 animate-float-slow">
                        <i className="fa-solid fa-trophy drop-shadow-md"></i>
                      </div>

                      {/* Final Match Card with Golden Aura */}
                      {koStage.rounds[2]?.matches.map((m) => (
                        <div key={m.id} className="w-full p-4 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50/70 border-2 border-amber-400 shadow-xl neon-ring-pulse card-hover-fx space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] font-oswald text-amber-900 border-b border-amber-200 pb-1">
                            <span className="font-black flex items-center space-x-1">
                              <i className="fa-solid fa-crown text-amber-500 animate-bounce"></i>
                              <span>TRANH NGÔI VƯƠNG</span>
                            </span>
                            <span className="bg-amber-100 px-2 py-0.5 rounded font-bold">{m.played ? 'KẾT THÚC' : 'SẮP DIỄN RA'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg transition-all ${m.winnerTeamName === m.homeTeamName ? 'bg-amber-400 text-slate-950 font-black shadow-xs scale-102' : 'bg-white text-slate-800 border border-slate-200'}`}>
                            <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                            <span className="font-oswald font-bold text-base">{m.homeScore !== null ? m.homeScore : '-'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg transition-all ${m.winnerTeamName === m.awayTeamName ? 'bg-amber-400 text-slate-950 font-black shadow-xs scale-102' : 'bg-white text-slate-800 border border-slate-200'}`}>
                            <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                            <span className="font-oswald font-bold text-base">{m.awayScore !== null ? m.awayScore : '-'}</span>
                          </div>

                          {m.winnerTeamName && (
                            <div className="text-center pt-2 border-t border-amber-200">
                              <span className="text-xs font-oswald font-black text-amber-900 block uppercase tracking-wider animate-pulse">
                                👑 NHÀ VÔ ĐỊCH: {m.winnerTeamName}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* COL 4: BÁN KẾT 2 (Nhánh Phải - Pastel Emerald nhạt) */}
                    <div className="space-y-4 flex flex-col justify-center relative z-10">
                      <div className="text-center pb-1 border-b-2 border-emerald-500">
                        <span className="font-oswald font-bold text-xs uppercase tracking-wider text-emerald-900">
                          BÁN KẾT 2
                        </span>
                      </div>
                      {koStage.rounds[1]?.matches.slice(1, 2).map((m) => (
                        <div key={m.id} className="p-3.5 rounded-xl bg-white border-2 border-emerald-200 shadow-md space-y-1.5 hover:border-emerald-400 transition-all">
                          <div className="flex items-center justify-between text-[10px] font-oswald text-emerald-800 border-b border-emerald-100 pb-1">
                            <span className="font-bold">BÁN KẾT 2</span>
                            <span className="bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">{m.played ? 'ĐÃ ĐẤU' : 'CHỜ ĐẤU'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1 rounded ${m.winnerTeamName === m.homeTeamName ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300' : 'text-slate-800'}`}>
                            <span className="truncate pr-1">{m.homeTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-emerald-900">{m.homeScore !== null ? m.homeScore : '-'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1 rounded ${m.winnerTeamName === m.awayTeamName ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300' : 'text-slate-800'}`}>
                            <span className="truncate pr-1">{m.awayTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-emerald-900">{m.awayScore !== null ? m.awayScore : '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* COL 5: TỨ KẾT 3 & 4 (Nhánh Phải - Pastel Rose nhạt) */}
                    <div className="space-y-6 relative z-10">
                      <div className="text-center pb-1 border-b-2 border-rose-400">
                        <span className="font-oswald font-bold text-xs uppercase tracking-wider text-rose-800">
                          TỨ KẾT 3 & 4
                        </span>
                      </div>
                      {koStage.rounds[0]?.matches.slice(2, 4).map((m) => (
                        <div key={m.id} className="p-3 rounded-xl bg-white border border-rose-200 shadow-sm space-y-1.5 hover:border-rose-400 transition-all">
                          <div className="flex items-center justify-between text-[10px] font-oswald text-rose-700 border-b border-rose-100 pb-1">
                            <span className="font-bold">TRẬN #{m.matchOrder}</span>
                            <span className="bg-rose-50 px-1.5 py-0.2 rounded font-semibold">{m.played ? 'ĐÃ ĐẤU' : 'CHƯA ĐẤU'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1 rounded ${m.winnerTeamName === m.homeTeamName ? 'bg-rose-100 text-rose-950 font-bold border border-rose-200' : 'text-slate-800'}`}>
                            <span className="truncate pr-1">{m.homeTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-rose-900">{m.homeScore !== null ? m.homeScore : '-'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1 rounded ${m.winnerTeamName === m.awayTeamName ? 'bg-rose-100 text-rose-950 font-bold border border-rose-200' : 'text-slate-800'}`}>
                            <span className="truncate pr-1">{m.awayTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-rose-900">{m.awayScore !== null ? m.awayScore : '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </div>
            ) : (
              <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center text-3xl mx-auto">
                  <i className="fa-solid fa-hourglass-half"></i>
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="font-oswald text-xl font-bold uppercase text-slate-900 dark:text-white">
                    Vòng Bảng Đang Diễn Ra
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                    Sơ đồ phân nhánh Vòng Knockout sẽ tự động kích hoạt ngay sau khi các lượt trận vòng bảng khép lại và xác định chính thức các tấm vé đi tiếp!
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleStageChange('GROUP')}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-oswald text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Xem Lịch &amp; BXH Vòng Bảng
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStageChange('STATS')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-oswald text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Xem Thống Kê Giải Đấu
                  </button>
                </div>
              </div>
            )
          )}

          {/* ================= STAGE 2: TOURNAMENT STATS VIEW ================= */}
          {viewStage === 'STATS' && (
            <TournamentStatsView tournament={tournament} theme="emerald" />
          )}

          {/* ================= STAGE 3: GROUP STAGE VIEW ================= */}
          {viewStage === 'GROUP' && (
            !activeGroup ? (
              <div className="p-8 sm:p-12 text-center portal-card bg-white rounded-2xl border border-slate-200 space-y-3">
                <p className="font-oswald text-slate-600 uppercase font-bold text-sm">
                  Giải đấu này theo thể thức Cúp Loại Trực Tiếp (Không có Vòng bảng)
                </p>
                <button
                  type="button"
                  onClick={() => handleStageChange('KNOCKOUT')}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-oswald text-xs font-bold uppercase cursor-pointer"
                >
                  Xem Sơ Đồ Cúp Knockout →
                </button>
              </div>
            ) : (
            <>
              {/* Group Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 w-fit">
                {tournament.groups.map((grp, idx) => (
                  <button
                    key={grp.id}
                    onClick={() => {
                      setActiveGroupIndex(idx);
                      setActiveRoundFilter('ALL');
                    }}
                    className={`px-5 py-2.5 rounded-xl font-oswald text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                      activeGroupIndex === idx
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-700/20'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <i
                      className={`fa-solid fa-layer-group text-xs ${
                        activeGroupIndex === idx ? 'text-amber-300' : 'text-slate-400'
                      }`}
                    ></i>
                    {grp.name}
                  </button>
                ))}
              </div>

              {/* STANDINGS TABLE (BẢNG XẾP HẠNG) */}
              <StandingsTable
                groupName={activeGroup.name}
                standings={standings}
                matches={activeGroup.matches}
                theme="emerald"
                qualificationNote="Top 1 & Top 2 giành vé trực tiếp vào Vòng 16 Đội (Knockout)"
              />

          {/* MATCH FIXTURES */}
          <div className="p-6 sm:p-8 rounded-xl portal-card space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-oswald text-xl font-bold uppercase text-slate-900">
                  LỊCH THI ĐẤU & TỈ SỐ ({activeGroup.name})
                </h3>
                <p className="text-xs text-slate-500">
                  Kết quả thi đấu các lượt trận được cập nhật chính thức từ Ban Tổ Chức
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveRoundFilter('ALL')}
                  className={`px-3 py-1 text-xs font-oswald font-bold uppercase rounded ${
                    activeRoundFilter === 'ALL'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Tất cả vòng
                </button>
                {distinctRounds.map((rnd) => (
                  <button
                    key={rnd}
                    type="button"
                    onClick={() => setActiveRoundFilter(rnd)}
                    className={`px-2.5 py-1 text-xs font-oswald font-bold rounded ${
                      activeRoundFilter === rnd
                        ? 'bg-emerald-700 text-white font-black'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Vòng {rnd}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatches.map((match) => {
                const home = teamMap[match.homeTeamId] || { name: match.homeTeamId };
                const away = teamMap[match.awayTeamId] || { name: match.awayTeamId };

                return (
                  <div
                    key={match.id}
                    className="reveal-on-scroll p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 hover:shadow-md card-hover-fx transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between text-[11px] font-fco font-bold uppercase text-slate-400 border-b border-slate-100 pb-1">
                      <span>VÒNG {match.round}</span>
                      <span
                        className={
                          match.played
                            ? "text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded"
                            : "text-slate-400 bg-slate-100 px-2 py-0.5 rounded"
                        }
                      >
                        {match.played ? "ĐÃ KẾT THÚC" : "CHƯA ĐẤU"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
                      <div className="flex-1 text-right truncate">
                        <span className="text-slate-900 block truncate">{home.name}</span>
                        {home.club && (
                          <span className="text-[10px] text-slate-400 font-normal block truncate">
                            {home.club}
                          </span>
                        )}
                      </div>

                      <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-black font-oswald text-sm sm:text-base flex-shrink-0 min-w-[64px] text-center shadow-xs">
                        {match.played
                          ? `${match.homeScore ?? 0} - ${match.awayScore ?? 0}`
                          : "VS"}
                      </div>

                      <div className="flex-1 text-left truncate">
                        <span className="text-slate-900 block truncate">{away.name}</span>
                        {away.club && (
                          <span className="text-[10px] text-slate-400 font-normal block truncate">
                            {away.club}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
        )
      )}

      </div>
    </Body>

      <Footer />
    </>
  );
};

export default Ltd;
