import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import Body from '../../components/body';
import { StandingsTable } from '../../components/StandingsTable';
import { TournamentStatsView } from '../../components/TournamentStatsView';
import {
  TournamentData,
  Group,
  calculateGroupStandings,
  loadDthenTournamentData,
  buildFIFABracketFromGroups,
  fetchAndSyncDthenTournament,
  fetchAndSyncArchiveDthenTournaments,
  loadArchiveDthenTournaments,
  isValidTournament,
  isOfficialDthen34,
  createDefaultDthenTournament,
  saveDthenTournamentData,
  saveTournamentBothAsync,
} from '../../utils/tournamentEngine';
import {
  subscribeTournamentFromFirestore,
  CLOUD_KEYS,
} from '../../services/tournamentService';
import { isFirebaseConfigured } from '../../services/firebase';

const DthenLtd: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [archiveList, setArchiveList] = useState<TournamentData[]>(() => loadArchiveDthenTournaments());

  const [tournament, setTournament] = useState<TournamentData | null>(() => {
    const tourIdParam = new URLSearchParams(window.location.search).get('tourId');
    const archive = loadArchiveDthenTournaments();
    if (tourIdParam) {
      const match = archive.find((t) => t.id === tourIdParam);
      if (match) return match;
    }
    const active = loadDthenTournamentData();
    if (active && isOfficialDthen34(active) && active.isVisible !== false) {
      return active;
    }
    const visibleInArchive = archive.find((t) => isOfficialDthen34(t) && t.isVisible !== false);
    if (visibleInArchive) {
      return visibleInArchive;
    }
    return createDefaultDthenTournament();
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
  const [koRoundFilter, setKoRoundFilter] = useState<string>('ALL');
  const [syncStatus, setSyncStatus] = useState<'cloud' | 'local'>('local');

  // Hàm tải và đồng bộ toàn diện từ Cloud Firestore
  const syncFromCloud = async () => {
    try {
      const [data, cloudArchives] = await Promise.all([
        fetchAndSyncDthenTournament(),
        fetchAndSyncArchiveDthenTournaments(),
      ]);

      const effectiveArchives = Array.isArray(cloudArchives) && cloudArchives.length > 0
        ? cloudArchives
        : loadArchiveDthenTournaments();
      setArchiveList(effectiveArchives);

      const tourIdParam = searchParams.get('tourId');
      if (tourIdParam) {
        const match = effectiveArchives.find((t) => t.id === tourIdParam);
        if (match) {
          setTournament(match);
          if (match.format === 'pure_knockout') setViewStage('KNOCKOUT');
          return;
        }
      }

      if (data && isOfficialDthen34(data) && data.isVisible !== false) {
        setTournament(data);
        if (data.format === 'pure_knockout' || data.knockoutStage?.isCompletedGroupStage) {
          setViewStage('KNOCKOUT');
        }
        if (isFirebaseConfigured) setSyncStatus('cloud');
      } else {
        const visibleInArchive = effectiveArchives.find((t) => isOfficialDthen34(t) && t.isVisible !== false);
        if (visibleInArchive) {
          setTournament(visibleInArchive);
          if (visibleInArchive.format === 'pure_knockout' || visibleInArchive.knockoutStage?.isCompletedGroupStage) {
            setViewStage('KNOCKOUT');
          }
        } else {
          const fresh = createDefaultDthenTournament();
          setTournament(fresh);
          setViewStage('KNOCKOUT');
          saveDthenTournamentData(fresh);
          saveTournamentBothAsync(fresh, 'DTHEN');
        }
      }
    } catch (err) {
      console.warn('Sync from cloud error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await syncFromCloud();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  useEffect(() => {
    syncFromCloud();

    // 1. Real-time Cloud listener cho giải Active
    const unsubActive = subscribeTournamentFromFirestore<TournamentData>(
      CLOUD_KEYS.DTHEN,
      (cloudData) => {
        if (!cloudData || !isOfficialDthen34(cloudData) || cloudData.isVisible === false) return;
        const tourIdParam = searchParams.get('tourId');
        if (!tourIdParam || tourIdParam === cloudData.id) {
          setTournament(cloudData);
          if (cloudData.format === 'pure_knockout' || cloudData.knockoutStage?.isCompletedGroupStage) {
            setViewStage('KNOCKOUT');
          }
          setSyncStatus('cloud');
        }
      }
    );

    // 2. Real-time Cloud listener cho Archive
    const unsubArchive = subscribeTournamentFromFirestore<TournamentData[]>(
      CLOUD_KEYS.ARCHIVE_DTHEN,
      (archiveData) => {
        if (Array.isArray(archiveData)) {
          setArchiveList(archiveData);
          const tourIdParam = searchParams.get('tourId');
          if (tourIdParam) {
            const match = archiveData.find((t) => t.id === tourIdParam);
            if (match) {
              setTournament(match);
            }
          } else {
            const vis = archiveData.find((t) => isOfficialDthen34(t) && t.isVisible !== false);
            if (vis) {
              setTournament(vis);
            }
          }
        }
      }
    );

    // 3. Fallback Local storage listener
    const handleStorage = () => {
      const currentArchive = loadArchiveDthenTournaments();
      setArchiveList(currentArchive);
      const tourIdParam = searchParams.get('tourId');
      if (tourIdParam) {
        const match = currentArchive.find((t) => t.id === tourIdParam);
        if (match) {
          setTournament(match);
          return;
        }
      }
      const active = loadDthenTournamentData();
      if (active && isOfficialDthen34(active) && active.isVisible !== false) {
        setTournament(active);
        if (active.format === 'pure_knockout' || active.knockoutStage?.isCompletedGroupStage) {
          setViewStage('KNOCKOUT');
        }
      } else {
        const vis = currentArchive.find((t) => isOfficialDthen34(t) && t.isVisible !== false);
        setTournament(vis || null);
        if (vis?.format === 'pure_knockout' || vis?.knockoutStage?.isCompletedGroupStage) {
          setViewStage('KNOCKOUT');
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      unsubActive();
      unsubArchive();
      window.removeEventListener('storage', handleStorage);
    };
  }, [searchParams]);

  // Loading state when initial cloud fetch is ongoing
  if (isLoading && !tournament) {
    return (
      <>
        <Banner
          title="LỊCH THI ĐẤU & BẢNG XẾP HẠNG"
          subtitle="Cổng thông tin bảng điểm và lịch trình giải đấu FC Online ĐThén FCO ™"
          badge="ĐANG TẢI DỮ LIỆU"
        />
        <Body>
          <div className="max-w-2xl mx-auto my-16 p-10 rounded-2xl portal-card text-center bg-white shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl border border-blue-200">
              <i className="fa-solid fa-spinner animate-spin text-2xl"></i>
            </div>
            <h2 className="font-oswald text-2xl font-bold uppercase text-slate-900 tracking-wide">
              ĐANG ĐỒNG BỘ BẢNG XẾP HẠNG MỚI NHẤT...
            </h2>
            <p className="text-xs text-slate-500">
              Hệ thống đang kết nối trực tiếp với Cloud Firestore để cập nhật tỉ số và BXH trực tiếp.
            </p>
          </div>
        </Body>
        <Footer />
      </>
    );
  }

  if (!tournament || !isOfficialDthen34(tournament) || tournament.isVisible === false) {
    return (
      <>
        <Banner
          title="LỊCH THI ĐẤU & BẢNG XẾP HẠNG"
          subtitle="Cổng thông tin bảng điểm và lịch trình giải đấu FC Online ĐThén FCO ™"
          badge="DTHEN FCO"
        />
        <Body>
          <div className="max-w-2xl mx-auto my-12 p-8 rounded-2xl portal-card text-center bg-white shadow-sm space-y-4">
            <h2 className="font-oswald text-2xl font-bold uppercase text-slate-900">
              ĐANG THIẾT LẬP LỊCH THI ĐẤU
            </h2>
            <p className="text-sm text-slate-600">
              Ban Tổ Chức đang bốc thăm chia bảng và cập nhật danh sách Huấn luyện viên tham dự.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const fresh = createDefaultDthenTournament();
                  setTournament(fresh);
                  setViewStage('KNOCKOUT');
                  saveDthenTournamentData(fresh);
                  saveTournamentBothAsync(fresh, 'DTHEN');
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-oswald text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span>Khôi Phục Giải ĐTHÉN 34 VĐV (Chuẩn Bốc Thăm)</span>
              </button>
            </div>
          </div>
        </Body>
        <Footer />
      </>
    );
  }

  const hasGroups = Array.isArray(tournament.groups) && tournament.groups.length > 0;
  const fallbackGroup: Group = {
    id: 'empty_group',
    name: 'BẢNG ĐẤU',
    teams: [],
    matches: [],
  };
  const currentGroup: Group = (hasGroups && tournament.groups[activeGroupIndex]) || tournament.groups[0] || fallbackGroup;
  const standings = hasGroups ? calculateGroupStandings(currentGroup) : [];

  const roundsInGroup = Array.from(new Set(currentGroup.matches.map((m) => m.round))).sort((a, b) => a - b);

  const filteredMatches =
    activeRoundFilter === 'ALL'
      ? currentGroup.matches
      : currentGroup.matches.filter((m) => m.round === activeRoundFilter);

  const getTeam = (teamId: string) => {
    return currentGroup.teams.find((t) => t.id === teamId) || { id: teamId, name: teamId, club: '' };
  };

  const knockoutStage =
    tournament.knockoutStage || (hasGroups ? buildFIFABracketFromGroups(tournament.groups) : { isCompletedGroupStage: true, rounds: [] });

  const koRounds = knockoutStage.rounds || [];
  const is34Format =
    koRounds.length === 6 ||
    koRounds.some((r) => r.name.includes('PLAY-OFF')) ||
    tournament.totalTeams === 34;

  const playoffMatches = is34Format
    ? (koRounds.find((r) => r.name.includes('PLAY-OFF'))?.matches || [])
    : [];
  const vongloaiMatches = is34Format
    ? (koRounds.find((r) => r.name.includes('LOẠI'))?.matches || [])
    : [];
  const top16Matches = is34Format
    ? (koRounds.find((r) => r.name.includes('TOP 16') || r.name.includes('1/8'))?.matches || [])
    : (koRounds.length >= 4 ? (koRounds[0]?.matches || []) : []);
  const qfMatches = is34Format
    ? (koRounds.find((r) => r.name.includes('TỨ KẾT'))?.matches || [])
    : (koRounds.length >= 4 ? (koRounds[1]?.matches || []) : (koRounds[0]?.matches || []));
  const sfMatches = is34Format
    ? (koRounds.find((r) => r.name.includes('BÁN KẾT'))?.matches || [])
    : (koRounds.length >= 4 ? (koRounds[2]?.matches || []) : (koRounds[1]?.matches || []));
  const finalMatches = is34Format
    ? (koRounds.find((r) => r.name.includes('CHUNG KẾT'))?.matches || [])
    : (koRounds.length >= 4 ? (koRounds[3]?.matches || []) : (koRounds[2]?.matches || []));

  return (
    <>
      <Banner
        title={`LỊCH ĐẤU & BXH - ${tournament.tournamentName}`}
        subtitle={`Theo dõi bảng xếp hạng trực tiếp và lịch thi đấu ${tournament.format === 'pure_knockout' ? 'Cúp Loại Trực Tiếp' : 'các bảng đấu'} ${tournament.season}`}
        badge={tournament.format === 'pure_knockout' ? 'KNOCKOUT CUP' : 'LIVE STANDINGS'}
      />

      <Body>
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Season / Tournament Switcher Bar */}
          {archiveList.filter((t) => t.isVisible !== false).length > 1 && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-trophy text-blue-500 text-sm"></i>
                <span className="font-oswald text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  CÁC MÙA GIẢI ĐTHÉN FCO:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {archiveList.filter((t) => t.isVisible !== false).map((t) => (
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
                        ? 'bg-blue-600 text-white shadow-sm font-black'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t.season || t.tournamentName}
                    {t.format === 'pure_knockout' ? ' (Cúp Knockout 🏆)' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Header Controls: Stage Selector & Status */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300 font-fco font-bold text-xs uppercase">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping mr-1.5"></span>
                {tournament.season} • {tournament.tournamentName}
              </span>
              <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                syncStatus === 'cloud'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                <i className={`fa-solid ${syncStatus === 'cloud' ? 'fa-cloud text-emerald-600 dark:text-emerald-400' : 'fa-database text-slate-500'}`}></i>
                <span>{syncStatus === 'cloud' ? 'Cloud Trực Tiếp' : 'Local'}</span>
              </span>
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-oswald font-bold uppercase text-slate-600 dark:text-slate-300 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                title="Bấm để tải lại dữ liệu mới nhất từ Cloud Firestore"
              >
                <i className={`fa-solid fa-arrows-rotate ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}></i>
                <span>{isRefreshing ? 'Đang tải...' : 'Làm mới'}</span>
              </button>
              <span className="text-[11px] text-slate-500 font-semibold sm:hidden">
                {tournament.format === 'pure_knockout' ? `${tournament.totalTeams || 16} Đội Knockout` : '32 Đội • 8 Bảng'}
              </span>
            </div>

            {/* Stage Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-full sm:w-auto">
              {hasGroups && tournament.format !== 'pure_knockout' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('GROUP')}
                  className={`px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center cursor-pointer ${
                    viewStage === 'GROUP'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <i className="fa-solid fa-list-ol mr-1.5"></i>
                  <span>Vòng Bảng</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleStageChange('KNOCKOUT')}
                className={`px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center cursor-pointer ${
                  viewStage === 'KNOCKOUT'
                    ? 'bg-blue-700 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <i className="fa-solid fa-trophy mr-1.5 text-amber-400"></i>
                <span>{tournament.format === 'pure_knockout' ? 'Cây Knockout' : 'Vòng Knockout'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleStageChange('STATS')}
                className={`px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center cursor-pointer ${
                  viewStage === 'STATS'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <i className="fa-solid fa-chart-column mr-1.5 text-cyan-300"></i>
                <span>THỐNG KÊ</span>
              </button>
            </div>
          </div>

          {viewStage === 'STATS' ? (
            <TournamentStatsView tournament={tournament} theme="blue" />
          ) : viewStage === 'GROUP' ? (
            <>
              {/* Group Tabs: Smooth horizontal swipe on mobile, clean flex-wrap on desktop */}
              <div className="w-full space-y-1.5">
                <div className="flex items-center justify-between px-1 sm:hidden">
                  <span className="text-[11px] font-oswald font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <i className="fa-solid fa-layer-group text-blue-600 dark:text-blue-400"></i>
                    <span>8 BẢNG ĐẤU VÒNG BẢNG</span>
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Vuốt ngang 👉</span>
                </div>
                
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1.5 pt-0.5 px-0.5 justify-start sm:flex-wrap">
                  {tournament.groups.map((grp, idx) => (
                    <button
                      key={grp.id}
                      onClick={() => {
                        setActiveGroupIndex(idx);
                        setActiveRoundFilter('ALL');
                      }}
                      className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex-shrink-0 shadow-2xs ${
                        activeGroupIndex === idx
                          ? 'bg-blue-700 text-white shadow-md scale-105 sm:scale-100'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {grp.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Standings Table */}
              <StandingsTable
                groupName={currentGroup.name}
                standings={standings}
                matches={currentGroup.matches}
                theme="blue"
                qualificationNote="Top 1 & Top 2 giành vé trực tiếp vào Vòng 16 Đội (Knockout)"
              />

              {/* Match Schedule / Results Grid */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="font-oswald text-lg sm:text-xl font-bold uppercase text-slate-900 dark:text-white">
                    LỊCH THI ĐẤU & KẾT QUẢ – {currentGroup.name}
                  </h3>

                  {/* Round Filter */}
                  {roundsInGroup.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setActiveRoundFilter('ALL')}
                        className={`px-3 py-1 rounded-lg text-xs font-oswald font-bold uppercase ${
                          activeRoundFilter === 'ALL'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        TẤT CẢ VÒNG
                      </button>
                      {roundsInGroup.map((r) => (
                        <button
                          key={r}
                          onClick={() => setActiveRoundFilter(r)}
                          className={`px-3 py-1 rounded-lg text-xs font-oswald font-bold uppercase ${
                            activeRoundFilter === r
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          VÒNG {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {filteredMatches.length === 0 ? (
                  <div className="p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-2xl shadow-xs">
                      <i className="fa-regular fa-calendar-xmark"></i>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-oswald text-slate-800 dark:text-white font-bold uppercase text-base tracking-wide">
                        CHƯA CÓ LỊCH THI ĐẤU CHO {currentGroup.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                        Dữ liệu mẫu các trận đấu đã được xóa. Ban Tổ Chức sẽ cập nhật lịch thi đấu và kết quả chính thức ngay khi giải đấu khởi tranh!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMatches.map((m) => {
                      const home = getTeam(m.homeTeamId);
                      const away = getTeam(m.awayTeamId);

                      return (
                        <div
                          key={m.id}
                          className="reveal-on-scroll p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md card-hover-fx transition-all flex flex-col justify-between space-y-3"
                        >
                          <div className="flex items-center justify-between text-[11px] font-fco font-bold uppercase text-slate-400 border-b border-slate-100 pb-1">
                            <span>VÒNG {m.round}</span>
                            <span
                              className={
                                m.played
                                  ? "text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded"
                                  : "text-slate-400 bg-slate-100 px-2 py-0.5 rounded"
                              }
                            >
                              {m.played ? "ĐÃ KẾT THÚC" : "CHƯA ĐẤU"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
                            <div className="flex-1 text-right truncate">
                              <span className="text-slate-900 block truncate">{home.name}</span>
                              {home.club && (
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {home.club}
                                </span>
                              )}
                            </div>

                            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-black font-oswald text-sm sm:text-base flex-shrink-0 min-w-[64px] text-center shadow-xs">
                              {m.played
                                ? `${m.homeScore ?? 0} - ${m.awayScore ?? 0}`
                                : "VS"}
                            </div>

                            <div className="flex-1 text-left truncate">
                              <span className="text-slate-900 block truncate">{away.name}</span>
                              {away.club && (
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {away.club}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Knockout Stage View: Sơ Đồ Phân Nhánh 34 VĐV (2 VĐV Đặc Cách) */
            <div className="space-y-4 sm:space-y-6">
              {/* Header Box */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-fco font-bold text-xs uppercase">
                      <i className="fa-solid fa-trophy mr-1.5 text-amber-500"></i>
                      {is34Format ? 'SƠ ĐỒ 34 VĐV (2 VĐV ĐẶC CÁCH)' : 'SƠ ĐỒ PHÂN NHÁNH TRỰC TIẾP'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-oswald text-[11px] font-bold uppercase">
                      <i className="fa-solid fa-check-double mr-1 text-emerald-500"></i>
                      ĐÃ BỐC THĂM VÒNG 1 & VÒNG 2
                    </span>
                  </div>
                  <h3 className="font-oswald text-xl sm:text-2xl md:text-3xl font-black uppercase text-slate-900 dark:text-white">
                    LỊCH THI ĐẤU & NHÁNH ĐẤU ĐTHÉN FCO ™
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    2 VĐV đặc cách vào thẳng Top 16 • 32 VĐV tranh 14 suất đi tiếp • Thắng 1 trận Top 16 là vào Top 8
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto">
                  <Link
                    to="/admin-portal"
                    className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-oswald text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                    title="Truy cập trang Quản lý giải đấu để nhập tỉ số các trận"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                    <span>CẬP NHẬT TỈ SỐ (ADMIN)</span>
                  </Link>
                  <Link
                    to="/dthen/thethuc"
                    className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-oswald text-xs font-bold uppercase transition-colors"
                    title="Xem chi tiết thể thức thi đấu"
                  >
                    <i className="fa-solid fa-circle-question mr-1.5 text-blue-500"></i>
                    <span>THỂ THỨC</span>
                  </Link>
                </div>
              </div>

              {/* Main Knockout View Container */}
              <div className="w-full max-w-full overflow-hidden p-3 sm:p-6 md:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-sitemap text-blue-600 dark:text-blue-400"></i>
                    <span className="font-oswald text-sm sm:text-base font-bold uppercase text-slate-800 dark:text-slate-200">
                      SƠ ĐỒ HỘI TỤ CHUNG KẾT CÚP (TOURNAMENT BRACKET)
                    </span>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1.5">
                    <i className="fa-solid fa-arrows-left-right"></i>
                    <span>Kéo ngang để xem trọn vẹn 6 giai đoạn thi đấu</span>
                  </span>
                </div>

                {/* Mobile Knockout View: Round Selector & Vertical Cards */}
                <div className="block lg:hidden space-y-4">
                  {/* Round Selector Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setKoRoundFilter('ALL')}
                      className={`px-3 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-all ${
                        koRoundFilter === 'ALL'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      Tất cả các vòng
                    </button>
                    {is34Format && (
                      <>
                        <button
                          type="button"
                          onClick={() => setKoRoundFilter('PLAYOFF')}
                          className={`px-3 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-all ${
                            koRoundFilter === 'PLAYOFF'
                              ? 'bg-orange-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          1. Play-off (4 trận)
                        </button>
                        <button
                          type="button"
                          onClick={() => setKoRoundFilter('VONGLOAI')}
                          className={`px-3 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-all ${
                            koRoundFilter === 'VONGLOAI'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          2. Vòng Loại (14 trận)
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setKoRoundFilter('TOP16')}
                      className={`px-3 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-all ${
                        koRoundFilter === 'TOP16'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      3. Top 16 ({top16Matches.length} trận)
                    </button>
                    <button
                      type="button"
                      onClick={() => setKoRoundFilter('QF')}
                      className={`px-3 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-all ${
                        koRoundFilter === 'QF'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      4. Tứ Kết ({qfMatches.length} trận)
                    </button>
                    <button
                      type="button"
                      onClick={() => setKoRoundFilter('SF')}
                      className={`px-3 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-all ${
                        koRoundFilter === 'SF'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      5. Bán Kết ({sfMatches.length} trận)
                    </button>
                    <button
                      type="button"
                      onClick={() => setKoRoundFilter('FINAL')}
                      className={`px-3 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase whitespace-nowrap transition-all ${
                        koRoundFilter === 'FINAL'
                          ? 'bg-rose-600 text-white font-black shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      6. Chung Kết 🏆
                    </button>
                  </div>

                  {/* Mobile Match List */}
                  <div className="space-y-6">
                    {/* Play-off Matches */}
                    {is34Format && (koRoundFilter === 'ALL' || koRoundFilter === 'PLAYOFF') && playoffMatches.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between px-1">
                          <span className="font-oswald text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                            <i className="fa-solid fa-play"></i>
                            <span>1. VÒNG PLAY-OFF (8 VĐV ➔ LẤY 4 NGƯỜI THẮNG)</span>
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {playoffMatches.map((m, idx) => (
                            <div key={m.id} className="p-3.5 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900/50 shadow-xs space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-oswald border-b border-orange-200 dark:border-orange-900/40 pb-1.5">
                                <span className="font-black text-orange-700 dark:text-orange-300 uppercase">CẶP P{idx + 1}</span>
                                <span className="px-2 py-0.5 rounded font-bold uppercase text-[9px] bg-orange-500 text-white">
                                  THẮNG VÀO T13/T14
                                </span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl ${m.winnerTeamName === m.homeTeamName ? 'bg-orange-100 dark:bg-orange-900/60 font-bold border border-orange-400' : 'bg-white dark:bg-slate-800'}`}>
                                <div className="flex items-center space-x-1.5 truncate">
                                  {m.winnerTeamName === m.homeTeamName && <i className="fa-solid fa-check text-emerald-600"></i>}
                                  <span className="truncate">{m.homeTeamName}</span>
                                </div>
                                <span className="font-oswald font-black text-sm">{m.homeScore !== null ? m.homeScore : '-'}</span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl ${m.winnerTeamName === m.awayTeamName ? 'bg-orange-100 dark:bg-orange-900/60 font-bold border border-orange-400' : 'bg-white dark:bg-slate-800'}`}>
                                <div className="flex items-center space-x-1.5 truncate">
                                  {m.winnerTeamName === m.awayTeamName && <i className="fa-solid fa-check text-emerald-600"></i>}
                                  <span className="truncate">{m.awayTeamName}</span>
                                </div>
                                <span className="font-oswald font-black text-sm">{m.awayScore !== null ? m.awayScore : '-'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Vòng Loại Matches */}
                    {is34Format && (koRoundFilter === 'ALL' || koRoundFilter === 'VONGLOAI') && vongloaiMatches.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between px-1">
                          <span className="font-oswald text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                            <i className="fa-solid fa-filter"></i>
                            <span>2. VÒNG LOẠI (28 VĐV ➔ LẤY 14 NGƯỜI VÀO TOP 16)</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {vongloaiMatches.map((m, idx) => (
                            <div key={m.id} className="p-3 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border-2 border-sky-200 dark:border-sky-900/50 shadow-xs space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-oswald border-b border-sky-200 dark:border-sky-900/40 pb-1">
                                <span className="font-black text-sky-700 dark:text-sky-300 uppercase">TRẬN T{idx + 1}</span>
                                <span className="px-1.5 py-0.5 rounded font-bold uppercase text-[9px] bg-sky-600 text-white">
                                  THẮNG ➔ A{idx + 1}
                                </span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl ${m.winnerTeamName === m.homeTeamName ? 'bg-sky-100 dark:bg-sky-900/60 font-bold border border-sky-400' : 'bg-white dark:bg-slate-800'}`}>
                                <div className="flex items-center space-x-1.5 truncate">
                                  {m.winnerTeamName === m.homeTeamName && <i className="fa-solid fa-check text-emerald-600"></i>}
                                  <span className="truncate">{m.homeTeamName}</span>
                                </div>
                                <span className="font-oswald font-black text-sm">{m.homeScore !== null ? m.homeScore : '-'}</span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl ${m.winnerTeamName === m.awayTeamName ? 'bg-sky-100 dark:bg-sky-900/60 font-bold border border-sky-400' : 'bg-white dark:bg-slate-800'}`}>
                                <div className="flex items-center space-x-1.5 truncate">
                                  {m.winnerTeamName === m.awayTeamName && <i className="fa-solid fa-check text-emerald-600"></i>}
                                  <span className="truncate">{m.awayTeamName}</span>
                                </div>
                                <span className="font-oswald font-black text-sm">{m.awayScore !== null ? m.awayScore : '-'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Top 16 Matches */}
                    {(koRoundFilter === 'ALL' || koRoundFilter === 'TOP16' || koRoundFilter === 'R16') && top16Matches.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between px-1">
                          <span className="font-oswald text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <i className="fa-solid fa-shield-halved"></i>
                            <span>3. VÒNG TOP 16 ({top16Matches.length} TRẬN ➔ TRANH VÉ VÀO TOP 8)</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {top16Matches.map((m, idx) => (
                            <div key={m.id} className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-900/50 shadow-xs space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-oswald border-b border-emerald-200 dark:border-emerald-900/40 pb-1">
                                <span className="font-black text-emerald-700 dark:text-emerald-300 uppercase">TRẬN #{idx + 1}</span>
                                <span className="px-1.5 py-0.5 rounded font-bold uppercase text-[9px] bg-emerald-600 text-white">
                                  VÀO TỨ KẾT
                                </span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl ${m.homeTeamName.includes('Đặc cách') ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-300 font-bold' : m.winnerTeamName === m.homeTeamName ? 'bg-emerald-100 dark:bg-emerald-900/60 font-bold border border-emerald-400' : 'bg-white dark:bg-slate-800'}`}>
                                <div className="flex items-center space-x-1.5 truncate">
                                  {m.homeTeamName.includes('Đặc cách') && <i className="fa-solid fa-star text-rose-500"></i>}
                                  {m.winnerTeamName === m.homeTeamName && <i className="fa-solid fa-check text-emerald-600"></i>}
                                  <span className="truncate">{m.homeTeamName}</span>
                                </div>
                                <span className="font-oswald font-black text-sm">{m.homeScore !== null ? m.homeScore : '-'}</span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl ${m.awayTeamName.includes('Đặc cách') ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-300 font-bold' : m.winnerTeamName === m.awayTeamName ? 'bg-emerald-100 dark:bg-emerald-900/60 font-bold border border-emerald-400' : 'bg-white dark:bg-slate-800'}`}>
                                <div className="flex items-center space-x-1.5 truncate">
                                  {m.awayTeamName.includes('Đặc cách') && <i className="fa-solid fa-star text-rose-500"></i>}
                                  {m.winnerTeamName === m.awayTeamName && <i className="fa-solid fa-check text-emerald-600"></i>}
                                  <span className="truncate">{m.awayTeamName}</span>
                                </div>
                                <span className="font-oswald font-black text-sm">{m.awayScore !== null ? m.awayScore : '-'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quarter-Finals */}
                    {(koRoundFilter === 'ALL' || koRoundFilter === 'QF') && qfMatches.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between px-1">
                          <span className="font-oswald text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                            <i className="fa-solid fa-chess-knight"></i>
                            <span>4. VÒNG TỨ KẾT (4 TRẬN ➔ TRANH VÉ BÁN KẾT)</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {qfMatches.map((m, idx) => (
                            <div key={m.id} className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/50 shadow-xs space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-oswald border-b border-amber-200 dark:border-amber-900/40 pb-1">
                                <span className="font-black text-amber-700 dark:text-amber-300 uppercase">TỨ KẾT Q{idx + 1}</span>
                                <span className="px-1.5 py-0.5 rounded font-bold uppercase text-[9px] bg-amber-500 text-slate-950">
                                  VÀO TOP 4
                                </span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl ${m.winnerTeamName === m.homeTeamName ? 'bg-amber-200 dark:bg-amber-900/60 font-bold border border-amber-400 text-slate-950 dark:text-white' : 'bg-white dark:bg-slate-800'}`}>
                                <span className="truncate">{m.homeTeamName}</span>
                                <span className="font-oswald font-black text-sm">{m.homeScore !== null ? m.homeScore : '-'}</span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl ${m.winnerTeamName === m.awayTeamName ? 'bg-amber-200 dark:bg-amber-900/60 font-bold border border-amber-400 text-slate-950 dark:text-white' : 'bg-white dark:bg-slate-800'}`}>
                                <span className="truncate">{m.awayTeamName}</span>
                                <span className="font-oswald font-black text-sm">{m.awayScore !== null ? m.awayScore : '-'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Semi-Finals */}
                    {(koRoundFilter === 'ALL' || koRoundFilter === 'SF') && sfMatches.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between px-1">
                          <span className="font-oswald text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                            <i className="fa-solid fa-fire"></i>
                            <span>5. VÒNG BÁN KẾT (2 TRẬN ➔ TRANH VÉ CHUNG KẾT)</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {sfMatches.map((m, idx) => (
                            <div key={m.id} className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border-2 border-indigo-200 dark:border-indigo-900/50 shadow-xs space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-oswald border-b border-indigo-200 dark:border-indigo-900/40 pb-1">
                                <span className="font-black text-indigo-700 dark:text-indigo-300 uppercase">BÁN KẾT S{idx + 1}</span>
                                <span className="px-2 py-0.5 rounded font-bold uppercase text-[9px] bg-indigo-600 text-white">
                                  VÀO CHUNG KẾT
                                </span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl ${m.winnerTeamName === m.homeTeamName ? 'bg-indigo-200 dark:bg-indigo-900/60 font-bold border border-indigo-400 text-indigo-950 dark:text-white' : 'bg-white dark:bg-slate-800'}`}>
                                <span className="truncate">{m.homeTeamName}</span>
                                <span className="font-oswald font-black text-sm">{m.homeScore !== null ? m.homeScore : '-'}</span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl ${m.winnerTeamName === m.awayTeamName ? 'bg-indigo-200 dark:bg-indigo-900/60 font-bold border border-indigo-400 text-indigo-950 dark:text-white' : 'bg-white dark:bg-slate-800'}`}>
                                <span className="truncate">{m.awayTeamName}</span>
                                <span className="font-oswald font-black text-sm">{m.awayScore !== null ? m.awayScore : '-'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Final Match */}
                    {(koRoundFilter === 'ALL' || koRoundFilter === 'FINAL') && finalMatches.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between px-1">
                          <span className="font-oswald text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                            <i className="fa-solid fa-crown text-amber-500"></i>
                            <span>6. TRẬN CHUNG KẾT VÔ ĐỊCH ĐTHÉN FCO ™</span>
                          </span>
                        </div>
                        {finalMatches.map((m) => (
                          <div key={m.id} className="p-4 rounded-3xl bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border-2 border-amber-400 dark:border-amber-500 shadow-xl space-y-3">
                            <div className="flex items-center justify-between text-xs font-oswald border-b border-amber-200 dark:border-amber-900/60 pb-2">
                              <span className="font-black text-amber-600 flex items-center gap-1.5">
                                <i className="fa-solid fa-trophy text-amber-500"></i>
                                <span>CHUNG KẾT ĐỈNH CAO</span>
                              </span>
                              <span className="px-2.5 py-0.5 rounded font-black uppercase text-[10px] bg-amber-500 text-slate-950">
                                {m.played ? 'ĐÃ CÓ QUÁN QUÂN' : 'TRANH NGÔI VƯƠNG'}
                              </span>
                            </div>
                            <div className={`flex items-center justify-between text-sm px-3 py-2 rounded-xl ${m.winnerTeamName === m.homeTeamName ? 'bg-amber-200 dark:bg-amber-950 text-slate-950 dark:text-amber-200 font-black border border-amber-400' : 'bg-slate-50 dark:bg-slate-800'}`}>
                              <span className="truncate">{m.homeTeamName}</span>
                              <span className="font-oswald font-black text-base">{m.homeScore !== null ? m.homeScore : '-'}</span>
                            </div>
                            <div className={`flex items-center justify-between text-sm px-3 py-2 rounded-xl ${m.winnerTeamName === m.awayTeamName ? 'bg-amber-200 dark:bg-amber-950 text-slate-950 dark:text-amber-200 font-black border border-amber-400' : 'bg-slate-50 dark:bg-slate-800'}`}>
                              <span className="truncate">{m.awayTeamName}</span>
                              <span className="font-oswald font-black text-base">{m.awayScore !== null ? m.awayScore : '-'}</span>
                            </div>
                            {m.winnerTeamName && (
                              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 text-center font-oswald text-xs font-black uppercase text-amber-900 dark:text-amber-300">
                                👑 NHÀ VÔ ĐỊCH: {m.winnerTeamName} 🏆
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop 6-Stage Sơ Đồ 34 VĐV Interactive Tree */}
                {is34Format ? (
                  <div className="hidden lg:block overflow-x-auto pb-6 overscroll-x-contain">
                    <div className="grid grid-cols-6 gap-3.5 min-w-[1550px] items-start text-center">
                      
                      {/* CỘT 1: 1. VÒNG PLAY-OFF (4 trận P1-P4) */}
                      <div className="space-y-3 p-3 rounded-2xl bg-orange-50/40 dark:bg-orange-950/10 border-2 border-orange-200 dark:border-orange-900/40">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xs">
                          <h4 className="font-oswald font-black text-xs uppercase tracking-wider">
                            1. VÒNG PLAY-OFF
                          </h4>
                          <span className="text-[10px] block opacity-90 font-medium">8 VĐV thi đấu, lấy 4 người thắng</span>
                        </div>

                        <div className="space-y-2.5 pt-1">
                          {playoffMatches.map((m, idx) => (
                            <div key={m.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-900/50 shadow-2xs space-y-1.5 text-left hover:border-orange-400 transition-all">
                              <div className="flex items-center justify-between text-[10px] font-oswald border-b border-orange-100 dark:border-orange-950 pb-1">
                                <span className="font-black px-1.5 py-0.2 rounded bg-orange-500 text-white uppercase">P{idx + 1}</span>
                                <span className="text-[9px] font-bold text-orange-600 dark:text-orange-400 uppercase">➔ W{idx + 1}</span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2 py-1 rounded ${m.winnerTeamName === m.homeTeamName ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-300' : 'bg-slate-50 dark:bg-slate-800'}`}>
                                <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                                <span className="font-oswald font-black text-xs">{m.homeScore !== null ? m.homeScore : '-'}</span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2 py-1 rounded ${m.winnerTeamName === m.awayTeamName ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-300' : 'bg-slate-50 dark:bg-slate-800'}`}>
                                <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                                <span className="font-oswald font-black text-xs">{m.awayScore !== null ? m.awayScore : '-'}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Callout Kết quả Play-off */}
                        <div className="p-2.5 rounded-xl bg-orange-100/70 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-900 text-left text-[10px] space-y-1">
                          <span className="font-oswald font-black uppercase text-orange-900 dark:text-orange-300 block">KẾT QUẢ PLAY-OFF:</span>
                          <p className="text-slate-700 dark:text-slate-300">• 4 người thắng (W1, W2, W3, W4)</p>
                          <p className="text-slate-700 dark:text-slate-300">• Còn 28 VĐV đi tiếp (24 + 4 W)</p>
                        </div>

                        {/* Box 2 VĐV Đặc Cách */}
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-600 text-left space-y-1.5 shadow-xs">
                          <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 font-oswald font-black text-xs uppercase">
                            <i className="fa-solid fa-crown text-amber-500"></i>
                            <span>2 VĐV ĐẶC CÁCH VÀO TOP 16</span>
                          </div>
                          <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-slate-800 dark:text-slate-200">
                            👑 VĐV 1: <span className="text-emerald-700 dark:text-emerald-400 font-black">DTFx18 05 2024</span> (Phạm Quốc Minh)
                          </div>
                          <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-slate-800 dark:text-slate-200">
                            👑 VĐV 2: <span className="text-emerald-700 dark:text-emerald-400 font-black">ĐTFxGNOL04</span> (Phan Long)
                          </div>
                          <p className="text-[10px] text-emerald-800 dark:text-emerald-300 leading-tight pt-1">
                            Không thi đấu Play-off & Vòng loại. Trận đầu tiên của họ là Top 16.
                          </p>
                        </div>
                      </div>

                      {/* CỘT 2: 2. VÒNG LOẠI (14 trận: T1-T14) */}
                      <div className="space-y-3 p-3 rounded-2xl bg-sky-50/40 dark:bg-sky-950/10 border-2 border-sky-200 dark:border-sky-900/40">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-xs">
                          <h4 className="font-oswald font-black text-xs uppercase tracking-wider">
                            2. VÒNG LOẠI
                          </h4>
                          <span className="text-[10px] block opacity-90 font-medium">28 VĐV thi đấu, lấy 14 người thắng</span>
                        </div>

                        <div className="space-y-2 pt-1 max-h-[1050px] overflow-y-auto pr-1">
                          {vongloaiMatches.map((m, idx) => (
                            <div key={m.id} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900/50 shadow-2xs space-y-1 text-left hover:border-sky-400 transition-all">
                              <div className="flex items-center justify-between text-[10px] font-oswald border-b border-sky-100 dark:border-sky-950 pb-0.5">
                                <span className={`px-1.5 py-0.2 rounded font-black text-white uppercase ${idx >= 12 ? 'bg-orange-600' : 'bg-sky-600'}`}>
                                  T{idx + 1}
                                </span>
                                <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 uppercase">➔ A{idx + 1}</span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2 py-0.5 rounded ${m.winnerTeamName === m.homeTeamName ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-300' : 'bg-slate-50 dark:bg-slate-800'}`}>
                                <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                                <span className="font-oswald font-black text-xs">{m.homeScore !== null ? m.homeScore : '-'}</span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2 py-0.5 rounded ${m.winnerTeamName === m.awayTeamName ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-300' : 'bg-slate-50 dark:bg-slate-800'}`}>
                                <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                                <span className="font-oswald font-black text-xs">{m.awayScore !== null ? m.awayScore : '-'}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-2.5 rounded-xl bg-sky-100/70 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-900 text-left text-[10px] space-y-0.5">
                          <span className="font-oswald font-black uppercase text-sky-900 dark:text-sky-300 block">KẾT QUẢ VÒNG LOẠI:</span>
                          <p className="text-slate-700 dark:text-slate-300">• 14 người thắng (A1 – A14)</p>
                          <p className="text-slate-700 dark:text-slate-300">• Cùng với 2 VĐV đặc cách tạo thành 16 VĐV</p>
                        </div>
                      </div>

                      {/* CỘT 3: 3. TOP 16 (8 trận: Trận 1-8) */}
                      <div className="space-y-3 p-3 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/10 border-2 border-emerald-200 dark:border-emerald-900/40">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs">
                          <h4 className="font-oswald font-black text-xs uppercase tracking-wider">
                            3. TOP 16
                          </h4>
                          <span className="text-[10px] block opacity-90 font-medium">8 trận, chọn 8 người vào Top 8</span>
                        </div>

                        <div className="space-y-3.5 pt-1 flex flex-col justify-around">
                          {top16Matches.map((m, idx) => {
                            const isSpecialH = m.homeTeamName.includes('Đặc cách');
                            const isSpecialA = m.awayTeamName.includes('Đặc cách');
                            return (
                              <div key={m.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 shadow-2xs space-y-1.5 text-left hover:border-emerald-400 transition-all">
                                <div className="flex items-center justify-between text-[10px] font-oswald border-b border-emerald-100 dark:border-emerald-950 pb-1">
                                  <span className="font-black px-1.5 py-0.2 rounded bg-emerald-600 text-white uppercase">TRẬN {idx + 1}</span>
                                  <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                                    ➔ TỨ KẾT {Math.floor(idx / 2) + 1}
                                  </span>
                                </div>
                                <div className={`flex items-center justify-between text-xs px-2 py-1 rounded ${isSpecialH ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-black border border-rose-300' : m.winnerTeamName === m.homeTeamName ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-300' : 'bg-slate-50 dark:bg-slate-800'}`}>
                                  <div className="flex items-center space-x-1.5 truncate pr-1">
                                    {isSpecialH && <i className="fa-solid fa-crown text-amber-500 text-[10px]"></i>}
                                    <span className="truncate font-semibold">{m.homeTeamName}</span>
                                  </div>
                                  <span className="font-oswald font-black text-xs">{m.homeScore !== null ? m.homeScore : '-'}</span>
                                </div>
                                <div className={`flex items-center justify-between text-xs px-2 py-1 rounded ${isSpecialA ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-black border border-rose-300' : m.winnerTeamName === m.awayTeamName ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-300' : 'bg-slate-50 dark:bg-slate-800'}`}>
                                  <div className="flex items-center space-x-1.5 truncate pr-1">
                                    {isSpecialA && <i className="fa-solid fa-crown text-amber-500 text-[10px]"></i>}
                                    <span className="truncate font-semibold">{m.awayTeamName}</span>
                                  </div>
                                  <span className="font-oswald font-black text-xs">{m.awayScore !== null ? m.awayScore : '-'}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* CỘT 4: 4. TOP 8 / TỨ KẾT (4 trận Q1-Q4) */}
                      <div className="space-y-3 p-3 rounded-2xl bg-amber-50/40 dark:bg-amber-950/10 border-2 border-amber-200 dark:border-amber-900/40 h-full flex flex-col justify-around">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black shadow-xs">
                          <h4 className="font-oswald font-black text-xs uppercase tracking-wider">
                            4. TOP 8 (TỨ KẾT)
                          </h4>
                          <span className="text-[10px] block opacity-90 font-medium">4 trận, chọn 4 người vào Top 4</span>
                        </div>

                        <div className="space-y-12 py-6 flex flex-col justify-around">
                          {qfMatches.map((m, idx) => (
                            <div key={m.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-2xs space-y-1.5 text-left hover:border-amber-400 transition-all">
                              <div className="flex items-center justify-between text-[10px] font-oswald border-b border-amber-100 dark:border-amber-950 pb-1">
                                <span className="font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 uppercase">TỨ KẾT {idx + 1} (Q{idx + 1})</span>
                                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase">➔ BÁN KẾT {idx < 2 ? '1' : '2'}</span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2 py-1 rounded ${m.winnerTeamName === m.homeTeamName ? 'bg-amber-100 dark:bg-amber-900/60 font-bold border border-amber-400 text-slate-950 dark:text-white' : 'bg-slate-50 dark:bg-slate-800'}`}>
                                <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                                <span className="font-oswald font-black text-xs">{m.homeScore !== null ? m.homeScore : '-'}</span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2 py-1 rounded ${m.winnerTeamName === m.awayTeamName ? 'bg-amber-100 dark:bg-amber-900/60 font-bold border border-amber-400 text-slate-950 dark:text-white' : 'bg-slate-50 dark:bg-slate-800'}`}>
                                <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                                <span className="font-oswald font-black text-xs">{m.awayScore !== null ? m.awayScore : '-'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CỘT 5: 5. TOP 4 / BÁN KẾT (2 trận S1-S2) */}
                      <div className="space-y-3 p-3 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/10 border-2 border-indigo-200 dark:border-indigo-900/40 h-full flex flex-col justify-around">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xs">
                          <h4 className="font-oswald font-black text-xs uppercase tracking-wider">
                            5. TOP 4 (BÁN KẾT)
                          </h4>
                          <span className="text-[10px] block opacity-90 font-medium">2 trận, chọn 2 người vào CK</span>
                        </div>

                        <div className="space-y-28 py-12 flex flex-col justify-around">
                          {sfMatches.map((m, idx) => (
                            <div key={m.id} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/50 shadow-md space-y-2 text-left hover:border-indigo-400 transition-all">
                              <div className="flex items-center justify-between text-[11px] font-oswald border-b border-indigo-100 dark:border-indigo-950 pb-1">
                                <span className="font-black px-2 py-0.5 rounded bg-indigo-600 text-white uppercase">BÁN KẾT {idx + 1} (S{idx + 1})</span>
                                <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">➔ CHUNG KẾT</span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded ${m.winnerTeamName === m.homeTeamName ? 'bg-indigo-200 dark:bg-indigo-900/70 font-bold border border-indigo-400 text-indigo-950 dark:text-white' : 'bg-slate-50 dark:bg-slate-800'}`}>
                                <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                                <span className="font-oswald font-black text-sm">{m.homeScore !== null ? m.homeScore : '-'}</span>
                              </div>
                              <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded ${m.winnerTeamName === m.awayTeamName ? 'bg-indigo-200 dark:bg-indigo-900/70 font-bold border border-indigo-400 text-indigo-950 dark:text-white' : 'bg-slate-50 dark:bg-slate-800'}`}>
                                <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                                <span className="font-oswald font-black text-sm">{m.awayScore !== null ? m.awayScore : '-'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CỘT 6: 6. CHUNG KẾT (1 trận & Cúp) */}
                      <div className="space-y-4 p-3.5 rounded-2xl bg-gradient-to-b from-rose-50/50 to-amber-50/50 dark:from-rose-950/20 dark:to-amber-950/20 border-2 border-rose-300 dark:border-rose-900/50 h-full flex flex-col justify-center items-center">
                        <div className="w-full p-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xs">
                          <h4 className="font-oswald font-black text-xs uppercase tracking-wider">
                            6. CHUNG KẾT
                          </h4>
                          <span className="text-[10px] block opacity-90 font-medium">1 trận • Tìm nhà vô địch</span>
                        </div>

                        {/* Golden Trophy Icon */}
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 animate-float-slow my-3">
                          <i className="fa-solid fa-trophy drop-shadow-md"></i>
                        </div>

                        {/* Final Match Card */}
                        {finalMatches.slice(0, 1).map((m) => (
                          <div
                            key={m.id}
                            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-500 shadow-xl space-y-2.5 text-left"
                          >
                            <div className="flex items-center justify-between text-[11px] font-oswald border-b border-amber-200 dark:border-amber-900/60 pb-1">
                              <span className="font-black text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                <i className="fa-solid fa-crown text-amber-500"></i>
                                <span>CHUNG KẾT CÚP</span>
                              </span>
                              <span className="px-2 py-0.5 rounded font-bold uppercase text-[9px] bg-amber-500 text-slate-950">
                                {m.played ? 'KẾT THÚC' : 'BO3 CK'}
                              </span>
                            </div>
                            <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded transition-all ${m.winnerTeamName === m.homeTeamName ? 'bg-amber-300 text-slate-950 font-black shadow-xs' : 'bg-slate-50 dark:bg-slate-800'}`}>
                              <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                              <span className="font-oswald font-bold text-sm text-amber-700 dark:text-amber-400">{m.homeScore !== null ? m.homeScore : '-'}</span>
                            </div>
                            <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded transition-all ${m.winnerTeamName === m.awayTeamName ? 'bg-amber-300 text-slate-950 font-black shadow-xs' : 'bg-slate-50 dark:bg-slate-800'}`}>
                              <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                              <span className="font-oswald font-bold text-sm text-amber-700 dark:text-amber-400">{m.awayScore !== null ? m.awayScore : '-'}</span>
                            </div>

                            {/* Podium Badge */}
                            <div className="mt-2 p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-center font-oswald text-[11px] font-black uppercase border border-amber-300">
                              🏆 NHÀ VÔ ĐỊCH ĐTHÉN FCO
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                ) : (
                  /* Standard 7-Column World Cup Tree for legacy formats */
                  <div className="hidden lg:block overflow-x-auto pb-4 overscroll-x-contain">
                    <div className="grid grid-cols-7 gap-3 items-center min-w-[1240px] text-center">
                      {/* COL 1: VÒNG 1/8 Nhánh Trái */}
                      <div className="space-y-4">
                        <div className="pb-1 border-b-2 border-blue-500">
                          <span className="font-oswald font-bold text-xs uppercase tracking-wider text-blue-800 dark:text-blue-300">
                            VÒNG 1/8 (NHÁNH TRÁI)
                          </span>
                        </div>
                        {top16Matches.slice(0, 4).map((m) => (
                          <div key={m.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-900/60 shadow-xs space-y-1.5 text-left">
                            <div className="flex items-center justify-between text-[10px] font-fco font-bold uppercase text-blue-700 dark:text-blue-400 border-b border-blue-100 pb-1">
                              <span>TRẬN #{m.matchOrder}</span>
                              <span className="bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">{m.played ? 'ĐÃ ĐẤU' : 'BO3'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs px-2 py-1 rounded bg-white dark:bg-slate-800">
                              <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                              <span className="font-oswald font-bold text-sm">{m.homeScore !== null ? m.homeScore : '-'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs px-2 py-1 rounded bg-white dark:bg-slate-800">
                              <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                              <span className="font-oswald font-bold text-sm">{m.awayScore !== null ? m.awayScore : '-'}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* COL 2: TỨ KẾT 1 & 2 */}
                      <div className="space-y-8 flex flex-col justify-around h-full py-4">
                        <div className="pb-1 border-b-2 border-indigo-500">
                          <span className="font-oswald font-bold text-xs uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                            TỨ KẾT 1 & 2
                          </span>
                        </div>
                        {qfMatches.slice(0, 2).map((m) => (
                          <div key={m.id} className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800/60 shadow-xs space-y-1.5 text-left">
                            <div className="flex items-center justify-between text-[10px] font-fco font-bold uppercase text-indigo-800 border-b border-indigo-100 pb-1">
                              <span>TỨ KẾT #{m.matchOrder}</span>
                              <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-semibold">{m.played ? 'ĐÃ ĐẤU' : 'BO3'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs px-2 py-1 rounded bg-white dark:bg-slate-800">
                              <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                              <span className="font-oswald font-bold text-sm">{m.homeScore !== null ? m.homeScore : '-'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs px-2 py-1 rounded bg-white dark:bg-slate-800">
                              <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                              <span className="font-oswald font-bold text-sm">{m.awayScore !== null ? m.awayScore : '-'}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* COL 3: BÁN KẾT 1 */}
                      <div className="space-y-4 flex flex-col justify-center h-full">
                        <div className="pb-1 border-b-2 border-teal-500">
                          <span className="font-oswald font-bold text-xs uppercase tracking-wider text-teal-800 dark:text-teal-300">
                            BÁN KẾT 1
                          </span>
                        </div>
                        {sfMatches.slice(0, 1).map((m) => (
                          <div key={m.id} className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border-2 border-teal-300 dark:border-teal-700 shadow-md space-y-2 text-left">
                            <div className="flex items-center justify-between text-[10px] font-fco font-bold uppercase text-teal-800 border-b border-teal-100 pb-1">
                              <span>BÁN KẾT 1</span>
                              <span className="bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-semibold">{m.played ? 'ĐÃ ĐẤU' : 'BO3'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs px-2 py-1 rounded bg-white dark:bg-slate-800">
                              <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                              <span className="font-oswald font-bold text-sm">{m.homeScore !== null ? m.homeScore : '-'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs px-2 py-1 rounded bg-white dark:bg-slate-800">
                              <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                              <span className="font-oswald font-bold text-sm">{m.awayScore !== null ? m.awayScore : '-'}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* COL 4: CHUNG KẾT */}
                      <div className="space-y-4 flex flex-col justify-center items-center py-2">
                        <div className="w-full pb-1 border-b-2 border-amber-500">
                          <span className="font-oswald font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300">
                            CHUNG KẾT CÚP
                          </span>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-xl shadow-amber-500/30">
                          <i className="fa-solid fa-trophy"></i>
                        </div>
                        {finalMatches.slice(0, 1).map((m) => (
                          <div key={m.id} className="w-full p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-400 space-y-2.5 text-left">
                            <div className="flex items-center justify-between text-[11px] font-oswald text-amber-900 border-b border-amber-200 pb-1">
                              <span className="font-black">TRANH NGÔI VƯƠNG</span>
                              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">{m.played ? 'KẾT THÚC' : 'BO3 CK'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded bg-white dark:bg-slate-800">
                              <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                              <span className="font-oswald font-bold text-base text-amber-700">{m.homeScore !== null ? m.homeScore : '-'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded bg-white dark:bg-slate-800">
                              <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                              <span className="font-oswald font-bold text-base text-amber-700">{m.awayScore !== null ? m.awayScore : '-'}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* COL 5: BÁN KẾT 2 */}
                      <div className="space-y-4 flex flex-col justify-center h-full">
                        <div className="pb-1 border-b-2 border-teal-500">
                          <span className="font-oswald font-bold text-xs uppercase tracking-wider text-teal-800 dark:text-teal-300">
                            BÁN KẾT 2
                          </span>
                        </div>
                        {sfMatches.slice(1, 2).map((m) => (
                          <div key={m.id} className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border-2 border-teal-300 dark:border-teal-700 shadow-md space-y-2 text-left">
                            <div className="flex items-center justify-between text-[10px] font-fco font-bold uppercase text-teal-800 border-b border-teal-100 pb-1">
                              <span>BÁN KẾT 2</span>
                              <span className="bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-semibold">{m.played ? 'ĐÃ ĐẤU' : 'BO3'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs px-2 py-1 rounded bg-white dark:bg-slate-800">
                              <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                              <span className="font-oswald font-bold text-sm">{m.homeScore !== null ? m.homeScore : '-'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs px-2 py-1 rounded bg-white dark:bg-slate-800">
                              <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                              <span className="font-oswald font-bold text-sm">{m.awayScore !== null ? m.awayScore : '-'}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* COL 6: TỨ KẾT 3 & 4 */}
                      <div className="space-y-8 flex flex-col justify-around h-full py-4">
                        <div className="pb-1 border-b-2 border-indigo-500">
                          <span className="font-oswald font-bold text-xs uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                            TỨ KẾT 3 & 4
                          </span>
                        </div>
                        {qfMatches.slice(2, 4).map((m) => (
                          <div key={m.id} className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800/60 shadow-xs space-y-1.5 text-left">
                            <div className="flex items-center justify-between text-[10px] font-fco font-bold uppercase text-indigo-800 border-b border-indigo-100 pb-1">
                              <span>TỨ KẾT #{m.matchOrder}</span>
                              <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-semibold">{m.played ? 'ĐÃ ĐẤU' : 'BO3'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs px-2 py-1 rounded bg-white dark:bg-slate-800">
                              <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                              <span className="font-oswald font-bold text-sm">{m.homeScore !== null ? m.homeScore : '-'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs px-2 py-1 rounded bg-white dark:bg-slate-800">
                              <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                              <span className="font-oswald font-bold text-sm">{m.awayScore !== null ? m.awayScore : '-'}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* COL 7: VÒNG 1/8 Nhánh Phải */}
                      <div className="space-y-4">
                        <div className="pb-1 border-b-2 border-blue-500">
                          <span className="font-oswald font-bold text-xs uppercase tracking-wider text-blue-800 dark:text-blue-300">
                            VÒNG 1/8 (NHÁNH PHẢI)
                          </span>
                        </div>
                        {top16Matches.slice(4, 8).map((m) => (
                          <div key={m.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-900/60 shadow-xs space-y-1.5 text-left">
                            <div className="flex items-center justify-between text-[10px] font-fco font-bold uppercase text-blue-700 pb-1">
                              <span>TRẬN #{m.matchOrder}</span>
                              <span className="bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">{m.played ? 'ĐÃ ĐẤU' : 'BO3'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs px-2 py-1 rounded bg-white dark:bg-slate-800">
                              <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                              <span className="font-oswald font-bold text-sm">{m.homeScore !== null ? m.homeScore : '-'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs px-2 py-1 rounded bg-white dark:bg-slate-800">
                              <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                              <span className="font-oswald font-bold text-sm">{m.awayScore !== null ? m.awayScore : '-'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* TÓM TẮT THỂ THỨC SƠ ĐỒ 34 VĐV (2 VĐV ĐẶC CÁCH) */}
              <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white border-2 border-blue-400/40 shadow-xl space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-blue-500/30 pb-2.5 sm:pb-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 text-base font-black shadow-md">
                    <i className="fa-solid fa-list-check"></i>
                  </div>
                  <h4 className="font-oswald font-black uppercase text-base sm:text-lg text-amber-300 leading-tight">
                    TÓM TẮT THỂ THỨC THI ĐẤU ĐTHÉN FCO ™ (34 VĐV)
                  </h4>
                </div>
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 sm:pl-10">
                  <ul className="space-y-2 list-none">
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span><strong>34 VĐV tham dự</strong>, trong đó có <strong>2 VĐV được đặc cách</strong> (VĐV 1 & VĐV 2).</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span><strong>Vòng Play-off:</strong> 8 VĐV thi đấu 4 trận (P1 – P4) ➔ lấy 4 người thắng (W1 – W4).</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span><strong>Vòng Loại:</strong> 28 VĐV (24 VĐV bốc thăm trực tiếp + 4 người thắng Play-off) thi đấu 14 trận (T1 – T14) ➔ lấy 14 người thắng (A1 – A14).</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 list-none">
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span><strong>Top 16:</strong> 14 người thắng Vòng loại cùng 2 VĐV đặc cách tạo thành 16 VĐV xuất sắc nhất.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>VĐV 1 và VĐV 2 chỉ cần thắng 1 trận ở Top 16 là thẳng tiến vào <strong>Top 8 (Tứ Kết)</strong>.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>Lộ trình hội tụ đỉnh cao: <strong>Top 8 (Tứ Kết) ➔ Top 4 (Bán Kết) ➔ Chung Kết tranh Cúp Vàng</strong>.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default DthenLtd;
