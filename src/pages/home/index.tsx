import styles from './index.module.less';
import Sidebar from './components/SideBar';
import ChatContainer from '@/pages/home/components/ChatContainer';
import { useEffect } from 'react';
import { useSessionStore } from '@/stores/sessionStore';
import type { Message } from '@/types/message';
import { useMessageStore } from '@/stores/messageStore';
import type { ModelConfig } from '@/types/model';
import { useModelStore } from '@/stores/modelStore';
import { DEFALUT_MODEL_CONFIG } from '@/const/model';

function Home() {
  const { setConfig } = useModelStore();
  const { setCurSessionId, setSessionList } = useSessionStore();
  const { setMessageList } = useMessageStore();

  // 加载（从缓存中恢复）
  useEffect(() => {
    try {
      // 模型配置
      const cacheModelConfig: ModelConfig =
        JSON.parse(localStorage.getItem('MODEL_CONFIG') || 'null') ||
        DEFALUT_MODEL_CONFIG;
      setConfig(cacheModelConfig);
      // 会话列表
      const cacheSessionList: Session[] = JSON.parse(
        localStorage.getItem('SESSION_LIST') || '[]'
      );
      console.log('cacheSessionList!!', cacheSessionList);
      setSessionList(cacheSessionList);
      // 消息列表
      if (cacheSessionList.length > 0) {
        setCurSessionId(cacheSessionList[0].sessionId);
        const cacheMessageList: Message[] = JSON.parse(
          localStorage.getItem(
            `MESSION_LIST_${cacheSessionList[0].sessionId}`
          ) || '[]'
        );
        setMessageList(cacheMessageList);
      }
    } catch (error) {
      console.error('Load Error parsing sessionList from localStorage:', error);
    }
  }, []);

  return (
    <div className={styles.home}>
      <Sidebar />
      <ChatContainer />
    </div>
  );
}

export default Home;
