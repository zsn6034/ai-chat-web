import { useState } from 'react';
import { Button, Select, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { useRequest } from '@/hooks/useRequest';
import { useMessageStore } from '@/stores/messageStore';
import type { Message } from '@/types/message';
import { MODEL_OPTIONS } from '@/const/model';
import { useModelStore } from '@/stores/modelStore';
import { useSessionStore } from '@/stores/sessionStore';
import { sleep } from '@/utils';
const InputArea = () => {
  const [inputValue, setInputValue] = useState('');
  const { curSessionId } = useSessionStore();
  const { messageList, addMessage } = useMessageStore();
  const { curModelId, setCurModelId } = useModelStore();
  const { requestLLM, answer } = useRequest();

  const handleSend = async () => {
    if (inputValue.trim()) {
      console.log('发送消息:', inputValue);
      console.log('选中的模型:', curModelId);
      // 清空输入框
      setInputValue('');
      // 加一条用户消息
      const userMessage: Message = {
        role: 'user',
        content: inputValue,
        modleId: curModelId,
        messageId: Date.now().toString(),
      };
      addMessage(userMessage);
      // 延迟100毫秒，确保messageId不一样
      await sleep(100);
      // 加一条AI消息
      const aiMessage: Message = {
        role: 'assistant',
        content: '',
        modleId: curModelId,
        messageId: Date.now().toString(),
      };
      addMessage(aiMessage);
      // 调用SSE
      await requestLLM(curModelId, [...messageList, userMessage], {
        max_tokens: 1024,
        temperature: 0.2,
      });
      // 缓存持久化：消息列表
      localStorage.setItem(
        `MESSION_LIST_${curSessionId}`,
        JSON.stringify([
          ...messageList,
          userMessage,
          { ...aiMessage, content: answer.current },
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
          value={curModelId}
          onChange={setCurModelId}
          options={MODEL_OPTIONS}
          size="small"
          className={styles.modelSelect}
        />
        <Button
          className={styles.sendButton}
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!inputValue.trim()}
        >
          发送
        </Button>
      </div>
    </div>
  );
};

export default InputArea;
