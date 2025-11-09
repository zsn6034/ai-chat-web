import type { Message } from '@/types/message';
import { create } from 'zustand';

interface MessageState {
  messageList: Message[];
  getInitMessage: (modelId: string) => Message;
  resetMessageList: (modelId: string) => void;
  addMessage: (message: Message) => void;
  setMessageList: (messageList: Message[]) => void;
  appendContent: (chunk: string) => void;
}

export const useMessageStore = create<MessageState>()((set) => ({
  messageList: [],
  getInitMessage: (modelId: string) => ({
    role: 'assistant',
    content: '你好，你可以问我任何问题，我会如数帮你解答~',
    modelId,
    messageId: Date.now().toString(),
  }),
  resetMessageList: (modelId: string) => {
    set((state) => ({
      messageList: [state.getInitMessage(modelId)],
    }));
  },
  addMessage: (message) =>
    set((state) => ({
      messageList: [...state.messageList, message],
    })),
  setMessageList: (messageList) =>
    set(() => ({
      messageList,
    })),
  appendContent: (chunk) =>
    set((state) => {
      if (state.messageList.length === 0) {
        return { messageList: [] };
      }
      const lastMessage = state.messageList[state.messageList.length - 1];
      if (lastMessage) {
        lastMessage.content += chunk;
      }
      return { messageList: [...state.messageList] };
    }),
}));
