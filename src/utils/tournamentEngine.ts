import {
  saveTournamentToFirestore,
  getTournamentFromFirestore,
  clearLiveDrawStateFromFirestore,
  CLOUD_KEYS,
} from '../services/tournamentService';

export interface Team {
  id: string;
  name: string;
  club?: string;
}

export interface Match {
  id: string;
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  played: boolean;
}

export interface TeamStats {
  teamId: string;
  teamName: string;
  club?: string;
  played: number; // ĐĐ
  won: number;    // Thắng
  drawn: number;  // H
  lost: number;   // Thua
  goalsFor: number; // BT
  goalsAgainst: number; // SBT
  goalDifference: number; // HS
  points: number; // Đ
}

export interface Group {
  id: string;
  name: string; // "BẢNG A", "BẢNG B"...
  teams: Team[];
  matches: Match[];
}

export interface KnockoutMatch {
  id: string;
  roundName: string; // 'VÒNG 1/8' | 'TỨ KẾT' | 'BÁN KẾT' | 'CHUNG KẾT' | 'TRANH HẠNG BA'
  matchOrder: number; // 1, 2, 3...
  homeTeamName: string;
  homeTeamClub?: string;
  homeSourceText?: string; // 'Nhất Bảng A'
  awayTeamName: string;
  awayTeamClub?: string;
  awaySourceText?: string; // 'Nhì Bảng B'
  homeScore: number | null;
  awayScore: number | null;
  homePenScore?: number | null;
  awayPenScore?: number | null;
  played: boolean;
  winnerTeamName?: string;
  nextMatchId?: string;
  nextMatchSlot?: 'home' | 'away';
}

export interface KnockoutStage {
  isCompletedGroupStage: boolean;
  rounds: {
    name: string; // 'VÒNG 1/8' | 'TỨ KẾT' | 'BÁN KẾT' | 'CHUNG KẾT'
    matches: KnockoutMatch[];
  }[];
  thirdPlaceMatch?: KnockoutMatch;
}

export interface TournamentData {
  id: string;
  tournamentName: string;
  season: string;
  numGroups: number;
  teamsPerGroup: number;
  legType: 'single' | 'double';
  groups: Group[];
  knockoutStage?: KnockoutStage;
  createdAt: string;
  isVisible?: boolean; // Toggle display on public page
  format?: 'group_knockout' | 'pure_knockout';
  pairingMode?: 'random' | 'draw';
  totalTeams?: number;
}

const STORAGE_KEY = 'great_mates_tournament_data';
const STORAGE_KEY_DTHEN = 'dthen_fco_tournament_data';
const ARCHIVE_KEY = 'great_mates_tournaments_archive';
const ARCHIVE_KEY_DTHEN = 'dthen_tournaments_archive';

/**
 * Tạo cây sơ đồ Vòng Loại Trực Tiếp (Pure Knockout Bracket) linh hoạt theo số đội tự chọn (4, 8, 16, 32 đội...)
 */
export function generatePureKnockoutBracket(teamsInput: Team[], shuffle: boolean = false): KnockoutStage {
  let teams = [...teamsInput];
  if (shuffle) {
    teams.sort(() => Math.random() - 0.5);
  }

  // Xác định kích thước cây nhị phân (4, 8, 16, 32...)
  let bracketSize = 4;
  while (bracketSize < teams.length && bracketSize < 64) {
    bracketSize *= 2;
  }
  // Bổ sung BYE nếu số đội không đủ lũy thừa của 2
  while (teams.length < bracketSize) {
    teams.push({
      id: `bye_${teams.length + 1}`,
      name: 'BYE (Đặc cách)',
      club: 'BYE',
    });
  }

  const roundNamesMap: { [count: number]: string } = {
    16: 'VÒNG 1/16',
    8: 'VÒNG 1/8',
    4: 'TỨ KẾT',
    2: 'BÁN KẾT',
    1: 'CHUNG KẾT',
  };

  const rounds: { name: string; matches: KnockoutMatch[] }[] = [];
  let currentMatchCount = bracketSize / 2;
  let roundIndex = 0;

  while (currentMatchCount >= 1) {
    const roundName = roundNamesMap[currentMatchCount] || `VÒNG ${currentMatchCount * 2} ĐỘI`;
    const matches: KnockoutMatch[] = [];

    for (let m = 0; m < currentMatchCount; m++) {
      const matchOrder = m + 1;
      const matchId = `ko_r${roundIndex}_m${matchOrder}`;
      const nextMatchOrder = Math.floor(m / 2) + 1;
      const nextMatchId = currentMatchCount > 1 ? `ko_r${roundIndex + 1}_m${nextMatchOrder}` : undefined;
      const nextMatchSlot: 'home' | 'away' = m % 2 === 0 ? 'home' : 'away';

      let homeName = '';
      let homeClub: string | undefined = undefined;
      let awayName = '';
      let awayClub: string | undefined = undefined;

      if (roundIndex === 0) {
        const homeTeam = teams[m * 2];
        const awayTeam = teams[m * 2 + 1];
        homeName = homeTeam?.name || `Đội ${m * 2 + 1}`;
        homeClub = homeTeam?.club;
        awayName = awayTeam?.name || `Đội ${m * 2 + 2}`;
        awayClub = awayTeam?.club;
      } else {
        homeName = `Thắng Trận #${m * 2 + 1} (${rounds[roundIndex - 1]?.name || ''})`;
        awayName = `Thắng Trận #${m * 2 + 2} (${rounds[roundIndex - 1]?.name || ''})`;
      }

      matches.push({
        id: matchId,
        roundName,
        matchOrder,
        homeTeamName: homeName,
        homeTeamClub: homeClub,
        awayTeamName: awayName,
        awayTeamClub: awayClub,
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId,
        nextMatchSlot,
      });
    }

    rounds.push({
      name: roundName,
      matches,
    });

    currentMatchCount = Math.floor(currentMatchCount / 2);
    roundIndex++;
  }

  const thirdPlaceMatch: KnockoutMatch = {
    id: 'ko_third_place',
    roundName: 'TRANH HẠNG BA',
    matchOrder: 1,
    homeTeamName: 'Thua Bán Kết 1',
    awayTeamName: 'Thua Bán Kết 2',
    homeScore: null,
    awayScore: null,
    played: false,
  };

  return {
    isCompletedGroupStage: true,
    rounds,
    thirdPlaceMatch,
  };
}

