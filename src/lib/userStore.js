import { create } from "zustand"

// currentUser is the signed in user's profile from users/{uid} in Firestore,
// or null when nobody is signed in (or the profile does not exist yet).
export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  setCurrentUser: (currentUser) => set({ currentUser, isLoading: false }),
}))
