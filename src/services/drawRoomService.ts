import { DrawTeam, DrawGroup, DrawState } from '../components/draw/DrawTypes';
import { SelectedTournamentConfig } from '../components/draw/TournamentSelectModal';

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

export function generateRoomCode(system: 'SAO_VANG' | 'DTHEN' = 'SAO_VANG'): string {
  const prefix = system === 'SAO_VANG' ? 'SV' : 'DT';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

export async function createDrawRoom(_params: any): Promise<DrawRoomData | null> {
  return null;
}

export async function joinDrawRoom(
  _roomId: string,
  _paramsOrName: any,
  _guestMcName?: string
): Promise<{ success: boolean; room?: any; error?: string }> {
  return { success: false, error: 'Firebase đã được tắt.' };
}

export async function dispatchRoomDrawAction(..._args: any[]): Promise<boolean> {
  return false;
}

export async function updateRoomGroupsState(..._args: any[]): Promise<boolean> {
  return false;
}

export async function closeDrawRoom(_roomId: string): Promise<boolean> {
  return true;
}

export function subscribeDrawRoom(
  _roomId: string,
  _onUpdate: (room: any) => void,
  _onError?: (err: any) => void
): () => void {
  return () => {};
}
