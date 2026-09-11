import { doc, getDoc, setDoc, updateDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { DrawTeam, DrawGroup, DrawState } from '../components/draw/DrawTypes';
import { SelectedTournamentConfig } from '../components/draw/TournamentSelectModal';

const COLLECTION_NAME = 'draw_rooms';

export interface DrawRoomAdmin {
  id: string;
  name: string;
  mcName: string;
  role: 'host' | 'guest';
  theme: 'GOLD_IVORY' | 'ROYAL_NAVY';
  joinedAt: string;
}

export interface DrawRoomAction {
  actionId: string;
  executorRole: 'host' | 'guest';
  activePresenterIndex: 1 | 2;
  chosenTeam: DrawTeam;
  destinationSlot: { groupIdx: number; slotIdx: number; label: string };
  timestamp: number;
}

export interface DrawRoomData {
  roomId: string;
  status: 'WAITING_GUEST' | 'DUAL_READY' | 'DRAWING' | 'COMPLETED';
  config: SelectedTournamentConfig;
  hostAdmin: DrawRoomAdmin;
  guestAdmin: DrawRoomAdmin | null;
  currentTurnRole: 'host' | 'guest';
  drawState: DrawState;
  groups: DrawGroup[];
  remainingTeams: DrawTeam[];
  currentPot: number;
  lastAction: DrawRoomAction | null;
  createdAt: string;
  updatedAt: string;
}

// Generate human-friendly room code (e.g. SV-6821 or DT-4519)
export function generateRoomCode(system: 'SAO_VANG' | 'DTHEN' = 'SAO_VANG'): string {
  const prefix = system === 'SAO_VANG' ? 'SV' : 'DT';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

/**
 * Host creates a new online draw room in Firestore
 */
export async function createDrawRoom(params: {
  config: SelectedTournamentConfig;
  hostAdminName: string;
  hostMcName: string;
  initialGroups: DrawGroup[];
  customRoomId?: string;
}): Promise<DrawRoomData | null> {
  const roomId = params.customRoomId?.toUpperCase().trim() || generateRoomCode(params.config.system);
  const now = new Date().toISOString();

  const hostAdmin: DrawRoomAdmin = {
    id: `admin_host_${Date.now()}`,
    name: params.hostAdminName.trim() || 'Admin 1 (Host)',
    mcName: params.hostMcName.trim() || 'MC Phan Long',
    role: 'host',
    theme: 'GOLD_IVORY',
    joinedAt: now,
  };

  const roomData: DrawRoomData = {
    roomId,
    status: 'WAITING_GUEST',
    config: params.config,
    hostAdmin,
    guestAdmin: null,
    currentTurnRole: 'host',
    drawState: 'IDLE',
    groups: params.initialGroups,
    remainingTeams: params.config.teams,
    currentPot: 1,
    lastAction: null,
    createdAt: now,
    updatedAt: now,
  };

  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, COLLECTION_NAME, roomId);
      await setDoc(docRef, {
        payload: JSON.stringify(roomData),
        updatedAt: now,
      });
      return roomData;
    } catch (err) {
      console.warn('[DrawRoom] Could not create room in Firestore, fallback to local room', err);
    }
  }

  // Fallback if offline
  localStorage.setItem(`draw_room_${roomId}`, JSON.stringify(roomData));
  return roomData;
}

/**
 * Guest Admin connects to an existing room
 */
