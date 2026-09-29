import { create } from "zustand"

// The chat open in the middle panel, and the other person in it.
export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  changeChat: (chatId, user) => set({ chatId, user }),
  resetChat: () => set({ chatId: null, user: null }),
}))
