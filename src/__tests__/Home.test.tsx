import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as sessionStore from '../stores/sessionStore';
import * as messageStore from '../stores/messageStore';
import Home from '../pages/home/index';

// Mock 子组件
vi.mock('../pages/home/components/SideBar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock('../pages/home/components/ChatContainer', () => ({
  default: () => <div data-testid="chat-container">ChatContainer</div>,
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Home Component', () => {
  beforeEach(() => {
    // 清理 localStorage
    localStorage.clear();

    // 重置所有 store
    sessionStore.useSessionStore.getState().setSessionList([]);
    sessionStore.useSessionStore.getState().setCurSessionId('');
    messageStore.useMessageStore.getState().setMessageList([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('应该在加载时显示 loading 状态', async () => {
    render(<Home />);
    // Home组件初始状态应该显示Spin组件作为loading状态
    // 通过测试，在加载状态下应该能找到.ant-spin元素
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('应该在加载完成后显示主界面', async () => {
    render(<Home />);
    
    // 等待加载完成，最多等待1.5秒
    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    }, { timeout: 1500 });
    
    expect(screen.getByTestId('chat-container')).toBeInTheDocument();
    // 确保loading状态已经消失
    expect(document.querySelector('.ant-spin')).not.toBeInTheDocument();
  });

  it('应该从 localStorage 恢复会话数据', async () => {
    // 准备测试数据
    const testSessions = [{ sessionId: '123' }];
    const testMessages = [
      {
        role: 'user',
        content: 'Hello',
        modelId: 'gpt-3.5-turbo',
        messageId: '456',
      },
    ];

    localStorage.setItem('SESSION_LIST', JSON.stringify(testSessions));
    localStorage.setItem('MESSION_LIST_123', JSON.stringify(testMessages));

    render(<Home />);
    
    // 等待数据加载完成
    await waitFor(() => {
      expect(sessionStore.useSessionStore.getState().sessionList).toHaveLength(1);
    }, { timeout: 1500 });

    // 验证 sessionStore 中的值是否正确
    expect(sessionStore.useSessionStore.getState().sessionList).toEqual(testSessions);
    
    // 验证 messageStore 中的值是否正确
    expect(messageStore.useMessageStore.getState().messageList).toEqual(testMessages);
  });
});