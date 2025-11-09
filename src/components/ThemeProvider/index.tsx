import { useMemo, useState } from 'react';
import { ConfigProvider as AntdConfigProvider } from 'antd';
import { ThemeContext } from '@/hooks/useTheme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    console.log('savedTheme', savedTheme);
    return savedTheme || 'light';
  });

  // 获取自定义主题变量
  const customThemeVar = useMemo(() => {
    // 强制在读取变量前应用主题
    document.documentElement.setAttribute('data-theme', theme);
    const rootStyles = getComputedStyle(document.documentElement);
    return {
      colorPrimary:
        rootStyles.getPropertyValue('--bg-primary').trim() || '#eb3434',
      textPrimaryColor:
        rootStyles.getPropertyValue('--text-primary').trim() || '#f9fafb',
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AntdConfigProvider
        theme={{
          // 全局token
          token: {
            colorPrimary: customThemeVar.colorPrimary,
          },
          // 组件token
          components: {
            Button: {
              primaryShadow: '',
            },
            Switch: {},
            Input: {
              activeShadow: '',
            },
            Select: {
              optionSelectedColor: customThemeVar.textPrimaryColor,
            },
          },
        }}
      >
        {children}
      </AntdConfigProvider>
    </ThemeContext.Provider>
  );
};
