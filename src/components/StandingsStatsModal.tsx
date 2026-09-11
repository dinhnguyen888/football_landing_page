import React, { useEffect, useState, useMemo } from 'react';
import { TeamStats, Match } from '../utils/tournamentEngine';

export interface StandingsStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  standings: TeamStats[];
  matches?: Match[];
  theme?: 'emerald' | 'blue';
}

export interface HighestScoringMatch {
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  total: number;
}

export interface BiggestWinMatch {
  winnerName: string;
  loserName: string;
  winnerScore: number;
  loserScore: number;
  diff: number;
}

export interface GroupStats {
  totalMatchesCount: number;
  playedMatchesCount: number;
  completionRate: number;
  totalGoals: number;
  avgGoalsPerMatch: string;
  homeWins: number;
  awayWins: number;
  draws: number;
  cleanSheetsMap: Record<string, number>;
  highestScoringMatch: HighestScoringMatch | null;
  biggestWinMatch: BiggestWinMatch | null;
  topScorerTeam: TeamStats | null;
  bestDefenseTeam: TeamStats | null;
  topCleanSheetTeam: { name: string; count: number } | null;
  topWinRateTeam: TeamStats | null;
}

function getTeamInitials(name: string): string {
  if (!name) return 'FC';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const StandingsStatsModal: React.FC<StandingsStatsModalProps> = ({
  isOpen,
  onClose,
  groupName,
  standings,
  matches = [],
  theme = 'emerald',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'teams'>('overview');
  const isEmerald = theme === 'emerald';

  // Close on Escape key & manage body scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Compute lookup map
  const teamNameMap = useMemo(() => {
    const map: Record<string, { name: string; club?: string }> = {};
    standings.forEach((t) => {
      map[t.teamId] = { name: t.teamName, club: t.club };
    });
    return map;
  }, [standings]);

  // Computed statistics
  const stats = useMemo<GroupStats>(() => {
    const playedMatches = matches.filter(
      (m) => m.played && m.homeScore !== null && m.awayScore !== null
    );
    const totalMatchesCount = matches.length;
    const playedMatchesCount = playedMatches.length;
    const completionRate =
      totalMatchesCount > 0
        ? Math.round((playedMatchesCount / totalMatchesCount) * 100)
        : 0;

    let totalGoals = 0;
    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;

    let highestScoringMatch: HighestScoringMatch | null = null;
    let biggestWinMatch: BiggestWinMatch | null = null;

    // Clean sheets per team
    const cleanSheetsMap: Record<string, number> = {};
    standings.forEach((s) => {
      cleanSheetsMap[s.teamId] = 0;
    });

    for (const m of playedMatches) {
      const hs = m.homeScore ?? 0;
      const as = m.awayScore ?? 0;
      const matchTotal = hs + as;
      totalGoals += matchTotal;

      if (hs > as) homeWins++;
      else if (hs < as) awayWins++;
      else draws++;

      // Clean sheet calculation
      if (as === 0 && cleanSheetsMap[m.homeTeamId] !== undefined) {
        cleanSheetsMap[m.homeTeamId]++;
      }
      if (hs === 0 && cleanSheetsMap[m.awayTeamId] !== undefined) {
        cleanSheetsMap[m.awayTeamId]++;
      }

      // Check highest scoring match
      if (!highestScoringMatch || matchTotal > highestScoringMatch.total) {
        highestScoringMatch = {
          homeName: teamNameMap[m.homeTeamId]?.name || 'Đội nhà',
          awayName: teamNameMap[m.awayTeamId]?.name || 'Đội khách',
          homeScore: hs,
          awayScore: as,
          total: matchTotal,
        };
      }

      // Check biggest win match
      const diff = Math.abs(hs - as);
      if (diff > 0 && (!biggestWinMatch || diff > biggestWinMatch.diff)) {
        const isHomeWinner = hs > as;
        biggestWinMatch = {
          winnerName:
            teamNameMap[isHomeWinner ? m.homeTeamId : m.awayTeamId]?.name ||
            'Người thắng',
          loserName:
            teamNameMap[isHomeWinner ? m.awayTeamId : m.homeTeamId]?.name ||
            'Người thua',
          winnerScore: isHomeWinner ? hs : as,
          loserScore: isHomeWinner ? as : hs,
          diff,
        };
      }
    }

    const avgGoalsPerMatch =
      playedMatchesCount > 0
        ? (totalGoals / playedMatchesCount).toFixed(2)
        : '0.00';

    // Best attack (most goals scored)
    const sortedByAttack = [...standings].sort((a, b) => b.goalsFor - a.goalsFor);
    const topScorerTeam = sortedByAttack.length > 0 && sortedByAttack[0].goalsFor > 0 ? sortedByAttack[0] : null;

    // Best defense (least goals conceded among teams that played at least 1 match)
    const teamsWithMatches = standings.filter((s) => s.played > 0);
    const sortedByDefense = [...teamsWithMatches].sort(
      (a, b) => a.goalsAgainst - b.goalsAgainst
    );
    const bestDefenseTeam = sortedByDefense.length > 0 ? sortedByDefense[0] : null;

    // Most clean sheets
    let topCleanSheetTeam: { name: string; count: number } | null = null;
    let maxCleanSheets = 0;
    Object.entries(cleanSheetsMap).forEach(([tId, count]) => {
      if (count > maxCleanSheets) {
        maxCleanSheets = count;
        topCleanSheetTeam = {
          name: teamNameMap[tId]?.name || 'Đội bóng',
          count,
        };
      }
    });

    // Best win rate team
    const sortedByWinRate = [...teamsWithMatches].sort((a, b) => {
      const rateA = a.played > 0 ? a.won / a.played : 0;
      const rateB = b.played > 0 ? b.won / b.played : 0;
      return rateB - rateA;
    });
    const topWinRateTeam =
      sortedByWinRate.length > 0 && sortedByWinRate[0].won > 0
        ? sortedByWinRate[0]
        : null;

    return {
      totalMatchesCount,
      playedMatchesCount,
      completionRate,
      totalGoals,
      avgGoalsPerMatch,
      homeWins,
      awayWins,
      draws,
      cleanSheetsMap,
      highestScoringMatch,
      biggestWinMatch,
      topScorerTeam,
      bestDefenseTeam,
      topCleanSheetTeam,
      topWinRateTeam,
    };
  }, [matches, standings, teamNameMap]);

  if (!isOpen) return null;

  const { highestScoringMatch, biggestWinMatch } = stats;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent Gradient Border */}
        <div
          className={`h-1.5 w-full ${
            isEmerald
              ? 'bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-500'
              : 'bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600'
          }`}
        />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70 shrink-0">
          <div className="flex items-center space-x-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-xs border ${
                isEmerald
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400'
              }`}
            >
              <i className="fa-solid fa-chart-column"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-oswald text-lg sm:text-2xl font-bold uppercase text-slate-900 dark:text-white tracking-wide">
                  SỐ LIỆU THỐNG KÊ {groupName}
                </h3>
                <span
                  className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    isEmerald
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
                      : 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25'
                  }`}
                >
                  Dữ liệu phân tích
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Tổng hợp hiệu suất thi đấu, số bàn thắng, phòng ngự &amp; chỉ số chuyên sâu
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng modal (Esc)"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? isEmerald
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/20'
                  : 'bg-blue-600 text-white shadow-sm shadow-blue-700/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <i className="fa-solid fa-table-cells-large"></i>
            Tổng quan bảng đấu
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'teams'
                ? isEmerald
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/20'
                  : 'bg-blue-600 text-white shadow-sm shadow-blue-700/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <i className="fa-solid fa-users-viewfinder"></i>
            So sánh chi tiết các đội
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          {activeTab === 'overview' ? (
            <>
              {/* Top Overview KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {/* Total Matches */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    <span>Số Trận Đã Đấu</span>
                    <i className="fa-regular fa-futbol text-emerald-500"></i>
                  </div>
                  <div className="mt-2">
                    <div className="font-oswald text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {stats.playedMatchesCount}{' '}
                      <span className="text-xs font-sans text-slate-400 font-normal">
                        / {stats.totalMatchesCount}
                      </span>
                    </div>
                    <div className="mt-1.5 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isEmerald ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                      Hoàn thành {stats.completionRate}% bảng đấu
                    </span>
                  </div>
                </div>

                {/* Total Goals */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    <span>Tổng Bàn Thắng</span>
                    <i className="fa-solid fa-fire text-amber-500"></i>
                  </div>
                  <div className="mt-2">
                    <div className="font-oswald text-2xl sm:text-3xl font-black text-amber-500">
                      {stats.totalGoals}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                      TB{' '}
                      <strong className="text-slate-900 dark:text-white font-bold">
                        {stats.avgGoalsPerMatch}
                      </strong>{' '}
                      bàn / trận
                    </p>
                  </div>
                </div>

                {/* Win / Draw Ratio */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    <span>Phân Định Thắng / Hòa</span>
                    <i className="fa-solid fa-scale-balanced text-indigo-500"></i>
                  </div>
                  <div className="mt-2">
                    <div className="font-oswald text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {stats.homeWins + stats.awayWins}{' '}
                      <span className="text-xs font-sans text-slate-400 font-normal">
                        thắng
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {stats.draws} trận hòa (
                      {stats.playedMatchesCount > 0
                        ? Math.round((stats.draws / stats.playedMatchesCount) * 100)
                        : 0}
                      %)
                    </p>
                  </div>
                </div>

                {/* Number of Teams */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    <span>Quy Mô Bảng</span>
                    <i className="fa-solid fa-users text-cyan-500"></i>
                  </div>
                  <div className="mt-2">
                    <div className="font-oswald text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {standings.length}{' '}
                      <span className="text-xs font-sans text-slate-400 font-normal">
                        HLV
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                      Top 2 giành vé Knockout
                    </p>
                  </div>
                </div>
              </div>

              {/* Group Awards / Spotlight Section */}
              <div className="space-y-3">
                <h4 className="font-oswald text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-award text-amber-500"></i>
                  Danh Hiệu &amp; Điểm Nhấn Bảng Đấu
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Best Attack */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 dark:border-amber-500/30 flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg shrink-0">
                      <i className="fa-solid fa-bullseye"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                        Hàng Công Xuất Sắc Nhất
                      </span>
                      {stats.topScorerTeam ? (
                        <>
                          <h5 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate mt-0.5">
                            {stats.topScorerTeam.teamName}
                          </h5>
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mt-1">
                            <span className="font-oswald font-black text-amber-600 dark:text-amber-400 text-sm">
                              {stats.topScorerTeam.goalsFor} bàn thắng
                            </span>
                            <span>•</span>
                            <span>
                              {stats.topScorerTeam.played > 0
                                ? (
                                    stats.topScorerTeam.goalsFor /
                                    stats.topScorerTeam.played
                                  ).toFixed(1)
                                : 0}{' '}
                              bàn/trận
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-slate-400 mt-1">Chưa có dữ liệu</p>
                      )}
                    </div>
                  </div>

                  {/* Best Defense */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 dark:border-emerald-500/30 flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg shrink-0">
                      <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                        Phòng Ngự Thép
                      </span>
                      {stats.bestDefenseTeam ? (
                        <>
                          <h5 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate mt-0.5">
                            {stats.bestDefenseTeam.teamName}
                          </h5>
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mt-1">
                            <span className="font-oswald font-black text-emerald-600 dark:text-emerald-400 text-sm">
                              {stats.bestDefenseTeam.goalsAgainst} bàn thua
                            </span>
                            <span>•</span>
                            <span>
                              {stats.bestDefenseTeam.played > 0
                                ? (
                                    stats.bestDefenseTeam.goalsAgainst /
                                    stats.bestDefenseTeam.played
                                  ).toFixed(1)
                                : 0}{' '}
                              bàn/trận
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-slate-400 mt-1">Chưa có dữ liệu</p>
                      )}
                    </div>
                  </div>

                  {/* Best Win Rate */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 dark:border-blue-500/30 flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg shrink-0">
                      <i className="fa-solid fa-trophy"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                        Tỷ Lệ Chiến Thắng Cao Nhất
                      </span>
                      {stats.topWinRateTeam ? (
                        <>
                          <h5 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate mt-0.5">
                            {stats.topWinRateTeam.teamName}
                          </h5>
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mt-1">
                            <span className="font-oswald font-black text-blue-600 dark:text-blue-400 text-sm">
                              {Math.round(
                                (stats.topWinRateTeam.won /
                                  stats.topWinRateTeam.played) *
                                  100
                              )}
                              % Thắng
                            </span>
                            <span>•</span>
                            <span>
                              {stats.topWinRateTeam.won} thắng /{' '}
                              {stats.topWinRateTeam.played} trận
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-slate-400 mt-1">Chưa có dữ liệu</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notable Matches / Records */}
              {(highestScoringMatch || biggestWinMatch) && (
                <div className="space-y-3">
                  <h4 className="font-oswald text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <i className="fa-solid fa-bolt text-yellow-500"></i>
                    Trận Cầu Đáng Chú Ý
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {highestScoringMatch && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            Nhiều bàn thắng nhất ({highestScoringMatch.total} bàn)
                          </span>
                          <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                            {highestScoringMatch.homeName} vs{' '}
                            {highestScoringMatch.awayName}
                          </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-xl font-oswald font-black text-sm sm:text-base bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          {highestScoringMatch.homeScore} -{' '}
                          {highestScoringMatch.awayScore}
                        </span>
                      </div>
                    )}

                    {biggestWinMatch && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            Thắng cách biệt lớn nhất (+{biggestWinMatch.diff} bàn)
                          </span>
                          <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                            {biggestWinMatch.winnerName} thắng{' '}
                            {biggestWinMatch.loserName}
                          </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-xl font-oswald font-black text-sm sm:text-base bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          {biggestWinMatch.winnerScore} -{' '}
                          {biggestWinMatch.loserScore}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Teams Detailed Matrix Tab */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-oswald text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-emerald-500"></i>
                  Bảng So Sánh Chỉ Số Từng Đội
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  PPG: Điểm trung bình mỗi trận • BT: Bàn Thắng • BB: Bàn Thua
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs sm:text-sm min-w-[650px]">
                  <thead className="bg-[#0b172a] text-white font-oswald uppercase text-[11px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3 text-center w-12">#</th>
                      <th className="py-3 px-3 min-w-[180px]">Đội Bóng / HLV</th>
                      <th className="py-3 px-2 text-center w-12" title="Số trận đã đấu">
                        Trận
                      </th>
                      <th className="py-3 px-2 text-center w-12" title="Tỉ lệ thắng">
                        % Thắng
                      </th>
                      <th className="py-3 px-2 text-center w-14" title="Điểm mỗi trận">
                        PPG
                      </th>
                      <th className="py-3 px-3 text-center min-w-[140px]" title="Tương quan BT / BB">
                        Công / Thủ (BT - BB)
                      </th>
                      <th className="py-3 px-2 text-center w-14" title="Giữ sạch lưới">
                        Clean Sheet
                      </th>
                      <th className="py-3 px-3 text-center w-16" title="Tổng điểm">
                        Điểm
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
                    {standings.map((team, idx) => {
                      const winRate =
                        team.played > 0 ? Math.round((team.won / team.played) * 100) : 0;
                      const ppg =
                        team.played > 0 ? (team.points / team.played).toFixed(2) : '0.00';
                      const cleanSheets = stats.cleanSheetsMap[team.teamId] ?? 0;
                      const totalGoalsInvolved = team.goalsFor + team.goalsAgainst;
                      const attackPercent =
                        totalGoalsInvolved > 0
                          ? Math.round((team.goalsFor / totalGoalsInvolved) * 100)
                          : 50;

                      return (
                        <tr
                          key={team.teamId}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="py-3 px-3 text-center font-oswald font-bold text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2.5">
                              <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-oswald font-bold text-[11px] flex items-center justify-center shrink-0">
                                {getTeamInitials(team.teamName)}
                              </span>
                              <div className="min-w-0">
                                <span className="block truncate font-bold text-xs sm:text-sm">
                                  {team.teamName}
                                </span>
                                {team.club && (
                                  <span className="text-[10px] text-slate-400 block truncate">
                                    {team.club}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center text-slate-700 dark:text-slate-300 font-bold">
                            {team.played}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                                winRate >= 50
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {winRate}%
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                            {ppg}
                          </td>
                          <td className="py-3 px-3">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-mono">
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                  {team.goalsFor} BT
                                </span>
                                <span className="text-rose-500 font-bold">
                                  {team.goalsAgainst} BB
                                </span>
                              </div>
                              <div className="w-full bg-rose-500/30 h-1.5 rounded-full overflow-hidden flex">
                                <div
                                  className="bg-emerald-500 h-full rounded-l-full"
                                  style={{ width: `${attackPercent}%` }}
                                  title={`Tỉ lệ ghi bàn: ${attackPercent}%`}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                            <span className="inline-flex items-center gap-1">
                              <i className="fa-solid fa-shield text-[9px] text-slate-400"></i>
                              {cleanSheets}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded-lg font-oswald font-black text-xs sm:text-sm ${
                                isEmerald
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-blue-600 text-white'
                              }`}
                            >
                              {team.points}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
            <i className="fa-solid fa-circle-info mr-1 text-slate-400"></i>
            Dữ liệu được cập nhật theo từng tỉ số được nhập lên hệ thống
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-oswald font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            Đóng bảng thống kê
          </button>
        </div>
      </div>
    </div>
  );
};
