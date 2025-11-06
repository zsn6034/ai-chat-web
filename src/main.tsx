import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/components/ThemeProvider';
import '@/global.less';
import Home from '@/pages/home';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  </StrictMode>
);
