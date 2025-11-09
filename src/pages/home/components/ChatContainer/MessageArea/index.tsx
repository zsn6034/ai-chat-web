import UserBubble from '../UserBubble';
import AIBubble from '../AIBubble';
import styles from './index.module.less';
import { useMessageStore } from '@/stores/messageStore';
import { useChatStore } from '@/stores/chatStore';
import ThinkBubble from '../ThinkBubble';
import { useEffect } from 'react';

const MessageArea = () => {
  const { messageList } = useMessageStore();
  const { isThinking } = useChatStore();

  useEffect(() => {
    console.log('messageList=', messageList);
  }, [messageList]);

  return (
    <div className={styles.messageArea}>
      {messageList.map((message, index) => {
        if (message.role === 'user') {
          return <UserBubble key={message.messageId} text={message.content} />;
        }
        if (message.role === 'assistant' && message.content.length > 0) {
          return (
            <AIBubble
              key={message.messageId}
              text={message.content}
              isStreaming={index === messageList.length - 1}
            />
          );
        }
        return null;
      })}
      {isThinking && <ThinkBubble />}
    </div>
  );
};

export default MessageArea;