// Berger Tables / Round Robin Scheduling Algorithm
export function generateRoundRobinMatches(teams: Team[], legType: 'single' | 'double' = 'double'): Match[] {
  const matches: Match[] = [];
  const teamList = [...teams];
  
  const isOdd = teamList.length % 2 !== 0;
  if (isOdd) {
    teamList.push({ id: 'BYE', name: 'BYE' });
  }

  const n = teamList.length;
  const rounds = n - 1;
  const half = n / 2;

  const firstLegMatches: Match[] = [];
  let matchCounter = 1;

  for (let r = 0; r < rounds; r++) {
    const roundNumber = r + 1;

    for (let i = 0; i < half; i++) {
      const homeIdx = (r + i) % (n - 1);
      let awayIdx = (n - 1 - i + r) % (n - 1);

      if (i === 0) {
        awayIdx = n - 1;
      }

      const teamA = teamList[homeIdx];
      const teamB = teamList[awayIdx];

      if (teamA.id === 'BYE' || teamB.id === 'BYE') {
        continue;
      }

      const homeTeam = r % 2 === 0 ? teamA : teamB;
      const awayTeam = r % 2 === 0 ? teamB : teamA;

      firstLegMatches.push({
        id: `match_${matchCounter++}`,
        round: roundNumber,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore: null,
        awayScore: null,
        played: false,
      });
    }
  }

  matches.push(...firstLegMatches);

  if (legType === 'double') {
    const secondLegMatches: Match[] = firstLegMatches.map((m) => ({
      id: `match_${matchCounter++}`,
      round: m.round + rounds,
      homeTeamId: m.awayTeamId,
      awayTeamId: m.homeTeamId,
      homeScore: null,
      awayScore: null,
      played: false,
    }));
    matches.push(...secondLegMatches);
  }

  return matches;
}

// Calculate real-world football standings
export function calculateGroupStandings(group: Group): TeamStats[] {
  const statsMap: { [teamId: string]: TeamStats } = {};

  group.teams.forEach((t) => {
    statsMap[t.id] = {
      teamId: t.id,
      teamName: t.name,
      club: t.club || '',
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });

  group.matches.forEach((m) => {
    if (m.played && m.homeScore !== null && m.awayScore !== null) {
      const home = statsMap[m.homeTeamId];
      const away = statsMap[m.awayTeamId];

      if (home && away) {
        home.played += 1;
        away.played += 1;

        home.goalsFor += m.homeScore;
        home.goalsAgainst += m.awayScore;

        away.goalsFor += m.awayScore;
        away.goalsAgainst += m.homeScore;

        if (m.homeScore > m.awayScore) {
          home.won += 1;
          home.points += 3;
          away.lost += 1;
        } else if (m.homeScore === m.awayScore) {
          home.drawn += 1;
          home.points += 1;
          away.drawn += 1;
          away.points += 1;
        } else {
          away.won += 1;
          away.points += 3;
          home.lost += 1;
        }
      }
    }
  });

  const standings: TeamStats[] = Object.values(statsMap).map((s) => ({
    ...s,
    goalDifference: s.goalsFor - s.goalsAgainst,
  }));

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamName.localeCompare(b.teamName);
  });

  return standings;
}

// Storage helpers for Sao Vàng Cup
export function saveTournamentData(data: TournamentData | null): void {
  try {
    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      saveTournamentToFirestore(CLOUD_KEYS.SAO_VANG, data);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      saveTournamentToFirestore(CLOUD_KEYS.SAO_VANG, null);
    }
  } catch (err) {
    console.error('Error saving tournament data', err);
  }
}

export function loadTournamentData(): TournamentData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading tournament data', err);
  }
  return null;
}

// Storage helpers for ĐThén FCO
export function saveDthenTournamentData(data: TournamentData | null): void {
  try {
    if (data) {
      localStorage.setItem(STORAGE_KEY_DTHEN, JSON.stringify(data));
      saveTournamentToFirestore(CLOUD_KEYS.DTHEN, data);
    } else {
      localStorage.removeItem(STORAGE_KEY_DTHEN);
      saveTournamentToFirestore(CLOUD_KEYS.DTHEN, null);
    }
  } catch (err) {
    console.error('Error saving Dthen tournament data', err);
  }
}

export function loadDthenTournamentData(): TournamentData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DTHEN);
    if (!raw) {
      const fresh = createDefaultDthenTournament();
      saveDthenTournamentData(fresh);
      return fresh;
    }
    const data: TournamentData = JSON.parse(raw);

    // Tự động nâng cấp lên phiên bản 34 VĐV với VĐV Đặc cách 1 là Phạm Quốc Minh, Đặc cách 2 là Phan Long
    const isOldMockData = !data || (
      data.format !== 'pure_knockout' ||
      !data.knockoutStage?.rounds ||
      data.knockoutStage.rounds.length < 6 ||
      !data.knockoutStage.rounds[0]?.matches?.some(m => m.homeTeamName.includes('DTFxMP07')) ||
      !data.knockoutStage.rounds[2]?.matches?.[0]?.homeTeamName.includes('Phạm Quốc Minh')
    );

    if (isOldMockData) {
      const fresh = createDefaultDthenTournament();
      saveDthenTournamentData(fresh);
      return fresh;
    }
    return data;
  } catch (err) {
    console.error('Error loading Dthen tournament data', err);
    return null;
  }
}

export function saveArchiveTournaments(list: TournamentData[]): void {
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(list));
    saveTournamentToFirestore(CLOUD_KEYS.ARCHIVE, list);
  } catch (err) {
    console.error('Error saving archive tournaments', err);
  }
}

export function loadArchiveTournaments(): TournamentData[] {
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading archive tournaments', err);
  }
  return [];
}

export function saveArchiveDthenTournaments(list: TournamentData[]): void {
  try {
    localStorage.setItem(ARCHIVE_KEY_DTHEN, JSON.stringify(list));
    saveTournamentToFirestore(CLOUD_KEYS.ARCHIVE_DTHEN, list);
  } catch (err) {
    console.error('Error saving Dthen archive tournaments', err);
  }
}

export function loadArchiveDthenTournaments(): TournamentData[] {
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY_DTHEN);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading Dthen archive tournaments', err);
  }
  return [];
}

export const CLEAN_VERSION_KEY = 'saovang_tournaments_cleaned_stamp_v1';

/**
 * Khởi tạo cấu trúc giải đấu rỗng an toàn khi hệ thống chưa có giải
 */
export function createEmptyTournament(system: 'SAO_VANG' | 'DTHEN'): TournamentData {
  return {
    id: `tour_empty_${system.toLowerCase()}_${Date.now()}`,
    tournamentName: system === 'SAO_VANG' ? 'SAO VÀNG CUP ™' : 'ĐTHÉN FCO ™',
    season: 'CHƯA CÓ GIẢI ĐẤU',
    numGroups: 0,
    teamsPerGroup: 0,
    legType: 'single',
    groups: [],
    createdAt: new Date().toISOString(),
    isVisible: false,
  };
}

/**
 * Dọn sạch TOÀN BỘ giải đấu trên LocalStorage và Cloud Firestore mà KHÔNG xóa các dữ liệu khác (tài khoản, bài viết, theme...)
 */
