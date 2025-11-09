export interface ApiMessage {
  content: string;
  role: 'system' | 'user' | 'assistant';
}

export interface RequestOptions {
  max_tokens: number; // 模型回答最大长度（单位 token），默认值 4096
  temperature: number; // 采样温度，取值范围为 [0, 2]，较高的值会使输出更加随机
  // 后续可扩展
}

export interface RequestParams {
  messages: ApiMessage[];
  model: string;
  stream: boolean;
}

export interface Choice {
  index: number;
  delta: ApiMessage;
}

export interface ResponseData {
  id: string;
  object: string; // 固定为 chat.completion.chunk
  created: number;
  model: string;
  choices: Choice[];
  usage: any; // 暂不关心token消耗
  service_tier: string; // 暂不关心是否使用TPM保障包
}

export type DONE = '[DONE]';
