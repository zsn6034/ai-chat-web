import { useRef } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useMessageStore } from '@/stores/messageStore';
import type {
  ApiMessage,
  RequestOptions,
  RequestParams,
  ResponseData,
} from '@/types/api';
import { sleep } from '@/utils';
import { ARK_API_URL } from '@/const/model';
import { useModelStore } from '@/stores/modelStore';

export const useRequest = () => {
  const answer = useRef('');
  const { setIsThinking, setIsTyping } = useChatStore();
  const { appendContent } = useMessageStore();
  const { config } = useModelStore();

  // 创建新的控制器
  const controller = useRef<AbortController>(null);
  const requestLLM = async (
    modelId: string,
    messages: ApiMessage[],
    options: RequestOptions
  ) => {
    setIsThinking(true);
    answer.current = '';
    const params: RequestParams = {
      messages,
      model: modelId,
      stream: true,
      ...options,
    };
    controller.current = new AbortController();
    const response = await fetch(ARK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apikey}`,
      },
      body: JSON.stringify(params),
      signal: controller.current.signal,
    });
    // 模拟延迟1秒，确保能展示『正在思考...』
    await sleep(1000);
    setIsThinking(false);
    setIsTyping(true);
    // console.log('r=', response);
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    try {
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        let buffer = decoder.decode(value, { stream: true });
        // 按行分割数据
        const lines = buffer.split('\n');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const dataStr = line.slice(5).trim();
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const data = JSON.parse(dataStr) as ResponseData;
              const chunk = data.choices.map((c) => c.delta.content).join('');
              appendContent(chunk);
              answer.current += chunk;
            } catch (parseError) {
              console.error('Error parsing JSON:', parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading stream:', error);
    } finally {
      reader?.releaseLock();
      setIsTyping(false);
    }
  };

  const stop = () => {
    try {
      controller.current?.abort();
    } catch (error) {
      console.error('Error stopping stream:', error);
    }
  };

  return {
    answer,
    requestLLM,
    stop,
  };
};
