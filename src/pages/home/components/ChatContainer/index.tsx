import { useSessionStore } from '@/stores/sessionStore';
import styles from './index.module.less';
import InputArea from './InputArea';
import MessageArea from './MessageArea';
import { useEffect } from 'react';
import { Empty } from 'antd';

interface ChatContainerProps {}

const ChatContainer = () => {
  const { sessionList } = useSessionStore();

  useEffect(() => {
    console.log('ChatContainer...');
  }, []);

  return (
    <div className={styles.chatContainer}>
      {sessionList.length > 0 ? (
        <>
          <MessageArea />
          <InputArea />
        </>
      ) : (
        <Empty
          className={styles.empty}
          description="暂无会话，请先新增一个会话"
        />
      )}
    </div>
  );
};

export default ChatContainer;
