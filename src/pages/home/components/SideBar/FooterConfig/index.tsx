import { useTheme } from '@/hooks/useTheme';
import styles from './index.module.less';
import { Switch } from 'antd';
import { SettingFilled } from '@ant-design/icons';

const FooterConfig = () => {
  const { theme, toggleTheme } = useTheme();

  const handleClickSetting = () => {
    console.log('click setting');
  };

  return (
    <div className={styles.footerConfig}>
      <Switch
        className={styles.switch}
        onChange={toggleTheme}
        checkedChildren="☀️"
        unCheckedChildren="🌙"
        checked={theme === 'light'}
      />
      <SettingFilled className={styles.setting} onClick={handleClickSetting} />
    </div>
  );
};

export default FooterConfig;