export async function cleanAllTournaments(): Promise<void> {
  // 1. Xóa các khóa lưu trữ giải đấu trên LocalStorage
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_DTHEN);
    localStorage.removeItem(ARCHIVE_KEY);
    localStorage.removeItem(ARCHIVE_KEY_DTHEN);
    localStorage.removeItem('SAOVANG_DRAW_DIRECT_SETUP');
    localStorage.removeItem('saovang_draw_draft');
    localStorage.removeItem('SAOVANG_DRAW_DRAFT_V1');
    localStorage.setItem(CLEAN_VERSION_KEY, 'CLEANED_SUCCESS');
  } catch (err) {
    console.warn('LocalStorage clean error:', err);
  }

  // 2. Xóa các tài liệu giải đấu trên Cloud Firestore
  try {
    await Promise.all([
      saveTournamentToFirestore(CLOUD_KEYS.SAO_VANG, null),
      saveTournamentToFirestore(CLOUD_KEYS.DTHEN, null),
      saveTournamentToFirestore(CLOUD_KEYS.ARCHIVE, []),
      saveTournamentToFirestore(CLOUD_KEYS.ARCHIVE_DTHEN, []),
      clearLiveDrawStateFromFirestore(),
    ]);
  } catch (err) {
    console.warn('Firestore clean error:', err);
  }
}

/**
 * Tự động kích hoạt dọn sạch giải đấu trên trình duyệt khi người dùng tải trang
 */
export function checkAndPerformOneTimeClean(): void {
  try {
    if (typeof window !== 'undefined' && localStorage.getItem(CLEAN_VERSION_KEY) !== 'CLEANED_SUCCESS') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_DTHEN);
      localStorage.removeItem(ARCHIVE_KEY);
      localStorage.removeItem(ARCHIVE_KEY_DTHEN);
      localStorage.removeItem('SAOVANG_DRAW_DIRECT_SETUP');
      localStorage.removeItem('saovang_draw_draft');
      localStorage.removeItem('SAOVANG_DRAW_DRAFT_V1');
      localStorage.setItem(CLEAN_VERSION_KEY, 'CLEANED_SUCCESS');
    }
  } catch (err) {
    // Ignore in non-browser or storage-restricted contexts
  }
}

// Chạy một lần tự động dọn sạch giải đấu cũ
checkAndPerformOneTimeClean();

/**
 * Kiểm tra giải đấu hợp lệ (có vòng bảng hoặc là cúp Knockout)
 */
export function isValidTournament(tour: TournamentData | null | undefined): boolean {
  if (!tour) return false;
  const hasGroups = Array.isArray(tour.groups) && tour.groups.length > 0;
  const isKnockout = tour.format === 'pure_knockout';
  const hasKnockoutStage = Boolean(tour.knockoutStage && Array.isArray(tour.knockoutStage.rounds) && tour.knockoutStage.rounds.length > 0);
  return hasGroups || isKnockout || hasKnockoutStage;
}

/**
 * Lưu đồng bộ một giải đấu vào cả giải hiện hành và danh sách lưu trữ (Archive)
 */
export function saveTournamentBoth(tour: TournamentData, system: 'SAO_VANG' | 'DTHEN'): void {
  if (system === 'SAO_VANG') {
    saveTournamentData(tour);
    const archives = loadArchiveTournaments();
    const existingIdx = archives.findIndex((t) => t.id === tour.id);
    let updated: TournamentData[];
    if (existingIdx >= 0) {
      updated = [...archives];
      updated[existingIdx] = tour;
    } else {
      updated = [tour, ...archives.filter((t) => t.id !== tour.id).map((t) => ({ ...t, isVisible: false }))];
    }
    saveArchiveTournaments(updated);
  } else {
    saveDthenTournamentData(tour);
    const archives = loadArchiveDthenTournaments();
    const existingIdx = archives.findIndex((t) => t.id === tour.id);
    let updated: TournamentData[];
    if (existingIdx >= 0) {
      updated = [...archives];
      updated[existingIdx] = tour;
    } else {
      updated = [tour, ...archives.filter((t) => t.id !== tour.id).map((t) => ({ ...t, isVisible: false }))];
    }
    saveArchiveDthenTournaments(updated);
  }
}

export async function fetchAndSyncArchiveDthenTournaments(): Promise<TournamentData[]> {
  try {
    const cloudData = await getTournamentFromFirestore<TournamentData[]>(CLOUD_KEYS.ARCHIVE_DTHEN);
    if (cloudData && Array.isArray(cloudData)) {
      localStorage.setItem(ARCHIVE_KEY_DTHEN, JSON.stringify(cloudData));
      return cloudData;
    }
  } catch (err) {
    console.warn('[Firebase] Fallback to local Dthen archive tournament data', err);
  }
  return loadArchiveDthenTournaments();
}

// Async helpers to fetch and sync from Firebase Cloud
export async function fetchAndSyncDthenTournament(): Promise<TournamentData | null> {
  try {
    const cloudData = await getTournamentFromFirestore<TournamentData>(CLOUD_KEYS.DTHEN);
    if (cloudData) {
      const isOldCloud = (
        cloudData.format !== 'pure_knockout' ||
        !cloudData.knockoutStage?.rounds ||
        cloudData.knockoutStage.rounds.length < 6 ||
        !cloudData.knockoutStage.rounds[0]?.matches?.some(m => m.homeTeamName.includes('DTFxMP07')) ||
        !cloudData.knockoutStage.rounds[2]?.matches?.[0]?.homeTeamName.includes('Phạm Quốc Minh')
      );
      if (isOldCloud) {
        const fresh = createDefaultDthenTournament();
        saveDthenTournamentData(fresh);
        return fresh;
      }
      localStorage.setItem(STORAGE_KEY_DTHEN, JSON.stringify(cloudData));
      return cloudData;
    }
  } catch (err) {
    console.warn('[Firebase] Fallback to local Dthen tournament data', err);
  }
  return loadDthenTournamentData();
}

export async function fetchAndSyncSaoVangTournament(): Promise<TournamentData | null> {
  try {
    const cloudData = await getTournamentFromFirestore<TournamentData>(CLOUD_KEYS.SAO_VANG);
    if (cloudData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
      return cloudData;
    }
  } catch (err) {
    console.warn('[Firebase] Fallback to local Sao Vang tournament data', err);
  }
  return loadTournamentData();
}

export async function fetchAndSyncArchiveTournaments(): Promise<TournamentData[]> {
  try {
    const cloudData = await getTournamentFromFirestore<TournamentData[]>(CLOUD_KEYS.ARCHIVE);
    if (cloudData && Array.isArray(cloudData)) {
      localStorage.setItem(ARCHIVE_KEY, JSON.stringify(cloudData));
      return cloudData;
    }
  } catch (err) {
    console.warn('[Firebase] Fallback to local archive tournament data', err);
  }
  return loadArchiveTournaments();
}

