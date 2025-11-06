import styles from './index.module.less';
import Sidebar from './components/SideBar';
import ChatContainer from '@/pages/home/components/ChatContainer';

function Home() {
  return (
    <div className={styles.home}>
      <Sidebar />
      <ChatContainer />
    </div>
  );
}

export default Home;
