import styles from './index.module.less';
import { useSessionStore } from '@/stores/sessionStore';
import { useMessageStore } from '@/stores/messageStore';
import type { Message } from '@/types/message';
import { Empty } from 'antd';
import { useChatStore } from '@/stores/chatStore';
import { useMemo } from 'react';

const SessionList = () => {
  const { curSessionId, sessionList, setCurSessionId } = useSessionStore();
  const { setMessageList } = useMessageStore();
  const { isThinking, isTyping } = useChatStore();

  const isDisable = useMemo(
    () => isThinking || isTyping,
    [isThinking, isTyping]
  );

  // 切换会话
  const handleSelect = (sessionId: string) => {
    if (isDisable) return;
    setCurSessionId(sessionId);
    // 从缓存中恢复
    try {
      const cacheMessageList: Message[] = JSON.parse(
        localStorage.getItem(`MESSION_LIST_${sessionId}`) || '[]'
      );
      setMessageList(cacheMessageList);
    } catch (error) {
      console.error(
        'HandleSelect Error parsing sessionList from localStorage:',
        error
      );
    }
  };

  const renderTime = (timestamp: string) => {
    const date = new Date(Number(timestamp));
    const title = `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return title;
  };

  return (
    <div className={styles.sessionList}>
      {sessionList.length > 0 ? (
        sessionList.map((session) => (
          <div
            key={session.sessionId}
            className={`${styles.sessionItem} ${
              curSessionId === session.sessionId ? styles.active : ''
            } ${isDisable ? styles.disable : ''}`}
            onClick={() => handleSelect(session.sessionId)}
          >
            {renderTime(session.sessionId)}
          </div>
        ))
      ) : (
        <Empty
          className={styles.empty}
          description="暂无会话，请先新增一个会话"
        />
      )}
    </div>
  );
};

export default SessionList;
