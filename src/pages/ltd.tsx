import React, { useState, useEffect } from 'react';
import Banner from '../components/banner';
import Footer from '../components/footer';
import Body from '../components/body';
import {
  TournamentData,
  calculateGroupStandings,
  loadTournamentData,
  loadArchiveTournaments,
  createDefaultTournament,
} from '../utils/tournamentEngine';

const Ltd: React.FC = () => {
  const [tournament, setTournament] = useState<TournamentData | null>(() => {
    // 1. Check direct active data
    const active = loadTournamentData();
    if (active && active.isVisible) {
      return active;
    }
    // 2. Check archive for visible tournament
    const archive = loadArchiveTournaments();
    const visibleInArchive = archive.find((t) => t.isVisible);
    if (visibleInArchive) {
      return visibleInArchive;
    }
    // If first time visit and archive is empty, load default Mùa 2
    if (archive.length === 0 && !active) {
      return createDefaultTournament();
    }
    return null;
  });

  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const [activeRoundFilter, setActiveRoundFilter] = useState<number | 'ALL'>('ALL');

  useEffect(() => {
    const handleStorage = () => {
      const active = loadTournamentData();
      if (active && active.isVisible) {
        setTournament(active);
      } else {
        const archive = loadArchiveTournaments();
        const vis = archive.find((t) => t.isVisible);
        setTournament(vis || null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // If no tournament is currently published / active
  if (!tournament || !tournament.isVisible) {
    return (
      <>
        <Banner
          title="LỊCH THI ĐẤU & BẢNG XẾP HẠNG"
          subtitle="Cổng thông tin bảng điểm và lịch trình giải đấu FC Online Great Mates Cup"
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
              📢 Vui lòng theo dõi các thông báo chính thức và lịch đăng ký tham gia trên <strong>Group Facebook</strong> & <strong>Box Messenger</strong> của Great Mates!
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

  return (
    <>
      <Banner
        title="LỊCH THI ĐẤU & BẢNG XẾP HẠNG"
        subtitle="Bảng điểm trực tiếp và lịch thi đấu các bảng đấu của giải Great Mates Cup"
        badge="STANDINGS & FIXTURES"
      />

      <Body>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Info */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-oswald text-xs font-bold uppercase text-emerald-800 tracking-wider block">
                {tournament.tournamentName} - {tournament.season}
              </span>
              <h2 className="font-oswald text-xl font-bold uppercase text-slate-900">
                {tournament.numGroups} BẢNG ĐẤU ({tournament.teamsPerGroup} ĐỘI/BẢNG) - {tournament.legType === 'double' ? 'VÒNG TRÒN 2 LƯỢT' : 'VÒNG TRÒN 1 LƯỢT'}
              </h2>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              * Điểm số và thứ hạng được cập nhật tự động
            </div>
          </div>

          {/* Group Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b-2 border-slate-200 pb-2">
            {tournament.groups.map((grp, idx) => (
              <button
                key={grp.id}
                onClick={() => {
                  setActiveGroupIndex(idx);
                  setActiveRoundFilter('ALL');
                }}
                className={`px-5 py-2 rounded-lg font-oswald text-sm font-bold uppercase tracking-wider transition-all ${
                  activeGroupIndex === idx
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {grp.name}
              </button>
            ))}
          </div>

          {/* STANDINGS TABLE (BẢNG XẾP HẠNG) */}
          <div className="p-6 sm:p-8 rounded-xl portal-card space-y-4">
            <div className="border-b border-slate-200 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-trophy text-amber-500"></i>
                <h3 className="font-oswald text-xl font-bold uppercase text-slate-900">
                  BẢNG XẾP HẠNG {activeGroup.name}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                * Thắng 3 điểm | Hòa 1 điểm | Thua 0 điểm
              </span>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#0a192f] text-white font-oswald uppercase text-center">
                  <tr>
                    <th className="p-3 text-left w-12">#</th>
                    <th className="p-3 text-left">Đội Bóng / HLV</th>
                    <th className="p-3 w-12 font-bold" title="Số trận đã chơi">ĐĐ</th>
                    <th className="p-3 w-12 font-bold" title="Số trận thắng">Thắng</th>
                    <th className="p-3 w-12 font-bold" title="Số trận hòa">H</th>
                    <th className="p-3 w-12 font-bold" title="Số trận thua">Thua</th>
                    <th className="p-3 w-12 font-bold" title="Số bàn thắng">BT</th>
                    <th className="p-3 w-12 font-bold" title="Số bàn thua">SBT</th>
                    <th className="p-3 w-14 font-bold text-amber-300" title="Hiệu số bàn thắng">HS</th>
                    <th className="p-3 w-14 font-bold text-emerald-400 bg-[#071324]" title="Tổng điểm">Đ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-center">
                  {standings.map((teamStat, rankIdx) => {
                    const isTop2 = rankIdx < 2;
                    return (
                      <tr
                        key={teamStat.teamId}
                        className={`hover:bg-slate-50 transition-colors ${
                          isTop2 ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <td className="p-3 text-left font-bold font-oswald text-slate-900">
                          <span
                            className={`inline-block w-6 h-6 rounded text-center leading-6 text-xs font-bold ${
                              rankIdx === 0
                                ? 'bg-amber-400 text-slate-950'
                                : rankIdx === 1
                                ? 'bg-slate-300 text-slate-900'
                                : rankIdx === 2
                                ? 'bg-orange-300 text-slate-900'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {rankIdx + 1}
                          </span>
                        </td>
                        <td className="p-3 text-left">
                          <strong className="text-slate-900 block font-bold text-sm">
                            {teamStat.teamName}
                          </strong>
                          {teamStat.club && (
                            <span className="text-[11px] text-slate-500 font-medium block">
                              CLB: {teamStat.club}
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{teamStat.played}</td>
                        <td className="p-3 font-semibold text-emerald-700">{teamStat.won}</td>
                        <td className="p-3 font-semibold text-amber-700">{teamStat.drawn}</td>
                        <td className="p-3 font-semibold text-rose-700">{teamStat.lost}</td>
                        <td className="p-3 text-slate-700">{teamStat.goalsFor}</td>
                        <td className="p-3 text-slate-700">{teamStat.goalsAgainst}</td>
                        <td className="p-3 font-bold font-mono text-slate-900">
                          {teamStat.goalDifference > 0
                            ? `+${teamStat.goalDifference}`
                            : teamStat.goalDifference}
                        </td>
                        <td className="p-3 font-oswald font-bold text-base text-emerald-800 bg-emerald-50/60">
                          {teamStat.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-400"></span>
              <span>Top 1 & Top 2 giành vé trực tiếp vào Vòng 16 đội (Knockout)</span>
            </div>
          </div>

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
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Vòng {rnd}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredMatches.map((match) => {
                const home = teamMap[match.homeTeamId] || { name: match.homeTeamId };
                const away = teamMap[match.awayTeamId] || { name: match.awayTeamId };

                return (
                  <div
                    key={match.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <span className="px-2.5 py-0.5 rounded bg-slate-200 text-slate-700 font-oswald text-xs font-bold uppercase flex-shrink-0">
                      VÒNG {match.round}
                    </span>

                    <div className="flex-1 flex items-center justify-center space-x-3 sm:space-x-6 w-full max-w-xl">
                      <div className="flex-1 text-right">
                        <span className="font-bold text-sm text-slate-900 block leading-tight">
                          {home.name}
                        </span>
                        {home.club && (
                          <span className="text-[11px] text-slate-500 font-medium block">
                            {home.club}
                          </span>
                        )}
                      </div>

                      <div className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm text-center min-w-[80px]">
                        {match.played ? (
                          <span className="font-oswald font-bold text-xl text-emerald-800">
                            {match.homeScore} - {match.awayScore}
                          </span>
                        ) : (
                          <span className="text-xs font-oswald font-semibold text-slate-400 uppercase">
                            VS
                          </span>
                        )}
                      </div>

                      <div className="flex-1 text-left">
                        <span className="font-bold text-sm text-slate-900 block leading-tight">
                          {away.name}
                        </span>
                        {away.club && (
                          <span className="text-[11px] text-slate-500 font-medium block">
                            {away.club}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {match.played ? (
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center space-x-1">
                          <i className="fa-solid fa-circle-check"></i>
                          <span>Đã đấu</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Chưa đấu</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Ltd;