export async function joinDrawRoom(
  roomId: string,
  params: {
    guestAdminName: string;
    guestMcName: string;
  }
): Promise<{ success: boolean; room?: DrawRoomData; error?: string }> {
  const cleanId = roomId.toUpperCase().trim();
  const now = new Date().toISOString();

  const guestAdmin: DrawRoomAdmin = {
    id: `admin_guest_${Date.now()}`,
    name: params.guestAdminName.trim() || 'Admin 2 (Co-Host)',
    mcName: params.guestMcName.trim() || 'MC Minh Quân',
    role: 'guest',
    theme: 'ROYAL_NAVY',
    joinedAt: now,
  };

  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, COLLECTION_NAME, cleanId);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        return { success: false, error: `Phòng "${cleanId}" không tồn tại hoặc đã kết thúc!` };
      }

      const raw = snap.data();
      const currentRoom: DrawRoomData = JSON.parse(raw.payload);

      const updatedRoom: DrawRoomData = {
        ...currentRoom,
        guestAdmin,
        status: 'DUAL_READY',
        updatedAt: now,
      };

      await updateDoc(docRef, {
        payload: JSON.stringify(updatedRoom),
        updatedAt: now,
      });

      return { success: true, room: updatedRoom };
    } catch (err) {
      console.error('[DrawRoom] Error joining room:', err);
      return { success: false, error: 'Lỗi kết nối máy chủ phòng bốc thăm!' };
    }
  }

  // Local fallback
  const local = localStorage.getItem(`draw_room_${cleanId}`);
  if (local) {
    const currentRoom: DrawRoomData = JSON.parse(local);
    const updatedRoom: DrawRoomData = {
      ...currentRoom,
      guestAdmin,
      status: 'DUAL_READY',
      updatedAt: now,
    };
    localStorage.setItem(`draw_room_${cleanId}`, JSON.stringify(updatedRoom));
    return { success: true, room: updatedRoom };
  }

  return { success: false, error: `Không tìm thấy phòng "${cleanId}"!` };
}

/**
 * Real-time listener for room state changes
 */
export function subscribeDrawRoom(
  roomId: string,
  onUpdate: (room: DrawRoomData) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const cleanId = roomId.toUpperCase().trim();

  if (!db || !isFirebaseConfigured) {
    // LocalStorage poll fallback
    const interval = setInterval(() => {
      const raw = localStorage.getItem(`draw_room_${cleanId}`);
      if (raw) {
        try {
          onUpdate(JSON.parse(raw));
        } catch {
          // ignore
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, cleanId);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && typeof data.payload === 'string') {
            try {
              const room = JSON.parse(data.payload) as DrawRoomData;
              onUpdate(room);
            } catch (err) {
              console.error('[DrawRoom] Failed to parse room payload', err);
            }
          }
        }
      },
      (err) => {
        console.warn(`[DrawRoom] Realtime listener error for room ${cleanId}:`, err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.error('[DrawRoom] Error setting up room subscription:', err);
    return () => {};
  }
}

/**
 * Broadcast draw action to the other admin in the room
 */
export async function dispatchRoomDrawAction(
  roomId: string,
  action: DrawRoomAction,
  nextTurnRole: 'host' | 'guest',
  remainingTeams: DrawTeam[],
  currentPot: number
): Promise<boolean> {
  const cleanId = roomId.toUpperCase().trim();
  const now = new Date().toISOString();

  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, COLLECTION_NAME, cleanId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return false;

      const currentRoom: DrawRoomData = JSON.parse(snap.data().payload);
      const updatedRoom: DrawRoomData = {
        ...currentRoom,
        status: remainingTeams.length === 0 ? 'COMPLETED' : 'DRAWING',
        currentTurnRole: nextTurnRole,
        lastAction: action,
        remainingTeams,
        currentPot,
        updatedAt: now,
      };

      await updateDoc(docRef, {
        payload: JSON.stringify(updatedRoom),
        updatedAt: now,
      });

      return true;
    } catch (err) {
      console.error('[DrawRoom] Error dispatching draw action:', err);
      return false;
    }
  }

  return false;
}

/**
 * Update room groups standings (after slotting team)
 */
export async function updateRoomGroupsState(
  roomId: string,
  groups: DrawGroup[],
  drawState: DrawState = 'IDLE'
): Promise<boolean> {
  const cleanId = roomId.toUpperCase().trim();
  const now = new Date().toISOString();

  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, COLLECTION_NAME, cleanId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return false;

      const currentRoom: DrawRoomData = JSON.parse(snap.data().payload);
      const updatedRoom: DrawRoomData = {
        ...currentRoom,
        groups,
        drawState,
        updatedAt: now,
      };

      await updateDoc(docRef, {
        payload: JSON.stringify(updatedRoom),
        updatedAt: now,
      });

      return true;
    } catch (err) {
      console.error('[DrawRoom] Error updating room groups:', err);
      return false;
    }
  }

  return false;
}
