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

  const [viewStage, setViewStage] = useState<'GROUP' | 'KNOCKOUT'>(() => {
    return tournament?.knockoutStage?.isCompletedGroupStage ? 'KNOCKOUT' : 'GROUP';
  });
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const [activeRoundFilter, setActiveRoundFilter] = useState<number | 'ALL'>('ALL');

  useEffect(() => {
    const handleStorage = () => {
      const active = loadTournamentData();
      if (active && active.isVisible) {
        setTournament(active);
        if (active.knockoutStage?.isCompletedGroupStage) {
          setViewStage('KNOCKOUT');
        }
      } else {
        const archive = loadArchiveTournaments();
        const vis = archive.find((t) => t.isVisible);
        setTournament(vis || null);
        if (vis?.knockoutStage?.isCompletedGroupStage) {
          setViewStage('KNOCKOUT');
        }
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
        subtitle="Bảng điểm trực tiếp và lịch thi đấu các bảng đấu của giải Sao Vàng Cup ™"
        badge="STANDINGS & FIXTURES"
      />

      <Body>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Info */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-oswald text-xs font-bold uppercase text-emerald-800 tracking-wider block">
                {tournament.tournamentName} - {tournament.season}
              </span>
              <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-slate-900">
                {tournament.knockoutStage?.isCompletedGroupStage && viewStage === 'KNOCKOUT'
                  ? 'VÒNG LOẠI TRỰC TIẾP (KNOCKOUT STAGE)'
                  : `${tournament.numGroups} BẢNG ĐẤU (${tournament.teamsPerGroup} ĐỘI/BẢNG) - ${tournament.legType === 'double' ? 'VÒNG TRÒN 2 LƯỢT' : 'VÒNG TRÒN 1 LƯỢT'}`}
              </h2>
            </div>
            
            {/* Stage Switcher if Knockout is ready */}
            {tournament.knockoutStage?.isCompletedGroupStage && (
              <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewStage('KNOCKOUT')}
                  className={`px-4 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all ${
                    viewStage === 'KNOCKOUT'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <i className="fa-solid fa-trophy mr-1.5"></i>
                  Vòng Knockout
                </button>
                <button
                  type="button"
                  onClick={() => setViewStage('GROUP')}
                  className={`px-4 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all ${
                    viewStage === 'GROUP'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <i className="fa-solid fa-list-ol mr-1.5"></i>
                  Vòng Bảng
                </button>
              </div>
            )}
          </div>

          {/* ================= STAGE 1: KNOCKOUT BRACKET VIEW ================= */}
          {tournament.knockoutStage?.isCompletedGroupStage && viewStage === 'KNOCKOUT' && (
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

                {/* FIFA Pathways Diagram: 100% Đồng bộ nền sáng, thẻ pastel thanh lịch & đường kẻ SVG chuẩn xác */}
                <div className="relative p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-slate-50 via-emerald-50/20 to-teal-50/30 border border-slate-200 shadow-sm overflow-x-auto">
                  
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
                      
                      {tournament.knockoutStage.rounds[0]?.matches.slice(0, 2).map((m) => (
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
                      {tournament.knockoutStage.rounds[1]?.matches.slice(0, 1).map((m) => (
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

                      {/* Final Match Card */}
                      {tournament.knockoutStage.rounds[2]?.matches.map((m) => (
                        <div key={m.id} className="w-full p-4 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50/60 border-2 border-amber-400 shadow-xl space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] font-oswald text-amber-900 border-b border-amber-200 pb-1">
                            <span className="font-black flex items-center space-x-1">
                              <i className="fa-solid fa-trophy text-amber-500"></i>
                              <span>TRANH NGÔI VƯƠNG</span>
                            </span>
                            <span className="bg-amber-100 px-2 py-0.5 rounded font-bold">{m.played ? 'KẾT THÚC' : 'SẮP DIỄN RA'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg ${m.winnerTeamName === m.homeTeamName ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'bg-white text-slate-800 border border-slate-200'}`}>
                            <span className="truncate pr-1 font-semibold">{m.homeTeamName}</span>
                            <span className="font-oswald font-bold text-base">{m.homeScore !== null ? m.homeScore : '-'}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg ${m.winnerTeamName === m.awayTeamName ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'bg-white text-slate-800 border border-slate-200'}`}>
                            <span className="truncate pr-1 font-semibold">{m.awayTeamName}</span>
                            <span className="font-oswald font-bold text-base">{m.awayScore !== null ? m.awayScore : '-'}</span>
                          </div>

                          {m.winnerTeamName && (
                            <div className="text-center pt-2 border-t border-amber-200">
                              <span className="text-xs font-oswald font-black text-amber-900 block uppercase tracking-wider">
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
                      {tournament.knockoutStage.rounds[1]?.matches.slice(1, 2).map((m) => (
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
                      {tournament.knockoutStage.rounds[0]?.matches.slice(2, 4).map((m) => (
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
          )}

          {/* ================= STAGE 2: GROUP STAGE VIEW ================= */}
          {(!tournament.knockoutStage?.isCompletedGroupStage || viewStage === 'GROUP') && (
            <>
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
          </>
        )}
      </div>
    </Body>

      <Footer />
    </>
  );
};

export default Ltd;
