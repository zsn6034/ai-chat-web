import type { ModelConfig } from '@/types/model';

export const MODEL_OPTIONS = [
  { value: 'deepseek-v3-1-terminus', label: 'DeepSeek-V3' },
  { value: 'doubao-seed-1-6-251015', label: 'Doubao-Seed-1.6' },
];

export const MODEL_MAP = MODEL_OPTIONS.reduce(
  (acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  },
  {} as Record<string, string>
);

export const DEFALUT_MODEL_CONFIG: ModelConfig = {
  apikey: '', // 需要用户填写
  max_tokens: 1024,
  temperature: 1,
};

// 字节火山引擎请求地址
export const ARK_API_URL =
  'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
