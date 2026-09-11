import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { drawAudio } from '../utils/drawAudio';
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
  saveTournamentData,
  saveDthenTournamentData,
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
  DrawState,
  DrawTeam,
  DrawGroup,
  GroupSlot,
  CameraPresetName,
} from '../components/draw/DrawTypes';

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
  const [showRoomModal, setShowRoomModal] = useState(true);
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSideBoard, setShowSideBoard] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customTextList, setCustomTextList] = useState('');

  const totalSlots = numGroups * teamsPerGroup;
  const drawnCount = totalSlots - remainingTeams.length;
  const isRunning = drawState !== 'IDLE' && drawState !== 'COMPLETED';

  // Initialize or Reset Groups
  const initializeGroups = (gCount = numGroups, tCount = teamsPerGroup, teamList = teams) => {
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
    setShowSelectModal(true);
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
    setShowSelectModal(true);
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

  // Save the drawn groups and fixtures directly to Firestore & LocalStorage
  const saveDrawResultsToEngine = (finalGroups: DrawGroup[], config: SelectedTournamentConfig | null) => {
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

    const updatedTour: TournamentData = config.selectedTournamentData
      ? {
          ...config.selectedTournamentData,
          groups: engineGroups,
          knockoutStage: buildFIFABracketFromGroups(engineGroups),
        }
      : {
          id: `tour_${config.system.toLowerCase()}_${Date.now()}`,
          tournamentName: config.system === 'SAO_VANG' ? 'SAO VÀNG CUP ™' : 'ĐTHÉN FCO ™',
          season: config.season,
          numGroups: config.numGroups,
          teamsPerGroup: config.teamsPerGroup,
          legType: config.system === 'DTHEN' ? 'single' : 'double',
          groups: engineGroups,
          knockoutStage: buildFIFABracketFromGroups(engineGroups),
          createdAt: nowIso,
          isVisible: true,
        };

    if (config.system === 'SAO_VANG') {
      saveTournamentData(updatedTour);
    } else {
      saveDthenTournamentData(updatedTour);
    }

    setIsSavedToCloud(true);
  };

  useEffect(() => {
    initializeGroups(numGroups, teamsPerGroup, teams);
    drawAudio.startAuditoriumTone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = () => {
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
        } else if (newState === 'RETURNING') {
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
              if (roomData?.roomId && myRole === 'host') {
                updateRoomGroupsState(roomData.roomId, updated, 'RETURNING');
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
            }, 1500);
          }

          setRemainingTeams((prev) => {
            const updated = prev.filter((t) => t.id !== chosenTeam.id);
            if (isSeeded) {
              const inPot = updated.filter((t) => t.pot === currentPot);
              if (inPot.length === 0 && updated.length > 0) {
                setCurrentPot((p) => p + 1);
              }
            }
            return updated;
          });
        }
      },
      () => {
        setRemainingTeams((prev) => {
          if (prev.length === 0) {
            setDrawState('COMPLETED');
            drawAudio.playCelebration();
            triggerConfetti();

            if (selectedConfigRef.current) {
              saveDrawResultsToEngine(groupsRef.current, selectedConfigRef.current);
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

  return (
    <div className="w-screen h-screen bg-[#020617] text-white flex flex-col font-sans select-none overflow-hidden relative">
      {/* ================= 1. THREE.JS 3D CINEMATIC CANVAS ================= */}
      <div className="absolute inset-0 z-0">
        <DrawScene
          onHandleReady={(handle) => {
            sceneHandleRef.current = handle;
          }}
          tournamentTitle={tournamentTitle}
          groups={groups}
          isDualMode={isDualMode}
          mc1Name={mc1Name}
          mc2Name={mc2Name}
        />
      </div>

      {/* ================= 2. BROADCAST TOP HUD ================= */}
      <header className="absolute top-0 inset-x-0 z-30 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 pointer-events-auto bg-gradient-to-b from-[#020617]/95 via-[#020617]/70 to-transparent">
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-600/90 text-white font-oswald text-[11px] font-black tracking-widest uppercase shadow-md shadow-red-600/30">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            LIVE 3D BROADCAST
          </div>
          <div>
            <h1 className="font-oswald text-xs sm:text-sm font-black uppercase tracking-wider text-slate-100">
              {tournamentTitle}
            </h1>
            <div className="text-[10px] text-cyan-400 font-mono">
              {subTitle} • {drawnCount}/{totalSlots} TEAMS DRAWN
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
          {/* Online Room Modal / Mode Switcher */}
          <button
            type="button"
            onClick={() => setShowRoomModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-blue-600/30 to-cyan-600/30 hover:from-blue-600/40 hover:to-cyan-600/40 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-oswald font-black uppercase tracking-wider transition-all shadow-md shadow-cyan-500/10"
            title="Đổi chế độ bốc thăm Solo hoặc Phòng Online 2 Admin"
          >
            <i className="fa-solid fa-users text-cyan-400"></i>
            <span className="hidden sm:inline">
              {roomMode === 'SOLO' ? 'CHẾ ĐỘ: SOLO' : `PHÒNG: ${roomData?.roomId || 'ONLINE'}`}
            </span>
            <span className="sm:hidden">PHÒNG</span>
          </button>

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

          <button
            type="button"
            onClick={() => setShowSideBoard((prev) => !prev)}
            className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-oswald font-bold uppercase transition-all"
          >
            <i className="fa-solid fa-table-columns mr-1"></i>
            {showSideBoard ? 'Ẩn Bảng' : 'Hiện Bảng'}
          </button>

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
        </div>
      </header>

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
      <footer className="absolute bottom-0 inset-x-0 z-30 bg-[#020617]/95 border-t border-slate-800/80 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
        {/* Status */}
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              TRẠNG THÁI SÂN KHẤU (THREE.JS 3D)
            </span>
            <span className="font-oswald text-xs sm:text-sm font-black uppercase text-cyan-300">
              {drawState === 'IDLE' && 'SẴN SÀNG CHO LƯỢT TIẾP THEO'}
              {drawState === 'CAMERA_FOCUS' && 'CAMERA TIẾN GẦN BÀN BỐC THĂM...'}
              {drawState === 'MIXING' && 'CÁC QUẢ BÓNG ĐANG ĐẢO TRONG LỒNG CẦU...'}
              {drawState === 'REACHING' && 'MC ĐƯA TAY VÀO LỒNG CẦU CHỌN BÓNG...'}
              {drawState === 'GRABBING' && 'MC ĐÃ CẦM QUẢ BÓNG TRONG TAY!'}
              {drawState === 'OPENING_BALL' && 'MC NÂNG BÓNG LÊN & TÁCH NẮP...'}
              {drawState === 'TAKING_CARD' && 'RÚT TẤM THẺ KẾT QUẢ TỪ QUẢ BÓNG...'}
              {drawState === 'OPENING_CARD' && 'ĐANG MỞ NẾP GẤP TẤM THẺ...'}
              {drawState === 'SHOWING_CARD' && 'MC GIƠ TẤM THẺ ĐỐI DIỆN ỐNG KÍNH!'}
              {drawState === 'REVEALING' && 'CÔNG BỐ KẾT QUẢ TRÊN THẺ 3D!'}
              {drawState === 'RETURNING' && 'CAMERA ZOOM OUT & XẾP VÀO BẢNG ĐẤU...'}
              {drawState === 'COMPLETED' && 'BUỔI LỄ BỐC THĂM ĐÃ HOÀN TẤT!'}
            </span>
          </div>
        </div>

        {/* The Draw Button */}
        <div className="flex items-center space-x-3">
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
              buttonLabel = 'CHỜ ADMIN 2 KẾT NỐI VÀO PHÒNG...';
              iconClass = 'fa-clock';
            } else if (!isMyTurnInRoom) {
              const otherName = roomData?.currentTurnRole === 'host' ? roomData.hostAdmin.name : roomData?.guestAdmin?.name;
              buttonLabel = `CHỜ LƯỢT BỐC CỦA ${otherName || 'ADMIN KIA'}`;
              iconClass = 'fa-lock';
            } else if (roomMode !== 'SOLO') {
              buttonLabel = `BỐC THĂM (LƯỢT CỦA BẠN - ${myRole === 'host' ? mc1Name : mc2Name})`;
            }

            return (
              <button
                type="button"
                disabled={isDisabled}
                onClick={handleStartDraw}
                className={`px-8 py-3 rounded-2xl font-oswald text-sm sm:text-base font-black uppercase tracking-widest shadow-2xl flex items-center gap-2.5 transition-all cursor-pointer ${
                  isDisabled
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 hover:scale-105 shadow-amber-500/30 animate-pulse'
                }`}
              >
                <i className={`fa-solid ${iconClass}`}></i>
                <span>{buttonLabel}</span>
              </button>
            );
          })()}
        </div>

        {/* Right Utility */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            disabled={isRunning}
            onClick={() => initializeGroups(numGroups, teamsPerGroup, teams)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-oswald font-bold uppercase transition-all"
            title="Làm lại từ đầu"
          >
            <i className="fa-solid fa-rotate-left mr-1.5 text-red-400"></i>
            <span>Đặt Lại</span>
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
