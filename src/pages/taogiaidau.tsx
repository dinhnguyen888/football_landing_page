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
  saveTournamentData,
  createDefaultTournament,
} from '../utils/tournamentEngine';

const Taogiaidau: React.FC = () => {
  const navigate = useNavigate();

  // Step 1: Configuration
  const [step, setStep] = useState<1 | 2>(1);
  const [tournamentName, setTournamentName] = useState('SAO VÀNG CUP ™');
  const [season, setSeason] = useState('MÙA 2');
  const [numGroups, setNumGroups] = useState<number>(4);
  const [teamsPerGroup, setTeamsPerGroup] = useState<number>(5);
  const [legType, setLegType] = useState<'single' | 'double'>('double');

  // Step 2: Teams Input data structured by group
  // e.g. groupTeams[0] = [{ name: '', club: '' }, ...]
  const [groupTeams, setGroupTeams] = useState<{ name: string; club: string }[][]>([]);

  // Go to Step 2: Initialize inputs
  const handleProceedToStep2 = () => {
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
    setStep(2);
  };

  // Quick fill preset sample data
  const handleFillSampleData = () => {
    const sampleData = createDefaultTournament();
    saveTournamentData(sampleData);
    alert('Đã tạo giải đấu mẫu Sao Vàng Cup ™ (4 Bảng, 20 Đội) thành công!');
    navigate('/ltd');
  };

  // Change team info
  const handleTeamChange = (groupIdx: number, teamIdx: number, field: 'name' | 'club', value: string) => {
    const newGroups = [...groupTeams];
    newGroups[groupIdx][teamIdx][field] = value;
    setGroupTeams(newGroups);
  };

  // Finish and create tournament
  const handleCreateTournament = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const groups: Group[] = groupTeams.map((teamsInput, gIdx) => {
      const groupLetter = alphabet[gIdx] || `${gIdx + 1}`;
      const teams: Team[] = teamsInput.map((t, tIdx) => ({
        id: `g${gIdx + 1}_t${tIdx + 1}`,
        name: t.name.trim() || `Đội ${tIdx + 1}`,
        club: t.club.trim() || '',
      }));

      // Generate round robin schedule automatically
      const matches = generateRoundRobinMatches(teams, legType);

      return {
        id: `group_${gIdx + 1}`,
        name: `BẢNG ${groupLetter}`,
        teams,
        matches,
      };
    });

    const newTournament: TournamentData = {
      id: `tour_${Date.now()}`,
      tournamentName,
      season,
      numGroups,
      teamsPerGroup,
      legType,
      groups,
      createdAt: new Date().toISOString(),
      isVisible: true,
    };

    saveTournamentData(newTournament);
    alert('🎉 Đã thiết lập giải đấu & tự động sinh toàn bộ lịch thi đấu thành công!');
    navigate('/ltd');
  };

  return (
    <>
      <Banner
        title="THIẾT LẬP GIẢI ĐẤU & XẾP LỊCH TỰ ĐỘNG"
        subtitle="Tạo giải đấu, thiết lập số bảng, nhập danh sách thành viên và tự động xếp lịch thi đấu vòng tròn"
        badge="TOURNAMENT BUILDER WIZARD"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Progress Tracker */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span
                className={`w-8 h-8 rounded-full font-oswald font-bold flex items-center justify-center text-sm ${
                  step === 1 ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                1
              </span>
              <span className="font-oswald text-sm font-bold uppercase text-slate-800">
                Bước 1: Cấu Hình Số Bảng & Số Đội
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
              <span className="font-oswald text-sm font-bold uppercase text-slate-800">
                Bước 2: Điền Tên Thành Viên & Tự Động Xếp Lịch
              </span>
            </div>
          </div>

          {/* Step 1: Configuration Form */}
          {step === 1 && (
            <div className="p-6 sm:p-8 rounded-xl portal-card space-y-6">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-oswald text-xl font-bold uppercase text-slate-900">
                    BƯỚC 1: THIẾT LẬP THÔNG SỐ GIẢI ĐẤU
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chọn số lượng bảng đấu và số đội trong mỗi bảng để chuẩn bị sinh lịch thi đấu.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleFillSampleData}
                  className="px-3 py-1.5 rounded bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-oswald font-bold uppercase tracking-wider"
                >
                  ⚡ Nạp Dữ Liệu Mẫu (4 Bảng - 20 Đội)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-oswald font-bold uppercase text-slate-700 mb-1.5">
                    Tên Giải Đấu
                  </label>
                  <input
                    type="text"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:outline-none"
                    placeholder="GREAT MATES CUP"
                  />
                </div>

                <div>
                  <label className="block text-xs font-oswald font-bold uppercase text-slate-700 mb-1.5">
                    Mùa Giải / Giai Đoạn
                  </label>
                  <input
                    type="text"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:outline-none"
                    placeholder="MÙA 2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-oswald font-bold uppercase text-slate-700 mb-1.5">
                    Số Lượng Bảng Đấu
                  </label>
                  <select
                    value={numGroups}
                    onChange={(e) => setNumGroups(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-medium focus:border-emerald-600 focus:outline-none bg-white"
                  >
                    <option value={1}>1 Bảng (Vòng tròn toàn bộ)</option>
                    <option value={2}>2 Bảng (Bảng A, B)</option>
                    <option value={4}>4 Bảng (Bảng A, B, C, D - Chuẩn giải đấu)</option>
                    <option value={6}>6 Bảng (Bảng A, B, C, D, E, F)</option>
                    <option value={8}>8 Bảng (Bảng A..H)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-oswald font-bold uppercase text-slate-700 mb-1.5">
                    Số Đội Trong 1 Bảng
                  </label>
                  <select
                    value={teamsPerGroup}
                    onChange={(e) => setTeamsPerGroup(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-medium focus:border-emerald-600 focus:outline-none bg-white"
                  >
                    <option value={3}>3 Đội / Bảng</option>
                    <option value={4}>4 Đội / Bảng</option>
                    <option value={5}>5 Đội / Bảng (Chuẩn 20 đội 4 bảng)</option>
                    <option value={6}>6 Đội / Bảng</option>
                    <option value={7}>7 Đội / Bảng</option>
                    <option value={8}>8 Đội / Bảng</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-oswald font-bold uppercase text-slate-700 mb-1.5">
                    Thể Thức Thi Đấu Vòng Bảng
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      className={`p-3.5 rounded-lg border cursor-pointer flex items-center space-x-3 transition-colors ${
                        legType === 'double' ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="legType"
                        checked={legType === 'double'}
                        onChange={() => setLegType('double')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <strong className="text-sm text-slate-900 block">Vòng Tròn 2 Lượt (Lượt Đi & Lượt Về)</strong>
                        <span className="text-xs text-slate-500">Mỗi cặp đấu sẽ gặp nhau 2 trận sân nhà - sân khách</span>
                      </div>
                    </label>

                    <label
                      className={`p-3.5 rounded-lg border cursor-pointer flex items-center space-x-3 transition-colors ${
                        legType === 'single' ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="legType"
                        checked={legType === 'single'}
                        onChange={() => setLegType('single')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <strong className="text-sm text-slate-900 block">Vòng Tròn 1 Lượt</strong>
                        <span className="text-xs text-slate-500">Mỗi cặp đấu chỉ gặp nhau đúng 1 trận duy nhất</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-oswald text-sm font-bold uppercase tracking-wider transition-colors flex items-center space-x-2"
                >
                  <span>Tiếp Tục Điền Tên Đội (Bước 2)</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Input Members */}
          {step === 2 && (
            <div className="p-6 sm:p-8 rounded-xl portal-card space-y-6">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-oswald text-xl font-bold uppercase text-slate-900">
                    BƯỚC 2: ĐIỀN TÊN CÁC THÀNH VIÊN / CLB TỪNG BẢNG
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hệ thống sẽ dựa vào danh sách này để tự động tính điểm và xếp lịch thi đấu vòng tròn.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-oswald font-bold uppercase"
                >
                  ← Quay Lại Bước 1
                </button>
              </div>

              <div className="space-y-8">
                {groupTeams.map((teamsInGroup, gIdx) => {
                  const groupLetter = String.fromCharCode(65 + gIdx);
                  return (
                    <div key={gIdx} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="font-oswald font-bold text-base text-emerald-800 uppercase">
                          BẢNG {groupLetter} ({teamsInGroup.length} Đội)
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {legType === 'double' ? 'Thi đấu 2 lượt (Đi & Về)' : 'Thi đấu 1 lượt'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {teamsInGroup.map((team, tIdx) => (
                          <div key={tIdx} className="p-3 rounded-lg bg-white border border-slate-200 space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                                {tIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={team.name}
                                onChange={(e) => handleTeamChange(gIdx, tIdx, 'name', e.target.value)}
                                placeholder={`Tên HLV ${tIdx + 1}`}
                                className="w-full px-2.5 py-1 text-xs font-bold border border-slate-300 rounded focus:border-emerald-600 focus:outline-none"
                              />
                            </div>
                            <div className="pl-7">
                              <input
                                type="text"
                                value={team.club}
                                onChange={(e) => handleTeamChange(gIdx, tIdx, 'club', e.target.value)}
                                placeholder="Câu lạc bộ (VD: Real Madrid, Chelsea...)"
                                className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded text-slate-600 focus:border-emerald-600 focus:outline-none"
                              />
                            </div>
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
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-oswald text-xs font-bold uppercase"
                >
                  ← Quay Lại
                </button>
                <button
                  type="button"
                  onClick={handleCreateTournament}
                  className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-oswald text-sm font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center space-x-2"
                >
                  <i className="fa-solid fa-check"></i>
                  <span>HOÀN TẤT & XẾP LỊCH THI ĐẤU NGAY</span>
                </button>
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
