import { useRef } from 'react';
import { ARK_API_KEY } from '@/config/model';
import { useChatStore } from '@/stores/chatStore';
import { useMessageStore } from '@/stores/messageStore';
import type { RequestOptions, RequestParams, ResponseData } from '@/types/api';
import { sleep } from '@/utils';

export const useRequest = () => {
  const answer = useRef('');
  const { setIsThinking } = useChatStore();
  const { appendContent } = useMessageStore();
  const requestLLM = async (
    modleId: string,
    messages: any[],
    options: RequestOptions
  ) => {
    setIsThinking(true);
    answer.current = '';
    const params: RequestParams = {
      messages,
      model: modleId,
      stream: true,
      ...options,
    };
    const response = await fetch(
      'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ARK_API_KEY}`,
        },
        body: JSON.stringify(params),
      }
    );
    // 模拟延迟2秒，确保能展示『正在思考...』
    await sleep(2000);
    setIsThinking(false);
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
              answer.current = answer.current + chunk;
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
    }
  };

  return {
    requestLLM,
    answer,
  };
};
