import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { drawAudio, BackgroundMusicType } from '../utils/drawAudio';
import { triggerConfetti } from '../utils/confettiHelper';
import { DrawScene, DrawSceneHandle } from '../components/draw/DrawScene';
import { BroadcastLowerThird } from '../components/draw/BroadcastLowerThird';
import { DrawDebugPanel } from '../components/draw/DrawDebugPanel';
import {
  TournamentSelectModal,
  SelectedTournamentConfig,
} from '../components/draw/TournamentSelectModal';
import {
  TournamentData,
  Group,
  Team,
  generateRoundRobinMatches,
  buildFIFABracketFromGroups,
  generatePureKnockoutBracket,
  saveTournamentBoth,
  loadArchiveTournaments,
  loadArchiveDthenTournaments,
  loadTournamentData,
  loadDthenTournamentData,
} from '../utils/tournamentEngine';
import {
  OnlineRoomModal,
  SoloSessionConfig,
  CreateRoomConfig,
  JoinRoomConfig,
} from '../components/draw/OnlineRoomModal';
import {
  DrawRoomData,
  DrawRoomAction,
  createDrawRoom,
  joinDrawRoom,
  subscribeDrawRoom,
  dispatchRoomDrawAction,
  updateRoomGroupsState,
} from '../services/drawRoomService';
import {
  saveLiveDrawStateToFirestore,
  getLiveDrawStateFromFirestore,
  clearLiveDrawStateFromFirestore,
} from '../services/tournamentService';
import {
  DrawState,
  DrawTeam,
  DrawGroup,
  GroupSlot,
  CameraPresetName,
} from '../components/draw/DrawTypes';

// Local Storage Key for Auto-Saving Draw Draft
const DRAFT_STORAGE_KEY = 'SAOVANG_DRAW_DRAFT_V1';

export interface DrawDraftState {
  tournamentTitle: string;
  subTitle: string;
  numGroups: number;
  teamsPerGroup: number;
  isSeeded: boolean;
  teams: DrawTeam[];
  remainingTeams: DrawTeam[];
  groups: DrawGroup[];
  currentPot: number;
  selectedConfig: SelectedTournamentConfig | null;
  roomMode: 'SOLO' | 'HOST' | 'GUEST';
  mc1Name: string;
  mc2Name: string;
  savedAt: number;
}

// Preset Teams (Fallback)
const PRESET_CHAMPIONS_16: DrawTeam[] = [
  // Pot 1
  { id: 't1', name: 'Real Madrid', club: 'La Liga (Tây Ban Nha)', pot: 1 },
  { id: 't2', name: 'Manchester City', club: 'Premier League (Anh)', pot: 1 },
  { id: 't3', name: 'Bayern Munich', club: 'Bundesliga (Đức)', pot: 1 },
  { id: 't4', name: 'Paris Saint-Germain', club: 'Ligue 1 (Pháp)', pot: 1 },
  // Pot 2
  { id: 't5', name: 'Arsenal FC', club: 'Premier League (Anh)', pot: 2 },
  { id: 't6', name: 'FC Barcelona', club: 'La Liga (Tây Ban Nha)', pot: 2 },
  { id: 't7', name: 'Inter Milan', club: 'Serie A (Ý)', pot: 2 },
  { id: 't8', name: 'Borussia Dortmund', club: 'Bundesliga (Đức)', pot: 2 },
  // Pot 3
  { id: 't9', name: 'Liverpool FC', club: 'Premier League (Anh)', pot: 3 },
  { id: 't10', name: 'Juventus FC', club: 'Serie A (Ý)', pot: 3 },
  { id: 't11', name: 'Atletico Madrid', club: 'La Liga (Tây Ban Nha)', pot: 3 },
  { id: 't12', name: 'AC Milan', club: 'Serie A (Ý)', pot: 3 },
  // Pot 4
  { id: 't13', name: 'Chelsea FC', club: 'Premier League (Anh)', pot: 4 },
  { id: 't14', name: 'Aston Villa', club: 'Premier League (Anh)', pot: 4 },
  { id: 't15', name: 'Sporting CP', club: 'Primeira Liga (Bồ Đào Nha)', pot: 4 },
  { id: 't16', name: 'AS Monaco', club: 'Ligue 1 (Pháp)', pot: 4 },
];

const PRESET_SAOVANG_16: DrawTeam[] = [
  // Pot 1 (Hạt giống hàng đầu)
  { id: 'sv1', name: 'HLV Phan Long', club: 'Real Madrid (Tây Ban Nha)', pot: 1 },
  { id: 'sv2', name: 'HLV Quốc Cường', club: 'Manchester City (Anh)', pot: 1 },
  { id: 'sv3', name: 'HLV Minh Quân', club: 'Bayern Munich (Đức)', pot: 1 },
  { id: 'sv4', name: 'HLV Hải Đăng', club: 'Paris Saint-Germain (Pháp)', pot: 1 },
  // Pot 2
  { id: 'sv5', name: 'HLV Tuấn Anh', club: 'Arsenal FC (Anh)', pot: 2 },
  { id: 'sv6', name: 'HLV Hoàng Phúc', club: 'FC Barcelona (Tây Ban Nha)', pot: 2 },
  { id: 'sv7', name: 'HLV Bảo Long', club: 'Inter Milan (Ý)', pot: 2 },
  { id: 'sv8', name: 'HLV Thanh Tùng', club: 'Borussia Dortmund (Đức)', pot: 2 },
  // Pot 3
  { id: 'sv9', name: 'HLV Trọng Nghĩa', club: 'Liverpool FC (Anh)', pot: 3 },
  { id: 'sv10', name: 'HLV Hữu Đạt', club: 'Juventus FC (Ý)', pot: 3 },
  { id: 'sv11', name: 'HLV Thế Anh', club: 'Atletico Madrid (Tây Ban Nha)', pot: 3 },
  { id: 'sv12', name: 'HLV Văn Đức', club: 'AC Milan (Ý)', pot: 3 },
  // Pot 4
  { id: 'sv13', name: 'HLV Quang Minh', club: 'Chelsea FC (Anh)', pot: 4 },
  { id: 'sv14', name: 'HLV Gia Huy', club: 'Aston Villa (Anh)', pot: 4 },
  { id: 'sv15', name: 'HLV Tấn Tài', club: 'Sporting CP (Bồ Đào Nha)', pot: 4 },
  { id: 'sv16', name: 'HLV Thành Đạt', club: 'AS Monaco (Pháp)', pot: 4 },
];

