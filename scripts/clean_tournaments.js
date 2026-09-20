require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, deleteDoc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

console.log('Connecting to Firebase project:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TOURNAMENT_DOCS = [
  'sao_vang',
  'dthen_fco',
  'archive',
  'archive_dthen',
  'draw_live_state',
];

async function run() {
  console.log('--- Checking and Cleaning Tournament Documents ONLY ---');
  for (const docId of TOURNAMENT_DOCS) {
    try {
      const docRef = doc(db, 'tournaments', docId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        console.log(`[FOUND] tournaments/${docId}: exists, deleting/clearing...`);
        await deleteDoc(docRef);
        console.log(`[CLEARED] tournaments/${docId} successfully deleted.`);
      } else {
        console.log(`[EMPTY] tournaments/${docId}: already not found.`);
      }
    } catch (err) {
      console.error(`[ERROR] clearing tournaments/${docId}:`, err);
    }
  }
  console.log('--- Finished cleaning all tournament data from Firestore! ---');
  process.exit(0);
}

run();
