import { useSessionStore } from '@/stores/sessionStore';
import styles from './index.module.less';
import InputArea from './InputArea';
import MessageArea from './MessageArea';
import { Empty } from 'antd';
import { useRequest } from '@/hooks/useRequest';

const ChatContainer = () => {
  const { sessionList } = useSessionStore();
  const { answer, requestLLM, stop } = useRequest();

  return (
    <div className={styles.chatContainer}>
      {sessionList.length > 0 ? (
        <>
          <MessageArea newAnswer={answer} requestLLM={requestLLM} />
          <InputArea
            newAnswer={answer}
            requestLLM={requestLLM}
            stopRequest={stop}
          />
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
