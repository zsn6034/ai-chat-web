import { Button } from 'antd';
import styles from './index.module.less';
import { useSessionStore } from '@/stores/sessionStore';
import { PlusOutlined } from '@ant-design/icons';
import { useMessageStore } from '@/stores/messageStore';
import { useModelStore } from '@/stores/modelStore';

const SessionList = () => {
  const { sessionList, addSession, setCurSessionId } = useSessionStore();
  const { getInitMessage, resetMessageList } = useMessageStore();
  const { curModelId } = useModelStore();
  const handleAddSession = () => {
    const newSession = { sessionId: Date.now().toString() };
    addSession(newSession);
    setCurSessionId(newSession.sessionId);
    try {
      // 缓存持久化：会话列表
      localStorage.setItem(
        'SESSION_LIST',
        JSON.stringify([newSession, ...sessionList])
      );
      // 重置消息列表
      resetMessageList(curModelId);
      // 缓存持久化：消息列表
      localStorage.setItem(
        `MESSION_LIST_${newSession.sessionId}`,
        JSON.stringify([getInitMessage(curModelId)])
      );
    } catch (error) {
      console.error(
        'HandleAddSession Error saving sessionList to localStorage:',
        error
      );
    }
  };

  return (
    <div className={styles.addOne}>
      <Button
        className={styles.btn}
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddSession}
      >
        新增会话
      </Button>
    </div>
  );
};

export default SessionList;