// Generate FIFA Knockout Bracket depending on number of groups (2, 4, or 8)
export function buildFIFABracketFromGroups(groups: Group[]): KnockoutStage {
  // Step 1: calculate top 2 teams for each group
  const topTeams: { [groupLetter: string]: { first: Team; second: Team } } = {};

  groups.forEach((grp, idx) => {
    const letter = String.fromCharCode(65 + idx); // 'A', 'B', 'C', 'D'...
    const hasMatches = grp.matches && grp.matches.length > 0;
    const isFinished = hasMatches && grp.matches.every((m) => m.played);

    if (isFinished) {
      const standings = calculateGroupStandings(grp);
      const firstTeamStat = standings[0];
      const secondTeamStat = standings[1];

      const firstTeam = grp.teams.find((t) => t.id === firstTeamStat?.teamId) || {
        id: `top1_${letter}`,
        name: `Nhất ${grp.name}`,
        club: grp.name,
      };
      const secondTeam = grp.teams.find((t) => t.id === secondTeamStat?.teamId) || {
        id: `top2_${letter}`,
        name: `Nhì ${grp.name}`,
        club: grp.name,
      };

      topTeams[letter] = { first: firstTeam, second: secondTeam };
    } else {
      // Khi chưa kết thúc vòng bảng: Luôn hiển thị quy tắc phân nhánh World Cup (Nhất Bảng A, Nhì Bảng B,...)
      topTeams[letter] = {
        first: {
          id: `top1_${letter}`,
          name: `Nhất ${grp.name}`,
          club: `Đội đầu ${grp.name}`,
        },
        second: {
          id: `top2_${letter}`,
          name: `Nhì ${grp.name}`,
          club: `Đội nhì ${grp.name}`,
        },
      };
    }
  });

  const numGroups = groups.length;

  // CASE 0: 8 GROUPS (World Cup Format: 16 Teams -> Vòng 1/8 -> Tứ Kết -> Bán Kết -> Chung Kết)
  if (numGroups === 8) {
    const r16Matches: KnockoutMatch[] = [
      {
        id: 'r16_1',
        roundName: 'VÒNG 1/8',
        matchOrder: 1,
        homeTeamName: topTeams['A']?.first.name || 'Nhất Bảng A',
        homeTeamClub: topTeams['A']?.first.club,
        homeSourceText: 'Nhất Bảng A',
        awayTeamName: topTeams['B']?.second.name || 'Nhì Bảng B',
        awayTeamClub: topTeams['B']?.second.club,
        awaySourceText: 'Nhì Bảng B',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'qf_1',
        nextMatchSlot: 'home',
      },
      {
        id: 'r16_2',
        roundName: 'VÒNG 1/8',
        matchOrder: 2,
        homeTeamName: topTeams['C']?.first.name || 'Nhất Bảng C',
        homeTeamClub: topTeams['C']?.first.club,
        homeSourceText: 'Nhất Bảng C',
        awayTeamName: topTeams['D']?.second.name || 'Nhì Bảng D',
        awayTeamClub: topTeams['D']?.second.club,
        awaySourceText: 'Nhì Bảng D',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'qf_1',
        nextMatchSlot: 'away',
      },
      {
        id: 'r16_3',
        roundName: 'VÒNG 1/8',
        matchOrder: 3,
        homeTeamName: topTeams['E']?.first.name || 'Nhất Bảng E',
        homeTeamClub: topTeams['E']?.first.club,
        homeSourceText: 'Nhất Bảng E',
        awayTeamName: topTeams['F']?.second.name || 'Nhì Bảng F',
        awayTeamClub: topTeams['F']?.second.club,
        awaySourceText: 'Nhì Bảng F',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'qf_2',
        nextMatchSlot: 'home',
      },
      {
        id: 'r16_4',
        roundName: 'VÒNG 1/8',
        matchOrder: 4,
        homeTeamName: topTeams['G']?.first.name || 'Nhất Bảng G',
        homeTeamClub: topTeams['G']?.first.club,
        homeSourceText: 'Nhất Bảng G',
        awayTeamName: topTeams['H']?.second.name || 'Nhì Bảng H',
        awayTeamClub: topTeams['H']?.second.club,
        awaySourceText: 'Nhì Bảng H',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'qf_2',
        nextMatchSlot: 'away',
      },
      {
        id: 'r16_5',
        roundName: 'VÒNG 1/8',
        matchOrder: 5,
        homeTeamName: topTeams['B']?.first.name || 'Nhất Bảng B',
        homeTeamClub: topTeams['B']?.first.club,
        homeSourceText: 'Nhất Bảng B',
        awayTeamName: topTeams['A']?.second.name || 'Nhì Bảng A',
        awayTeamClub: topTeams['A']?.second.club,
        awaySourceText: 'Nhì Bảng A',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'qf_3',
        nextMatchSlot: 'home',
      },
      {
        id: 'r16_6',
        roundName: 'VÒNG 1/8',
        matchOrder: 6,
        homeTeamName: topTeams['D']?.first.name || 'Nhất Bảng D',
        homeTeamClub: topTeams['D']?.first.club,
        homeSourceText: 'Nhất Bảng D',
        awayTeamName: topTeams['C']?.second.name || 'Nhì Bảng C',
        awayTeamClub: topTeams['C']?.second.club,
        awaySourceText: 'Nhì Bảng C',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'qf_3',
        nextMatchSlot: 'away',
      },
      {
        id: 'r16_7',
        roundName: 'VÒNG 1/8',
        matchOrder: 7,
        homeTeamName: topTeams['F']?.first.name || 'Nhất Bảng F',
        homeTeamClub: topTeams['F']?.first.club,
        homeSourceText: 'Nhất Bảng F',
        awayTeamName: topTeams['E']?.second.name || 'Nhì Bảng E',
        awayTeamClub: topTeams['E']?.second.club,
        awaySourceText: 'Nhì Bảng E',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'qf_4',
        nextMatchSlot: 'home',
      },
      {
        id: 'r16_8',
        roundName: 'VÒNG 1/8',
        matchOrder: 8,
        homeTeamName: topTeams['H']?.first.name || 'Nhất Bảng H',
        homeTeamClub: topTeams['H']?.first.club,
        homeSourceText: 'Nhất Bảng H',
        awayTeamName: topTeams['G']?.second.name || 'Nhì Bảng G',
        awayTeamClub: topTeams['G']?.second.club,
        awaySourceText: 'Nhì Bảng G',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'qf_4',
        nextMatchSlot: 'away',
      },
    ];

    const qfMatches: KnockoutMatch[] = [
      {
        id: 'qf_1',
        roundName: 'TỨ KẾT',
        matchOrder: 1,
        homeTeamName: 'Thắng Trận 1/8 (1)',
        awayTeamName: 'Thắng Trận 1/8 (2)',
        homeSourceText: 'Thắng 1/8 (1)',
        awaySourceText: 'Thắng 1/8 (2)',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'sf_1',
        nextMatchSlot: 'home',
      },
      {
        id: 'qf_2',
        roundName: 'TỨ KẾT',
        matchOrder: 2,
        homeTeamName: 'Thắng Trận 1/8 (3)',
        awayTeamName: 'Thắng Trận 1/8 (4)',
        homeSourceText: 'Thắng 1/8 (3)',
        awaySourceText: 'Thắng 1/8 (4)',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'sf_1',
        nextMatchSlot: 'away',
      },
      {
        id: 'qf_3',
        roundName: 'TỨ KẾT',
        matchOrder: 3,
        homeTeamName: 'Thắng Trận 1/8 (5)',
        awayTeamName: 'Thắng Trận 1/8 (6)',
        homeSourceText: 'Thắng 1/8 (5)',
        awaySourceText: 'Thắng 1/8 (6)',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'sf_2',
        nextMatchSlot: 'home',
      },
      {
        id: 'qf_4',
        roundName: 'TỨ KẾT',
        matchOrder: 4,
        homeTeamName: 'Thắng Trận 1/8 (7)',
        awayTeamName: 'Thắng Trận 1/8 (8)',
        homeSourceText: 'Thắng 1/8 (7)',
        awaySourceText: 'Thắng 1/8 (8)',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'sf_2',
        nextMatchSlot: 'away',
      },
    ];

    const sfMatches: KnockoutMatch[] = [
      {
        id: 'sf_1',
        roundName: 'BÁN KẾT',
        matchOrder: 1,
        homeTeamName: 'Thắng Tứ Kết 1',
        awayTeamName: 'Thắng Tứ Kết 2',
        homeSourceText: 'Thắng TK 1',
        awaySourceText: 'Thắng TK 2',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'final_1',
        nextMatchSlot: 'home',
      },
      {
        id: 'sf_2',
        roundName: 'BÁN KẾT',
        matchOrder: 2,
        homeTeamName: 'Thắng Tứ Kết 3',
        awayTeamName: 'Thắng Tứ Kết 4',
        homeSourceText: 'Thắng TK 3',
        awaySourceText: 'Thắng TK 4',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'final_1',
        nextMatchSlot: 'away',
      },
    ];

    const finalMatch: KnockoutMatch = {
      id: 'final_1',
      roundName: 'CHUNG KẾT',
      matchOrder: 1,
      homeTeamName: 'Thắng Bán Kết 1',
      awayTeamName: 'Thắng Bán Kết 2',
      homeSourceText: 'Thắng BK 1',
      awaySourceText: 'Thắng BK 2',
      homeScore: null,
      awayScore: null,
      played: false,
    };

    return {
      isCompletedGroupStage: true,
      rounds: [
        { name: 'VÒNG 1/8', matches: r16Matches },
        { name: 'TỨ KẾT', matches: qfMatches },
        { name: 'BÁN KẾT', matches: sfMatches },
        { name: 'CHUNG KẾT', matches: [finalMatch] },
      ],
    };
  }

  // CASE 1: 4 GROUPS (Standard 8-team Quarterfinals)
  if (numGroups === 4) {
    // Round 1: TỨ KẾT (4 matches)
    const qfMatches: KnockoutMatch[] = [
      {
        id: 'qf_1',
        roundName: 'TỨ KẾT',
        matchOrder: 1,
        homeTeamName: topTeams['A']?.first.name || 'Nhất Bảng A',
        homeTeamClub: topTeams['A']?.first.club,
        homeSourceText: 'Nhất Bảng A',
        awayTeamName: topTeams['B']?.second.name || 'Nhì Bảng B',
        awayTeamClub: topTeams['B']?.second.club,
        awaySourceText: 'Nhì Bảng B',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'sf_1',
        nextMatchSlot: 'home',
      },
      {
        id: 'qf_2',
        roundName: 'TỨ KẾT',
        matchOrder: 2,
        homeTeamName: topTeams['C']?.first.name || 'Nhất Bảng C',
        homeTeamClub: topTeams['C']?.first.club,
        homeSourceText: 'Nhất Bảng C',
        awayTeamName: topTeams['D']?.second.name || 'Nhì Bảng D',
        awayTeamClub: topTeams['D']?.second.club,
        awaySourceText: 'Nhì Bảng D',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'sf_1',
        nextMatchSlot: 'away',
      },
      {
        id: 'qf_3',
        roundName: 'TỨ KẾT',
        matchOrder: 3,
        homeTeamName: topTeams['B']?.first.name || 'Nhất Bảng B',
        homeTeamClub: topTeams['B']?.first.club,
        homeSourceText: 'Nhất Bảng B',
        awayTeamName: topTeams['A']?.second.name || 'Nhì Bảng A',
        awayTeamClub: topTeams['A']?.second.club,
        awaySourceText: 'Nhì Bảng A',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'sf_2',
        nextMatchSlot: 'home',
      },
      {
        id: 'qf_4',
        roundName: 'TỨ KẾT',
        matchOrder: 4,
        homeTeamName: topTeams['D']?.first.name || 'Nhất Bảng D',
        homeTeamClub: topTeams['D']?.first.club,
        homeSourceText: 'Nhất Bảng D',
        awayTeamName: topTeams['C']?.second.name || 'Nhì Bảng C',
        awayTeamClub: topTeams['C']?.second.club,
        awaySourceText: 'Nhì Bảng C',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'sf_2',
        nextMatchSlot: 'away',
      },
    ];

    // Round 2: BÁN KẾT (2 matches)
    const sfMatches: KnockoutMatch[] = [
      {
        id: 'sf_1',
        roundName: 'BÁN KẾT',
        matchOrder: 1,
        homeTeamName: 'Thắng Tứ Kết 1',
        awayTeamName: 'Thắng Tứ Kết 2',
        homeSourceText: 'Thắng TK 1',
        awaySourceText: 'Thắng TK 2',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'final_1',
        nextMatchSlot: 'home',
      },
      {
        id: 'sf_2',
        roundName: 'BÁN KẾT',
        matchOrder: 2,
        homeTeamName: 'Thắng Tứ Kết 3',
        awayTeamName: 'Thắng Tứ Kết 4',
        homeSourceText: 'Thắng TK 3',
        awaySourceText: 'Thắng TK 4',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'final_1',
        nextMatchSlot: 'away',
      },
    ];

    // Round 3: CHUNG KẾT (1 match)
    const finalMatch: KnockoutMatch = {
      id: 'final_1',
      roundName: 'CHUNG KẾT',
      matchOrder: 1,
      homeTeamName: 'Thắng Bán Kết 1',
      awayTeamName: 'Thắng Bán Kết 2',
      homeSourceText: 'Thắng BK 1',
      awaySourceText: 'Thắng BK 2',
      homeScore: null,
      awayScore: null,
      played: false,
    };

    return {
      isCompletedGroupStage: true,
      rounds: [
        { name: 'TỨ KẾT', matches: qfMatches },
        { name: 'BÁN KẾT', matches: sfMatches },
        { name: 'CHUNG KẾT', matches: [finalMatch] },
      ],
    };
  }

  // CASE 2: 2 GROUPS (Semifinals -> Final)
  if (numGroups === 2) {
    const sfMatches: KnockoutMatch[] = [
      {
        id: 'sf_1',
        roundName: 'BÁN KẾT',
        matchOrder: 1,
        homeTeamName: topTeams['A']?.first.name || 'Nhất Bảng A',
        homeTeamClub: topTeams['A']?.first.club,
        homeSourceText: 'Nhất Bảng A',
        awayTeamName: topTeams['B']?.second.name || 'Nhì Bảng B',
        awayTeamClub: topTeams['B']?.second.club,
        awaySourceText: 'Nhì Bảng B',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'final_1',
        nextMatchSlot: 'home',
      },
      {
        id: 'sf_2',
        roundName: 'BÁN KẾT',
        matchOrder: 2,
        homeTeamName: topTeams['B']?.first.name || 'Nhất Bảng B',
        homeTeamClub: topTeams['B']?.first.club,
        homeSourceText: 'Nhất Bảng B',
        awayTeamName: topTeams['A']?.second.name || 'Nhì Bảng A',
        awayTeamClub: topTeams['A']?.second.club,
        awaySourceText: 'Nhì Bảng A',
        homeScore: null,
        awayScore: null,
        played: false,
        nextMatchId: 'final_1',
        nextMatchSlot: 'away',
      },
    ];

    const finalMatch: KnockoutMatch = {
      id: 'final_1',
      roundName: 'CHUNG KẾT',
      matchOrder: 1,
      homeTeamName: 'Thắng Bán Kết 1',
      awayTeamName: 'Thắng Bán Kết 2',
      homeSourceText: 'Thắng BK 1',
      awaySourceText: 'Thắng BK 2',
      homeScore: null,
      awayScore: null,
      played: false,
    };

    return {
      isCompletedGroupStage: true,
      rounds: [
        { name: 'BÁN KẾT', matches: sfMatches },
        { name: 'CHUNG KẾT', matches: [finalMatch] },
      ],
    };
  }

  // DEFAULT / 3+ GROUPS GENERIC BRACKET (Top 2 from each group)
  const qfMatches: KnockoutMatch[] = [
    {
      id: 'qf_1',
      roundName: 'TỨ KẾT',
      matchOrder: 1,
      homeTeamName: topTeams['A']?.first.name || 'Nhất Bảng A',
      homeTeamClub: topTeams['A']?.first.club,
      homeSourceText: 'Nhất Bảng A',
      awayTeamName: topTeams['B']?.second.name || 'Nhì Bảng B',
      awayTeamClub: topTeams['B']?.second.club,
      awaySourceText: 'Nhì Bảng B',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'sf_1',
      nextMatchSlot: 'home',
    },
    {
      id: 'qf_2',
      roundName: 'TỨ KẾT',
      matchOrder: 2,
      homeTeamName: topTeams['C']?.first.name || topTeams['A']?.second.name || 'Đội 3',
      homeTeamClub: topTeams['C']?.first.club,
      homeSourceText: 'Đội 3',
      awayTeamName: topTeams['D']?.second.name || topTeams['B']?.second.name || 'Đội 4',
      awayTeamClub: topTeams['D']?.second.club,
      awaySourceText: 'Đội 4',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'sf_1',
      nextMatchSlot: 'away',
    },
  ];

  const finalMatch: KnockoutMatch = {
    id: 'final_1',
    roundName: 'CHUNG KẾT',
    matchOrder: 1,
    homeTeamName: 'Thắng Trận 1',
    awayTeamName: 'Thắng Trận 2',
    homeScore: null,
    awayScore: null,
    played: false,
  };

  return {
    isCompletedGroupStage: true,
    rounds: [
      { name: 'BÁN KẾT', matches: qfMatches },
      { name: 'CHUNG KẾT', matches: [finalMatch] },
    ],
  };
}

