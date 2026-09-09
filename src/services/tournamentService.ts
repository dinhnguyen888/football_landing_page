import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const COLLECTION_NAME = 'tournaments';

export const CLOUD_KEYS = {
  DTHEN: 'dthen_fco',
  SAO_VANG: 'sao_vang',
  ARCHIVE: 'archive',
  ARCHIVE_DTHEN: 'archive_dthen',
} as const;

/**
 * Save tournament data to Firebase Cloud Firestore.
 * Automatically wraps in try/catch to avoid breaking UI on network failure.
 */
export async function saveTournamentToFirestore(
  docKey: string,
  data: unknown
): Promise<boolean> {
  if (!db || !isFirebaseConfigured) {
    return false;
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, docKey);
    await setDoc(docRef, {
      payload: JSON.stringify(data),
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.warn(`[Firebase] Could not save tournament data for ${docKey}:`, err);
    return false;
  }
}

/**
 * Fetch tournament data once from Firestore.
 */
export async function getTournamentFromFirestore<T>(
  docKey: string
): Promise<T | null> {
  if (!db || !isFirebaseConfigured) {
    return null;
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, docKey);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const docData = snap.data();
      if (docData && typeof docData.payload === 'string') {
        return JSON.parse(docData.payload) as T;
      }
    }
    return null;
  } catch (err) {
    console.warn(`[Firebase] Could not load tournament data for ${docKey}:`, err);
    return null;
  }
}

/**
 * Subscribe to real-time changes of tournament data on Cloud Firestore.
 * Returns an unsubscribe callback.
 */
export function subscribeTournamentFromFirestore<T>(
  docKey: string,
  onUpdate: (data: T) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  if (!db || !isFirebaseConfigured) {
    return () => {};
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, docKey);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const docData = snapshot.data();
          if (docData && typeof docData.payload === 'string') {
            try {
              const parsed = JSON.parse(docData.payload) as T;
              onUpdate(parsed);
            } catch (parseErr) {
              console.error('[Firebase] Failed to parse realtime payload', parseErr);
            }
          }
        }
      },
      (error) => {
        console.warn(`[Firebase] Realtime listener error for ${docKey}:`, error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn(`[Firebase] Failed to subscribe to ${docKey}:`, err);
    return () => {};
  }
}
