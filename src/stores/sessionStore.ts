import { create } from 'zustand';

interface SessionState {
  curSessionId: string;
  sessionList: Session[];
  setCurSessionId: (sessionId: string) => void;
  addSession: (session: Session) => void;
  setSessionList: (sessionList: Session[]) => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  curSessionId: '',
  sessionList: [],
  setCurSessionId: (sessionId: string) => set({ curSessionId: sessionId }),
  addSession: (session: Session) =>
    set((state) => ({
      sessionList: [session, ...state.sessionList],
    })),
  setSessionList: (sessionList: Session[]) => set({ sessionList }),
}));
