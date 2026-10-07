// Firebase tournament cloud service has been removed/disabled.

export const CLOUD_KEYS = {
  DTHEN: 'dthen_fco',
  SAO_VANG: 'sao_vang',
  ARCHIVE: 'archive',
  ARCHIVE_DTHEN: 'archive_dthen',
  DRAW_LIVE_STATE: 'draw_live_state',
} as const;

export async function saveLiveDrawStateToFirestore(_data: unknown): Promise<boolean> {
  return false;
}

export async function getLiveDrawStateFromFirestore<T>(): Promise<T | null> {
  return null;
}

export async function clearLiveDrawStateFromFirestore(): Promise<boolean> {
  return true;
}

export async function saveTournamentToFirestore(_docKey: string, _data: unknown): Promise<boolean> {
  return false;
}

export async function getTournamentFromFirestore<T>(_docKey: string): Promise<T | null> {
  return null;
}

export function subscribeTournamentFromFirestore<T>(_docKey: string, _callback: (data: T) => void): () => void {
  return () => {};
}
