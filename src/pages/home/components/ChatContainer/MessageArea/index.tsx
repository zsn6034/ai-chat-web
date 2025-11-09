import UserBubble from '../UserBubble';
import AIBubble from '../AIBubble';
import ThinkBubble from '../ThinkBubble';
import styles from './index.module.less';
import { useMessageStore } from '@/stores/messageStore';
import { useChatStore } from '@/stores/chatStore';
import { useModelStore } from '@/stores/modelStore';
import { useSessionStore } from '@/stores/sessionStore';
import { Button } from 'antd';
import type { ApiMessage, RequestOptions } from '@/types/api';
import { MODEL_MAP } from '@/const/model';

interface MessageAreaProps {
  newAnswer: React.RefObject<string>;
  requestLLM: (
    modelId: string,
    messages: ApiMessage[],
    options: RequestOptions
  ) => Promise<void>;
}

const MessageArea: React.FC<MessageAreaProps> = ({ newAnswer, requestLLM }) => {
  const { messageList, setMessageList } = useMessageStore();
  const { isThinking, isTyping } = useChatStore();
  const { curSessionId } = useSessionStore();
  const { modelId } = useModelStore();
  const { config } = useModelStore();

  const handleRetry = async () => {
    if (messageList.length < 2) return;
    // 最后一个AI消息重置
    const aiMessage = messageList[messageList.length - 1];
    aiMessage.content = '';
    aiMessage.messageId = Date.now().toString();
    setMessageList([...messageList.slice(0, -1), aiMessage]);
    const userMessage = messageList[messageList.length - 2];
    // 调用SSE
    await requestLLM(modelId, [...messageList, userMessage], {
      max_tokens: config.max_tokens,
      temperature: config.temperature,
    });
    // 缓存持久化：消息列表
    localStorage.setItem(
      `MESSION_LIST_${curSessionId}`,
      JSON.stringify([
        ...messageList.slice(0, -1),
        { ...aiMessage, content: newAnswer.current },
      ])
    );
  };

  return (
    <div className={styles.messageArea}>
      {messageList.map((message, index) => {
        if (message.role === 'user') {
          return <UserBubble key={message.messageId} text={message.content} />;
        }
        if (message.role === 'assistant' && message.content.length > 0) {
          return (
            <>
              <div className={styles.modelName}>
                模型名称：{MODEL_MAP[message.modelId]}
              </div>
              <AIBubble
                key={message.messageId}
                text={message.content}
                isStreaming={index === messageList.length - 1 && isTyping}
              />
            </>
          );
        }
        return null;
      })}
      {isThinking && <ThinkBubble />}
      {!isThinking && !isTyping && messageList.length > 2 && (
        <Button className={styles.retry} type="link" onClick={handleRetry}>
          重新生成
        </Button>
      )}
    </div>
  );
};

export default MessageArea;
