import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../components/banner';
import Footer from '../components/footer';
import Body from '../components/body';
import {
  Team,
  Group,
  TournamentData,
  generateRoundRobinMatches,
  generatePureKnockoutBracket,
  createDefaultTournament,
  saveTournamentBoth,
} from '../utils/tournamentEngine';
import { clearLiveDrawStateFromFirestore } from '../services/tournamentService';

export const DIRECT_DRAW_SETUP_KEY = 'SAOVANG_DRAW_DIRECT_SETUP';

const Taogiaidau: React.FC = () => {
  const navigate = useNavigate();

  // Step 1: Configuration
  const [step, setStep] = useState<1 | 2>(1);
  const [tournamentSystem, setTournamentSystem] = useState<'SAO_VANG' | 'DTHEN'>('SAO_VANG');
  const [format, setFormat] = useState<'group_knockout' | 'pure_knockout'>('group_knockout');
  const [tournamentName, setTournamentName] = useState('SAO VÀNG CUP ™');
  const [season, setSeason] = useState('MÙA 3');

  // Group stage settings
  const [numGroups, setNumGroups] = useState<number>(4);
  const [teamsPerGroup, setTeamsPerGroup] = useState<number>(5);
  const [legType, setLegType] = useState<'single' | 'double'>('double');

  // Pure Knockout settings
  const [knockoutTeamsCount, setKnockoutTeamsCount] = useState<number>(16);
  const [pairingMode, setPairingMode] = useState<'random' | 'draw'>('random');

  // Step 2: Teams Input
  // For group format: groupTeams[groupIdx] = [{ name, club }]
  const [groupTeams, setGroupTeams] = useState<{ name: string; club: string }[][]>([]);
  // For knockout format: knockoutTeams = [{ name, club }]
  const [knockoutTeams, setKnockoutTeams] = useState<{ name: string; club: string }[]>([]);

  // Switch system handler
  const handleSystemChange = (sys: 'SAO_VANG' | 'DTHEN') => {
    setTournamentSystem(sys);
    if (sys === 'SAO_VANG') {
      setTournamentName('SAO VÀNG CUP ™');
      setSeason('MÙA 3');
    } else {
      setTournamentName('ĐTHÉN FCO ™');
      setSeason('MÙA 1');
    }
  };

  // Go to Step 2
  const handleProceedToStep2 = () => {
    if (format === 'group_knockout') {
      const initialGroups: { name: string; club: string }[][] = [];
      for (let g = 0; g < numGroups; g++) {
        const teams: { name: string; club: string }[] = [];
        for (let t = 0; t < teamsPerGroup; t++) {
          teams.push({
            name: `HLV ${String.fromCharCode(65 + g)}${t + 1}`,
            club: `CLB ${t + 1}`,
          });
        }
        initialGroups.push(teams);
      }
      setGroupTeams(initialGroups);
    } else {
      // Pure Knockout
      const sampleKnockoutNames = [
        'HLV Phan Long',
        'HLV Quốc Cường',
        'HLV Minh Quân',
        'HLV Hải Đăng',
        'HLV Tuấn Anh',
        'HLV Hoàng Phúc',
        'HLV Bảo Long',
        'HLV Thanh Tùng',
        'HLV Trọng Nghĩa',
        'HLV Hữu Đạt',
        'HLV Thế Anh',
        'HLV Văn Đức',
        'HLV Quang Minh',
        'HLV Gia Huy',
        'HLV Tấn Tài',
        'HLV Thành Đạt',
        'HLV Hoàng Nam',
        'HLV Duy Mạnh',
        'HLV Tiến Dũng',
        'HLV Công Phượng',
        'HLV Quang Hải',
        'HLV Văn Toàn',
        'HLV Hùng Dũng',
        'HLV Tuấn Hải',
        'HLV Việt Hưng',
        'HLV Hoàng Đức',
        'HLV Văn Quyết',
        'HLV Tấn Sinh',
        'HLV Đức Chinh',
        'HLV Văn Hậu',
        'HLV Đình Trọng',
        'HLV Xuân Trường',
      ];

      const initialTeams: { name: string; club: string }[] = [];
      for (let i = 0; i < knockoutTeamsCount; i++) {
        initialTeams.push({
          name: sampleKnockoutNames[i] || `HLV ${i + 1}`,
          club: '',
        });
      }
      setKnockoutTeams(initialTeams);
    }
    setStep(2);
  };

  // Quick fill preset sample data
  const handleFillSampleData = () => {
    if (format === 'group_knockout') {
      const sampleData = createDefaultTournament();
      sampleData.tournamentName = tournamentName;
      sampleData.season = season;
      saveTournamentBoth(sampleData, tournamentSystem);
      if (tournamentSystem === 'SAO_VANG') {
        navigate('/ltd');
      } else {
        navigate('/dthen/ltd');
      }
      alert(`Đã tạo giải đấu mẫu ${tournamentName} (${numGroups} Bảng) thành công!`);
    } else {
      // Generate sample knockout
      handleProceedToStep2();
    }
  };

  // Change team info (Group)
  const handleGroupTeamChange = (groupIdx: number, teamIdx: number, field: 'name' | 'club', value: string) => {
    const newGroups = [...groupTeams];
    newGroups[groupIdx][teamIdx][field] = value;
    setGroupTeams(newGroups);
  };

  // Change team info (Knockout)
  const handleKnockoutTeamChange = (teamIdx: number, field: 'name' | 'club', value: string) => {
    const newTeams = [...knockoutTeams];
    newTeams[teamIdx][field] = value;
    setKnockoutTeams(newTeams);
  };

  // Finish and create Group Tournament
  const handleCreateGroupTournament = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const groups: Group[] = groupTeams.map((teamsInput, gIdx) => {
      const groupLetter = alphabet[gIdx] || `${gIdx + 1}`;
      const teams: Team[] = teamsInput.map((t, tIdx) => ({
        id: `g${gIdx + 1}_t${tIdx + 1}`,
        name: t.name.trim() || `Đội ${tIdx + 1}`,
        club: t.club.trim() || '',
      }));

      const matches = generateRoundRobinMatches(teams, legType);

      return {
        id: `group_${gIdx + 1}`,
        name: `BẢNG ${groupLetter}`,
        teams,
        matches,
      };
    });

    const newTournament: TournamentData = {
      id: `tour_${tournamentSystem.toLowerCase()}_${Date.now()}`,
      tournamentName,
      season,
      numGroups,
      teamsPerGroup,
      legType,
      groups,
      format: 'group_knockout',
      createdAt: new Date().toISOString(),
      isVisible: true,
    };

    saveTournamentBoth(newTournament, tournamentSystem);

    if (tournamentSystem === 'SAO_VANG') {
      alert('🎉 Đã thiết lập giải đấu Vòng bảng Sao Vàng Cup thành công! Dữ liệu đã lưu vào kho lưu trữ & Cloud.');
      navigate('/ltd');
    } else {
      alert('🎉 Đã thiết lập giải đấu Vòng bảng ĐThén FCO thành công! Dữ liệu đã lưu vào kho lưu trữ & Cloud.');
      navigate('/dthen/ltd');
    }
  };

  // Finish and create Pure Knockout Tournament (Random Mode)
  const handleCreateKnockoutRandom = () => {
    const teams: Team[] = knockoutTeams.map((t, idx) => ({
      id: `ko_team_${idx + 1}`,
      name: t.name.trim() || `HLV ${idx + 1}`,
      club: t.club.trim() || '',
    }));

    // Generate randomized bracket
    const knockoutStage = generatePureKnockoutBracket(teams, true);

    const newTournament: TournamentData = {
      id: `tour_ko_${tournamentSystem.toLowerCase()}_${Date.now()}`,
      tournamentName,
      season,
      numGroups: 0,
      teamsPerGroup: 2,
      legType: 'single',
      groups: [],
      format: 'pure_knockout',
      pairingMode: 'random',
      totalTeams: teams.length,
      knockoutStage,
      createdAt: new Date().toISOString(),
      isVisible: true,
    };

    saveTournamentBoth(newTournament, tournamentSystem);

    if (tournamentSystem === 'SAO_VANG') {
      alert('🎉 Đã xếp cặp ngẫu nhiên & sinh sơ đồ Cúp Loại Trực Tiếp Sao Vàng Cup thành công!');
      navigate('/ltd?tab=knockout');
    } else {
      alert('🎉 Đã xếp cặp ngẫu nhiên & sinh sơ đồ Cúp Loại Trực Tiếp ĐThén FCO thành công!');
      navigate('/dthen/ltd');
    }
  };

  // Redirect to 3D Draw page for live drawing
  const handleProceedTo3DDraw = async () => {
    const tourId = `tour_ko_${tournamentSystem.toLowerCase()}_${Date.now()}`;
    const teamsForDraw = knockoutTeams.map((t, idx) => ({
      id: `draw_team_${idx + 1}`,
      name: t.name.trim() || `HLV ${idx + 1}`,
      club: '',
      pot: Math.floor(idx / 4) + 1,
    }));

    const newTournament: TournamentData = {
      id: tourId,
      tournamentName,
      season,
      numGroups: 0,
      teamsPerGroup: 2,
      legType: 'single',
      groups: [],
      format: 'pure_knockout',
      pairingMode: 'draw',
      totalTeams: knockoutTeams.length,
      createdAt: new Date().toISOString(),
      isVisible: true,
    };

    // Đăng ký giải đấu chờ bốc thăm vào archive
    saveTournamentBoth(newTournament, tournamentSystem);

    const drawPayload = {
      tourId,
      system: tournamentSystem,
      tournamentTitle: tournamentName,
      season,
      format: 'pure_knockout',
      pairingMode: 'draw',
      totalTeams: knockoutTeams.length,
      numGroups: knockoutTeams.length / 2,
      teamsPerGroup: 2,
      teams: teamsForDraw,
      selectedTournamentData: newTournament,
      createdAt: Date.now(),
    };

    // Xóa hoàn toàn bản nháp cũ trên Local & Cloud trước khi sang sân khấu bốc thăm
    try {
      localStorage.removeItem('saovang_draw_draft');
      localStorage.setItem(DIRECT_DRAW_SETUP_KEY, JSON.stringify(drawPayload));
    } catch {}
    try {
      await clearLiveDrawStateFromFirestore();
    } catch {}

    alert('🏆 Giải đấu đã được khởi tạo và lưu vào hệ thống! Đang chuyển tới sân khấu Bốc Thăm 3D để tiến hành bắt cặp...');
    navigate(`/boctham?tourId=${tourId}&system=${tournamentSystem}`);
  };

  return (
    <>
      <Banner
        title="THIẾT LẬP GIẢI ĐẤU & TỰ ĐỘNG XẾP LỊCH"
        subtitle="Hỗ trợ cả 2 thể thức: Vòng Bảng + Knockout và Cúp Loại Trực Tiếp (Ngẫu nhiên hoặc Bốc thăm 3D)"
        badge="TOURNAMENT BUILDER WIZARD"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Progress Tracker */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span
                className={`w-8 h-8 rounded-full font-oswald font-bold flex items-center justify-center text-sm ${
                  step === 1 ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                1
              </span>
              <span className="font-oswald text-sm font-bold uppercase text-slate-800 dark:text-slate-200">
                Bước 1: Chọn Thể Thức & Cấu Hình
              </span>
            </div>
            <div className="h-0.5 w-12 bg-slate-300 hidden sm:block"></div>
            <div className="flex items-center space-x-3">
              <span
                className={`w-8 h-8 rounded-full font-oswald font-bold flex items-center justify-center text-sm ${
                  step === 2 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                2
              </span>
              <span className="font-oswald text-sm font-bold uppercase text-slate-800 dark:text-slate-200">
                Bước 2: Điền Thành Viên & Bắt Cặp Thi Đấu
              </span>
            </div>
          </div>

          {/* Step 1: Configuration Form */}
          {step === 1 && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-oswald text-xl font-bold uppercase text-slate-900 dark:text-white">
                    BƯỚC 1: THIẾT LẬP THÔNG SỐ GIẢI ĐẤU
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Lựa chọn hệ thống giải, thể thức thi đấu và số lượng đội tham gia.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleFillSampleData}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-oswald font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  ⚡ Nạp Mẫu Nhanh
                </button>
              </div>

              {/* 1. System Selection */}
              <div>
                <label className="block text-xs font-oswald font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
                  1. Chọn Hệ Thống Giải Đấu
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`p-4 rounded-xl border-2 cursor-pointer flex items-center space-x-3 transition-all ${
                      tournamentSystem === 'SAO_VANG'
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="system"
                      checked={tournamentSystem === 'SAO_VANG'}
                      onChange={() => handleSystemChange('SAO_VANG')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <strong className="text-sm text-slate-900 dark:text-white block font-oswald uppercase">
                        ⭐ SAO VÀNG CUP ™
                      </strong>
                      <span className="text-xs text-slate-500">Giải đấu truyền thống Sao Vàng</span>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-xl border-2 cursor-pointer flex items-center space-x-3 transition-all ${
                      tournamentSystem === 'DTHEN'
                        ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="system"
                      checked={tournamentSystem === 'DTHEN'}
                      onChange={() => handleSystemChange('DTHEN')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <strong className="text-sm text-slate-900 dark:text-white block font-oswald uppercase">
                        🏆 ĐTHÉN FCO ™
                      </strong>
                      <span className="text-xs text-slate-500">Giải đấu cộng đồng ĐThén FCO</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 2. Format Selection */}
              <div>
                <label className="block text-xs font-oswald font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
                  2. Chọn Thể Thức Thi Đấu
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`p-4 rounded-xl border-2 cursor-pointer flex items-start space-x-3 transition-all ${
                      format === 'group_knockout'
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      checked={format === 'group_knockout'}
                      onChange={() => setFormat('group_knockout')}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <strong className="text-sm text-slate-900 dark:text-white block font-oswald uppercase">
                        1. Vòng Bảng + Knockout (World Cup Format)
                      </strong>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        Chia bảng đá vòng tròn tính điểm, chọn các đội xuất sắc nhất vào đá loại trực tiếp.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-xl border-2 cursor-pointer flex items-start space-x-3 transition-all ${
                      format === 'pure_knockout'
                        ? 'bg-amber-50/80 border-amber-500 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      checked={format === 'pure_knockout'}
                      onChange={() => setFormat('pure_knockout')}
                      className="mt-1 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <strong className="text-sm text-slate-900 dark:text-white block font-oswald uppercase text-amber-950">
                        2. Cúp Loại Trực Tiếp Thuần Túy (Knockout Cup)
                      </strong>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        Đá loại trực tiếp ngay từ vòng đầu (Tứ kết, 1/8, 1/16). Thắng đi tiếp, thua dừng bước.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Tournament Name & Season Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-oswald font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Tên Giải Đấu
                  </label>
                  <input
                    type="text"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:border-emerald-600 focus:outline-none"
                    placeholder="SAO VÀNG CUP ™"
                  />
                </div>

                <div>
                  <label className="block text-xs font-oswald font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Mùa Giải / Giai Đoạn
                  </label>
                  <input
                    type="text"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:border-emerald-600 focus:outline-none"
                    placeholder="MÙA 3"
                  />
                </div>
              </div>

              {/* IF GROUP KNOCKOUT: Show Group Settings */}
              {format === 'group_knockout' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <h4 className="font-oswald text-xs font-bold uppercase text-emerald-800 tracking-wider">
                    CẤU HÌNH VÒNG BẢNG
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-oswald font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                        Số Lượng Bảng Đấu
                      </label>
                      <select
                        value={numGroups}
                        onChange={(e) => setNumGroups(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:border-emerald-600 focus:outline-none"
                      >
                        <option value={1}>1 Bảng</option>
                        <option value={2}>2 Bảng (A, B)</option>
                        <option value={4}>4 Bảng (A, B, C, D)</option>
                        <option value={6}>6 Bảng (A..F)</option>
                        <option value={8}>8 Bảng (A..H - 32 Đội)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-oswald font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                        Số Đội / Bảng
                      </label>
                      <select
                        value={teamsPerGroup}
                        onChange={(e) => setTeamsPerGroup(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:border-emerald-600 focus:outline-none"
                      >
                        <option value={3}>3 Đội / Bảng</option>
                        <option value={4}>4 Đội / Bảng</option>
                        <option value={5}>5 Đội / Bảng</option>
                        <option value={6}>6 Đội / Bảng</option>
                        <option value={8}>8 Đội / Bảng</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-oswald font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                        Số Lượt Đấu
                      </label>
                      <select
                        value={legType}
                        onChange={(e) => setLegType(e.target.value as 'single' | 'double')}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:border-emerald-600 focus:outline-none"
                      >
                        <option value="single">Vòng tròn 1 lượt</option>
                        <option value="double">Vòng tròn 2 lượt (Đi & Về)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* IF PURE KNOCKOUT: Show Knockout Size and Pairing Mode */}
              {format === 'pure_knockout' && (
                <div className="p-5 rounded-xl bg-amber-50/50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 space-y-5">
                  <div>
                    <label className="block text-xs font-oswald font-bold uppercase text-slate-800 dark:text-white mb-2">
                      3. Số Lượng Đội Tham Gia (Tự Chọn)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { count: 4, label: '4 Đội (Bán Kết ➔ CK)' },
                        { count: 8, label: '8 Đội (Tứ Kết ➔ CK)' },
                        { count: 16, label: '16 Đội (Vòng 1/8 ➔ CK)' },
                        { count: 32, label: '32 Đội (Vòng 1/16 ➔ CK)' },
                      ].map((item) => (
                        <button
                          key={item.count}
                          type="button"
                          onClick={() => setKnockoutTeamsCount(item.count)}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            knockoutTeamsCount === item.count
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-sm'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="font-oswald text-lg font-black block">{item.count} ĐỘI</span>
                          <span className="text-[10px] opacity-80 block">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pairing Mode Selection */}
                  <div>
                    <label className="block text-xs font-oswald font-bold uppercase text-slate-800 dark:text-white mb-2">
                      4. Cơ Chế Xếp Cặp Thi Đấu
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label
                        className={`p-4 rounded-xl border-2 cursor-pointer flex items-start space-x-3 transition-all ${
                          pairingMode === 'random'
                            ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="pairingMode"
                          checked={pairingMode === 'random'}
                          onChange={() => setPairingMode('random')}
                          className="mt-1 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <strong className="text-sm text-slate-900 dark:text-white block font-oswald uppercase">
                            🎲 Xếp Cặp Ngẫu Nhiên (Auto Random)
                          </strong>
                          <span className="text-xs text-slate-500 block mt-0.5">
                            Hệ thống tự động xáo trộn ngẫu nhiên danh sách đã nhập và ghép cặp vào cây sơ đồ ngay lập tức.
                          </span>
                        </div>
                      </label>

                      <label
                        className={`p-4 rounded-xl border-2 cursor-pointer flex items-start space-x-3 transition-all ${
                          pairingMode === 'draw'
                            ? 'bg-amber-100/60 border-amber-500 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="pairingMode"
                          checked={pairingMode === 'draw'}
                          onChange={() => setPairingMode('draw')}
                          className="mt-1 text-amber-600 focus:ring-amber-500"
                        />
                        <div>
                          <strong className="text-sm text-slate-900 dark:text-white block font-oswald uppercase text-amber-950">
                            🏆 Bốc Thăm Trực Tiếp (Live 3D Draw)
                          </strong>
                          <span className="text-xs text-slate-500 block mt-0.5">
                            Chuyển toàn bộ danh sách HLV sang sân khấu Bốc thăm 3D để mở từng quả bóng chia vào các Trận 1, 2...
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-oswald text-sm font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-sm cursor-pointer"
                >
                  <span>Tiếp Tục Điền Tên Đội (Bước 2)</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Input Members */}
          {step === 2 && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-oswald text-xl font-bold uppercase text-slate-900 dark:text-white">
                    {format === 'pure_knockout'
                      ? `BƯỚC 2: DANH SÁCH ${knockoutTeamsCount} HLV THAM GIA CÚP KNOCKOUT`
                      : 'BƯỚC 2: ĐIỀN TÊN THÀNH VIÊN TỪNG BẢNG'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {format === 'pure_knockout'
                      ? pairingMode === 'random'
                        ? 'Nhập tên các HLV và CLB. Hệ thống sẽ xáo trộn ngẫu nhiên để xếp cặp đấu.'
                        : 'Nhập tên các HLV và CLB để sẵn sàng đưa lên sân khấu Bốc thăm 3D.'
                      : 'Hệ thống sẽ dựa vào danh sách này để tự động tính điểm và xếp lịch thi đấu vòng tròn.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-oswald font-bold uppercase transition-colors cursor-pointer"
                >
                  ← Quay Lại Bước 1
                </button>
              </div>

              {/* Group Format Form */}
              {format === 'group_knockout' && (
                <div className="space-y-8">
                  {groupTeams.map((teamsInGroup, gIdx) => {
                    const groupLetter = String.fromCharCode(65 + gIdx);
                    return (
                      <div key={gIdx} className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                          <span className="font-oswald font-bold text-base text-emerald-800 dark:text-emerald-400 uppercase">
                            BẢNG {groupLetter} ({teamsInGroup.length} Đội)
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {legType === 'double' ? 'Vòng tròn 2 lượt' : 'Vòng tròn 1 lượt'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {teamsInGroup.map((team, tIdx) => (
                            <div key={tIdx} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center">
                                  {tIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={team.name}
                                  onChange={(e) => handleGroupTeamChange(gIdx, tIdx, 'name', e.target.value)}
                                  placeholder={`Tên HLV ${tIdx + 1}`}
                                  className="w-full px-2.5 py-1 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
                                />
                              </div>
                              <div className="pl-7">
                                <input
                                  type="text"
                                  value={team.club}
                                  onChange={(e) => handleGroupTeamChange(gIdx, tIdx, 'club', e.target.value)}
                                  placeholder="CLB (Real Madrid, Chelsea...)"
                                  className="w-full px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 focus:border-emerald-600 focus:outline-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pure Knockout Format Form */}
              {format === 'pure_knockout' && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900 dark:text-amber-300">
                      Quy mô: {knockoutTeamsCount} Huấn Luyện Viên • Cơ chế: {pairingMode === 'random' ? 'Xếp Cặp Ngẫu Nhiên 🎲' : 'Bốc Thăm 3D 🏆'}
                    </span>
                    <span className="text-slate-500">
                      {knockoutTeamsCount === 8 ? '4 Trận Tứ Kết' : knockoutTeamsCount === 16 ? '8 Trận Vòng 1/8' : '16 Trận Vòng 1/16'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {knockoutTeams.map((team, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center space-x-2.5 hover:border-amber-400 transition-all shadow-2xs"
                      >
                        <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 font-oswald text-xs font-black flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                          #{tIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={team.name}
                          onChange={(e) => handleKnockoutTeamChange(tIdx, 'name', e.target.value)}
                          placeholder={`Tên Huấn Luyện Viên ${tIdx + 1}`}
                          className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-oswald text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  ← Quay Lại
                </button>

                {format === 'group_knockout' ? (
                  <button
                    type="button"
                    onClick={handleCreateGroupTournament}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-oswald text-sm font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center space-x-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-check"></i>
                    <span>HOÀN TẤT & XẾP LỊCH VÒNG BẢNG NGAY</span>
                  </button>
                ) : pairingMode === 'random' ? (
                  <button
                    type="button"
                    onClick={handleCreateKnockoutRandom}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-oswald text-sm font-black uppercase tracking-wider transition-colors shadow-md flex items-center space-x-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-shuffle"></i>
                    <span>TỰ ĐỘNG XẾP CẶP NGẪU NHIÊN & TẠO SƠ ĐỒ KNOCKOUT</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleProceedTo3DDraw}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-oswald text-sm font-black uppercase tracking-wider transition-all shadow-md flex items-center space-x-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-trophy"></i>
                    <span>CHUYỂN SANG SÂN KHẤU BỐC THĂM 3D TRỰC TIẾP</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Taogiaidau;
