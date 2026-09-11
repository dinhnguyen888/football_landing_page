import React, { useState, useMemo } from 'react';
import { TournamentData, TeamStats, calculateGroupStandings } from '../utils/tournamentEngine';

export interface TournamentStatsViewProps {
  tournament: TournamentData;
  theme?: 'emerald' | 'blue';
}

export interface PlayerTotalStats {
  teamId: string;
  name: string;
  club?: string;
  groupName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  cleanSheets: number;
  goalsPerMatch: number;
  concededPerMatch: number;
  winRate: number;
  maxGoalsInSingleMatch: number;
}

export interface MatchHighlight {
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  totalGoals: number;
  stageName: string;
}

export interface BiggestWinHighlight {
  winnerName: string;
  loserName: string;
  winnerScore: number;
  loserScore: number;
  diff: number;
  stageName: string;
}

function getTeamInitials(name: string): string {
  if (!name) return 'FC';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_GRADIENTS = [
  'from-emerald-600 to-teal-700 text-emerald-100',
  'from-blue-600 to-indigo-700 text-blue-100',
  'from-purple-600 to-pink-700 text-purple-100',
  'from-amber-600 to-orange-700 text-amber-100',
  'from-rose-600 to-red-700 text-rose-100',
  'from-cyan-600 to-blue-700 text-cyan-100',
  'from-violet-600 to-purple-700 text-violet-100',
  'from-teal-600 to-emerald-700 text-teal-100',
];

function getAvatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

type StatsCategory = 'top_scorers' | 'clean_sheets' | 'performance' | 'records';

export const TournamentStatsView: React.FC<TournamentStatsViewProps> = ({
  tournament,
  theme = 'emerald',
}) => {
  const [activeCategory, setActiveCategory] = useState<StatsCategory>('top_scorers');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');
  const isEmerald = theme === 'emerald';

  // Aggregate all players and matches
  const {
    filteredPlayers,
    tournamentKPIs,
    highestScoringMatch,
    biggestWinMatch,
  } = useMemo(() => {
    const playersMap: Record<string, PlayerTotalStats> = {};

    // 1. Initialize from groups
    tournament.groups.forEach((group) => {
      const groupStandings: TeamStats[] = calculateGroupStandings(group);
      const standingsLookup: Record<string, TeamStats> = {};
      groupStandings.forEach((s) => {
        standingsLookup[s.teamId] = s;
      });

      // Clean sheets map for this group
      const cleanSheetsMap: Record<string, number> = {};
      const maxGoalsMap: Record<string, number> = {};
      group.teams.forEach((t) => {
        cleanSheetsMap[t.id] = 0;
        maxGoalsMap[t.id] = 0;
      });

      group.matches.forEach((m) => {
        if (m.played && m.homeScore !== null && m.awayScore !== null) {
          if (m.awayScore === 0) cleanSheetsMap[m.homeTeamId] = (cleanSheetsMap[m.homeTeamId] || 0) + 1;
          if (m.homeScore === 0) cleanSheetsMap[m.awayTeamId] = (cleanSheetsMap[m.awayTeamId] || 0) + 1;

          if (m.homeScore > (maxGoalsMap[m.homeTeamId] || 0)) {
            maxGoalsMap[m.homeTeamId] = m.homeScore;
          }
          if (m.awayScore > (maxGoalsMap[m.awayTeamId] || 0)) {
            maxGoalsMap[m.awayTeamId] = m.awayScore;
          }
        }
      });

      group.teams.forEach((t) => {
        const s = standingsLookup[t.id];
        const played = s ? s.played : 0;
        const gf = s ? s.goalsFor : 0;
        const ga = s ? s.goalsAgainst : 0;
        const won = s ? s.won : 0;
        const drawn = s ? s.drawn : 0;
        const lost = s ? s.lost : 0;
        const points = s ? s.points : 0;
        const cs = cleanSheetsMap[t.id] || 0;

        playersMap[t.id] = {
          teamId: t.id,
          name: t.name,
          club: t.club,
          groupName: group.name,
          played,
          won,
          drawn,
          lost,
          goalsFor: gf,
          goalsAgainst: ga,
          goalDifference: gf - ga,
          points,
          cleanSheets: cs,
          goalsPerMatch: played > 0 ? Number((gf / played).toFixed(2)) : 0,
          concededPerMatch: played > 0 ? Number((ga / played).toFixed(2)) : 0,
          winRate: played > 0 ? Math.round((won / played) * 100) : 0,
          maxGoalsInSingleMatch: maxGoalsMap[t.id] || 0,
        };
      });
    });

    // 2. Also factor in Knockout matches if any
    if (tournament.knockoutStage?.rounds) {
      tournament.knockoutStage.rounds.forEach((round) => {
        round.matches.forEach((km) => {
          if (km.played && km.homeScore !== null && km.awayScore !== null) {
            // Find home team in playersMap by name
            const homeP = Object.values(playersMap).find(
              (p) => p.name.trim().toLowerCase() === km.homeTeamName.trim().toLowerCase()
            );
            if (homeP) {
              homeP.played += 1;
              homeP.goalsFor += km.homeScore;
              homeP.goalsAgainst += km.awayScore;
              homeP.goalDifference = homeP.goalsFor - homeP.goalsAgainst;
              if (km.homeScore > km.awayScore) {
                homeP.won += 1;
                homeP.points += 3;
              } else if (km.homeScore === km.awayScore) {
                homeP.drawn += 1;
                homeP.points += 1;
              } else {
                homeP.lost += 1;
              }
              if (km.awayScore === 0) homeP.cleanSheets += 1;
              if (km.homeScore > homeP.maxGoalsInSingleMatch) {
                homeP.maxGoalsInSingleMatch = km.homeScore;
              }
              homeP.goalsPerMatch = Number((homeP.goalsFor / homeP.played).toFixed(2));
              homeP.concededPerMatch = Number((homeP.goalsAgainst / homeP.played).toFixed(2));
              homeP.winRate = Math.round((homeP.won / homeP.played) * 100);
            }

            // Away team
            const awayP = Object.values(playersMap).find(
              (p) => p.name.trim().toLowerCase() === km.awayTeamName.trim().toLowerCase()
            );
            if (awayP) {
              awayP.played += 1;
              awayP.goalsFor += km.awayScore;
              awayP.goalsAgainst += km.homeScore;
              awayP.goalDifference = awayP.goalsFor - awayP.goalsAgainst;
              if (km.awayScore > km.homeScore) {
                awayP.won += 1;
                awayP.points += 3;
              } else if (km.awayScore === km.homeScore) {
                awayP.drawn += 1;
                awayP.points += 1;
              } else {
                awayP.lost += 1;
              }
              if (km.homeScore === 0) awayP.cleanSheets += 1;
              if (km.awayScore > awayP.maxGoalsInSingleMatch) {
                awayP.maxGoalsInSingleMatch = km.awayScore;
              }
              awayP.goalsPerMatch = Number((awayP.goalsFor / awayP.played).toFixed(2));
              awayP.concededPerMatch = Number((awayP.goalsAgainst / awayP.played).toFixed(2));
              awayP.winRate = Math.round((awayP.won / awayP.played) * 100);
            }
          }
        });
      });
    }

    // 3. Compute overall tournament KPIs and highlights
    let totalScheduledMatches = 0;
    let totalPlayedMatches = 0;
    let totalTournamentGoals = 0;
    let totalWins = 0;
    let totalDraws = 0;

    let bestScoringMatch: MatchHighlight | null = null;
    let bestWinMatch: BiggestWinHighlight | null = null;

    // Team name lookup
    const allTeamsLookup: Record<string, string> = {};
    tournament.groups.forEach((g) => {
      g.teams.forEach((t) => {
        allTeamsLookup[t.id] = t.name;
      });
    });

    tournament.groups.forEach((g) => {
      totalScheduledMatches += g.matches.length;
      g.matches.forEach((m) => {
        if (m.played && m.homeScore !== null && m.awayScore !== null) {
          totalPlayedMatches++;
          const matchTotal = m.homeScore + m.awayScore;
          totalTournamentGoals += matchTotal;

          if (m.homeScore === m.awayScore) totalDraws++;
          else totalWins++;

          const hName = allTeamsLookup[m.homeTeamId] || 'Đội nhà';
          const aName = allTeamsLookup[m.awayTeamId] || 'Đội khách';

          if (!bestScoringMatch || matchTotal > bestScoringMatch.totalGoals) {
            bestScoringMatch = {
              homeName: hName,
              awayName: aName,
              homeScore: m.homeScore,
              awayScore: m.awayScore,
              totalGoals: matchTotal,
              stageName: g.name,
            };
          }

          const diff = Math.abs(m.homeScore - m.awayScore);
          if (diff > 0 && (!bestWinMatch || diff > bestWinMatch.diff)) {
            const isHomeWin = m.homeScore > m.awayScore;
            bestWinMatch = {
              winnerName: isHomeWin ? hName : aName,
              loserName: isHomeWin ? aName : hName,
              winnerScore: isHomeWin ? m.homeScore : m.awayScore,
              loserScore: isHomeWin ? m.awayScore : m.homeScore,
              diff,
              stageName: g.name,
            };
          }
        }
      });
    });

    // Also include knockout matches in KPIs
    if (tournament.knockoutStage?.rounds) {
      tournament.knockoutStage.rounds.forEach((r) => {
        totalScheduledMatches += r.matches.length;
        r.matches.forEach((km) => {
          if (km.played && km.homeScore !== null && km.awayScore !== null) {
            totalPlayedMatches++;
            const matchTotal = km.homeScore + km.awayScore;
            totalTournamentGoals += matchTotal;
            if (km.homeScore === km.awayScore) totalDraws++;
            else totalWins++;

            if (!bestScoringMatch || matchTotal > bestScoringMatch.totalGoals) {
              bestScoringMatch = {
                homeName: km.homeTeamName,
                awayName: km.awayTeamName,
                homeScore: km.homeScore,
                awayScore: km.awayScore,
                totalGoals: matchTotal,
                stageName: r.name,
              };
            }

            const diff = Math.abs(km.homeScore - km.awayScore);
            if (diff > 0 && (!bestWinMatch || diff > bestWinMatch.diff)) {
              const isHomeWin = km.homeScore > km.awayScore;
              bestWinMatch = {
                winnerName: isHomeWin ? km.homeTeamName : km.awayTeamName,
                loserName: isHomeWin ? km.awayTeamName : km.homeTeamName,
                winnerScore: isHomeWin ? km.homeScore : km.awayScore,
                loserScore: isHomeWin ? km.awayScore : km.homeScore,
                diff,
                stageName: r.name,
              };
            }
          }
        });
      });
    }

    const allPlayersList = Object.values(playersMap);

    const filtered =
      selectedGroupFilter === 'ALL'
        ? allPlayersList
        : allPlayersList.filter((p) => p.groupName === selectedGroupFilter);

    const completionPercent =
      totalScheduledMatches > 0
        ? Math.round((totalPlayedMatches / totalScheduledMatches) * 100)
        : 0;

    const avgGoals =
      totalPlayedMatches > 0
        ? (totalTournamentGoals / totalPlayedMatches).toFixed(2)
        : '0.00';

    return {
      allPlayers: allPlayersList,
      filteredPlayers: filtered,
      tournamentKPIs: {
        totalScheduledMatches,
        totalPlayedMatches,
        totalTournamentGoals,
        avgGoals,
        totalWins,
        totalDraws,
        completionPercent,
        totalParticipants: allPlayersList.length,
      },
      highestScoringMatch: bestScoringMatch as MatchHighlight | null,
      biggestWinMatch: bestWinMatch as BiggestWinHighlight | null,
    };
  }, [tournament, selectedGroupFilter]);

  // Sortings for different categories
  const sortedPlayers = useMemo(() => {
    const list = [...filteredPlayers];
    switch (activeCategory) {
      case 'top_scorers':
        return list.sort((a, b) => {
          if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
          if (a.played !== b.played && a.played > 0 && b.played > 0) return a.played - b.played;
          return b.goalDifference - a.goalDifference;
        });
      case 'clean_sheets':
        return list.sort((a, b) => {
          if (b.cleanSheets !== a.cleanSheets) return b.cleanSheets - a.cleanSheets;
          if (a.goalsAgainst !== b.goalsAgainst) return a.goalsAgainst - b.goalsAgainst;
          return b.played - a.played;
        });
      case 'performance':
        return list
          .filter((p) => p.played > 0)
          .sort((a, b) => {
            const ppgA = a.played > 0 ? a.points / a.played : 0;
            const ppgB = b.played > 0 ? b.points / b.played : 0;
            if (ppgB !== ppgA) return ppgB - ppgA;
            return b.winRate - a.winRate;
          });
      case 'records':
      default:
        return list.sort((a, b) => b.goalsFor - a.goalsFor);
    }
  }, [filteredPlayers, activeCategory]);

  const top1Leader = sortedPlayers.length > 0 ? sortedPlayers[0] : null;
  const maxStatValue = useMemo(() => {
    if (sortedPlayers.length === 0) return 1;
    if (activeCategory === 'top_scorers') return Math.max(1, sortedPlayers[0].goalsFor);
    if (activeCategory === 'clean_sheets') return Math.max(1, sortedPlayers[0].cleanSheets);
    if (activeCategory === 'performance') return 100;
    return 1;
  }, [sortedPlayers, activeCategory]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ================= 1. TOURNAMENT STATS HERO SUMMARY ================= */}
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800 text-white border border-slate-700/60 shadow-xl relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div
          className={`absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
            isEmerald ? 'bg-emerald-500' : 'bg-blue-500'
          }`}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`px-2.5 py-0.5 rounded-full font-oswald text-[10px] font-bold uppercase tracking-wider ${
                  isEmerald ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                }`}
              >
                TOURNAMENT STATISTICS &amp; LEADERBOARD
              </span>
              <span className="text-xs text-slate-400">• Cập nhật trực tiếp</span>
            </div>
            <h2 className="font-oswald text-2xl sm:text-3xl font-black uppercase tracking-wide text-white">
              SỐ LIỆU THỐNG KÊ {tournament.tournamentName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Bảng vàng Vua Phá Lưới, Găng Tay Vàng, Hiệu suất tấn công &amp; Kỷ lục bàn thắng toàn giải
            </p>
          </div>

          {/* Group Filter Dropdown */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/70">
            <span className="text-xs font-oswald font-bold uppercase text-slate-400 pl-2">
              <i className="fa-solid fa-filter mr-1 text-slate-500"></i>
              Phạm Vi:
            </span>
            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              className="bg-slate-900 text-white text-xs font-oswald font-bold uppercase rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="ALL">Toàn Giải (Tất Cả Các Bảng)</option>
              {tournament.groups.map((g) => (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
          {/* Total Goals */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Tổng Bàn Thắng</span>
              <i className="fa-solid fa-fire text-amber-400 text-sm"></i>
            </div>
            <div className="mt-2">
              <div className="font-oswald text-3xl font-black text-amber-400">
                {tournamentKPIs.totalTournamentGoals}
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                TB <strong className="text-white font-bold">{tournamentKPIs.avgGoals}</strong> bàn / trận
              </span>
            </div>
          </div>

          {/* Total Matches */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Trận Đã Thi Đấu</span>
              <i className="fa-regular fa-futbol text-emerald-400 text-sm"></i>
            </div>
            <div className="mt-2">
              <div className="font-oswald text-3xl font-black text-white">
                {tournamentKPIs.totalPlayedMatches}{' '}
                <span className="text-sm font-sans font-normal text-slate-400">
                  / {tournamentKPIs.totalScheduledMatches}
                </span>
              </div>
              <div className="mt-1.5 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isEmerald ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${tournamentKPIs.completionPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Decisive Ratio */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Kết Quả Thắng / Hòa</span>
              <i className="fa-solid fa-scale-balanced text-indigo-400 text-sm"></i>
            </div>
            <div className="mt-2">
              <div className="font-oswald text-3xl font-black text-white">
                {tournamentKPIs.totalWins}{' '}
                <span className="text-sm font-sans font-normal text-slate-400">thắng</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {tournamentKPIs.totalDraws} trận hòa (
                {tournamentKPIs.totalPlayedMatches > 0
                  ? Math.round((tournamentKPIs.totalDraws / tournamentKPIs.totalPlayedMatches) * 100)
                  : 0}
                %)
              </span>
            </div>
          </div>

          {/* Total Participants */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Huấn Luyện Viên</span>
              <i className="fa-solid fa-users text-cyan-400 text-sm"></i>
            </div>
            <div className="mt-2">
              <div className="font-oswald text-3xl font-black text-white">
                {tournamentKPIs.totalParticipants}
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {tournament.numGroups} bảng đấu • {tournament.teamsPerGroup} HLV/bảng
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. CATEGORY PILL TABS (GIỐNG GOOGLE STATS) ================= */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {/* Vua Phá Lưới */}
        <button
          type="button"
          onClick={() => setActiveCategory('top_scorers')}
          className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeCategory === 'top_scorers'
              ? isEmerald
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-fire text-amber-400"></i>
          <span>Vua Phá Lưới</span>
        </button>

        {/* Giữ Sạch Lưới */}
        <button
          type="button"
          onClick={() => setActiveCategory('clean_sheets')}
          className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeCategory === 'clean_sheets'
              ? isEmerald
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-shield-halved text-cyan-400"></i>
          <span>Giữ Sạch Lưới</span>
        </button>

        {/* Hiệu Suất */}
        <button
          type="button"
          onClick={() => setActiveCategory('performance')}
          className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeCategory === 'performance'
              ? isEmerald
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-chart-line text-indigo-400"></i>
          <span>Hiệu Suất</span>
        </button>

        {/* Kỷ Lục & Trận Cầu */}
        <button
          type="button"
          onClick={() => setActiveCategory('records')}
          className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeCategory === 'records'
              ? isEmerald
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-bolt text-yellow-400"></i>
          <span>Kỷ Lục &amp; Trận Cầu</span>
        </button>
      </div>

      {/* ================= 3. LEADER HERO SPOTLIGHT CARD (#1) ================= */}
      {top1Leader && activeCategory !== 'records' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-50 to-amber-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border-2 border-amber-400/40 dark:border-amber-500/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="flex items-center space-x-4 sm:space-x-5 min-w-0">
            {/* Big Avatar */}
            <div className="relative shrink-0">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${getAvatarGradient(
                  top1Leader.name
                )} flex items-center justify-center font-oswald font-black text-xl sm:text-2xl shadow-lg ring-4 ring-amber-400/40`}
              >
                {getTeamInitials(top1Leader.name)}
              </div>
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-oswald font-black text-xs flex items-center justify-center shadow-md">
                #1
              </span>
            </div>

            {/* Leader details */}
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-oswald font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40">
                <i className="fa-solid fa-crown text-amber-500"></i>
                {activeCategory === 'top_scorers'
                  ? 'CHIẾC GIÀY VÀNG - VUA PHÁ LƯỚI'
                  : activeCategory === 'clean_sheets'
                  ? 'GĂNG TAY VÀNG - GIỮ SẠCH LƯỚI'
                  : 'HIỆU SUẤT XUẤT SẮC NHẤT'}
              </span>
              <h3 className="font-oswald text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white truncate mt-1">
                {top1Leader.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-0.5 flex-wrap">
                {top1Leader.club && (
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    <i className="fa-solid fa-shield-halved mr-1 text-slate-400"></i>
                    {top1Leader.club}
                  </span>
                )}
                <span>•</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {top1Leader.groupName}
                </span>
                <span>•</span>
                <span>{top1Leader.played} trận đã đấu</span>
              </div>
            </div>
          </div>

          {/* Big Leader Metric */}
          <div className="text-center sm:text-right shrink-0 bg-white/80 dark:bg-slate-800/80 px-5 py-3 rounded-2xl border border-amber-300/40 dark:border-amber-500/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              {activeCategory === 'top_scorers'
                ? 'Tổng Bàn Thắng'
                : activeCategory === 'clean_sheets'
                ? 'Trận Sạch Lưới'
                : 'Điểm Trung Bình (PPG)'}
            </span>
            <div className="font-oswald text-4xl sm:text-5xl font-black text-amber-500 mt-0.5">
              {activeCategory === 'top_scorers'
                ? top1Leader.goalsFor
                : activeCategory === 'clean_sheets'
                ? top1Leader.cleanSheets
                : (top1Leader.points / Math.max(1, top1Leader.played)).toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              {activeCategory === 'top_scorers'
                ? `TB ${top1Leader.goalsPerMatch} bàn/trận`
                : activeCategory === 'clean_sheets'
                ? `${Math.round((top1Leader.cleanSheets / Math.max(1, top1Leader.played)) * 100)}% tỷ lệ sạch • ${top1Leader.goalsAgainst} bàn thua (${top1Leader.concededPerMatch}/trận)`
                : `${top1Leader.winRate}% tỷ lệ thắng`}
            </span>
          </div>
        </div>
      )}

      {/* ================= 4. MAIN LEADERBOARD TABLE (GIỐNG GOOGLE STATS) ================= */}
      {activeCategory !== 'records' ? (
        <div className="p-5 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-oswald text-lg sm:text-xl font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2">
                <i
                  className={`fa-solid ${
                    activeCategory === 'top_scorers'
                      ? 'fa-fire text-amber-500'
                      : activeCategory === 'clean_sheets'
                      ? 'fa-shield-halved text-cyan-500'
                      : 'fa-chart-line text-indigo-500'
                  }`}
                ></i>
                {activeCategory === 'top_scorers' && 'BẢNG XẾP HẠNG VUA PHÁ LƯỚI'}
                {activeCategory === 'clean_sheets' && 'BẢNG XẾP HẠNG GIỮ SẠCH LƯỚI'}
                {activeCategory === 'performance' && 'BẢNG XẾP HẠNG HIỆU SUẤT & ĐIỂM SỐ'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thứ hạng được tính trên toàn bộ các trận đấu chính thức của giải đấu
              </p>
            </div>

            <span className="text-xs text-slate-500 font-semibold">
              Tổng cộng {sortedPlayers.length} HLV
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[650px]">
              <thead className="bg-[#0b172a] text-white font-oswald uppercase text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3 text-center w-12 sm:w-14">Hạng</th>
                  <th className="py-3 px-3 min-w-[200px]">Huấn Luyện Viên / CLB</th>
                  <th className="py-3 px-2 text-center w-16">Bảng</th>
                  <th className="py-3 px-2 text-center w-14" title="Số trận đã thi đấu">
                    Trận
                  </th>
                  <th className="py-3 px-3 text-center w-24">
                    {activeCategory === 'top_scorers' && 'Bàn Thắng'}
                    {activeCategory === 'clean_sheets' && 'Sạch Lưới'}
                    {activeCategory === 'performance' && 'Điểm / PPG'}
                  </th>
                  <th className="py-3 px-3 min-w-[160px]" title="So sánh tỷ lệ phần trăm">
                    Tương Quan Trực Quan
                  </th>
                  <th className="py-3 px-3 text-center w-28">
                    {activeCategory === 'clean_sheets' ? 'Thủng Lưới' : 'Hiệu Suất'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
                {sortedPlayers.map((player, idx) => {
                  const rank = idx + 1;
                  const isTop1 = rank === 1;
                  const isTop2 = rank === 2;
                  const isTop3 = rank === 3;

                  // Compute metric & bar width
                  let metricDisplay = '';
                  let subMetric = '';
                  let barPercent = 0;

                  if (activeCategory === 'top_scorers') {
                    metricDisplay = `${player.goalsFor}`;
                    subMetric = `${player.goalsPerMatch}/trận`;
                    barPercent = maxStatValue > 0 ? Math.round((player.goalsFor / maxStatValue) * 100) : 0;
                  } else if (activeCategory === 'clean_sheets') {
                    metricDisplay = `${player.cleanSheets} trận`;
                    subMetric = `${player.goalsAgainst} bàn (${player.concededPerMatch}/trận)`;
                    barPercent = maxStatValue > 0 ? Math.round((player.cleanSheets / maxStatValue) * 100) : 0;
                  } else {
                    const ppg = player.played > 0 ? Number((player.points / player.played).toFixed(2)) : 0;
                    metricDisplay = `${player.points}đ (${ppg})`;
                    subMetric = `${player.winRate}% Thắng`;
                    barPercent = Math.round((ppg / 3) * 100);
                  }

                  return (
                    <tr
                      key={player.teamId}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isTop1 ? 'bg-amber-500/5 dark:bg-amber-950/15' : ''
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="py-3.5 px-3 text-center">
                        {isTop1 ? (
                          <div className="relative inline-flex items-center justify-center">
                            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs font-oswald shadow-xs">
                              1
                            </span>
                            <i className="fa-solid fa-crown text-[9px] text-amber-500 absolute -top-2 -right-1"></i>
                          </div>
                        ) : isTop2 ? (
                          <span className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-black text-xs font-oswald inline-flex items-center justify-center">
                            2
                          </span>
                        ) : isTop3 ? (
                          <span className="w-7 h-7 rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-400 font-bold text-xs font-oswald inline-flex items-center justify-center">
                            3
                          </span>
                        ) : (
                          <span className="font-oswald font-bold text-slate-500 text-xs">
                            {rank}
                          </span>
                        )}
                      </td>

                      {/* Name & Club */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getAvatarGradient(
                              player.name
                            )} flex items-center justify-center font-oswald font-bold text-xs shadow-2xs shrink-0`}
                          >
                            {getTeamInitials(player.name)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm block truncate">
                              {player.name}
                            </span>
                            {player.club && (
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                                {player.club}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Group */}
                      <td className="py-3.5 px-2 text-center">
                        <span className="px-2 py-0.5 rounded-md font-oswald text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {player.groupName}
                        </span>
                      </td>

                      {/* Played */}
                      <td className="py-3.5 px-2 text-center font-bold text-slate-700 dark:text-slate-300">
                        {player.played}
                      </td>

                      {/* Main Metric Value */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`font-oswald font-black text-sm sm:text-base ${
                            isTop1
                              ? 'text-amber-500 dark:text-amber-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {metricDisplay}
                        </span>
                      </td>

                      {/* Visual Progress Bar (Giống Google Stats) */}
                      <td className="py-3.5 px-3">
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              activeCategory === 'top_scorers'
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                : activeCategory === 'clean_sheets'
                                ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                                : 'bg-gradient-to-r from-indigo-400 to-purple-500'
                            }`}
                            style={{ width: `${barPercent}%` }}
                          />
                        </div>
                      </td>

                      {/* Efficiency / Sub-metric */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {subMetric}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ================= 5. RECORDS & NOTABLE MATCHES TAB ================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Highest Scoring Match */}
            {highestScoringMatch ? (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-oswald font-bold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    <i className="fa-solid fa-fire"></i>
                    TRẬN ĐẤU NHIỀU BÀN THẮNG NHẤT
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {highestScoringMatch.stageName}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                  <div className="min-w-0 pr-3">
                    <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                      {highestScoringMatch.homeName}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">vs</div>
                    <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                      {highestScoringMatch.awayName}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-oswald font-black text-2xl sm:text-3xl text-amber-500">
                      {highestScoringMatch.homeScore} - {highestScoringMatch.awayScore}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">
                      Tổng {highestScoringMatch.totalGoals} bàn thắng
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
                Chưa có dữ liệu trận đấu
              </div>
            )}

            {/* Biggest Win */}
            {biggestWinMatch ? (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-oswald font-bold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <i className="fa-solid fa-trophy"></i>
                    TRẬN THẮNG ĐẬM NHẤT (CÁCH BIỆT)
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {biggestWinMatch.stageName}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                  <div className="min-w-0 pr-3">
                    <div className="font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 truncate">
                      {biggestWinMatch.winnerName} (Thắng)
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">đối đầu</div>
                    <div className="font-bold text-sm sm:text-base text-slate-700 dark:text-slate-300 truncate">
                      {biggestWinMatch.loserName}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-oswald font-black text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400">
                      {biggestWinMatch.winnerScore} - {biggestWinMatch.loserScore}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">
                      Cách biệt +{biggestWinMatch.diff} bàn
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
                Chưa có dữ liệu trận đấu
              </div>
            )}
          </div>

          {/* Group Attack & Defense Summary Comparison Cards */}
          <div className="p-5 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-oswald text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-layer-group text-blue-500"></i>
              Tổng Hợp Tấn Công &amp; Phòng Ngự Theo Từng Bảng
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {tournament.groups.map((grp) => {
                const groupStandings = calculateGroupStandings(grp);
                const totalGoals = groupStandings.reduce((sum, t) => sum + t.goalsFor, 0);
                const totalPlayed = grp.matches.filter((m) => m.played).length;
                const topScorer = [...groupStandings].sort((a, b) => b.goalsFor - a.goalsFor)[0];

                return (
                  <div
                    key={grp.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
                      <span className="font-oswald font-black text-sm uppercase text-slate-900 dark:text-white">
                        {grp.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {totalPlayed}/{grp.matches.length} trận
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tổng bàn thắng:</span>
                        <strong className="text-amber-500 font-bold">{totalGoals} bàn</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">TB mỗi trận:</span>
                        <strong className="text-slate-800 dark:text-slate-200 font-bold">
                          {totalPlayed > 0 ? (totalGoals / totalPlayed).toFixed(1) : 0} bàn
                        </strong>
                      </div>
                      {topScorer && topScorer.goalsFor > 0 && (
                        <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/40 text-[11px]">
                          <span className="text-slate-400">Vua dội bom:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate max-w-[120px]">
                            {topScorer.teamName} ({topScorer.goalsFor})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
