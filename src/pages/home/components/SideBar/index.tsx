import styles from './index.module.less';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import SessionList from './SessionList';
import FooterConfig from './FooterConfig';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.addOne}>
        <Button className={styles.btn} type="primary" icon={<PlusOutlined />}>
          新增会话
        </Button>
      </div>
      <SessionList />
      <FooterConfig />
    </div>
  );
};

export default Sidebar;