// Generate default preset data for Sao Vàng Cup Mùa 2
export function createDefaultTournament(): TournamentData {
  const groupNames = ['BẢNG A', 'BẢNG B', 'BẢNG C', 'BẢNG D'];
  const defaultCoaches = [
    [
      { id: 't1', name: 'HLV Phan Long (BTC)', club: 'Chelsea' },
      { id: 't2', name: 'HLV Duy Anh', club: 'Real Madrid' },
      { id: 't3', name: 'HLV Tuấn Kiệt', club: 'Man City' },
      { id: 't4', name: 'HLV Hoàng Nam', club: 'AC Milan' },
      { id: 't5', name: 'HLV Minh Đức', club: 'Arsenal' },
    ],
    [
      { id: 't6', name: "HLV Vis's Sơn", club: 'Bayern Munich' },
      { id: 't7', name: 'HLV Dũng Huyền', club: 'Juventus' },
      { id: 't8', name: 'HLV Quốc Bảo', club: 'Liverpool' },
      { id: 't9', name: 'HLV Văn Hậu', club: 'Inter Milan' },
      { id: 't10', name: 'HLV Quang Hải', club: 'PSG' },
    ],
    [
      { id: 't11', name: 'HLV Thành Long', club: 'Barcelona' },
      { id: 't12', name: 'HLV Đình Trọng', club: 'Tottenham' },
      { id: 't13', name: 'HLV Hữu Thắng', club: 'Dortmund' },
      { id: 't14', name: 'HLV Đức Huy', club: 'Atletico' },
      { id: 't15', name: 'HLV Việt Anh', club: 'AS Roma' },
    ],
    [
      { id: 't16', name: 'HLV Văn Toàn', club: 'Man United' },
      { id: 't17', name: 'HLV Công Phượng', club: 'Napoli' },
      { id: 't18', name: 'HLV Tuấn Anh', club: 'Leverkusen' },
      { id: 't19', name: 'HLV Xuân Trường', club: 'Sevilla' },
      { id: 't20', name: 'HLV Ngọc Hải', club: 'SLNA' },
    ],
  ];

  const groups: Group[] = groupNames.map((name, idx) => {
    const teams = defaultCoaches[idx];
    const matches = generateRoundRobinMatches(teams, 'double');
    return {
      id: `group_${idx + 1}`,
      name,
      teams,
      matches,
    };
  });

  return {
    id: 'tour_default_mua_2',
    tournamentName: 'SAO VÀNG CUP ™',
    season: 'MÙA 2',
    numGroups: 4,
    teamsPerGroup: 5,
    legType: 'double',
    groups,
    createdAt: new Date().toISOString(),
    isVisible: true,
  };
}

