import { create } from 'zustand';

interface ChatState {
  isThinking: boolean;
  isTyping: boolean;
  setIsThinking: (isThinking: boolean) => void;
  setIsTyping: (isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  isThinking: false,
  isTyping: false,
  setIsThinking: (isThinking: boolean) => set({ isThinking }),
  setIsTyping: (isTyping: boolean) => set({ isTyping }),
}));
