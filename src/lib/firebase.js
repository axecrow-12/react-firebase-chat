import { initializeApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"

const env = import.meta.env

// Local emulators (npx firebase-tools emulators:start --project demo-agrovia)
// accept any config for a "demo-" project, so no real keys are needed.
export const usingEmulators = env.VITE_USE_FIREBASE_EMULATORS === "true"

const firebaseConfig = usingEmulators
  ? {
      apiKey: "demo-key",
      authDomain: "localhost",
      projectId: "demo-agrovia",
      storageBucket: "demo-agrovia.appspot.com",
      appId: "demo-app",
    }
  : {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID,
    }

const requiredKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "appId"]
export const isFirebaseConfigured = requiredKeys.every((key) => firebaseConfig[key])

let auth, db, storage

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)

  if (usingEmulators) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true })
    connectFirestoreEmulator(db, "127.0.0.1", 8080)
    connectStorageEmulator(storage, "127.0.0.1", 9199)
  }
}

export { auth, db, storage }
