import styles from './index.module.less';
import InputArea from './InputArea';
import MessageArea from './MessageArea';

interface ChatContainerProps {}

const ChatContainer = () => {
  return (
    <div className={styles.chatContainer}>
      <MessageArea />
      <InputArea />
    </div>
  );
};

export default ChatContainer;
