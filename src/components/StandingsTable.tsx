import React, { useState } from 'react';
import { TeamStats, Match } from '../utils/tournamentEngine';
import { StandingsStatsModal } from './StandingsStatsModal';

export interface StandingsTableProps {
  groupName: string;
  standings: TeamStats[];
  matches?: Match[];
  theme?: 'emerald' | 'blue';
  qualificationNote?: string;
  showForm?: boolean;
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

function getTeamForm(teamId: string, matches?: Match[]): Array<'W' | 'D' | 'L'> {
  if (!matches || !Array.isArray(matches)) return [];
  const teamMatches = matches
    .filter(
      (m) =>
        m.played &&
        m.homeScore !== null &&
        m.awayScore !== null &&
        (m.homeTeamId === teamId || m.awayTeamId === teamId)
    )
    .sort((a, b) => a.round - b.round);

  return teamMatches.map((m) => {
    const isHome = m.homeTeamId === teamId;
    const teamScore = isHome ? m.homeScore! : m.awayScore!;
    const oppScore = isHome ? m.awayScore! : m.homeScore!;
    if (teamScore > oppScore) return 'W';
    if (teamScore === oppScore) return 'D';
    return 'L';
  });
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  groupName,
  standings,
  matches = [],
  theme = 'emerald',
  qualificationNote = 'Top 1 & Top 2 giành vé trực tiếp vào Vòng 16 Đội (Knockout)',
  showForm = true,
}) => {
  const [showStatsModal, setShowStatsModal] = useState(false);
  const isEmerald = theme === 'emerald';

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all">
      {/* Accent Gradient Top Border */}
      <div
        className={`h-1.5 w-full ${
          isEmerald
            ? 'bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-500'
            : 'bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600'
        }`}
      />

      {/* Header Container */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-xs border ${
              isEmerald
                ? 'bg-gradient-to-br from-emerald-500/15 to-amber-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-gradient-to-br from-blue-500/15 to-cyan-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
            }`}
          >
            <i className="fa-solid fa-trophy"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-oswald text-lg sm:text-xl font-bold uppercase text-slate-900 dark:text-white tracking-wide">
                BẢNG XẾP HẠNG {groupName}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  isEmerald
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
                    : 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    isEmerald ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                ></span>
                Trực tiếp
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Tự động cập nhật tỉ số &amp; điểm số theo thời gian thực
            </p>
          </div>
        </div>

        {/* Action Buttons & Qualification Badge */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Nút Số Liệu Thống Kê */}
          <button
            type="button"
            onClick={() => setShowStatsModal(true)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-oswald font-bold uppercase tracking-wider border transition-all duration-200 cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5 ${
              isEmerald
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-emerald-500/50 shadow-emerald-700/20'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-500/50 shadow-blue-700/20'
            }`}
            title="Xem số liệu thống kê chi tiết của bảng đấu"
          >
            <i className="fa-solid fa-chart-column text-amber-300 text-[11px]"></i>
            <span>Số liệu thống kê</span>
          </button>

          <span
            className={`text-xs px-3 py-1 rounded-full font-oswald font-bold uppercase tracking-wider border ${
              isEmerald
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
            }`}
          >
            <i className="fa-solid fa-award mr-1.5 text-amber-500"></i>
            Top 2 Vào Vòng 1/8
          </span>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="md:hidden px-4 py-2 bg-slate-100/70 dark:bg-slate-800/40 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800">
        <span className="flex items-center gap-1.5 font-medium">
          <i
            className={`fa-solid fa-arrows-left-right text-[10px] ${
              isEmerald ? 'text-emerald-600' : 'text-blue-600'
            }`}
          ></i>
          Vuốt ngang xem đầy đủ Trận, Hiệu số, Điểm &amp; Phong độ
        </span>
        <i className="fa-solid fa-chevron-right text-[9px] opacity-60"></i>
      </div>

      {/* Standings Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm min-w-[620px] sm:min-w-[680px]">
          <thead className="bg-[#0b172a] text-white font-oswald uppercase text-[11px] sm:text-xs tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-3 sm:px-4 text-center w-12 sm:w-14">#</th>
              <th className="py-3 px-3 sm:px-4 min-w-[180px] sm:min-w-[220px]">
                Đội Bóng / Huấn Luyện Viên
              </th>
              <th className="py-3 px-2 text-center w-12" title="Số trận đã đấu">
                Trận
              </th>
              <th className="py-3 px-2 text-center w-11" title="Số trận thắng">
                T
              </th>
              <th className="py-3 px-2 text-center w-11" title="Số trận hòa">
                H
              </th>
              <th className="py-3 px-2 text-center w-11" title="Số trận thua">
                B
              </th>
              <th className="py-3 px-2 text-center w-12" title="Số bàn thắng">
                BT
              </th>
              <th className="py-3 px-2 text-center w-12" title="Số bàn thua">
                BB
              </th>
              <th className="py-3 px-2.5 text-center w-14" title="Hiệu số bàn thắng (BT - BB)">
                HS
              </th>
              <th
                className={`py-3 px-3 sm:px-4 text-center w-16 sm:w-20 font-black ${
                  isEmerald
                    ? 'text-emerald-400 bg-emerald-950/60'
                    : 'text-blue-400 bg-blue-950/60'
                }`}
                title="Tổng điểm tích lũy"
              >
                Điểm
              </th>
              {showForm && (
                <th
                  className="py-3 px-3 sm:px-4 text-center min-w-[120px] hidden md:table-cell"
                  title="Kết quả các trận gần nhất"
                >
                  Phong Độ
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
            {standings.map((teamStat, rankIdx) => {
              const isTop2 = rankIdx < 2;
              const form = getTeamForm(teamStat.teamId, matches);

              return (
                <tr
                  key={teamStat.teamId}
                  className={`group transition-colors duration-150 hover:bg-slate-50/90 dark:hover:bg-slate-800/50 ${
                    isTop2
                      ? isEmerald
                        ? 'bg-emerald-50/35 dark:bg-emerald-950/15'
                        : 'bg-blue-50/35 dark:bg-blue-950/15'
                      : ''
                  }`}
                >
                  {/* Rank Column */}
                  <td
                    className={`py-3 px-2 sm:px-3 text-center border-l-4 transition-all ${
                      isTop2
                        ? isEmerald
                          ? 'border-emerald-500'
                          : 'border-blue-500'
                        : 'border-transparent'
                    }`}
                  >
                    {rankIdx === 0 ? (
                      <div className="relative inline-flex items-center justify-center">
                        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs font-oswald shadow-sm ring-2 ring-amber-300/70 inline-flex items-center justify-center">
                          1
                        </span>
                        <i className="fa-solid fa-crown text-[9px] text-amber-500 absolute -top-2 -right-1 drop-shadow-xs"></i>
                      </div>
                    ) : rankIdx === 1 ? (
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-900 font-black text-xs font-oswald shadow-xs ring-2 ring-slate-300/70 inline-flex items-center justify-center">
                        2
                      </span>
                    ) : rankIdx === 2 ? (
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-700/25 via-amber-800/35 to-amber-900/40 text-amber-900 dark:text-amber-200 font-bold text-xs font-oswald ring-1 ring-amber-700/40 inline-flex items-center justify-center">
                        3
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs font-oswald inline-flex items-center justify-center">
                        {rankIdx + 1}
                      </span>
                    )}
                  </td>

                  {/* Team & Coach Info */}
                  <td className="py-3 px-3 sm:px-4 text-left">
                    <div className="flex items-center space-x-3">
                      {/* Avatar Initials Badge */}
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarGradient(
                          teamStat.teamName
                        )} flex items-center justify-center font-oswald font-bold text-xs shadow-xs shrink-0 ring-1 ring-black/5 dark:ring-white/10`}
                      >
                        {getTeamInitials(teamStat.teamName)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                            {teamStat.teamName}
                          </span>
                          {isTop2 && (
                            <span
                              className={`hidden lg:inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-md tracking-wider ${
                                isEmerald
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                              }`}
                            >
                              <i className="fa-solid fa-check text-[8px]"></i>
                              Vé 1/8
                            </span>
                          )}
                        </div>
                        {teamStat.club && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                            <i className="fa-solid fa-shield-halved text-[9px] text-slate-400"></i>
                            {teamStat.club}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Matches Played */}
                  <td className="py-3 px-2 text-center font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                    {teamStat.played}
                  </td>

                  {/* Won */}
                  <td className="py-3 px-2 text-center font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {teamStat.won}
                  </td>

                  {/* Drawn */}
                  <td className="py-3 px-2 text-center font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {teamStat.drawn}
                  </td>

                  {/* Lost */}
                  <td className="py-3 px-2 text-center font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    {teamStat.lost}
                  </td>

                  {/* Goals For */}
                  <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-300 tabular-nums font-medium">
                    {teamStat.goalsFor}
                  </td>

                  {/* Goals Against */}
                  <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-300 tabular-nums font-medium">
                    {teamStat.goalsAgainst}
                  </td>

                  {/* Goal Difference */}
                  <td className="py-3 px-2.5 text-center">
                    {teamStat.goalDifference > 0 ? (
                      <span className="inline-block px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        +{teamStat.goalDifference}
                      </span>
                    ) : teamStat.goalDifference < 0 ? (
                      <span className="inline-block px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                        {teamStat.goalDifference}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        0
                      </span>
                    )}
                  </td>

                  {/* Points (High-contrast Standout) */}
                  <td className="py-3 px-3 sm:px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center min-w-[36px] px-2.5 py-1 rounded-lg font-oswald font-black text-sm sm:text-base shadow-xs ${
                        isEmerald
                          ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white ring-1 ring-emerald-500/30'
                          : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white ring-1 ring-blue-500/30'
                      }`}
                    >
                      {teamStat.points}
                    </span>
                  </td>

                  {/* Recent Form (Desktop) */}
                  {showForm && (
                    <td className="py-3 px-3 sm:px-4 text-center hidden md:table-cell">
                      {form.length > 0 ? (
                        <div className="inline-flex items-center gap-1 justify-center">
                          {form.slice(-5).map((res, idx) => (
                            <span
                              key={idx}
                              title={res === 'W' ? 'Thắng' : res === 'D' ? 'Hòa' : 'Thua'}
                              className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] font-black shadow-2xs ${
                                res === 'W'
                                  ? 'bg-emerald-500 text-white'
                                  : res === 'D'
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-rose-500 text-white'
                              }`}
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend & Rules Footer */}
      <div className="p-3.5 sm:p-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 font-medium text-slate-700 dark:text-slate-300">
            <span
              className={`w-3 h-3 rounded-sm ${
                isEmerald ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
            ></span>
            <span>
              <strong>Top 1 &amp; Top 2:</strong> {qualificationNote}
            </span>
          </div>

          {showForm && (
            <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 border-l border-slate-300 dark:border-slate-700 pl-3">
              <span className="font-semibold">Phong độ:</span>
              <span className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[8px] font-bold flex items-center justify-center">
                  W
                </span>
                Thắng
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-slate-950 text-[8px] font-bold flex items-center justify-center">
                  D
                </span>
                Hòa
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                  L
                </span>
                Thua
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span title="Thắng 3 điểm, Hòa 1 điểm, Thua 0 điểm">
            <i className="fa-solid fa-calculator mr-1 text-slate-400"></i>
            Thắng: 3đ | Hòa: 1đ | Thua: 0đ
          </span>
          <span>•</span>
          <span title="Tiêu chí phân hạng khi bằng điểm">
            Điểm &gt; Hiệu Số &gt; Bàn Thắng &gt; Đối Đầu
          </span>
        </div>
      </div>

      {/* Standings Statistics Modal */}
      <StandingsStatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        groupName={groupName}
        standings={standings}
        matches={matches}
        theme={theme}
      />
    </div>
  );
};

