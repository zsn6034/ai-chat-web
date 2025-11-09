import { DEFALUT_MODEL_CONFIG, MODEL_OPTIONS } from '@/const/model';
import type { ModelConfig } from '@/types/model';
import { create } from 'zustand';

interface ModelState {
  modelId: string;
  config: ModelConfig;
  setModelId: (modelId: string) => void;
  setConfig: (config: ModelConfig) => void;
}

export const useModelStore = create<ModelState>()((set) => ({
  modelId: MODEL_OPTIONS[0].value,
  config: DEFALUT_MODEL_CONFIG,
  setModelId: (modelId: string) => set({ modelId }),
  setConfig: (config: ModelConfig) => set({ config }),
}));
