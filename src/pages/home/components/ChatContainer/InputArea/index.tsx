import { useState } from 'react';
import { Button, Select, Input } from 'antd';
import { SendOutlined, PauseCircleFilled } from '@ant-design/icons';
import styles from './index.module.less';
import { useMessageStore } from '@/stores/messageStore';
import type { Message } from '@/types/message';
import { MODEL_OPTIONS } from '@/const/model';
import { useModelStore } from '@/stores/modelStore';
import { useSessionStore } from '@/stores/sessionStore';
import { sleep } from '@/utils';
import type { ApiMessage, RequestOptions } from '@/types/api';
import { useChatStore } from '@/stores/chatStore';

interface InputAreaProps {
  newAnswer: React.RefObject<string>;
  requestLLM: (
    modelId: string,
    messages: ApiMessage[],
    options: RequestOptions
  ) => Promise<void>;
  stopRequest: () => void;
}
const InputArea: React.FC<InputAreaProps> = ({
  newAnswer,
  requestLLM,
  stopRequest,
}) => {
  const [inputValue, setInputValue] = useState('');
  const { curSessionId } = useSessionStore();
  const { messageList, addMessage } = useMessageStore();
  const { modelId, setModelId } = useModelStore();
  const { isThinking, isTyping, setIsThinking, setIsTyping } = useChatStore();
  const { config } = useModelStore();

  const handleStop = async () => {
    await stopRequest();
    setIsThinking(false);
    setIsTyping(false);
  };

  const handleSend = async () => {
    if (inputValue.trim()) {
      console.log('发送消息:', inputValue);
      console.log('选中的模型:', modelId);
      // 清空输入框
      setInputValue('');
      // 加一条用户消息
      const userMessage: Message = {
        role: 'user',
        content: inputValue,
        modelId,
        messageId: Date.now().toString(),
      };
      addMessage(userMessage);
      // 延迟100毫秒，确保messageId不一样
      await sleep(100);
      // 加一条AI消息
      const aiMessage: Message = {
        role: 'assistant',
        content: '',
        modelId,
        messageId: Date.now().toString(),
      };
      addMessage(aiMessage);
      // 调用SSE
      await requestLLM(modelId, [...messageList, userMessage], {
        max_tokens: config.max_tokens,
        temperature: config.temperature,
      });
      // 缓存持久化：消息列表
      localStorage.setItem(
        `MESSION_LIST_${curSessionId}`,
        JSON.stringify([
          ...messageList,
          userMessage,
          { ...aiMessage, content: newAnswer.current },
        ])
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.inputArea}>
      <Input.TextArea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="请输入内容，Enter发送，Shift+Enter换行"
        autoSize
        className={styles.textarea}
      />
      <div className={styles.bottom}>
        <Select
          value={modelId}
          onChange={setModelId}
          options={MODEL_OPTIONS}
          size="small"
          className={styles.modelSelect}
        />
        {isThinking || isTyping ? (
          <Button
            className={styles.pauseButton}
            type="primary"
            icon={<PauseCircleFilled />}
            onClick={handleStop}
          >
            停止
          </Button>
        ) : (
          <Button
            className={styles.sendButton}
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            发送
          </Button>
        )}
      </div>
    </div>
  );
};

export default InputArea;
