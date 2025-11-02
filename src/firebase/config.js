import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAu7c9J7QAcGFjHj0xw39QjsmvdyrC2tsQ",
  authDomain: "consultancy-services-48b5d.firebaseapp.com",
  projectId: "consultancy-services-48b5d",
  // Try both bucket formats - Firebase SDK should handle this, but explicitly setting helps
  storageBucket: "consultancy-services-48b5d.appspot.com", // Use appspot.com format (matches error URL)
  messagingSenderId: "695440911733",
  appId: "1:695440911733:web:17e181929d9f0d2d91773c",
  measurementId: "G-E0MNZVY30F"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