// Generate default preset data for ĐThén FCO Mùa 1 (34 VĐV - 2 VĐV Đặc Cách Chuẩn Theo Bốc Thăm V1 & V2)
export function createDthen34Tournament(): TournamentData {
  // 1. VÒNG PLAY-OFF (8 VĐV thi đấu 4 trận P1 -> P4, lấy 4 người thắng W1 -> W4)
  const playoffMatches: KnockoutMatch[] = [
    {
      id: 'ko_playoff_1',
      roundName: 'VÒNG PLAY-OFF',
      matchOrder: 1,
      homeTeamName: 'DTFxMP07 (Mẫn Phương)',
      homeTeamClub: 'Mẫn Phương',
      awayTeamName: 'dtfxtintin (Nguyễn Phi Long)',
      awayTeamClub: 'Nguyễn Phi Long',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_vongloai_13',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_playoff_2',
      roundName: 'VÒNG PLAY-OFF',
      matchOrder: 2,
      homeTeamName: 'DTFxKarma (Tuấn Đạt)',
      homeTeamClub: 'Tuấn Đạt',
      awayTeamName: 'DTFxt4bin (Phamm Tungg Anhh)',
      awayTeamClub: 'Phamm Tungg Anhh',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_vongloai_13',
      nextMatchSlot: 'away',
    },
    {
      id: 'ko_playoff_3',
      roundName: 'VÒNG PLAY-OFF',
      matchOrder: 3,
      homeTeamName: 'DTFxSiuuperman (Minh Long)',
      homeTeamClub: 'Minh Long',
      awayTeamName: 'DTFxLamHTH2k12 (Huỳnh Tấn Hải)',
      awayTeamClub: 'Huỳnh Tấn Hải',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_vongloai_14',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_playoff_4',
      roundName: 'VÒNG PLAY-OFF',
      matchOrder: 4,
      homeTeamName: 'DTFxNavy (Hoàng Huy)',
      homeTeamClub: 'Hoàng Huy',
      awayTeamName: 'DTFxHoangViet (Hoang Nam)',
      awayTeamClub: 'Hoang Nam',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_vongloai_14',
      nextMatchSlot: 'away',
    },
  ];

  // 2. VÒNG LOẠI (28 VĐV thi đấu 14 trận T1 -> T14, lấy 14 người thắng A1 -> A14)
  const vongloaiMatches: KnockoutMatch[] = [
    {
      id: 'ko_vongloai_1',
      roundName: 'VÒNG LOẠI',
      matchOrder: 1,
      homeTeamName: 'DTFx TONY (Nguyễn Hồng Đại Dương)',
      homeTeamClub: 'Nguyễn Hồng Đại Dương',
      awayTeamName: 'DTFx1515 (Le Tien Huy)',
      awayTeamClub: 'Le Tien Huy',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_top16_1',
      nextMatchSlot: 'away',
    },
    {
      id: 'ko_vongloai_2',
      roundName: 'VÒNG LOẠI',
      matchOrder: 2,
      homeTeamName: 'DTFxNamB (Tống Duy Nam)',
      homeTeamClub: 'Tống Duy Nam',
      awayTeamName: 'DTFxZeRy (M. Hiển)',
      awayTeamClub: 'M. Hiển',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_top16_2',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_vongloai_3',
      roundName: 'VÒNG LOẠI',
      matchOrder: 3,
      homeTeamName: 'DTFxNgminh08 (Minh Nguyễn)',
      homeTeamClub: 'Minh Nguyễn',
      awayTeamName: 'DTFxDPex09 (Phát Lù Danh)',
      awayTeamClub: 'Phát Lù Danh',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_top16_2',
      nextMatchSlot: 'away',
    },
    {
      id: 'ko_vongloai_4',
      roundName: 'VÒNG LOẠI',
      matchOrder: 4,
      homeTeamName: 'DTFxMamyeuemm (Trần Tuấn)',
      homeTeamClub: 'Trần Tuấn',
      awayTeamName: 'DFTxNkhánh7zz (Nam Khánhh)',
      awayTeamClub: 'Nam Khánhh',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_top16_3',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_vongloai_5',
      roundName: 'VÒNG LOẠI',
      matchOrder: 5,
      homeTeamName: 'DTF x t3xture (Triet Tran)',
      homeTeamClub: 'Triet Tran',
      awayTeamName: 'DTFx2207 (Nguyen Bao)',
      awayTeamClub: 'Nguyen Bao',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_top16_3',
      nextMatchSlot: 'away',
    },
    {
      id: 'ko_vongloai_6',
      roundName: 'VÒNG LOẠI',
      matchOrder: 6,
      homeTeamName: 'DTFxDungLe (Dũng Lê)',
      homeTeamClub: 'Dũng Lê',
      awayTeamName: 'DTFxTrThaooo (Trường Thảo)',
      awayTeamClub: 'Trường Thảo',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_top16_4',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_vongloai_7',
      roundName: 'VÒNG LOẠI',
      matchOrder: 7,
      homeTeamName: 'DTFxMhieu (Minh Hiếu)',
      homeTeamClub: 'Minh Hiếu',
      awayTeamName: 'DTFxHab75 (Bao Anh Nguyen)',
      awayTeamClub: 'Bao Anh Nguyen',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_top16_4',
      nextMatchSlot: 'away',
    },
    {
      id: 'ko_vongloai_8',
      roundName: 'VÒNG LOẠI',
      matchOrder: 8,
      homeTeamName: 'ĐTFXhlanmeomeo (Hoàng Lân)',
      homeTeamClub: 'Hoàng Lân',
      awayTeamName: 'DTFxDante04 (Vĩnh Tường)',
      awayTeamClub: 'Vĩnh Tường',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_top16_5',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_vongloai_9',
      roundName: 'VÒNG LOẠI',
      matchOrder: 9,
      homeTeamName: 'DTFxTanPhat (Nguyễn Tấn Phát)',
      homeTeamClub: 'Nguyễn Tấn Phát',
      awayTeamName: 'ĐTFxRùaBéo (Nhat Tung)',
      awayTeamClub: 'Nhat Tung',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_top16_5',
      nextMatchSlot: 'away',
    },
    {
      id: 'ko_vongloai_10',
      roundName: 'VÒNG LOẠI',
      matchOrder: 10,
      homeTeamName: 'Dtfxtinbow (Long Nguyễn)',
      homeTeamClub: 'Long Nguyễn',
      awayTeamName: 'DTFxLBao (Le Bao)',
      awayTeamClub: 'Le Bao',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_top16_6',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_vongloai_11',
      roundName: 'VÒNG LOẠI',
      matchOrder: 11,
      homeTeamName: 'DTFxHwng14 (Truong Phuoc Hung)',
      homeTeamClub: 'Truong Phuoc Hung',
      awayTeamName: 'ĐTFxBell05 (Huynh Le)',
      awayTeamClub: 'Huynh Le',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_top16_6',
      nextMatchSlot: 'away',
    },
    {
      id: 'ko_vongloai_12',
      roundName: 'VÒNG LOẠI',
      matchOrder: 12,
      homeTeamName: 'ĐTFxSơnSợYêu (Sơn Hoàng)',
      homeTeamClub: 'Sơn Hoàng',
      awayTeamName: 'DTFxThanhDuong (Nguyễn Thanh Duong)',
      awayTeamClub: 'Nguyễn Thanh Duong',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_top16_7',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_vongloai_13',
      roundName: 'VÒNG LOẠI',
      matchOrder: 13,
      homeTeamName: 'Thắng P1 (W1)',
      homeSourceText: 'Thắng P1 (W1)',
      awayTeamName: 'Thắng P2 (W2)',
      awaySourceText: 'Thắng P2 (W2)',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_top16_7',
      nextMatchSlot: 'away',
    },
    {
      id: 'ko_vongloai_14',
      roundName: 'VÒNG LOẠI',
      matchOrder: 14,
      homeTeamName: 'Thắng P3 (W3)',
      homeSourceText: 'Thắng P3 (W3)',
      awayTeamName: 'Thắng P4 (W4)',
      awaySourceText: 'Thắng P4 (W4)',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_top16_8',
      nextMatchSlot: 'home',
    },
  ];

  // 3. TOP 16 (8 trận: Trận 1 -> Trận 8, kết hợp 14 người thắng + 2 VĐV đặc cách)
  const top16Matches: KnockoutMatch[] = [
    {
      id: 'ko_top16_1',
      roundName: 'TOP 16',
      matchOrder: 1,
      homeTeamName: '⭐ DTFx18 05 2024 (Phạm Quốc Minh)',
      homeTeamClub: 'Phạm Quốc Minh',
      homeSourceText: 'VĐV 1 Đặc cách Top 16',
      awayTeamName: 'Thắng T1 (A1)',
      awaySourceText: 'Thắng T1 (A1)',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_tuket_1',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_top16_2',
      roundName: 'TOP 16',
      matchOrder: 2,
      homeTeamName: 'Thắng T2 (A2)',
      homeSourceText: 'Thắng T2 (A2)',
      awayTeamName: 'Thắng T3 (A3)',
      awaySourceText: 'Thắng T3 (A3)',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_tuket_1',
      nextMatchSlot: 'away',
    },
    {
      id: 'ko_top16_3',
      roundName: 'TOP 16',
      matchOrder: 3,
      homeTeamName: 'Thắng T4 (A4)',
      homeSourceText: 'Thắng T4 (A4)',
      awayTeamName: 'Thắng T5 (A5)',
      awaySourceText: 'Thắng T5 (A5)',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_tuket_2',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_top16_4',
      roundName: 'TOP 16',
      matchOrder: 4,
      homeTeamName: 'Thắng T6 (A6)',
      homeSourceText: 'Thắng T6 (A6)',
      awayTeamName: 'Thắng T7 (A7)',
      awaySourceText: 'Thắng T7 (A7)',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_tuket_2',
      nextMatchSlot: 'away',
    },
    {
      id: 'ko_top16_5',
      roundName: 'TOP 16',
      matchOrder: 5,
      homeTeamName: 'Thắng T8 (A8)',
      homeSourceText: 'Thắng T8 (A8)',
      awayTeamName: 'Thắng T9 (A9)',
      awaySourceText: 'Thắng T9 (A9)',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_tuket_3',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_top16_6',
      roundName: 'TOP 16',
      matchOrder: 6,
      homeTeamName: 'Thắng T10 (A10)',
      homeSourceText: 'Thắng T10 (A10)',
      awayTeamName: 'Thắng T11 (A11)',
      awaySourceText: 'Thắng T11 (A11)',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_tuket_3',
      nextMatchSlot: 'away',
    },
    {
      id: 'ko_top16_7',
      roundName: 'TOP 16',
      matchOrder: 7,
      homeTeamName: 'Thắng T12 (A12)',
      homeSourceText: 'Thắng T12 (A12)',
      awayTeamName: 'Thắng T13 (A13)',
      awaySourceText: 'Thắng T13 (A13)',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_tuket_4',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_top16_8',
      roundName: 'TOP 16',
      matchOrder: 8,
      homeTeamName: 'Thắng T14 (A14)',
      homeSourceText: 'Thắng T14 (A14)',
      awayTeamName: '⭐ ĐTFxGNOL04 (Phan Long)',
      awayTeamClub: 'Phan Long',
      awaySourceText: 'VĐV 2 Đặc cách Top 16',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_tuket_4',
      nextMatchSlot: 'away',
    },
  ];

  // 4. TOP 8 / TỨ KẾT (4 trận: Q1 -> Q4)
  const tuKetMatches: KnockoutMatch[] = [
    {
      id: 'ko_tuket_1',
      roundName: 'TỨ KẾT',
      matchOrder: 1,
      homeTeamName: 'Thắng Trận 1',
      homeSourceText: 'Thắng Trận 1',
      awayTeamName: 'Thắng Trận 2',
      awaySourceText: 'Thắng Trận 2',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_banket_1',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_tuket_2',
      roundName: 'TỨ KẾT',
      matchOrder: 2,
      homeTeamName: 'Thắng Trận 3',
      homeSourceText: 'Thắng Trận 3',
      awayTeamName: 'Thắng Trận 4',
      awaySourceText: 'Thắng Trận 4',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_banket_1',
      nextMatchSlot: 'away',
    },
    {
      id: 'ko_tuket_3',
      roundName: 'TỨ KẾT',
      matchOrder: 3,
      homeTeamName: 'Thắng Trận 5',
      homeSourceText: 'Thắng Trận 5',
      awayTeamName: 'Thắng Trận 6',
      awaySourceText: 'Thắng Trận 6',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_banket_2',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_tuket_4',
      roundName: 'TỨ KẾT',
      matchOrder: 4,
      homeTeamName: 'Thắng Trận 7',
      homeSourceText: 'Thắng Trận 7',
      awayTeamName: 'Thắng Trận 8',
      awaySourceText: 'Thắng Trận 8',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_banket_2',
      nextMatchSlot: 'away',
    },
  ];

  // 5. TOP 4 / BÁN KẾT (2 trận: S1, S2)
  const banKetMatches: KnockoutMatch[] = [
    {
      id: 'ko_banket_1',
      roundName: 'BÁN KẾT',
      matchOrder: 1,
      homeTeamName: 'Thắng Q1',
      homeSourceText: 'Thắng Q1',
      awayTeamName: 'Thắng Q2',
      awaySourceText: 'Thắng Q2',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_chungket_1',
      nextMatchSlot: 'home',
    },
    {
      id: 'ko_banket_2',
      roundName: 'BÁN KẾT',
      matchOrder: 2,
      homeTeamName: 'Thắng Q3',
      homeSourceText: 'Thắng Q3',
      awayTeamName: 'Thắng Q4',
      awaySourceText: 'Thắng Q4',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: 'ko_chungket_1',
      nextMatchSlot: 'away',
    },
  ];

  // 6. CHUNG KẾT (1 trận tìm nhà vô địch)
  const chungKetMatches: KnockoutMatch[] = [
    {
      id: 'ko_chungket_1',
      roundName: 'CHUNG KẾT',
      matchOrder: 1,
      homeTeamName: 'Thắng S1',
      homeSourceText: 'Thắng S1',
      awayTeamName: 'Thắng S2',
      awaySourceText: 'Thắng S2',
      homeScore: null,
      awayScore: null,
      played: false,
    },
  ];

  return {
    id: 'tour_dthen_mua_1',
    tournamentName: 'ĐTHÉN FCO ™',
    season: 'MÙA 1 (34 VĐV)',
    numGroups: 0,
    teamsPerGroup: 0,
    totalTeams: 34,
    format: 'pure_knockout',
    legType: 'single',
    groups: [],
    knockoutStage: {
      isCompletedGroupStage: true,
      rounds: [
        { name: 'VÒNG PLAY-OFF', matches: playoffMatches },
        { name: 'VÒNG LOẠI', matches: vongloaiMatches },
        { name: 'TOP 16', matches: top16Matches },
        { name: 'TỨ KẾT', matches: tuKetMatches },
        { name: 'BÁN KẾT', matches: banKetMatches },
        { name: 'CHUNG KẾT', matches: chungKetMatches },
      ],
    },
    createdAt: new Date().toISOString(),
    isVisible: true,
  };
}

export function createDefaultDthenTournament(): TournamentData {
  return createDthen34Tournament();
}


