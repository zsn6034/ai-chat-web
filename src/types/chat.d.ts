import type { Message } from './message';

export interface Chat {
  sessionId: string;
  messageList: Message[];
}
