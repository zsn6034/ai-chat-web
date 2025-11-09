import type { ApiMessage } from './api';

// 自定义消息
export interface Message extends ApiMessage {
  messageId: string; // 唯一索引（用时间戳生成）
  modelId: string;
  // 后续可扩展
}
