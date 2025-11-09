import { useTheme } from '@/hooks/useTheme';
import styles from './index.module.less';
import { Switch } from 'antd';
import { SettingFilled } from '@ant-design/icons';
import ConfigDialog from '../ConfigDialog';
import { useState } from 'react';
import type { ModelConfig } from '@/types/model';
import { useModelStore } from '@/stores/modelStore';

const FooterConfig = () => {
  const { theme, toggleTheme } = useTheme();
  const [openConfig, setOpenConfig] = useState(false);
  const { config, setConfig } = useModelStore();

  const handleOk = (values: ModelConfig) => {
    setOpenConfig(false);
    setConfig(values);
    // 缓存持久化：模型配置
    try {
      localStorage.setItem('MODEL_CONFIG', JSON.stringify(values));
    } catch (error) {
      console.error('Failed to save model config to local storage', error);
    }
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
      <SettingFilled
        className={styles.setting}
        onClick={() => setOpenConfig(true)}
      />
      <ConfigDialog
        open={openConfig}
        initValues={config}
        onOk={handleOk}
        onCancel={() => setOpenConfig(false)}
      />
    </div>
  );
};

export default FooterConfig;
