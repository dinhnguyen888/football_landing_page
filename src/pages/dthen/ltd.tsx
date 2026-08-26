import React, { useState, useEffect } from 'react';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import Body from '../../components/body';
import {
  TournamentData,
  calculateGroupStandings,
  loadDthenTournamentData,
  createDefaultDthenTournament,
} from '../../utils/tournamentEngine';

const DthenLtd: React.FC = () => {
  const [tournament, setTournament] = useState<TournamentData | null>(() => {
    const active = loadDthenTournamentData();
    if (active && active.isVisible) {
      return active;
    }
    return createDefaultDthenTournament();
  });

  const [viewStage, setViewStage] = useState<'GROUP' | 'KNOCKOUT'>(() => {
    return tournament?.knockoutStage?.isCompletedGroupStage ? 'KNOCKOUT' : 'GROUP';
  });
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const [activeRoundFilter, setActiveRoundFilter] = useState<number | 'ALL'>('ALL');

  useEffect(() => {
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
    return () => window.removeEventListener('storage', handleStorage);
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

  return (
    <>
      <Banner
        title={`LỊCH ĐẤU & BXH - ${tournament.tournamentName}`}
        subtitle={`Theo dõi bảng xếp hạng trực tiếp và lịch thi đấu các bảng đấu ${tournament.season}`}
        badge="LIVE STANDINGS"
      />

      <Body>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Controls: Stage Selector & Status */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-800 font-fco font-bold text-xs uppercase">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping mr-1.5"></span>
                {tournament.season} • {tournament.tournamentName}
              </span>
            </div>

            {/* Stage Switcher */}
            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewStage('GROUP')}
                className={`px-4 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all ${
                  viewStage === 'GROUP'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <i className="fa-solid fa-table-cells mr-1.5"></i>
                VÒNG BẢNG
              </button>

              <button
                onClick={() => setViewStage('KNOCKOUT')}
                className={`px-4 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all ${
                  viewStage === 'KNOCKOUT'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <i className="fa-solid fa-trophy mr-1.5 text-amber-400"></i>
                KNOCKOUT
              </button>
            </div>
          </div>

          {viewStage === 'GROUP' ? (
            <>
              {/* Group Tabs */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {tournament.groups.map((grp, idx) => (
                  <button
                    key={grp.id}
                    onClick={() => {
                      setActiveGroupIndex(idx);
                      setActiveRoundFilter('ALL');
                    }}
                    className={`px-5 py-2.5 rounded-xl font-oswald text-sm font-bold uppercase tracking-wider transition-all shadow-2xs ${
                      activeGroupIndex === idx
                        ? 'bg-blue-700 text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {grp.name}
                  </button>
                ))}
              </div>

              {/* Standings Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-oswald text-lg sm:text-xl font-bold uppercase text-slate-900">
                    BẢNG XẾP HẠNG – {currentGroup.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Top 2 Vào Knockout
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3 sm:px-4 text-center w-12">#</th>
                        <th className="py-3 px-4">Huấn Luyện Viên / CLB</th>
                        <th className="py-3 px-3 text-center">Trận</th>
                        <th className="py-3 px-3 text-center">T</th>
                        <th className="py-3 px-3 text-center">H</th>
                        <th className="py-3 px-3 text-center">B</th>
                        <th className="py-3 px-3 text-center">BT</th>
                        <th className="py-3 px-3 text-center">SBT</th>
                        <th className="py-3 px-3 text-center">HS</th>
                        <th className="py-3 px-4 text-center font-black text-blue-700">Điểm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {standings.map((stat, idx) => (
                        <tr
                          key={stat.teamId}
                          className={`hover:bg-slate-50 transition-colors ${
                            idx < 2 ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                                idx === 0
                                  ? 'bg-amber-400 text-slate-900 font-black'
                                  : idx === 1
                                  ? 'bg-blue-200 text-blue-900'
                                  : 'text-slate-400'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            <div>
                              <span>{stat.teamName}</span>
                              {stat.club && (
                                <span className="block text-[11px] font-normal text-slate-500">
                                  {stat.club}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center text-slate-600">{stat.played}</td>
                          <td className="py-3 px-3 text-center text-emerald-700 font-semibold">{stat.won}</td>
                          <td className="py-3 px-3 text-center text-amber-700 font-semibold">{stat.drawn}</td>
                          <td className="py-3 px-3 text-center text-rose-700 font-semibold">{stat.lost}</td>
                          <td className="py-3 px-3 text-center text-slate-600">{stat.goalsFor}</td>
                          <td className="py-3 px-3 text-center text-slate-600">{stat.goalsAgainst}</td>
                          <td className="py-3 px-3 text-center font-semibold">
                            {stat.goalDifference > 0
                              ? `+${stat.goalDifference}`
                              : stat.goalDifference}
                          </td>
                          <td className="py-3 px-4 text-center font-black text-blue-700 text-base">
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
                  <h3 className="font-oswald text-lg sm:text-xl font-bold uppercase text-slate-900">
                    LỊCH THI ĐẤU & KẾT QUẢ – {currentGroup.name}
                  </h3>

                  {/* Round Filter */}
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
                </div>

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
              </div>
            </>
          ) : (
            /* Knockout Bracket View */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 text-center">
              <div className="space-y-1">
                <h3 className="font-oswald text-2xl font-bold uppercase text-slate-900">
                  NHÁNH ĐẤU LOẠI TRỰC TIẾP (KNOCKOUT BRACKET)
                </h3>
                <p className="text-xs text-slate-500">
                  Tứ Kết ➔ Bán Kết ➔ Chung Kết (Thể thức BO3)
                </p>
              </div>

              <div className="py-8 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 max-w-lg mx-auto space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto text-xl">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <h4 className="font-fco font-bold uppercase text-slate-800 text-sm">
                  GIAI ĐOẠN VÒNG BẢNG ĐANG DIỄN RA
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Nhánh đấu Knockout sẽ tự động được kích hoạt và điền tên các HLV xuất sắc nhất sau khi hoàn thành toàn bộ các lượt trận vòng bảng.
                </p>
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