export default function BocthamPage() {
  const [searchParams] = useSearchParams();
  const isDebugMode = searchParams.get('debugDraw') === '1';

  // Admin Authorization Gate (Chỉ dành cho Ban Tổ Chức & Quản Trị Viên)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_portal_authenticated_session') === 'true';
  });
  const [adminPinInput, setAdminPinInput] = useState<string>('');
  const [showAdminPin, setShowAdminPin] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');

  const handleVerifyAdminPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (adminPinInput.trim() === '020604') {
      sessionStorage.setItem('admin_portal_authenticated_session', 'true');
      setIsAdminAuthenticated(true);
      setPinError('');
      drawAudio.startAuditoriumTone();
    } else {
      setPinError('Mã PIN bảo mật Quản trị viên không chính xác. Vui lòng thử lại!');
    }
  };

  // Tournament Info & Configuration
  const [tournamentTitle, setTournamentTitle] = useState('SAO VÀNG CUP ™ - MÙA 3');
  const [subTitle, setSubTitle] = useState('OFFICIAL LIVE DRAW CEREMONY');
  const [numGroups, setNumGroups] = useState(4);
  const [teamsPerGroup, setTeamsPerGroup] = useState(4);
  const [isSeeded, setIsSeeded] = useState(true);

  // Tournament Integration Modal & Saved Data State
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<SelectedTournamentConfig | null>(null);
  const [isSavedToCloud, setIsSavedToCloud] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Online Multiplayer Room & MC Customization State
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomMode, setRoomMode] = useState<'SOLO' | 'HOST' | 'GUEST'>('SOLO');
  const [myRole, setMyRole] = useState<'solo' | 'host' | 'guest'>('solo');
  const [roomData, setRoomData] = useState<DrawRoomData | null>(null);
  const [mc1Name, setMc1Name] = useState('MC Phan Long');
  const [mc2Name, setMc2Name] = useState('MC Minh Quân');
  const [activeMcName, setActiveMcName] = useState('MC Phan Long');
  const [pendingCreateRoom, setPendingCreateRoom] = useState<CreateRoomConfig | null>(null);
  const [copiedRoomCode, setCopiedRoomCode] = useState(false);

  const lastProcessedActionIdRef = useRef<string | null>(null);

  // Derived Dual Mode state: true if in room and guest admin has joined
  const isDualMode = roomMode !== 'SOLO' && Boolean(roomData?.guestAdmin);

  // Pool & Groups
  const [teams, setTeams] = useState<DrawTeam[]>(PRESET_CHAMPIONS_16);
  const [remainingTeams, setRemainingTeams] = useState<DrawTeam[]>([]);
  const [groups, setGroups] = useState<DrawGroup[]>([]);
  const [currentPot, setCurrentPot] = useState<number>(1);

  // Refs for async timeline callbacks
  const groupsRef = useRef<DrawGroup[]>(groups);
  const selectedConfigRef = useRef<SelectedTournamentConfig | null>(selectedConfig);

  useEffect(() => {
    groupsRef.current = groups;
  }, [groups]);

  useEffect(() => {
    selectedConfigRef.current = selectedConfig;
  }, [selectedConfig]);

  // 3D Scene Handle
  const sceneHandleRef = useRef<DrawSceneHandle | null>(null);

  // State Machine
  const [drawState, setDrawState] = useState<DrawState>('IDLE');
  const [pendingResult, setPendingResult] = useState<DrawTeam | null>(null);
  const [targetSlot, setTargetSlot] = useState<{ groupIdx: number; slotIdx: number; label: string } | null>(null);

  // UI state
  const [isMuted, setIsMuted] = useState(false);
  const [bgmTrack, setBgmTrack] = useState<BackgroundMusicType>('champions');
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSideBoard, setShowSideBoard] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customTextList, setCustomTextList] = useState('');

  // Performance mode state (auto-detects mobile or low-end device by default)
  const [qualityMode, setQualityMode] = useState<'high' | 'performance'>(() => {
    if (typeof window !== 'undefined') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
      const lowMem = (navigator as unknown as { deviceMemory?: number }).deviceMemory && (navigator as unknown as { deviceMemory?: number }).deviceMemory! <= 4;
      if (isMobile || lowMem) return 'performance';
    }
    return 'high';
  });

  const totalSlots = numGroups * teamsPerGroup;
  const drawnCount = totalSlots - remainingTeams.length;
  const isRunning = drawState !== 'IDLE' && drawState !== 'COMPLETED';

  // Cloud Restored Draft State
  const [restoredDraftBanner, setRestoredDraftBanner] = useState<{
    drawn: number;
    total: number;
    timeStr: string;
  } | null>(null);
  const [pendingDraftPrompt, setPendingDraftPrompt] = useState<DrawDraftState | null>(null);

  // Gửi trực tiếp tiến trình bốc thăm lên Cloud Firestore (không lưu local nữa)
  const saveDraftToCloud = (
    updatedGroups: DrawGroup[],
    updatedRemaining: DrawTeam[],
    pot: number
  ) => {
    try {
      const draft: DrawDraftState = {
        tournamentTitle,
        subTitle,
        numGroups,
        teamsPerGroup,
        isSeeded,
        teams,
        remainingTeams: updatedRemaining,
        groups: updatedGroups,
        currentPot: pot,
        selectedConfig: selectedConfigRef.current,
        roomMode,
        mc1Name,
        mc2Name,
        savedAt: Date.now(),
      };
      // Gửi thẳng lên Cloud Firestore
      saveLiveDrawStateToFirestore(draft);
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {}
    } catch (err) {
      console.warn('Cannot save live draw to cloud:', err);
    }
  };

  // Xóa tiến trình bốc thăm trên Cloud Firestore
  const clearDraftFromCloud = () => {
    try {
      clearLiveDrawStateFromFirestore();
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {}
    } catch {}
  };

  // Initialize or Reset Groups
  const initializeGroups = (gCount = numGroups, tCount = teamsPerGroup, teamList = teams) => {
    clearDraftFromCloud();
    setRestoredDraftBanner(null);

    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const newGroups: DrawGroup[] = [];

    for (let i = 0; i < gCount; i++) {
      const gLetter = letters[i] || `G${i + 1}`;
      const slots: GroupSlot[] = [];
      for (let j = 0; j < tCount; j++) {
        slots.push({
          positionName: `${gLetter}${j + 1}`,
          team: null,
          isJustSlotted: false,
        });
      }
      newGroups.push({
        id: `g-${i}`,
        name: `BẢNG ${gLetter}`,
        slots,
        color: 'border-cyan-500/40',
      });
    }

    setGroups(newGroups);
    setRemainingTeams([...teamList]);
    setCurrentPot(1);
    setDrawState('IDLE');
    setPendingResult(null);
    setTargetSlot(null);
    setIsSavedToCloud(false);
    setShowCompletionModal(false);
    sceneHandleRef.current?.resetScene();
  };

  // Handle Solo Selected
  const handleSelectSolo = (cfg: SoloSessionConfig) => {
    setRoomMode('SOLO');
    setMyRole('solo');
    setMc1Name(cfg.mcName);
    setActiveMcName(cfg.mcName);
    setShowRoomModal(false);
    if (!selectedConfigRef.current) {
      setShowSelectModal(true);
    }
    sceneHandleRef.current?.setDualMode(false, cfg.mcName);
  };

  // Handle Create Room Selected (Host)
  const handleSelectCreateRoom = (cfg: CreateRoomConfig) => {
    setRoomMode('HOST');
    setMyRole('host');
    setMc1Name(cfg.mcName);
    setActiveMcName(cfg.mcName);
    setPendingCreateRoom(cfg);
    setShowRoomModal(false);
    if (!selectedConfigRef.current) {
      setShowSelectModal(true);
    }
  };

  // Handle Join Room Selected (Guest)
  const handleSelectJoinRoom = async (cfg: JoinRoomConfig) => {
    const res = await joinDrawRoom(cfg.roomId, {
      guestAdminName: cfg.adminName,
      guestMcName: cfg.mcName,
    });

    if (!res.success || !res.room) {
      alert(res.error || 'Không thể kết nối vào phòng bốc thăm!');
      return;
    }

    const room = res.room;
    setRoomMode('GUEST');
    setMyRole('guest');
    setMc1Name(room.hostAdmin.mcName);
    setMc2Name(cfg.mcName);
    setActiveMcName(room.hostAdmin.mcName);
    setRoomData(room);

    // Apply Host's tournament config directly!
    setSelectedConfig(room.config);
    setTournamentTitle(room.config.tournamentTitle);
    setSubTitle(room.config.subTitle);
    setNumGroups(room.config.numGroups);
    setTeamsPerGroup(room.config.teamsPerGroup);
    setTeams(room.config.teams);
    setIsSeeded(room.config.isSeeded);
    setGroups(room.groups);
    setRemainingTeams(room.remainingTeams);
    setCurrentPot(room.currentPot);

    setShowRoomModal(false);
    setShowSelectModal(false);

    // Update 3D scene to dual mode
    sceneHandleRef.current?.setDualMode(true, room.hostAdmin.mcName, cfg.mcName);
  };

  // Handle when Admin confirms tournament selection from modal
  const handleTournamentSelected = (config: SelectedTournamentConfig) => {
    setSelectedConfig(config);
    setTournamentTitle(config.tournamentTitle);
    setSubTitle(config.subTitle);
    setNumGroups(config.numGroups);
    setTeamsPerGroup(config.teamsPerGroup);
    setTeams(config.teams);
    setIsSeeded(config.isSeeded);
    initializeGroups(config.numGroups, config.teamsPerGroup, config.teams);

    // If in Host mode, create room in Firestore
    if (roomMode === 'HOST' && pendingCreateRoom) {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const initialGroupsForRoom: DrawGroup[] = [];
      for (let i = 0; i < config.numGroups; i++) {
        const gLetter = letters[i] || `G${i + 1}`;
        const slots: GroupSlot[] = [];
        for (let j = 0; j < config.teamsPerGroup; j++) {
          slots.push({
            positionName: `${gLetter}${j + 1}`,
            team: null,
            isJustSlotted: false,
          });
        }
        initialGroupsForRoom.push({
          id: `g-${i}`,
          name: `BẢNG ${gLetter}`,
          slots,
          color: 'border-cyan-500/40',
        });
      }

      createDrawRoom({
        config,
        hostAdminName: pendingCreateRoom.adminName,
        hostMcName: pendingCreateRoom.mcName,
        initialGroups: initialGroupsForRoom,
        customRoomId: pendingCreateRoom.roomId,
      }).then((created) => {
        if (created) {
          setRoomData(created);
        }
      });
    }
  };

  // Real-time listener for current online room
  useEffect(() => {
    if (roomMode === 'SOLO' || !roomData?.roomId) return;

    const unsubscribe = subscribeDrawRoom(
      roomData.roomId,
      (updatedRoom) => {
        setRoomData(updatedRoom);

        // Check if guest joined -> update to dual mode in 3D scene
        if (updatedRoom.guestAdmin) {
          setMc1Name(updatedRoom.hostAdmin.mcName);
          setMc2Name(updatedRoom.guestAdmin.mcName);
          sceneHandleRef.current?.setDualMode(
            true,
            updatedRoom.hostAdmin.mcName,
            updatedRoom.guestAdmin.mcName
          );
        }

        // Synchronize remote draw action
        if (
          updatedRoom.lastAction &&
          updatedRoom.lastAction.actionId !== lastProcessedActionIdRef.current
        ) {
          lastProcessedActionIdRef.current = updatedRoom.lastAction.actionId;
          const action = updatedRoom.lastAction;
          const mcNameForAction =
            action.activePresenterIndex === 2
              ? (updatedRoom.guestAdmin?.mcName || mc2Name)
              : updatedRoom.hostAdmin.mcName;

          runDrawAnimation(
            action.chosenTeam,
            action.destinationSlot,
            action.activePresenterIndex,
            mcNameForAction
          );
        }
      },
      (err) => {
        console.warn('Realtime room sync error:', err);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomMode, roomData?.roomId, mc2Name]);

  // Save the drawn groups and fixtures directly to Cloud Firestore
  const saveDrawResultsToEngine = (
    finalGroups: DrawGroup[],
    config: SelectedTournamentConfig | null,
    isFinalCompleted: boolean = false
  ) => {
    if (!config) return;

    // Convert DrawGroup[] to tournamentEngine Group[]
    const engineGroups: Group[] = finalGroups.map((g, gIdx) => {
      const gLetter = String.fromCharCode(65 + gIdx);
      const teamsInGroup: Team[] = g.slots
        .filter((s) => s.team !== null)
        .map((s) => ({
          id: s.team!.id,
          name: s.team!.name,
          club: s.team!.club || '',
        }));

      const legType =
        config.system === 'DTHEN'
          ? 'single'
          : config.selectedTournamentData?.legType || 'double';

      const matches = generateRoundRobinMatches(teamsInGroup, legType);

      return {
        id: `group_${gLetter.toLowerCase()}`,
        name: g.name,
        teams: teamsInGroup,
        matches,
      };
    });

    const nowIso = new Date().toISOString();
    const isPureKnockout = config.format === 'pure_knockout' || config.teamsPerGroup === 2;

    let updatedTour: TournamentData;
    if (isPureKnockout) {
      const allDrawnTeams: Team[] = [];
      groups.forEach((g) => {
        g.slots.forEach((s) => {
          if (s.team) {
            allDrawnTeams.push({
              id: s.team.id,
              name: s.team.name,
              club: s.team.club || '',
            });
          }
        });
      });

      const knockoutStage = generatePureKnockoutBracket(allDrawnTeams, false);

      const resolvedTitle = config.selectedTournamentData?.tournamentName || tournamentTitle || (config.system === 'SAO_VANG' ? 'SAO VÀNG CUP ™' : 'ĐTHÉN FCO ™');

      updatedTour = {
        id: config.selectedTournamentData?.id || `tour_ko_${config.system.toLowerCase()}_${Date.now()}`,
        tournamentName: resolvedTitle,
        season: config.season,
        numGroups: 0,
        teamsPerGroup: 2,
        legType: 'single',
        groups: [],
        format: 'pure_knockout',
        pairingMode: 'draw',
        totalTeams: allDrawnTeams.length,
        knockoutStage,
        createdAt: nowIso,
        isVisible: true,
      };
    } else {
      const resolvedTitle = config.selectedTournamentData?.tournamentName || tournamentTitle || (config.system === 'SAO_VANG' ? 'SAO VÀNG CUP ™' : 'ĐTHÉN FCO ™');
      updatedTour = config.selectedTournamentData
        ? {
            ...config.selectedTournamentData,
            groups: engineGroups,
            knockoutStage: buildFIFABracketFromGroups(engineGroups),
          }
        : {
            id: `tour_${config.system.toLowerCase()}_${Date.now()}`,
            tournamentName: resolvedTitle,
            season: config.season,
            numGroups: config.numGroups,
            teamsPerGroup: config.teamsPerGroup,
            legType: config.system === 'DTHEN' ? 'single' : 'double',
            groups: engineGroups,
            knockoutStage: buildFIFABracketFromGroups(engineGroups),
            createdAt: nowIso,
            isVisible: true,
          };
    }

    // Lưu đồng bộ cả Active, Archive và Cloud Firestore
    saveTournamentBoth(updatedTour, config.system);

    setIsSavedToCloud(true);
    if (isFinalCompleted) {
      clearDraftFromCloud();
    }
  };

  // Áp dụng bản nháp bốc thăm dở dang khi người dùng chủ động chọn
  const applyDraft = (draft: DrawDraftState) => {
    const cleanGroups = draft.groups.map((g) => ({
      ...g,
      slots: g.slots.map((s) => ({ ...s, isJustSlotted: false })),
    }));

    setTournamentTitle(draft.tournamentTitle);
    setSubTitle(draft.subTitle);
    setNumGroups(draft.numGroups);
    setTeamsPerGroup(draft.teamsPerGroup);
    setIsSeeded(draft.isSeeded);
    setTeams(draft.teams);
    setRemainingTeams(draft.remainingTeams);
    setGroups(cleanGroups);
    setCurrentPot(draft.currentPot || 1);
    setSelectedConfig(draft.selectedConfig);
    setMc1Name(draft.mc1Name || 'MC Phan Long');
    setMc2Name(draft.mc2Name || 'MC Minh Quân');
    setActiveMcName(draft.mc1Name || 'MC Phan Long');
    setRoomMode(draft.roomMode || 'SOLO');
    setShowRoomModal(false);
    setShowSelectModal(false);

    const drawn = draft.teams.length - draft.remainingTeams.length;
    setRestoredDraftBanner({
      drawn,
      total: draft.teams.length,
      timeStr: new Date(draft.savedAt).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  };

  // Áp dụng trực tiếp giải đấu vào sân khấu 3D mà không hỏi lại
  const applyTournamentToDraw = (
    tTitle: string,
    sTitle: string,
    season: string,
    sys: 'SAO_VANG' | 'DTHEN',
    drawTeams: DrawTeam[],
    format: 'group_knockout' | 'pure_knockout',
    nGroups: number,
    tPerGroup: number,
    tourData: TournamentData | null
  ) => {
    const isPureKnockout = format === 'pure_knockout';
    const gCount = isPureKnockout ? Math.max(1, Math.floor(drawTeams.length / 2)) : (nGroups || 4);
    const tCount = isPureKnockout ? 2 : (tPerGroup || 4);

    setTournamentTitle(tTitle);
    setSubTitle(sTitle);
    setNumGroups(gCount);
    setTeamsPerGroup(tCount);
    setIsSeeded(false);
    setTeams(drawTeams);
    setRemainingTeams([...drawTeams]);
    setCurrentPot(1);
    setDrawState('IDLE');
    setPendingResult(null);
    setTargetSlot(null);
    setIsSavedToCloud(false);
    setShowCompletionModal(false);

    const newGroups: DrawGroup[] = [];
    for (let i = 0; i < gCount; i++) {
      newGroups.push({
        id: `g-${i}`,
        name: isPureKnockout ? `TRẬN #${i + 1}` : `BẢNG ${String.fromCharCode(65 + i)}`,
        slots: [
          { positionName: isPureKnockout ? `T${i + 1}-1` : `${String.fromCharCode(65 + i)}1`, team: null, isJustSlotted: false },
          { positionName: isPureKnockout ? `T${i + 1}-2` : `${String.fromCharCode(65 + i)}2`, team: null, isJustSlotted: false },
        ],
        color: isPureKnockout ? 'border-amber-500/40' : 'border-cyan-500/40',
      });
    }
    setGroups(newGroups);

    const newConfig: SelectedTournamentConfig = {
      system: sys,
      tournamentTitle: tTitle,
      subTitle: sTitle,
      season,
      numGroups: gCount,
      teamsPerGroup: tCount,
      teams: drawTeams,
      isSeeded: false,
      selectedTournamentData: tourData,
      format,
    };

    setSelectedConfig(newConfig);
    selectedConfigRef.current = newConfig;

    // VÀO THẲNG SÂN KHẤU - TUYỆT ĐỐI KHÔNG BẬT MODAL HỎI LẠI
    setShowRoomModal(false);
    setShowSelectModal(false);
    setPendingDraftPrompt(null);
    setRestoredDraftBanner(null);
    sceneHandleRef.current?.resetScene();
  };

  // Khôi phục tiến trình bốc thăm trực tiếp từ Cloud Firestore khi mở trang / F5
  useEffect(() => {
    let isMounted = true;

    const tourIdParam = searchParams.get('tourId');
    const systemParam = (searchParams.get('system') as 'SAO_VANG' | 'DTHEN') || 'SAO_VANG';

    // 1. Kiểm tra cấu hình bốc thăm trực tiếp (direct setup từ Admin hoặc Tạo Giải)
    const directSetupRaw = localStorage.getItem('SAOVANG_DRAW_DIRECT_SETUP');
    let directHandled = false;

    if (directSetupRaw) {
      try {
        const directSetup = JSON.parse(directSetupRaw);
        if (directSetup && Array.isArray(directSetup.teams) && directSetup.teams.length > 0) {
          if (!tourIdParam || !directSetup.tourId || directSetup.tourId === tourIdParam) {
            clearDraftFromCloud();
            applyTournamentToDraw(
              directSetup.tournamentTitle || 'SAO VÀNG CUP ™',
              directSetup.subTitle || (directSetup.format === 'pure_knockout' ? 'LỄ BỐC THĂM CÚP LOẠI TRỰC TIẾP (KNOCKOUT)' : 'OFFICIAL LIVE DRAW CEREMONY'),
              directSetup.season || 'MÙA 1',
              directSetup.system || systemParam,
              directSetup.teams,
              directSetup.format === 'pure_knockout' ? 'pure_knockout' : 'group_knockout',
              directSetup.numGroups,
              directSetup.teamsPerGroup,
              directSetup.selectedTournamentData || null
            );
            directHandled = true;
          }
        }
      } catch (err) {
        console.error('Error parsing SAOVANG_DRAW_DIRECT_SETUP:', err);
      }
    }

    // 2. Nếu có tourIdParam trong URL mà chưa xử lý từ directSetup
    if (!directHandled && tourIdParam) {
      const archives = systemParam === 'DTHEN' ? loadArchiveDthenTournaments() : loadArchiveTournaments();
      let foundTour: TournamentData | null = archives.find((t) => t.id === tourIdParam) || null;
      if (!foundTour) {
        const active = systemParam === 'DTHEN' ? loadDthenTournamentData() : loadTournamentData();
        if (active && active.id === tourIdParam) foundTour = active;
      }

      if (foundTour) {
        let teamsForDraw: DrawTeam[] = [];
        const isPureKnockout = foundTour.format === 'pure_knockout';
        if (isPureKnockout) {
          if (foundTour.knockoutStage?.rounds?.[0]?.matches?.length) {
            foundTour.knockoutStage.rounds[0].matches.forEach((m) => {
              if (m.homeTeamName && !m.homeTeamName.includes('Thắng')) {
                teamsForDraw.push({
                  id: `team_${teamsForDraw.length + 1}`,
                  name: m.homeTeamName,
                  club: m.homeTeamClub || '',
                  pot: 1,
                });
              }
              if (m.awayTeamName && !m.awayTeamName.includes('Thắng')) {
                teamsForDraw.push({
                  id: `team_${teamsForDraw.length + 1}`,
                  name: m.awayTeamName,
                  club: m.awayTeamClub || '',
                  pot: 1,
                });
              }
            });
          }
          if (teamsForDraw.length === 0) {
            const count = foundTour.totalTeams || 16;
            for (let i = 1; i <= count; i++) {
              teamsForDraw.push({
                id: `team_${i}`,
                name: `HLV ${i}`,
                club: '',
                pot: 1,
              });
            }
          }
        } else if (Array.isArray(foundTour.groups) && foundTour.groups.length > 0) {
          foundTour.groups.forEach((g, gIdx) => {
            g.teams.forEach((t) => {
              teamsForDraw.push({
                id: t.id,
                name: t.name,
                club: t.club || '',
                pot: gIdx + 1,
              });
            });
          });
        }

        clearDraftFromCloud();
        applyTournamentToDraw(
          foundTour.tournamentName,
          isPureKnockout ? 'LỄ BỐC THĂM CÚP LOẠI TRỰC TIẾP (KNOCKOUT)' : 'OFFICIAL LIVE DRAW CEREMONY',
          foundTour.season,
          systemParam,
          teamsForDraw,
          isPureKnockout ? 'pure_knockout' : 'group_knockout',
          isPureKnockout ? Math.max(1, Math.floor(teamsForDraw.length / 2)) : (foundTour.numGroups || 4),
          isPureKnockout ? 2 : (foundTour.teamsPerGroup || 4),
          foundTour
        );
        directHandled = true;
      }
    }

    if (directHandled) {
      if (sessionStorage.getItem('admin_portal_authenticated_session') === 'true') {
        drawAudio.startAuditoriumTone();
      }
      return;
    }

    // 3. Nếu không có giải được chọn trước: Kiểm tra xem có bản nháp dở dang cũ không
    const restoreFromCloud = async () => {
      let foundDraft: DrawDraftState | null = null;
      try {
        const draft = await getLiveDrawStateFromFirestore<DrawDraftState>();
        if (!isMounted) return;

        if (
          draft &&
          Array.isArray(draft.groups) &&
          draft.groups.length > 0 &&
          Array.isArray(draft.teams) &&
          Array.isArray(draft.remainingTeams) &&
          draft.remainingTeams.length < draft.teams.length &&
          draft.remainingTeams.length > 0
        ) {
          foundDraft = draft;
        }
      } catch (e) {
        console.warn('Failed to restore live draw from Firestore cloud:', e);
      }

      if (!foundDraft) {
        try {
          const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
          if (raw) {
            const draft: DrawDraftState = JSON.parse(raw);
            if (
              draft &&
              Array.isArray(draft.groups) &&
              draft.groups.length > 0 &&
              Array.isArray(draft.teams) &&
              Array.isArray(draft.remainingTeams) &&
              draft.remainingTeams.length < draft.teams.length &&
              draft.remainingTeams.length > 0
            ) {
              foundDraft = draft;
            }
          }
        } catch {}
      }

      if (foundDraft && isMounted) {
        // Hỏi ý kiến Admin thay vì tự động ghi đè bất ngờ
        setPendingDraftPrompt(foundDraft);
      } else if (isMounted) {
        setShowRoomModal(false);
      }
    };

    restoreFromCloud();
    if (sessionStorage.getItem('admin_portal_authenticated_session') === 'true') {
      drawAudio.startAuditoriumTone();
    }

    return () => {
      isMounted = false;
      drawAudio.stopBackgroundMusic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = () => {
    drawAudio.initCtx();
    const next = !isMuted;
    setIsMuted(next);
    drawAudio.setMuted(next);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Find next valid slot
  const findNextSlot = (team: DrawTeam, curGroups: DrawGroup[]) => {
    if (isSeeded) {
      const slotRow = team.pot - 1;
      for (let gIdx = 0; gIdx < curGroups.length; gIdx++) {
        if (curGroups[gIdx].slots[slotRow] && curGroups[gIdx].slots[slotRow].team === null) {
          return {
            groupIdx: gIdx,
            slotIdx: slotRow,
            label: `${curGroups[gIdx].name} (${curGroups[gIdx].slots[slotRow].positionName})`,
          };
        }
      }
    }
    // Fallback: row by row
    for (let sIdx = 0; sIdx < teamsPerGroup; sIdx++) {
      for (let gIdx = 0; gIdx < curGroups.length; gIdx++) {
        if (curGroups[gIdx].slots[sIdx]?.team === null) {
          return {
            groupIdx: gIdx,
            slotIdx: sIdx,
            label: `${curGroups[gIdx].name} (${curGroups[gIdx].slots[sIdx].positionName})`,
          };
        }
      }
    }
    return null;
  };

  // Run Draw Animation locally on 3D Stage
  const runDrawAnimation = (
    chosenTeam: DrawTeam,
    destinationSlot: { groupIdx: number; slotIdx: number; label: string } | null,
    presenterIdx: 1 | 2 = 1,
    presenterNameDisplay: string = mc1Name
  ) => {
    if (!sceneHandleRef.current) return;

    setPendingResult(chosenTeam);
    setTargetSlot(destinationSlot);
    setActiveMcName(presenterNameDisplay);

    drawAudio.playCameraWhoosh();

    sceneHandleRef.current.executeSequence(
      chosenTeam,
      tournamentTitle,
      destinationSlot?.label || '',
      (newState) => {
        setDrawState(newState);

        if (newState === 'MIXING') {
          drawAudio.playBallCollisions();
        } else if (newState === 'OPENING_BALL') {
          drawAudio.playCameraWhoosh();
          drawAudio.playBallOpening();
        } else if (newState === 'TAKING_CARD' || newState === 'OPENING_CARD') {
          drawAudio.playSuspenseRiser();
        } else if (newState === 'REVEALING') {
          drawAudio.playBroadcastReveal();
          setTimeout(() => drawAudio.playPoliteApplause(), 500);

          // Update board immediately when card reveals the team name!
          let updatedGroupsForDraft: DrawGroup[] = groupsRef.current;

          if (destinationSlot) {
            drawAudio.playSlotTeam();
            setGroups((prevGroups) => {
              const updated = prevGroups.map((group, gIdx) => {
                if (gIdx !== destinationSlot.groupIdx) return group;
                return {
                  ...group,
                  slots: group.slots.map((slot, sIdx) => {
                    if (sIdx !== destinationSlot.slotIdx) return slot;
                    return { ...slot, team: chosenTeam, isJustSlotted: true };
                  }),
                };
              });
              updatedGroupsForDraft = updated;
              if (roomData?.roomId && myRole === 'host') {
                updateRoomGroupsState(roomData.roomId, updated, 'REVEALING');
              }
              return updated;
            });

            setTimeout(() => {
              setGroups((prevGroups) =>
                prevGroups.map((group, gIdx) => {
                  if (gIdx !== destinationSlot.groupIdx) return group;
                  return {
                    ...group,
                    slots: group.slots.map((slot, sIdx) => {
                      if (sIdx !== destinationSlot.slotIdx) return slot;
                      return { ...slot, isJustSlotted: false };
                    }),
                  };
                })
              );
            }, 2000);
          }

          setRemainingTeams((prev) => {
            const updated = prev.filter((t) => t.id !== chosenTeam.id);
            let nextPot = currentPot;
            if (isSeeded) {
              const inPot = updated.filter((t) => t.pot === currentPot);
              if (inPot.length === 0 && updated.length > 0) {
                nextPot = currentPot + 1;
                setCurrentPot(nextPot);
              }
            }

            // GỬI THẲNG DỮ LIỆU LÊN CLOUD FIRESTORE NGAY KHI BỐC TRÚNG TÊN (KHÔNG LƯU LOCAL NỮA)
            saveDraftToCloud(updatedGroupsForDraft, updated, nextPot);

            // Đồng bộ kết quả bảng đấu lên Cloud Firestore ngay lập tức
            if (selectedConfigRef.current) {
              saveDrawResultsToEngine(updatedGroupsForDraft, selectedConfigRef.current, false);
            }

            return updated;
          });
        } else if (newState === 'RETURNING') {
          // Camera zooms back out to wide shot
        }
      },
      () => {
        setRemainingTeams((prev) => {
          if (prev.length === 0) {
            clearDraftFromCloud();
            setRestoredDraftBanner(null);
            setDrawState('COMPLETED');
            drawAudio.playCelebration();
            triggerConfetti();

            if (selectedConfigRef.current) {
              saveDrawResultsToEngine(groupsRef.current, selectedConfigRef.current, true);
            }
            setShowCompletionModal(true);
          } else {
            setDrawState('IDLE');
            setPendingResult(null);
            setTargetSlot(null);
          }
          return prev;
        });
      },
      presenterIdx
    );
  };

  // ================= TRIGGER DRAW SEQUENCE =================
  const handleStartDraw = () => {
    drawAudio.initCtx();
    if (isRunning || remainingTeams.length === 0 || !sceneHandleRef.current) return;

    // In room mode, verify if it is my turn
    if (roomMode !== 'SOLO' && roomData) {
      if (!roomData.guestAdmin) {
        alert('Vui lòng đợi Admin 2 kết nối vào phòng trước khi bắt đầu bốc thăm!');
        return;
      }
      if (myRole !== roomData.currentTurnRole) {
        alert(`Đang là lượt bốc thăm của ${roomData.currentTurnRole === 'host' ? roomData.hostAdmin.name : roomData.guestAdmin.name}!`);
        return;
      }
    }

    let eligiblePool = remainingTeams;
    if (isSeeded) {
      const potTeams = remainingTeams.filter((t) => t.pot === currentPot);
      if (potTeams.length > 0) {
        eligiblePool = potTeams;
      } else {
        const nextPot = currentPot + 1;
        setCurrentPot(nextPot);
        eligiblePool = remainingTeams.filter((t) => t.pot === nextPot);
      }
    }
    if (eligiblePool.length === 0) eligiblePool = remainingTeams;

    const randomIndex = Math.floor(Math.random() * eligiblePool.length);
    const chosenTeam = eligiblePool[randomIndex];
    const destinationSlot = findNextSlot(chosenTeam, groups);

    const presenterIdx: 1 | 2 = myRole === 'guest' ? 2 : 1;
    const presenterName = myRole === 'guest' ? mc2Name : mc1Name;

    // In Online Room Mode, broadcast action to Firestore
    if (roomMode !== 'SOLO' && roomData?.roomId) {
      const action: DrawRoomAction = {
        actionId: `action_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        executorRole: myRole as 'host' | 'guest',
        activePresenterIndex: presenterIdx,
        chosenTeam,
        destinationSlot: destinationSlot || { groupIdx: 0, slotIdx: 0, label: '' },
        timestamp: Date.now(),
      };
      lastProcessedActionIdRef.current = action.actionId;
      const nextTurn = myRole === 'host' ? 'guest' : 'host';
      const nextRemaining = remainingTeams.filter((t) => t.id !== chosenTeam.id);
      dispatchRoomDrawAction(roomData.roomId, action, nextTurn, nextRemaining, currentPot);
    }

    runDrawAnimation(chosenTeam, destinationSlot, presenterIdx, presenterName);
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-center items-center px-4 py-12 font-sans relative overflow-hidden select-none">
        {/* Background ambient glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-3xl mx-auto shadow-lg shadow-amber-500/10">
              <i className="fa-solid fa-shield-halved"></i>
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full text-[10px] font-oswald font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                <i className="fa-solid fa-lock text-[9px]"></i>
                <span>TRUY CẬP BỊ GIỚI HẠN • DÀNH RIÊNG CHO ADMIN</span>
              </span>
              <h1 className="font-oswald text-2xl sm:text-3xl font-black uppercase tracking-wide text-white">
                SÂN KHẤU BỐC THĂM 3D
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                Khu vực này được bảo mật và chỉ dành riêng cho <strong>Ban Tổ Chức (Admin)</strong> để trực tiếp vận hành và mở bóng các cặp đấu. Thành viên thông thường không được phép truy cập.
              </p>
            </div>
          </div>

          {/* Admin Unlock Form */}
          <form onSubmit={handleVerifyAdminPin} className="space-y-4 pt-2 border-t border-slate-800/80">
            <div>
              <label className="block text-xs font-oswald font-bold uppercase text-slate-300 mb-1.5 tracking-wider">
                XÁC THỰC MÃ PIN QUẢN TRỊ VIÊN (BTC):
              </label>
              <div className="relative">
                <input
                  type={showAdminPin ? 'text' : 'password'}
                  maxLength={6}
                  value={adminPinInput}
                  onChange={(e) => {
                    setAdminPinInput(e.target.value);
                    if (pinError) setPinError('');
                  }}
                  placeholder="Nhập mã PIN 6 số..."
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-center text-xl tracking-[0.4em] font-mono text-white placeholder:text-slate-600 placeholder:text-xs placeholder:tracking-normal focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPin(!showAdminPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm cursor-pointer"
                  tabIndex={-1}
                >
                  <i className={`fa-solid ${showAdminPin ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {pinError && (
                <p className="text-xs font-bold text-red-400 mt-1.5 text-center flex items-center justify-center space-x-1">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>{pinError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-oswald text-sm font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <i className="fa-solid fa-key"></i>
              <span>XÁC NHẬN QUYỀN ADMIN & MỞ KHÓA</span>
            </button>
          </form>

          {/* Quick Exit Links for Regular Users */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2 text-center">
            <p className="text-[11px] text-slate-500 uppercase font-oswald font-bold tracking-wider">
              NẾU BẠN LÀ THÀNH VIÊN / HLV:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                to="/"
                className="px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-oswald font-bold uppercase transition-all"
              >
                ← Về Trang Chủ
              </Link>
              <Link
                to="/thethuc"
                className="px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-oswald font-bold uppercase transition-all"
              >
                Thể Thức Thi Đấu
              </Link>
              <Link
                to="/ltd"
                className="px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-oswald font-bold uppercase transition-all"
              >
                Lịch Thi Đấu & Kết Quả
              </Link>
              <Link
                to="/admin-portal"
                className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-oswald font-bold uppercase transition-all border border-amber-500/30"
              >
                Cổng Admin Portal →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#020617] text-white flex flex-col font-sans select-none overflow-hidden relative">
      {/* ================= 1. THREE.JS 3D CINEMATIC CANVAS ================= */}
      <div className="absolute inset-0 z-0">
        <DrawScene
          onHandleReady={(handle) => {
            sceneHandleRef.current = handle;
            if (groupsRef.current.length > 0) {
              handle.updateLedBoard(groupsRef.current, tournamentTitle);
            }
          }}
          tournamentTitle={tournamentTitle}
          groups={groups}
          isDualMode={isDualMode}
          mc1Name={mc1Name}
          mc2Name={mc2Name}
          qualityMode={qualityMode}
        />
      </div>

      {/* ================= 2. BROADCAST TOP HUD ================= */}
      <header className="absolute top-0 inset-x-0 z-30 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 pointer-events-auto bg-gradient-to-b from-[#020617]/95 via-[#020617]/70 to-transparent">
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-600/90 text-white font-oswald text-[11px] font-black tracking-widest uppercase shadow-md shadow-red-600/30">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            LIVE
          </div>
          <div>
            <h1 className="font-oswald text-xs sm:text-sm font-black uppercase tracking-wider text-slate-100">
              {tournamentTitle}
            </h1>
            <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-2">
              <span>{subTitle} • {drawnCount}/{totalSlots} TEAMS DRAWN</span>
              {drawnCount > 0 && remainingTeams.length > 0 && (
                <span className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[9px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  ☁️ CLOUD SYNC ({drawnCount}/{totalSlots})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center Room Status / Online Info Pill */}
        {roomMode !== 'SOLO' && roomData ? (
          <div className="hidden md:flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-amber-400 font-bold">
              <span className="text-[10px] text-slate-400">PHÒNG:</span>
              <span className="bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/40 text-amber-300">
                {roomData.roomId}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(roomData.roomId);
                  setCopiedRoomCode(true);
                  setTimeout(() => setCopiedRoomCode(false), 2000);
                }}
                className="hover:text-white text-[11px] p-0.5 text-slate-400"
                title="Sao chép mã phòng"
              >
                <i className={`fa-solid ${copiedRoomCode ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
              </button>
            </div>

            <div className="h-3.5 w-px bg-slate-800"></div>

            <span className="text-[11px] flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <strong>MC 1:</strong> {mc1Name}
            </span>

            <span className="text-[11px] flex items-center gap-1 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${roomData.guestAdmin ? 'bg-cyan-400' : 'bg-slate-600 animate-pulse'}`}></span>
              <strong>MC 2:</strong> {roomData.guestAdmin ? mc2Name : '(Chờ kết nối...)'}
            </span>

            <div className="h-3.5 w-px bg-slate-800"></div>

            <span className="text-[11px] font-mono text-cyan-300 font-bold">
              LƯỢT: {roomData.currentTurnRole === 'host' ? `${mc1Name} (Host)` : `${mc2Name} (Co-Host)`}
            </span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800 text-xs text-amber-300/90 font-mono">
            <i className="fa-solid fa-microphone text-amber-400 text-xs"></i>
            <span>MC 3D: <strong>{mc1Name}</strong></span>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          {/* Quick Switch / Open Tournament Select Modal */}
          <button
            type="button"
            onClick={() => setShowSelectModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/50 hover:border-amber-400 text-amber-300 hover:text-white text-xs font-oswald font-black uppercase tracking-wider transition-all shadow-md shadow-amber-500/10"
            title="Đổi hệ thống giải hoặc mùa giải"
          >
            <i className="fa-solid fa-trophy text-amber-400"></i>
            <span className="hidden sm:inline">
              {selectedConfig
                ? `${selectedConfig.system === 'SAO_VANG' ? 'SAO VÀNG' : 'ĐTHÉN'} • ${selectedConfig.season}`
                : 'CHỌN GIẢI / MÙA'}
            </span>
            <span className="sm:hidden">GIẢI</span>
            <i className="fa-solid fa-chevron-down text-[10px] text-amber-400/80"></i>
          </button>

          {isSeeded && drawState !== 'COMPLETED' && (
            <div className="hidden md:flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold">POT HIỆN TẠI:</span>
              <span className="font-oswald font-black text-amber-400 text-xs">POT {currentPot}</span>
            </div>
          )}

          {/* Quick 60FPS / Quality Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextMode = qualityMode === 'high' ? 'performance' : 'high';
              setQualityMode(nextMode);
              sceneHandleRef.current?.setQualityMode(nextMode);
            }}
            className={`px-2.5 py-1 rounded-lg border text-xs font-oswald font-bold uppercase transition-all flex items-center gap-1.5 ${
              qualityMode === 'performance'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-slate-900/80 border-slate-700 text-cyan-300 hover:bg-slate-800'
            }`}
            title={qualityMode === 'performance' ? 'Đang bật 60 FPS Mượt (Bấm để chuyển Đồ họa Cao)' : 'Đang bật Đồ họa Cao (Bấm để chuyển 60 FPS Mượt)'}
          >
            <i className={`fa-solid ${qualityMode === 'performance' ? 'fa-bolt text-emerald-400' : 'fa-wand-magic-sparkles text-cyan-400'}`}></i>
            <span className="hidden sm:inline">
              {qualityMode === 'performance' ? '60 FPS MƯỢT' : 'ĐỒ HỌA CAO'}
            </span>
            <span className="sm:hidden">
              {qualityMode === 'performance' ? '60FPS' : 'HQ'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowSideBoard((prev) => !prev)}
            className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-oswald font-bold uppercase transition-all"
          >
            <i className="fa-solid fa-table-columns mr-1"></i>
            {showSideBoard ? 'Ẩn Bảng' : 'Hiện Bảng'}
          </button>

          {/* Background Music Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAudioMenu((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-oswald font-bold uppercase transition-all flex items-center gap-1.5 ${
                bgmTrack !== 'none' && !isMuted
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Chọn nhạc nền buổi lễ bốc thăm"
            >
              <i className={`fa-solid ${bgmTrack !== 'none' && !isMuted ? 'fa-music animate-pulse text-amber-400' : 'fa-volume-xmark text-slate-500'}`}></i>
              <span className="hidden sm:inline">
                {bgmTrack === 'champions'
                  ? 'NHẠC: CHAMPIONS LEAGUE'
                  : bgmTrack === 'hype'
                  ? 'NHẠC: SÂN VẬN ĐỘNG'
                  : bgmTrack === 'gala'
                  ? 'NHẠC: GALA ĐIỆN ẢNH'
                  : 'TẮT NHẠC NỀN'}
              </span>
              <span className="sm:hidden">NHẠC</span>
              <i className="fa-solid fa-chevron-down text-[10px] ml-0.5"></i>
            </button>

            {showAudioMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowAudioMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-60 bg-slate-950/95 border border-slate-800 rounded-xl p-2 shadow-2xl backdrop-blur-xl z-50 text-xs space-y-1 animate-in fade-in zoom-in-95">
                  <div className="text-[10px] uppercase font-mono text-slate-400 px-2 py-1 font-bold border-b border-slate-800">
                    CHỌN NHẠC NỀN BUỔI LỄ BỐC THĂM
                  </div>
                  {[
                    { key: 'champions', label: '🏆 UEFA Champions League', desc: 'Hành khúc Cúp C1 kinh điển, hào hùng' },
                    { key: 'hype', label: '🔥 Sân Vận Động Sôi Động', desc: 'Nhạc beat EDM bốc lửa, náo nhiệt' },
                    { key: 'gala', label: '🎻 Gala Điện Ảnh Quý Tộc', desc: 'Giao hưởng điện ảnh sâu lắng, sang trọng' },
                    { key: 'none', label: '🔇 Tắt Nhạc Nền', desc: 'Chỉ nghe hiệu ứng bốc thăm' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        const t = item.key as BackgroundMusicType;
                        setBgmTrack(t);
                        drawAudio.setTrack(t);
                        setShowAudioMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-all flex flex-col ${
                        bgmTrack === item.key
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-semibold">{item.label}</span>
                      <span className="text-[10px] text-slate-400">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className={`p-1.5 px-2.5 rounded-lg border text-xs font-semibold transition-all ${
              isMuted
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-slate-900/80 border-slate-700 text-emerald-400 hover:bg-slate-800'
            }`}
            title="Bật/Tắt âm thanh"
          >
            <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 px-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white text-xs transition-all"
            title="Toàn màn hình"
          >
            <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
          </button>

          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="p-1.5 px-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-amber-400 hover:text-amber-300 text-xs transition-all"
            title="Cấu hình giải đấu"
          >
            <i className="fa-solid fa-sliders"></i>
          </button>

          <Link
            to="/admin"
            className="p-1.5 px-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white text-xs transition-all flex items-center space-x-1.5"
            title="Quay về Admin Portal"
          >
            <i className="fa-solid fa-arrow-left text-[10px]"></i>
            <span className="hidden sm:inline font-oswald text-[11px] font-bold uppercase">Admin Portal</span>
          </Link>
        </div>
      </header>

      {/* ================= 2b. PENDING DRAFT CONFIRMATION MODAL ================= */}
      {pendingDraftPrompt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0 border border-amber-500/30">
                <i className="fa-solid fa-clock-rotate-left"></i>
              </div>
              <div>
                <h3 className="font-oswald text-lg font-black uppercase text-amber-300">
                  PHÁT HIỆN TIẾN TRÌNH BỐC THĂM DỞ DANG
                </h3>
                <p className="text-xs text-slate-400">
                  Hệ thống tìm thấy một buổi bốc thăm chưa hoàn thành từ trước.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Giải đấu:</span>
                <span className="font-bold text-white font-oswald tracking-wide">{pendingDraftPrompt.tournamentTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tiến độ đã bốc:</span>
                <span className="font-bold text-amber-400 font-mono">
                  {pendingDraftPrompt.teams.length - pendingDraftPrompt.remainingTeams.length}/{pendingDraftPrompt.teams.length} đội
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Thời gian lưu:</span>
                <span className="text-slate-300 font-mono">
                  {new Date(pendingDraftPrompt.savedAt).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  applyDraft(pendingDraftPrompt);
                  setPendingDraftPrompt(null);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-oswald text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-play"></i>
                <span>TIẾP TỤC BỐC DỞ</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  clearDraftFromCloud();
                  setPendingDraftPrompt(null);
                  initializeGroups(numGroups, teamsPerGroup, teams);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-oswald text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-trash-can text-red-400"></i>
                <span>XÓA NHÁP & BỐC MỚI</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2c. RESTORED DRAFT NOTIFICATION TOAST ================= */}
      {restoredDraftBanner && (
        <div className="absolute top-14 inset-x-4 sm:inset-x-auto sm:left-6 z-40 bg-slate-900/95 border border-amber-500/50 rounded-2xl p-3 sm:px-4 shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold shrink-0">
            <i className="fa-solid fa-clock-rotate-left"></i>
          </div>
          <div className="text-xs">
            <div className="font-oswald font-black text-amber-300 uppercase tracking-wider">
              ĐÃ KHÔI PHỤC TIẾN TRÌNH BỐC THĂM ({restoredDraftBanner.drawn}/{restoredDraftBanner.total} ĐỘI)
            </div>
            <div className="text-slate-400 text-[11px]">
              Tự động lưu lúc {restoredDraftBanner.timeStr} • Bạn có thể tiếp tục bốc ngay!
            </div>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              onClick={() => setRestoredDraftBanner(null)}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-oswald font-bold uppercase transition-all"
            >
              Tiếp Tục
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa bản nháp này và bắt đầu bốc lại từ đầu?')) {
                  clearDraftFromCloud();
                  setRestoredDraftBanner(null);
                  initializeGroups(numGroups, teamsPerGroup, teams);
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-oswald font-bold uppercase transition-all"
              title="Xóa bản nháp và bốc lại từ đầu"
            >
              Bốc Lại
            </button>
          </div>
        </div>
      )}

      {/* ================= 3. BROADCAST LOWER-THIRD GRAPHIC ================= */}
      <BroadcastLowerThird
        team={pendingResult}
        targetLabel={targetSlot?.label || null}
        isVisible={drawState === 'SHOWING_CARD' || drawState === 'REVEALING'}
        presenterName={activeMcName}
      />

      {/* ================= 4. DOCKED GROUP STANDINGS BOARD ================= */}
      {showSideBoard && (
        <aside className="absolute right-3 top-16 bottom-20 w-80 sm:w-88 z-20 pointer-events-auto bg-slate-950/85 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-3 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-right-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-oswald text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <i className="fa-solid fa-list-ol text-cyan-400"></i>
              BẢNG XẾP HẠNG BỐC THĂM
            </span>
            <span className="text-[11px] font-mono text-amber-400 font-semibold">
              {drawnCount}/{totalSlots}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {groups.map((g, gIdx) => {
              const filled = g.slots.filter((s) => s.team !== null).length;
              return (
                <div
                  key={g.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5 space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-1">
                    <span className="font-oswald text-xs font-black uppercase text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-bold">
                        {String.fromCharCode(65 + gIdx)}
                      </span>
                      {g.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {filled}/{g.slots.length}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {g.slots.map((s) => (
                      <div
                        key={s.positionName}
                        className={`px-2 py-1 rounded-lg text-xs flex items-center justify-between transition-all ${
                          s.isJustSlotted
                            ? 'bg-amber-400/25 border border-amber-400 text-white font-bold animate-pulse'
                            : s.team
                            ? 'bg-slate-800/60 text-slate-200'
                            : 'bg-slate-950/40 text-slate-600 border border-dashed border-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className="text-[10px] font-mono font-bold text-slate-400 w-4">
                            {s.positionName}
                          </span>
                          <span className="truncate text-xs font-medium">
                            {s.team ? s.team.name : '—'}
                          </span>
                        </div>
                        {s.team && (
                          <span className="text-[9px] font-oswald uppercase text-amber-400 font-bold px-1 rounded bg-slate-900">
                            P{s.team.pot}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* ================= 5. BOTTOM DIRECTOR CONTROL BAR ================= */}
      <footer className="absolute bottom-0 inset-x-0 z-30 bg-[#020617]/90 backdrop-blur-md border-t border-slate-800/70 px-3 sm:px-6 py-1.5 flex items-center justify-between gap-3 shadow-xl">
        {/* Status */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0"></div>
          <div className="truncate">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block leading-none">
              TRẠNG THÁI SÂN KHẤU
            </span>
            <span className="font-oswald text-xs sm:text-sm font-black uppercase text-cyan-300 truncate">
              {isRunning
                ? (drawState === 'REVEALING' || drawState === 'SHOWING_CARD' ? 'CÔNG BỐ KẾT QUẢ...' : 'ĐANG TIẾN HÀNH BỐC THĂM...')
                : (remainingTeams.length === 0 ? 'BUỔI LỄ BỐC THĂM HOÀN TẤT' : 'SẴN SÀNG CHO LƯỢT TIẾP THEO')}
            </span>
          </div>
        </div>

        {/* Right Actions: Draw Button + Reset Icon Button on same line */}
        <div className="flex items-center space-x-2 shrink-0">
          {(() => {
            const isMyTurnInRoom = roomMode === 'SOLO' || (myRole === roomData?.currentTurnRole);
            const isWaitingGuest = roomMode === 'HOST' && !roomData?.guestAdmin;
            const isDisabled = isRunning || remainingTeams.length === 0 || !isMyTurnInRoom || isWaitingGuest;

            let buttonLabel = 'BỐC THĂM';
            let iconClass = 'fa-hand';

            if (isRunning) {
              buttonLabel = 'ĐANG BỐC THĂM...';
              iconClass = 'fa-spinner fa-spin';
            } else if (remainingTeams.length === 0) {
              buttonLabel = 'ĐÃ HOÀN TẤT';
              iconClass = 'fa-check';
            } else if (isWaitingGuest) {
              buttonLabel = 'CHỜ ADMIN 2...';
              iconClass = 'fa-clock';
            } else if (!isMyTurnInRoom) {
              const otherName = roomData?.currentTurnRole === 'host' ? roomData.hostAdmin.name : roomData?.guestAdmin?.name;
              buttonLabel = `CHỜ ${otherName || 'ADMIN KIA'}...`;
              iconClass = 'fa-lock';
            } else if (roomMode !== 'SOLO') {
              buttonLabel = `BỐC THĂM (${myRole === 'host' ? mc1Name : mc2Name})`;
            }

            return (
              <button
                type="button"
                disabled={isDisabled}
                onClick={handleStartDraw}
                className={`px-5 sm:px-7 py-2 rounded-xl font-oswald text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                  isDisabled
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 hover:scale-105 shadow-amber-500/25 animate-pulse'
                }`}
              >
                <i className={`fa-solid ${iconClass}`}></i>
                <span>{buttonLabel}</span>
              </button>
            );
          })()}

          {/* Reset Button - Icon Only */}
          <button
            type="button"
            disabled={isRunning}
            onClick={() => {
              if (drawnCount > 0) {
                if (window.confirm('Bạn có chắc muốn xóa bản nháp và đặt lại từ đầu không?')) {
                  initializeGroups(numGroups, teamsPerGroup, teams);
                }
              } else {
                initializeGroups(numGroups, teamsPerGroup, teams);
              }
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all shadow"
            title="Đặt lại từ đầu"
          >
            <i className="fa-solid fa-rotate-left text-xs sm:text-sm text-red-400"></i>
          </button>
        </div>
      </footer>

      {/* ================= 6. DEVELOPER DEBUG PANEL (?debugDraw=1) ================= */}
      {isDebugMode && (
        <DrawDebugPanel
          onCameraPreset={(preset: CameraPresetName) => {
            sceneHandleRef.current?.setCameraPreset(preset);
          }}
          onPlayAction={(actionName: string) => {
            sceneHandleRef.current?.playPresenterAction(actionName);
          }}
          onToggleSpotlight={() => {
            sceneHandleRef.current?.toggleSpotlight();
          }}
          onResetScene={() => {
            sceneHandleRef.current?.resetScene();
          }}
        />
      )}

      {/* ================= 7. CONFIGURATION MODAL ================= */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-oswald text-lg font-black uppercase text-white flex items-center gap-2">
                <i className="fa-solid fa-sliders text-amber-400"></i>
                CẤU HÌNH LỄ BỐC THĂM
              </h3>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-oswald font-bold uppercase text-slate-400 block mb-1">
                  Chọn Bộ Dữ Liệu Sẵn:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTournamentTitle('UEFA CHAMPIONS LEAGUE DRAW');
                      setSubTitle('2026/27 GROUP STAGE CEREMONY');
                      setTeams(PRESET_CHAMPIONS_16);
                      initializeGroups(4, 4, PRESET_CHAMPIONS_16);
                      setShowConfigModal(false);
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-blue-500/40 font-oswald text-xs font-bold uppercase text-left"
                  >
                    🏆 Champions League (16 Đội)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTournamentTitle('SAO VÀNG CUP ™ - FC ONLINE');
                      setSubTitle('LỄ BỐC THĂM VÒNG BẢNG CHÍNH THỨC');
                      setTeams(PRESET_SAOVANG_16);
                      initializeGroups(4, 4, PRESET_SAOVANG_16);
                      setShowConfigModal(false);
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/40 font-oswald text-xs font-bold uppercase text-left"
                  >
                    ⭐ Sao Vàng Cup (16 HLV)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-oswald font-bold uppercase text-slate-400 block mb-1">
                  Tiêu Đề Giải Đấu
                </label>
                <input
                  type="text"
                  value={tournamentTitle}
                  onChange={(e) => setTournamentTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-medium focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="font-oswald font-bold uppercase text-slate-400 block mb-1">
                  Dán Danh Sách Đội Tùy Chỉnh (Mỗi dòng: Tên Đội - CLB)
                </label>
                <textarea
                  rows={4}
                  value={customTextList}
                  onChange={(e) => setCustomTextList(e.target.value)}
                  placeholder="Ví dụ:&#10;Manchester City - Premier League&#10;Real Madrid - La Liga..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-oswald text-xs uppercase"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  if (customTextList.trim().length > 0) {
                    const lines = customTextList
                      .split('\n')
                      .map((l) => l.trim())
                      .filter((l) => l.length > 0);
                    const customTeams: DrawTeam[] = lines.map((line, idx) => {
                      const parts = line.split('-').map((p) => p.trim());
                      return {
                        id: `custom-${idx + 1}`,
                        name: parts[0],
                        club: parts[1] || `Đội bóng ${idx + 1}`,
                        pot: Math.min(4, Math.floor(idx / numGroups) + 1),
                      };
                    });
                    setTeams(customTeams);
                    initializeGroups(numGroups, teamsPerGroup, customTeams);
                  }
                  setShowConfigModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-oswald font-black text-xs uppercase tracking-wider shadow-md"
              >
                Áp Dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 8. ONLINE ROOM MODAL ================= */}
      <OnlineRoomModal
        isOpen={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        onSelectSolo={handleSelectSolo}
        onSelectCreateRoom={handleSelectCreateRoom}
        onSelectJoinRoom={handleSelectJoinRoom}
      />

      {/* ================= 8b. TOURNAMENT SELECT MODAL ================= */}
      <TournamentSelectModal
        isOpen={showSelectModal}
        onClose={() => setShowSelectModal(false)}
        onConfirm={handleTournamentSelected}
      />

      {/* ================= 9. CELEBRATION / COMPLETION MODAL ================= */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 animate-in zoom-in-95 text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-3 relative z-10">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/30 animate-bounce">
                🏆
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                {isSavedToCloud
                  ? 'ĐÃ ĐỒNG BỘ FIRESTORE & LOCAL STORAGE THÀNH CÔNG'
                  : 'ĐANG LƯU KẾT QUẢ VÀO HỆ THỐNG...'}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-oswald uppercase tracking-wider text-white">
                BUỔI LỄ BỐC THĂM ĐÃ HOÀN TẤT!
              </h2>

              <p className="text-slate-300 text-sm max-w-lg mx-auto">
                Tất cả các đội đã được phân bổ chính xác vào các bảng đấu cho{' '}
                <span className="text-amber-400 font-bold">
                  {selectedConfig?.tournamentTitle || tournamentTitle}
                </span>
                . Lịch thi đấu vòng tròn (Round Robin) và phân nhánh Knockout đã được tự động khởi tạo!
              </p>
            </div>

            {/* Quick Groups Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left relative z-10 max-h-48 overflow-y-auto pr-1">
              {groups.map((g) => (
                <div key={g.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="font-oswald text-xs font-black text-amber-400 uppercase border-b border-slate-800 pb-1 flex items-center justify-between">
                    <span>{g.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{g.slots.length} Đội</span>
                  </div>
                  <div className="space-y-0.5 text-[11px] text-slate-300">
                    {g.slots.map((s) => (
                      <div key={s.positionName} className="truncate">
                        • {s.team ? s.team.name : '—'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
              <Link
                to={selectedConfig?.system === 'DTHEN' ? '/dthen/xephang' : '/xephang'}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-oswald text-sm font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <i className="fa-solid fa-chart-simple"></i>
                <span>Xem Lịch Thi Đấu & BXH</span>
              </Link>

              <Link
                to="/admin-portal"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-oswald text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <i className="fa-solid fa-shield-halved text-cyan-400"></i>
                <span>Quản Lý Tỷ Số Admin</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setShowCompletionModal(false);
                  setShowSelectModal(true);
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-oswald text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <i className="fa-solid fa-arrows-rotate text-amber-400"></i>
                <span>Bốc Thăm Mùa Khác</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCompletionModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs uppercase font-oswald font-semibold px-2 py-1"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
