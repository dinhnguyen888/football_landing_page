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
}

const STORAGE_KEY = 'great_mates_tournament_data';
const ARCHIVE_KEY = 'great_mates_tournaments_archive';

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

// Storage helpers
export function saveTournamentData(data: TournamentData | null): void {
  try {
    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(STORAGE_KEY);
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

export function saveArchiveTournaments(list: TournamentData[]): void {
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(list));
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

// Generate FIFA Knockout Bracket depending on number of groups (2, 4, or 8)
export function buildFIFABracketFromGroups(groups: Group[]): KnockoutStage {
  // Step 1: calculate top 2 teams for each group
  const topTeams: { [groupLetter: string]: { first: Team; second: Team } } = {};

  groups.forEach((grp, idx) => {
    const letter = String.fromCharCode(65 + idx); // 'A', 'B', 'C', 'D'...
    const standings = calculateGroupStandings(grp);
    const firstTeamStat = standings[0];
    const secondTeamStat = standings[1];

    const firstTeam = grp.teams.find((t) => t.id === firstTeamStat?.teamId) || {
      id: `top1_${letter}`,
      name: `Nhất ${grp.name}`,
    };
    const secondTeam = grp.teams.find((t) => t.id === secondTeamStat?.teamId) || {
      id: `top2_${letter}`,
      name: `Nhì ${grp.name}`,
    };

    topTeams[letter] = { first: firstTeam, second: secondTeam };
  });

  const numGroups = groups.length;

  // CASE 1: 4 GROUPS (Standard World Cup 8-team Quarterfinals)
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
