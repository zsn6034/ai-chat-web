import { create } from 'zustand';

interface ChatState {
  isThinking: boolean;
  setIsThinking: (isThinking: boolean) => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  isThinking: false,
  setIsThinking: (isThinking: boolean) => set({ isThinking }),
}));
