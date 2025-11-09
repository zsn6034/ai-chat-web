import styles from './index.module.less';
import AddOne from './AddOne';
import SessionList from './SessionList';
import FooterConfig from './FooterConfig';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <AddOne />
      <SessionList />
      <FooterConfig />
    </div>
  );
};

export default Sidebar;
