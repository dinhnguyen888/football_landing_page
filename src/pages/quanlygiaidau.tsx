import React, { useState, useEffect } from 'react';
import Banner from '../components/banner';
import Footer from '../components/footer';
import Body from '../components/body';
import {
  TournamentData,
  calculateGroupStandings,
  loadTournamentData,
  saveTournamentData,
  createDefaultTournament,
  generateRoundRobinMatches,
  loadArchiveTournaments,
  saveArchiveTournaments,
  Team,
  Group,
} from '../utils/tournamentEngine';

const SECRET_PIN = '020604';

const Quanlygiaidau: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Active tournament
  const [tournament, setTournament] = useState<TournamentData>(() => {
    const existing = loadTournamentData();
    if (existing && existing.groups && existing.groups.length > 0) {
      return existing;
    }
    const defaultData = createDefaultTournament();
    saveTournamentData(defaultData);
    return defaultData;
  });

  // Archive list of all created tournaments
  const [savedTournaments, setSavedTournaments] = useState<TournamentData[]>(() => {
    const archive = loadArchiveTournaments();
    if (archive && archive.length > 0) return archive;
    const defaultData = createDefaultTournament();
    saveArchiveTournaments([defaultData]);
    return [defaultData];
  });

  // Tabs: 'LIST' | 'SCORES' | 'CREATE'
  const [managerTab, setManagerTab] = useState<'LIST' | 'SCORES' | 'CREATE'>('LIST');

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

  // Synchronize state when active tournament or archive updates
  useEffect(() => {
    saveTournamentData(tournament);
  }, [tournament]);

  useEffect(() => {
    saveArchiveTournaments(savedTournaments);
  }, [savedTournaments]);

  // Authentication check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === SECRET_PIN) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Mã PIN không chính xác!');
    }
  };

  // Toggle Visibility of a Tournament
  const handleToggleVisibility = (tourId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // If turning ON, turn off all others (or set this as the single active published tournament)
    const updatedList = savedTournaments.map((t) => {
      if (t.id === tourId) {
        return { ...t, isVisible: newStatus };
      }
      return newStatus ? { ...t, isVisible: false } : t;
    });

    setSavedTournaments(updatedList);

    // If this is the active tournament, update active state too
    const activeTour = updatedList.find((t) => t.isVisible);
    if (activeTour) {
      setTournament(activeTour);
      saveTournamentData(activeTour);
    } else {
      // All hidden
      const updatedCurr = { ...tournament, isVisible: false };
      setTournament(updatedCurr);
      saveTournamentData(updatedCurr);
    }
  };

  // Switch active editing tournament
  const handleSelectTournament = (selected: TournamentData) => {
    setTournament(selected);
    saveTournamentData(selected);
    setManagerTab('SCORES');
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

  // Score change
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

    // Update in archive list too
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

  // Wizard: Finish create
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
      id: `tour_${Date.now()}`,
      tournamentName: tourNameInput,
      season: seasonInput,
      numGroups: numGroupsInput,
      teamsPerGroup: teamsPerGroupInput,
      legType: legTypeInput,
      groups,
      createdAt: new Date().toISOString(),
      isVisible: true,
    };

    // Make new tournament the single visible one
    const updatedArchive = savedTournaments.map((t) => ({ ...t, isVisible: false }));
    const finalList = [newTour, ...updatedArchive];

    setTournament(newTour);
    setSavedTournaments(finalList);

    setManagerTab('SCORES');
    setCreateStep(1);
    setActiveGroupIndex(0);
    setActiveRoundFilter('ALL');
    alert('🎉 Đã tạo giải đấu mới & tự động kích hoạt hiển thị ra trang công khai!');
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

  // ================= RENDER: LOGIN FORM =================
  if (!isAuthenticated) {
    return (
      <>
        <Banner
          title="TRANG QUẢN TRỊ NỘI BỘ"
          subtitle="Hệ thống quản lý giải đấu & cập nhật tỉ số bí mật dành riêng cho Ban Tổ Chức"
          badge="RESTRICTED ACCESS"
        />
        <Body>
          <div className="max-w-md mx-auto my-12 p-8 rounded-2xl portal-card shadow-lg bg-white space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-xl">
                <i className="fa-solid fa-lock"></i>
              </div>
              <h2 className="font-oswald text-2xl font-bold uppercase text-slate-900">
                XÁC THỰC QUẢN TRỊ VIÊN
              </h2>
              <p className="text-xs text-slate-500">
                Vui lòng nhập mã PIN bảo mật để truy cập bảng điều khiển.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-rose-600 font-bold text-center mt-2">{pinError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-oswald text-sm font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                MỞ BẢNG ĐIỀU KHIỂN
              </button>
            </form>
          </div>
        </Body>
        <Footer />
      </>
    );
  }

  // ================= RENDER: DASHBOARD =================
  return (
    <>
      <Banner
        title="BẢNG ĐIỀU KHIỂN QUẢN LÝ GIẢI ĐẤU"
        subtitle="Quản lý danh sách giải đấu, bật/tắt hiển thị ra trang công khai và chỉnh sửa tỉ số"
        badge="ADMIN DASHBOARD"
      />

      <Body>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Manager Navigation Bar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setManagerTab('LIST')}
                className={`px-4 py-2 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-colors ${
                  managerTab === 'LIST'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <i className="fa-solid fa-list-check mr-1.5"></i>
                Danh Sách Giải & Bật/Tắt Hiển Thị ({savedTournaments.length})
              </button>

              <button
                type="button"
                onClick={() => setManagerTab('SCORES')}
                className={`px-4 py-2 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-colors ${
                  managerTab === 'SCORES'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <i className="fa-solid fa-pen-to-square mr-1.5"></i>
                Chỉnh Sửa Kết Quả
              </button>

              <button
                type="button"
                onClick={() => setManagerTab('CREATE')}
                className={`px-4 py-2 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-colors ${
                  managerTab === 'CREATE'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <i className="fa-solid fa-plus mr-1.5"></i>
                Tạo Giải Đấu Mới
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-oswald font-bold uppercase"
            >
              Đăng Xuất
            </button>
          </div>

          {/* ================= TAB 1: DANH SÁCH GIẢI & BẬT TẮT ================= */}
          {managerTab === 'LIST' && (
            <div className="p-6 sm:p-8 rounded-xl portal-card space-y-6">
              <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-oswald text-xl font-bold uppercase text-slate-900">
                    DANH SÁCH GIẢI ĐẤU & CÔNG TẮC BẬT/TẮT HIỂN THỊ
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gạt nút BẬT để chọn giải đấu xuất hiện trên trang Lịch thi đấu & BXH. Nếu TẮT HẾT, web sẽ hiện thông báo chờ giải tiếp theo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setManagerTab('CREATE')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-oswald font-bold uppercase flex items-center space-x-1.5"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Tạo Giải Mới</span>
                </button>
              </div>

              {savedTournaments.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <i className="fa-solid fa-folder-open text-4xl text-slate-300 mb-2 block"></i>
                  <p className="font-oswald text-sm uppercase">Chưa có giải đấu nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedTournaments.map((tour) => {
                    const isVisible = !!tour.isVisible;

                    return (
                      <div
                        key={tour.id}
                        className={`p-5 rounded-xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                          isVisible
                            ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                            : 'bg-slate-50 border-slate-200 opacity-80'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-oswald font-bold text-lg text-slate-900 uppercase">
                              {tour.tournamentName} - {tour.season}
                            </h3>
                            {isVisible ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold font-oswald uppercase tracking-wider flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                <span>ĐANG HIỂN THỊ TRÊN WEB</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-300 text-slate-700 text-[10px] font-bold font-oswald uppercase">
                                ĐANG ẨN
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            {tour.numGroups} Bảng • {tour.teamsPerGroup} Đội/bảng •{' '}
                            {tour.legType === 'double' ? 'Vòng tròn 2 lượt (Đi & Về)' : 'Vòng tròn 1 lượt'}
                          </p>
                        </div>

                        {/* Actions & Switch */}
                        <div className="flex items-center space-x-4">
                          {/* Toggle Switch */}
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-oswald font-bold uppercase text-slate-600">
                              {isVisible ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleVisibility(tour.id, isVisible)}
                              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                                isVisible ? 'bg-emerald-600' : 'bg-slate-300'
                              }`}
                            >
                              <span
                                className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                                  isVisible ? 'translate-x-6' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectTournament(tour)}
                            className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-oswald font-bold uppercase tracking-wider transition-colors shadow-sm"
                          >
                            <i className="fa-solid fa-pen-to-square mr-1"></i>
                            Chỉnh Tỉ Số
                          </button>

                          {savedTournaments.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteTournament(tour.id)}
                              className="p-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs transition-colors"
                              title="Xóa giải đấu"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: CHỈNH SỬA TỈ SỐ ================= */}
          {managerTab === 'SCORES' && (
            <div className="space-y-6">
              {/* Season Selection Tabs Bar */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-oswald font-bold uppercase text-slate-500 tracking-wider">
                  CHỌN MÙA GIẢI CẦN CHỈNH SỬA:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {savedTournaments.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectTournament(t)}
                      className={`px-4 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all ${
                        tournament.id === t.id
                          ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400/40'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {t.season || t.tournamentName}
                      {t.isVisible && ' (Đang bật)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-oswald font-bold uppercase text-emerald-800 block">
                    ĐANG CHỈNH SỬA KẾT QUẢ CHO GIẢI:
                  </span>
                  <h2 className="font-oswald text-xl font-bold uppercase text-emerald-950">
                    {tournament.tournamentName} - {tournament.season}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold font-oswald uppercase ${
                      tournament.isVisible
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {tournament.isVisible ? '✓ Đang hiển thị công khai' : '⚠ Đang ẩn khỏi web'}
                  </span>
                </div>
              </div>

              {/* Group tabs */}
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

              {/* LIVE STANDINGS */}
              <div className="p-6 sm:p-8 rounded-xl portal-card space-y-4">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h3 className="font-oswald text-xl font-bold uppercase text-slate-900">
                    BẢNG XẾP HẠNG {activeGroup.name} (TỰ ĐỘNG CẬP NHẬT)
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    * Bảng điểm tự tính lại ngay khi bạn điền tỉ số bên dưới
                  </span>
                </div>

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
                      {standings.map((teamStat, rankIdx) => (
                        <tr
                          key={teamStat.teamId}
                          className={`hover:bg-slate-50 transition-colors ${
                            rankIdx < 2 ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <td className="p-3 text-left font-bold font-oswald text-slate-900">
                            {rankIdx + 1}
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MATCH SCORE INPUTS */}
              <div className="p-6 sm:p-8 rounded-xl portal-card space-y-6">
                <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-oswald text-xl font-bold uppercase text-slate-900">
                      ĐIỀN TỈ SỐ CÁC TRẬN ĐẤU ({activeGroup.name})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Điền tỉ số trực tiếp vào các ô vuông bên dưới. Dữ liệu sẽ tự động lưu và đồng bộ.
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

                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <input
                              type="number"
                              min="0"
                              max="99"
                              value={match.homeScore !== null ? match.homeScore : ''}
                              onChange={(e) =>
                                handleScoreChange(match.id, 'homeScore', e.target.value)
                              }
                              placeholder="-"
                              className="w-12 h-10 text-center font-oswald font-bold text-xl border-2 border-emerald-600 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-inner"
                            />
                            <span className="font-bold text-slate-400 text-sm">:</span>
                            <input
                              type="number"
                              min="0"
                              max="99"
                              value={match.awayScore !== null ? match.awayScore : ''}
                              onChange={(e) =>
                                handleScoreChange(match.id, 'awayScore', e.target.value)
                              }
                              placeholder="-"
                              className="w-12 h-10 text-center font-oswald font-bold text-xl border-2 border-emerald-600 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-inner"
                            />
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

          {/* ================= TAB 3: TẠO GIẢI MỚI ================= */}
          {managerTab === 'CREATE' && (
            <div className="space-y-6">
              {createStep === 1 && (
                <div className="p-6 sm:p-8 rounded-xl portal-card space-y-6">
                  <div className="border-b border-slate-200 pb-3">
                    <h2 className="font-oswald text-xl font-bold uppercase text-slate-900">
                      BƯỚC 1: THIẾT LẬP THÔNG SỐ GIẢI ĐẤU MỚI
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Chọn số bảng đấu và số lượng đội bóng để tự động sinh lịch thi đấu.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-oswald font-bold uppercase text-slate-700 mb-1.5">
                        Tên Giải Đấu
                      </label>
                      <input
                        type="text"
                        value={tourNameInput}
                        onChange={(e) => setTourNameInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-oswald font-bold uppercase text-slate-700 mb-1.5">
                        Mùa Giải
                      </label>
                      <input
                        type="text"
                        value={seasonInput}
                        onChange={(e) => setSeasonInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-oswald font-bold uppercase text-slate-700 mb-1.5">
                        Số Lượng Bảng Đấu
                      </label>
                      <select
                        value={numGroupsInput}
                        onChange={(e) => setNumGroupsInput(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-medium focus:border-emerald-600 focus:outline-none bg-white"
                      >
                        <option value={1}>1 Bảng</option>
                        <option value={2}>2 Bảng (Bảng A, B)</option>
                        <option value={4}>4 Bảng (Bảng A, B, C, D)</option>
                        <option value={6}>6 Bảng</option>
                        <option value={8}>8 Bảng</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-oswald font-bold uppercase text-slate-700 mb-1.5">
                        Số Đội Trong 1 Bảng
                      </label>
                      <select
                        value={teamsPerGroupInput}
                        onChange={(e) => setTeamsPerGroupInput(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-medium focus:border-emerald-600 focus:outline-none bg-white"
                      >
                        <option value={3}>3 Đội / Bảng</option>
                        <option value={4}>4 Đội / Bảng</option>
                        <option value={5}>5 Đội / Bảng</option>
                        <option value={6}>6 Đội / Bảng</option>
                        <option value={7}>7 Đội / Bảng</option>
                        <option value={8}>8 Đội / Bảng</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-oswald font-bold uppercase text-slate-700 mb-1.5">
                        Thể Thức Thi Đấu
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label
                          className={`p-3.5 rounded-lg border cursor-pointer flex items-center space-x-3 transition-colors ${
                            legTypeInput === 'double' ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="legTypeAdmin"
                            checked={legTypeInput === 'double'}
                            onChange={() => setLegTypeInput('double')}
                            className="text-emerald-600"
                          />
                          <div>
                            <strong className="text-sm text-slate-900 block">Vòng Tròn 2 Lượt (Lượt Đi & Lượt Về)</strong>
                            <span className="text-xs text-slate-500">Mỗi cặp đấu gặp nhau 2 trận</span>
                          </div>
                        </label>

                        <label
                          className={`p-3.5 rounded-lg border cursor-pointer flex items-center space-x-3 transition-colors ${
                            legTypeInput === 'single' ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="legTypeAdmin"
                            checked={legTypeInput === 'single'}
                            onChange={() => setLegTypeInput('single')}
                            className="text-emerald-600"
                          />
                          <div>
                            <strong className="text-sm text-slate-900 block">Vòng Tròn 1 Lượt</strong>
                            <span className="text-xs text-slate-500">Mỗi cặp đấu chỉ gặp nhau 1 trận</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSetupStep2}
                      className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-oswald text-sm font-bold uppercase tracking-wider"
                    >
                      Tiếp Tục Điền Tên Đội →
                    </button>
                  </div>
                </div>
              )}

              {createStep === 2 && (
                <div className="p-6 sm:p-8 rounded-xl portal-card space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="font-oswald text-xl font-bold uppercase text-slate-900">
                        BƯỚC 2: NHẬP TÊN THÀNH VIÊN TỪNG BẢNG
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Điền tên HLV và câu lạc bộ cho từng bảng đấu.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCreateStep(1)}
                      className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-oswald font-bold uppercase"
                    >
                      ← Quay Lại
                    </button>
                  </div>

                  <div className="space-y-6">
                    {groupTeamsInput.map((teamsInGroup, gIdx) => {
                      const groupLetter = String.fromCharCode(65 + gIdx);
                      return (
                        <div key={gIdx} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                          <span className="font-oswald font-bold text-base text-emerald-800 uppercase block border-b border-slate-200 pb-1">
                            BẢNG {groupLetter} ({teamsInGroup.length} Đội)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {teamsInGroup.map((team, tIdx) => (
                              <div key={tIdx} className="p-3 rounded-lg bg-white border border-slate-200 space-y-2">
                                <input
                                  type="text"
                                  value={team.name}
                                  onChange={(e) =>
                                    handleTeamNameChange(gIdx, tIdx, 'name', e.target.value)
                                  }
                                  placeholder={`Tên HLV ${tIdx + 1}`}
                                  className="w-full px-2.5 py-1 text-xs font-bold border border-slate-300 rounded focus:border-emerald-600 focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={team.club}
                                  onChange={(e) =>
                                    handleTeamNameChange(gIdx, tIdx, 'club', e.target.value)
                                  }
                                  placeholder="Câu lạc bộ"
                                  className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded text-slate-600 focus:border-emerald-600 focus:outline-none"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCreateStep(1)}
                      className="px-4 py-2 rounded bg-slate-100 text-slate-700 text-xs font-oswald font-bold uppercase"
                    >
                      ← Quay Lại
                    </button>
                    <button
                      type="button"
                      onClick={handleFinishCreateTournament}
                      className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-oswald text-sm font-bold uppercase tracking-wider"
                    >
                      HOÀN TẤT & TẠO GIẢI NGAY
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Quanlygiaidau;
