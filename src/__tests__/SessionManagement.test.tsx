import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as sessionStore from '../stores/sessionStore';
import * as messageStore from '../stores/messageStore';
import * as chatStore from '../stores/chatStore';
import AddOne from '../pages/home/components/SideBar/AddOne';

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

// Mock antd 组件
vi.mock('antd', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    Button: ({ children, onClick, disabled }: any) => (
      <button
        onClick={onClick}
        disabled={disabled}
        data-testid="add-session-button"
      >
        {children}
      </button>
    ),
    Empty: ({ description }: any) => <div>{description}</div>,
  };
});

vi.mock('@ant-design/icons', () => ({
  PlusOutlined: () => <span>+</span>,
}));

describe('Session Management', () => {
  beforeEach(() => {
    // 清理 localStorage
    localStorage.clear();

    // 重置所有 store
    sessionStore.useSessionStore.getState().setSessionList([]);
    sessionStore.useSessionStore.getState().setCurSessionId('');
    messageStore.useMessageStore.getState().setMessageList([]);
    chatStore.useChatStore.getState().setIsThinking(false);
    chatStore.useChatStore.getState().setIsTyping(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('新增一个会话时，sessionList会新增一个项', () => {
    render(<AddOne />);

    // 初始状态应该是空的
    expect(sessionStore.useSessionStore.getState().sessionList).toHaveLength(0);

    // 点击新增按钮
    const addButton = screen.getByTestId('add-session-button');
    fireEvent.click(addButton);

    // 验证 sessionList 增加了一个项
    expect(sessionStore.useSessionStore.getState().sessionList).toHaveLength(1);
    expect(sessionStore.useSessionStore.getState().curSessionId).toBeTruthy();
  });

  it('新增会话时应该设置当前会话ID', () => {
    render(<AddOne />);

    const addButton = screen.getByTestId('add-session-button');
    fireEvent.click(addButton);

    const { curSessionId, sessionList } =
      sessionStore.useSessionStore.getState();
    expect(sessionList[0].sessionId).toBe(curSessionId);
  });

  it('当正在思考或输入时，新增会话按钮应该被禁用', () => {
    chatStore.useChatStore.getState().setIsThinking(true);

    render(
      <div>
        <AddOne />
      </div>
    );

    const addButton = screen.getByTestId('add-session-button');
    expect(addButton).toBeDisabled();
  });
});
