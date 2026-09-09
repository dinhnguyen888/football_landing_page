import React, { useState, useEffect } from 'react';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import Body from '../../components/body';
import {
  TournamentData,
  calculateGroupStandings,
  loadDthenTournamentData,
  createDefaultDthenTournament,
  buildFIFABracketFromGroups,
  fetchAndSyncDthenTournament,
} from '../../utils/tournamentEngine';
import {
  subscribeTournamentFromFirestore,
  CLOUD_KEYS,
} from '../../services/tournamentService';
import { isFirebaseConfigured } from '../../services/firebase';

const DthenLtd: React.FC = () => {
  const [tournament, setTournament] = useState<TournamentData | null>(() => {
    const active = loadDthenTournamentData();
    if (active && active.isVisible) {
      return active;
    }
    return createDefaultDthenTournament();
  });

  const [viewStage, setViewStage] = useState<'GROUP' | 'KNOCKOUT'>('GROUP');
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const [activeRoundFilter, setActiveRoundFilter] = useState<number | 'ALL'>('ALL');
  const [syncStatus, setSyncStatus] = useState<'cloud' | 'local'>('local');

  useEffect(() => {
    // 1. Initial fetch from Cloud
    fetchAndSyncDthenTournament().then((data) => {
      if (data && data.isVisible) {
        setTournament(data);
        if (data.knockoutStage?.isCompletedGroupStage) {
          setViewStage('KNOCKOUT');
        }
        if (isFirebaseConfigured) setSyncStatus('cloud');
      }
    });

    // 2. Real-time Cloud listener
    const unsubscribe = subscribeTournamentFromFirestore<TournamentData>(
      CLOUD_KEYS.DTHEN,
      (cloudData) => {
        if (cloudData && cloudData.isVisible) {
          setTournament(cloudData);
          if (cloudData.knockoutStage?.isCompletedGroupStage) {
            setViewStage('KNOCKOUT');
          }
          setSyncStatus('cloud');
        }
      }
    );

    // 3. Fallback Local storage listener
    const handleStorage = () => {
      const active = loadDthenTournamentData();
      if (active && active.isVisible) {
        setTournament(active);
        if (active.knockoutStage?.isCompletedGroupStage) {
          setViewStage('KNOCKOUT');
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  if (!tournament || !tournament.groups || tournament.groups.length === 0) {
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
              ĐANG THIẾT LẬP LỊCH THI ĐẤU MÙA 1
            </h2>
            <p className="text-sm text-slate-600">
              Ban Tổ Chức đang bốc thăm chia bảng và cập nhật danh sách Huấn luyện viên tham dự.
            </p>
          </div>
        </Body>
        <Footer />
      </>
    );
  }

  const currentGroup = tournament.groups[activeGroupIndex] || tournament.groups[0];
  const standings = calculateGroupStandings(currentGroup);

  const roundsInGroup = Array.from(
    new Set(currentGroup.matches.map((m) => m.round))
  ).sort((a, b) => a - b);

  const filteredMatches =
    activeRoundFilter === 'ALL'
      ? currentGroup.matches
      : currentGroup.matches.filter((m) => m.round === activeRoundFilter);

  const getTeam = (teamId: string) => {
    return currentGroup.teams.find((t) => t.id === teamId) || { id: teamId, name: teamId, club: '' };
  };

  const knockoutStage =
    tournament.knockoutStage || buildFIFABracketFromGroups(tournament.groups);

  const r16Matches = knockoutStage.rounds?.[0]?.matches || [];
  const qfMatches = knockoutStage.rounds?.[1]?.matches || [];
  const sfMatches = knockoutStage.rounds?.[2]?.matches || [];
  const finalMatches = knockoutStage.rounds?.[3]?.matches || [];

  return (
    <>
      <Banner
        title={`LỊCH ĐẤU & BXH - ${tournament.tournamentName}`}
        subtitle={`Theo dõi bảng xếp hạng trực tiếp và lịch thi đấu các bảng đấu ${tournament.season}`}
        badge="LIVE STANDINGS"
      />

      <Body>
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
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
                <span>{syncStatus === 'cloud' ? 'Cloud Synced' : 'Local'}</span>
              </span>
              <span className="text-[11px] text-slate-500 font-semibold sm:hidden">
                32 Đội • 8 Bảng
              </span>
            </div>

            {/* Stage Switcher */}
            <div className="grid grid-cols-2 sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setViewStage('GROUP')}
                className={`px-4 py-2 sm:py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center ${
                  viewStage === 'GROUP'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <i className="fa-solid fa-table-cells mr-1.5"></i>
                VÒNG BẢNG
              </button>

              <button
                onClick={() => setViewStage('KNOCKOUT')}
                className={`px-4 py-2 sm:py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center ${
                  viewStage === 'KNOCKOUT'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <i className="fa-solid fa-trophy mr-1.5 text-amber-400"></i>
                KNOCKOUT
              </button>
            </div>
          </div>

          {viewStage === 'GROUP' ? (
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
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-0">
                <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-oswald text-base sm:text-xl font-bold uppercase text-slate-900 dark:text-white">
                    BẢNG XẾP HẠNG – {currentGroup.name}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                    Top 2 Vào Vòng 1/8
                  </span>
                </div>

                {/* Mobile horizontal scroll hint */}
                <div className="sm:hidden px-3.5 py-1.5 bg-blue-50/70 dark:bg-blue-950/40 text-[11px] text-blue-800 dark:text-blue-300 flex items-center justify-between border-b border-blue-100 dark:border-blue-900/30">
                  <span className="flex items-center gap-1.5 font-medium">
                    <i className="fa-solid fa-arrows-left-right text-[10px] text-blue-600 dark:text-blue-400"></i>
                    Vuốt ngang để xem đủ Trận, Hiệu số, Điểm
                  </span>
                  <i className="fa-solid fa-chevron-right text-[9px] opacity-60"></i>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm min-w-[560px]">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 sm:py-3 px-2 sm:px-4 text-center w-10 sm:w-12">#</th>
                        <th className="py-2.5 sm:py-3 px-3 sm:px-4 min-w-[170px]">Huấn Luyện Viên / CLB</th>
                        <th className="py-2.5 sm:py-3 px-2 text-center w-12">Trận</th>
                        <th className="py-2.5 sm:py-3 px-2 text-center w-10">T</th>
                        <th className="py-2.5 sm:py-3 px-2 text-center w-10">H</th>
                        <th className="py-2.5 sm:py-3 px-2 text-center w-10">B</th>
                        <th className="py-2.5 sm:py-3 px-2 text-center w-12">BT</th>
                        <th className="py-2.5 sm:py-3 px-2 text-center w-12">SBT</th>
                        <th className="py-2.5 sm:py-3 px-2 text-center w-12">HS</th>
                        <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-center font-black text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 w-16">Điểm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {standings.map((stat, idx) => (
                        <tr
                          key={stat.teamId}
                          className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                            idx < 2 ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                          }`}
                        >
                          <td className="py-2.5 sm:py-3 px-2 sm:px-4 text-center">
                            <span
                              className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                                idx === 0
                                  ? 'bg-amber-400 text-slate-900 font-black shadow-2xs'
                                  : idx === 1
                                  ? 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100'
                                  : 'text-slate-400'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-slate-900 dark:text-white">
                            <div>
                              <span className="block leading-tight">{stat.teamName}</span>
                              {stat.club && (
                                <span className="block text-[11px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                                  {stat.club}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 sm:py-3 px-2 text-center text-slate-600 dark:text-slate-300">{stat.played}</td>
                          <td className="py-2.5 sm:py-3 px-2 text-center text-emerald-700 dark:text-emerald-400 font-semibold">{stat.won}</td>
                          <td className="py-2.5 sm:py-3 px-2 text-center text-amber-700 dark:text-amber-400 font-semibold">{stat.drawn}</td>
                          <td className="py-2.5 sm:py-3 px-2 text-center text-rose-700 dark:text-rose-400 font-semibold">{stat.lost}</td>
                          <td className="py-2.5 sm:py-3 px-2 text-center text-slate-600 dark:text-slate-300">{stat.goalsFor}</td>
                          <td className="py-2.5 sm:py-3 px-2 text-center text-slate-600 dark:text-slate-300">{stat.goalsAgainst}</td>
                          <td className="py-2.5 sm:py-3 px-2 text-center font-semibold text-slate-800 dark:text-slate-200">
                            {stat.goalDifference > 0
                              ? `+${stat.goalDifference}`
                              : stat.goalDifference}
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-center font-black text-blue-700 dark:text-blue-400 text-sm sm:text-base bg-blue-50/50 dark:bg-blue-950/30">
                            {stat.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

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
                          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md card-hover-fx transition-all flex flex-col justify-between space-y-3"
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
            /* Knockout Stage View: Full 16-Team FIFA World Cup Tree */
            <div className="space-y-4 sm:space-y-6">
              {/* Header Box */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-fco font-bold text-xs uppercase">
                      <i className="fa-solid fa-trophy mr-1.5 text-amber-500"></i>
                      CHUẨN PHÂN NHÁNH FIFA WORLD CUP (32 ĐỘI)
                    </span>
                  </div>
                  <h3 className="font-oswald text-xl sm:text-3xl font-bold uppercase text-slate-900 dark:text-white">
                    SƠ ĐỒ PHÂN NHÁNH VÒNG LOẠI TRỰC TIẾP
                  </h3>
                </div>
              </div>

              {/* World Cup Bracket Tree View */}
              <div className="w-full max-w-full overflow-hidden p-3 sm:p-7 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-code-branch text-blue-600 dark:text-blue-400"></i>
                    <span className="font-oswald text-sm sm:text-base font-bold uppercase text-slate-800 dark:text-slate-200">
                      SƠ ĐỒ HỘI TỤ CHUNG KẾT CÚP (PATHWAYS TREE)
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                    <i className="fa-solid fa-arrows-left-right mr-1"></i>
                    Kéo ngang để xem trọn vẹn 7 cột sơ đồ
                  </span>
                </div>

                {/* Mobile Touch Swipe Indicator */}
                <div className="sm:hidden p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-bold">
                    <i className="fa-solid fa-hand-pointer animate-bounce text-blue-600 dark:text-blue-400"></i>
                    <span>Vuốt ngang để xem trọn vẹn 7 cột sơ đồ</span>
                  </span>
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                    Vòng 1/8 ➔ CK
                  </span>
                </div>

                {/* 7-Column World Cup Symmetrical Tree with Horizontal Scroll (supports natural vertical page scroll and horizontal tree pan) */}
                <div className="overflow-x-auto pb-4 overscroll-x-contain">
                  <div className="grid grid-cols-7 gap-3 items-center min-w-[1240px] text-center">
                    {/* COL 1: VÒNG 1/8 (Nhánh Trái - 4 trận) */}
                    <div className="space-y-4">
                      <div className="pb-1 border-b-2 border-blue-500">
                        <span className="font-oswald font-bold text-xs uppercase tracking-wider text-blue-800 dark:text-blue-300">
                          VÒNG 1/8 (NHÁNH TRÁI)
                        </span>
                      </div>
                      {r16Matches.slice(0, 4).map((m) => (
                        <div
                          key={m.id}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-900/60 shadow-xs space-y-1.5 hover:border-blue-500 hover:shadow-md transition-all text-left"
                        >
                          <div className="flex items-center justify-between text-[10px] font-fco font-bold uppercase text-blue-700 dark:text-blue-400 border-b border-blue-100 dark:border-blue-900/40 pb-1">
                            <span>TRẬN #{m.matchOrder}</span>
                            <span className="bg-blue-100/80 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-1.5 py-0.2 rounded font-semibold">
                              {m.played ? 'ĐÃ ĐẤU' : 'BO3'}
                            </span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${m.winnerTeamName === m.homeTeamName ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-950 dark:text-blue-100 font-bold' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                            <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-blue-700 dark:text-blue-400">{m.homeScore !== null ? m.homeScore : '-'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${m.winnerTeamName === m.awayTeamName ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-950 dark:text-blue-100 font-bold' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                            <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-blue-700 dark:text-blue-400">{m.awayScore !== null ? m.awayScore : '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* COL 2: TỨ KẾT 1 & 2 (Nhánh Trái - 2 trận) */}
                    <div className="space-y-8 flex flex-col justify-around h-full py-4">
                      <div className="pb-1 border-b-2 border-indigo-500">
                        <span className="font-oswald font-bold text-xs uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                          TỨ KẾT 1 & 2
                        </span>
                      </div>
                      {qfMatches.slice(0, 2).map((m) => (
                        <div
                          key={m.id}
                          className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800/60 shadow-xs space-y-1.5 hover:border-indigo-400 transition-all text-left"
                        >
                          <div className="flex items-center justify-between text-[10px] font-fco font-bold uppercase text-indigo-800 dark:text-indigo-300 border-b border-indigo-100 dark:border-indigo-900/40 pb-1">
                            <span>TỨ KẾT #{m.matchOrder}</span>
                            <span className="bg-indigo-100/80 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 px-1.5 py-0.2 rounded font-semibold">
                              {m.played ? 'ĐÃ ĐẤU' : 'BO3'}
                            </span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${m.winnerTeamName === m.homeTeamName ? 'bg-indigo-200 dark:bg-indigo-900 text-indigo-950 dark:text-indigo-100 font-bold' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                            <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-indigo-700 dark:text-indigo-400">{m.homeScore !== null ? m.homeScore : '-'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${m.winnerTeamName === m.awayTeamName ? 'bg-indigo-200 dark:bg-indigo-900 text-indigo-950 dark:text-indigo-100 font-bold' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                            <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-indigo-700 dark:text-indigo-400">{m.awayScore !== null ? m.awayScore : '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* COL 3: BÁN KẾT 1 (Nhánh Trái - 1 trận) */}
                    <div className="space-y-4 flex flex-col justify-center h-full">
                      <div className="pb-1 border-b-2 border-teal-500">
                        <span className="font-oswald font-bold text-xs uppercase tracking-wider text-teal-800 dark:text-teal-300">
                          BÁN KẾT 1
                        </span>
                      </div>
                      {sfMatches.slice(0, 1).map((m) => (
                        <div
                          key={m.id}
                          className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border-2 border-teal-300 dark:border-teal-700 shadow-md space-y-2 hover:border-teal-400 transition-all text-left"
                        >
                          <div className="flex items-center justify-between text-[10px] font-fco font-bold uppercase text-teal-800 dark:text-teal-300 border-b border-teal-100 dark:border-teal-900/40 pb-1">
                            <span>BÁN KẾT 1</span>
                            <span className="bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-1.5 py-0.2 rounded font-semibold">
                              {m.played ? 'ĐÃ ĐẤU' : 'BO3'}
                            </span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${m.winnerTeamName === m.homeTeamName ? 'bg-teal-200 dark:bg-teal-900 text-teal-950 dark:text-teal-100 font-bold' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                            <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-teal-700 dark:text-teal-400">{m.homeScore !== null ? m.homeScore : '-'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${m.winnerTeamName === m.awayTeamName ? 'bg-teal-200 dark:bg-teal-900 text-teal-950 dark:text-teal-100 font-bold' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                            <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-teal-700 dark:text-teal-400">{m.awayScore !== null ? m.awayScore : '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* COL 4: TRUNG TÂM - CHUNG KẾT CÚP VÀNG */}
                    <div className="space-y-4 flex flex-col justify-center items-center py-2">
                      <div className="w-full pb-1 border-b-2 border-amber-500">
                        <span className="font-oswald font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center justify-center space-x-1">
                          <i className="fa-solid fa-crown text-amber-500"></i>
                          <span>CHUNG KẾT CÚP</span>
                        </span>
                      </div>

                      {/* Golden Trophy Icon */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-amber-500/30 animate-float-slow">
                        <i className="fa-solid fa-trophy drop-shadow-md"></i>
                      </div>

                      {/* Final Match Card */}
                      {finalMatches.slice(0, 1).map((m) => (
                        <div
                          key={m.id}
                          className="w-full p-4 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50/70 dark:from-amber-950/50 dark:to-slate-900 border-2 border-amber-400 dark:border-amber-500 shadow-xl neon-ring-pulse card-hover-fx space-y-2.5 text-left"
                        >
                          <div className="flex items-center justify-between text-[11px] font-oswald text-amber-900 dark:text-amber-300 border-b border-amber-200 dark:border-amber-800/60 pb-1">
                            <span className="font-black flex items-center space-x-1">
                              <i className="fa-solid fa-crown text-amber-500 animate-bounce"></i>
                              <span>TRANH NGÔI VƯƠNG</span>
                            </span>
                            <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded font-bold">
                              {m.played ? 'KẾT THÚC' : 'BO3 CHUNG KẾT'}
                            </span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg transition-all ${m.winnerTeamName === m.homeTeamName ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                            <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                            <span className="font-oswald font-bold text-base text-amber-700 dark:text-amber-400">{m.homeScore !== null ? m.homeScore : '-'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg transition-all ${m.winnerTeamName === m.awayTeamName ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                            <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                            <span className="font-oswald font-bold text-base text-amber-700 dark:text-amber-400">{m.awayScore !== null ? m.awayScore : '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* COL 5: BÁN KẾT 2 (Nhánh Phải - 1 trận) */}
                    <div className="space-y-4 flex flex-col justify-center h-full">
                      <div className="pb-1 border-b-2 border-teal-500">
                        <span className="font-oswald font-bold text-xs uppercase tracking-wider text-teal-800 dark:text-teal-300">
                          BÁN KẾT 2
                        </span>
                      </div>
                      {sfMatches.slice(1, 2).map((m) => (
                        <div
                          key={m.id}
                          className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border-2 border-teal-300 dark:border-teal-700 shadow-md space-y-2 hover:border-teal-400 transition-all text-left"
                        >
                          <div className="flex items-center justify-between text-[10px] font-fco font-bold uppercase text-teal-800 dark:text-teal-300 border-b border-teal-100 dark:border-teal-900/40 pb-1">
                            <span>BÁN KẾT 2</span>
                            <span className="bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-1.5 py-0.2 rounded font-semibold">
                              {m.played ? 'ĐÃ ĐẤU' : 'BO3'}
                            </span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${m.winnerTeamName === m.homeTeamName ? 'bg-teal-200 dark:bg-teal-900 text-teal-950 dark:text-teal-100 font-bold' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                            <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-teal-700 dark:text-teal-400">{m.homeScore !== null ? m.homeScore : '-'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${m.winnerTeamName === m.awayTeamName ? 'bg-teal-200 dark:bg-teal-900 text-teal-950 dark:text-teal-100 font-bold' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                            <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-teal-700 dark:text-teal-400">{m.awayScore !== null ? m.awayScore : '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* COL 6: TỨ KẾT 3 & 4 (Nhánh Phải - 2 trận) */}
                    <div className="space-y-8 flex flex-col justify-around h-full py-4">
                      <div className="pb-1 border-b-2 border-indigo-500">
                        <span className="font-oswald font-bold text-xs uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                          TỨ KẾT 3 & 4
                        </span>
                      </div>
                      {qfMatches.slice(2, 4).map((m) => (
                        <div
                          key={m.id}
                          className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800/60 shadow-xs space-y-1.5 hover:border-indigo-400 transition-all text-left"
                        >
                          <div className="flex items-center justify-between text-[10px] font-fco font-bold uppercase text-indigo-800 dark:text-indigo-300 border-b border-indigo-100 dark:border-indigo-900/40 pb-1">
                            <span>TỨ KẾT #{m.matchOrder}</span>
                            <span className="bg-indigo-100/80 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 px-1.5 py-0.2 rounded font-semibold">
                              {m.played ? 'ĐÃ ĐẤU' : 'BO3'}
                            </span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${m.winnerTeamName === m.homeTeamName ? 'bg-indigo-200 dark:bg-indigo-900 text-indigo-950 dark:text-indigo-100 font-bold' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                            <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-indigo-700 dark:text-indigo-400">{m.homeScore !== null ? m.homeScore : '-'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${m.winnerTeamName === m.awayTeamName ? 'bg-indigo-200 dark:bg-indigo-900 text-indigo-950 dark:text-indigo-100 font-bold' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                            <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-indigo-700 dark:text-indigo-400">{m.awayScore !== null ? m.awayScore : '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* COL 7: VÒNG 1/8 (Nhánh Phải - 4 trận) */}
                    <div className="space-y-4">
                      <div className="pb-1 border-b-2 border-blue-500">
                        <span className="font-oswald font-bold text-xs uppercase tracking-wider text-blue-800 dark:text-blue-300">
                          VÒNG 1/8 (NHÁNH PHẢI)
                        </span>
                      </div>
                      {r16Matches.slice(4, 8).map((m) => (
                        <div
                          key={m.id}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-900/60 shadow-xs space-y-1.5 hover:border-blue-500 hover:shadow-md transition-all text-left"
                        >
                          <div className="flex items-center justify-between text-[10px] font-fco font-bold uppercase text-blue-700 dark:text-blue-400 border-b border-blue-100 dark:border-blue-900/40 pb-1">
                            <span>TRẬN #{m.matchOrder}</span>
                            <span className="bg-blue-100/80 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-1.5 py-0.2 rounded font-semibold">
                              {m.played ? 'ĐÃ ĐẤU' : 'BO3'}
                            </span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${m.winnerTeamName === m.homeTeamName ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-950 dark:text-blue-100 font-bold' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                            <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-blue-700 dark:text-blue-400">{m.homeScore !== null ? m.homeScore : '-'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${m.winnerTeamName === m.awayTeamName ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-950 dark:text-blue-100 font-bold' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                            <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                            <span className="font-oswald font-bold text-sm text-blue-700 dark:text-blue-400">{m.awayScore !== null ? m.awayScore : '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* BẢNG QUY TẮC PHÂN CẶP WORLD CUP - ĐƯỢC ĐƯA XUỐNG DƯỚI CÂY THEO YÊU CẦU */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/80 shadow-sm space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-blue-100 dark:border-blue-900/40 pb-2.5 sm:pb-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm sm:text-base shadow-xs">
                    <i className="fa-solid fa-circle-info"></i>
                  </div>
                  <h4 className="font-oswald font-bold uppercase text-sm sm:text-lg text-blue-950 dark:text-blue-200 leading-tight">
                    BẢNG QUY TẮC BỐC THĂM PHÂN CẶP THEO LUẬT WORLD CUP
                  </h4>
                </div>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2.5 sm:space-y-3 pl-0 sm:pl-10">
                  <p>
                    Khi chưa kết thúc vòng bảng, sơ đồ cây hiển thị trước quy tắc phân nhánh chuẩn FIFA World Cup: <strong>Nhất bảng này gặp Nhì bảng kia</strong>.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1.5">
                      <span className="font-bold text-blue-900 dark:text-blue-300 block text-sm">🔷 Nhánh Đấu Trái:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                        <li>Trận 1: <strong>Nhất Bảng A</strong> vs <strong>Nhì Bảng B</strong></li>
                        <li>Trận 2: <strong>Nhất Bảng C</strong> vs <strong>Nhì Bảng D</strong></li>
                        <li>Trận 3: <strong>Nhất Bảng E</strong> vs <strong>Nhì Bảng F</strong></li>
                        <li>Trận 4: <strong>Nhất Bảng G</strong> vs <strong>Nhì Bảng H</strong></li>
                      </ul>
                    </div>
                    <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1.5">
                      <span className="font-bold text-blue-900 dark:text-blue-300 block text-sm">🔷 Nhánh Đấu Phải:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                        <li>Trận 5: <strong>Nhất Bảng B</strong> vs <strong>Nhì Bảng A</strong></li>
                        <li>Trận 6: <strong>Nhất Bảng D</strong> vs <strong>Nhì Bảng C</strong></li>
                        <li>Trận 7: <strong>Nhất Bảng F</strong> vs <strong>Nhì Bảng E</strong></li>
                        <li>Trận 8: <strong>Nhất Bảng H</strong> vs <strong>Nhì Bảng G</strong></li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-[12px] text-blue-800 dark:text-blue-400 italic pt-1">
                    * Tên chính thức của Huấn luyện viên và CLB sẽ tự động cập nhật ngay khi các bảng đấu kết thúc toàn bộ lượt trận!
                  </p>
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
