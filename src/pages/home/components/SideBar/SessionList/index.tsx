import styles from './index.module.less';
import { useSessionStore } from '@/stores/sessionStore';
import { useMessageStore } from '@/stores/messageStore';
import type { Message } from '@/types/message';
import { Empty } from 'antd';

const SessionList = () => {
  const { curSessionId, sessionList, setCurSessionId } = useSessionStore();
  const { setMessageList } = useMessageStore();

  // 切换会话
  const handleSelect = (sessionId: string) => {
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

  return (
    <div className={styles.sessionList}>
      {sessionList.length > 0 ? (
        sessionList.map((session) => (
          <div
            key={session.sessionId}
            className={`${styles.sessionItem} ${
              curSessionId === session.sessionId ? styles.active : ''
            }`}
            onClick={() => handleSelect(session.sessionId)}
          >
            {session.sessionId}
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
