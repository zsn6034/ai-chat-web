import styles from './index.module.less';
import Sidebar from './components/SideBar';
import ChatContainer from '@/pages/home/components/ChatContainer';
import { useEffect, useState } from 'react';
import { useSessionStore } from '@/stores/sessionStore';
import type { Message } from '@/types/message';
import { useMessageStore } from '@/stores/messageStore';
import type { ModelConfig } from '@/types/model';
import { useModelStore } from '@/stores/modelStore';
import { DEFALUT_MODEL_CONFIG } from '@/const/model';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { sleep } from '@/utils';

function Home() {
  const { setConfig } = useModelStore();
  const { setCurSessionId, setSessionList } = useSessionStore();
  const { setMessageList } = useMessageStore();
  const [loading, setLoading] = useState(true);

  // 加载（从缓存中恢复）
  const initData = async () => {
    try {
      // 模拟等待1s（让loading效果明显些）
      await sleep(1000);
      // 模型配置
      const cacheModelConfig: ModelConfig =
        JSON.parse(localStorage.getItem('MODEL_CONFIG') || 'null') ||
        DEFALUT_MODEL_CONFIG;
      setConfig(cacheModelConfig);
      // 会话列表
      const cacheSessionList: Session[] = JSON.parse(
        localStorage.getItem('SESSION_LIST') || '[]'
      );
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
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    initData();
  }, []);

  return (
    <div className={styles.home}>
      {loading ? (
        <Spin
          className={styles.loading}
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        />
      ) : (
        <>
          <Sidebar />
          <ChatContainer />
        </>
      )}
    </div>
  );
}

export default Home;
