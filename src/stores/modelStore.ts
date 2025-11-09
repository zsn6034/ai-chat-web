import { MODEL_OPTIONS } from '@/const/model';
import { create } from 'zustand';

interface ModelState {
  curModelId: string;
  setCurModelId: (modelId: string) => void;
}

export const useModelStore = create<ModelState>()((set) => ({
  curModelId: MODEL_OPTIONS[0].value,
  setCurModelId: (modelId: string) => set({ curModelId: modelId }),
}));
