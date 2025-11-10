import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as messageStore from '../stores/messageStore';
import * as chatStore from '../stores/chatStore';
import * as modelStore from '../stores/modelStore';
import * as sessionStore from '../stores/sessionStore';
import InputArea from '../pages/home/components/ChatContainer/InputArea';

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
    Button: ({ children, onClick, disabled, type }: any) => (
      <button
        onClick={onClick}
        disabled={disabled}
        data-testid={`button-${type || 'default'}`}
      >
        {children}
      </button>
    ),
    Input: {
      TextArea: ({ value, onChange, onKeyDown, placeholder }: any) => (
        <textarea
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          data-testid="message-input"
        />
      ),
    },
    Select: ({ value, onChange, options }: any) => (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="model-select"
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ),
  };
});

vi.mock('@ant-design/icons', () => ({
  SendOutlined: () => <span>Send</span>,
  PauseCircleFilled: () => <span>Pause</span>,
}));

describe('Message Flow', () => {
  beforeEach(() => {
    // 清理 localStorage
    localStorage.clear();

    // 重置所有 store
    messageStore.useMessageStore.getState().setMessageList([]);
    chatStore.useChatStore.getState().setIsThinking(false);
    chatStore.useChatStore.getState().setIsTyping(false);
    modelStore.useModelStore.getState().setModelId('gpt-3.5-turbo');
    sessionStore.useSessionStore.getState().setCurSessionId('test-session-id');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('发送一个消息时，会展示正在思考中', async () => {
    // Mock 函数
    const mockRequestLLM = vi.fn();
    const mockStopRequest = vi.fn();
    const mockNewAnswer = { current: 'Mock AI response' };

    render(
      <InputArea
        newAnswer={mockNewAnswer}
        requestLLM={mockRequestLLM}
        stopRequest={mockStopRequest}
      />
    );

    // 输入消息
    const input = screen.getByTestId('message-input');
    fireEvent.change(input, { target: { value: 'Hello AI!' } });

    // 点击发送按钮
    const sendButton = screen.getByTestId('button-primary');
    await act(async () => {
      fireEvent.click(sendButton);
    });

    // 验证消息被添加到 store
    await waitFor(() => {
      const messageList = messageStore.useMessageStore.getState().messageList;
      expect(messageList).toHaveLength(2); // 用户消息 + AI 消息
      expect(messageList[0].role).toBe('user');
      expect(messageList[0].content).toBe('Hello AI!');
      expect(messageList[1].role).toBe('assistant');
    });

    // 验证调用了 requestLLM
    expect(mockRequestLLM).toHaveBeenCalled();
  });

  it('发送消息后经过一段时间，应该有新的 AI 消息渲染', async () => {
    // 设置 mock 函数模拟延迟
    const mockRequestLLM = vi.fn(async () => {
      chatStore.useChatStore.getState().setIsThinking(true);
      await new Promise((resolve) =>
        setTimeout(() => {
          chatStore.useChatStore.getState().setIsThinking(false);
          resolve({});
        }, 1000)
      );
    });
    const mockStopRequest = vi.fn();
    const mockNewAnswer = { current: 'Mock AI response' };

    render(
      <InputArea
        newAnswer={mockNewAnswer}
        requestLLM={mockRequestLLM}
        stopRequest={mockStopRequest}
      />
    );

    // 输入消息
    const input = screen.getByTestId('message-input');
    fireEvent.change(input, { target: { value: 'Hello AI!' } });

    // 点击发送按钮
    const sendButton = screen.getByTestId('button-primary');
    await act(async () => {
      fireEvent.click(sendButton);
    });

    // 验证初始状态是思考中
    // 等待状态更新
    await waitFor(
      () => {
        expect(chatStore.useChatStore.getState().isThinking).toBe(true);
      },
      { timeout: 1000 }
    );

    // 等待请求完成
    await waitFor(
      () => {
        expect(chatStore.useChatStore.getState().isThinking).toBe(false);
      },
      { timeout: 2000 }
    );

    // 验证消息列表包含 AI 回复
    const messageList = messageStore.useMessageStore.getState().messageList;
    expect(messageList).toHaveLength(2);
    // 检查 localStorage 中的内容
    const storedMessages = JSON.parse(
      localStorage.getItem('MESSION_LIST_test-session-id') || '[]'
    );
    expect(storedMessages[1].content).toBe('Mock AI response');
  });

  it('点击停止按钮时应该停止请求', async () => {
    // 模拟长时间运行的请求
    const mockRequestLLM = vi.fn(async () => {
      chatStore.useChatStore.getState().setIsThinking(true);
      await new Promise((resolve) =>
        setTimeout(() => {
          chatStore.useChatStore.getState().setIsThinking(false);
          resolve({});
        }, 100000)
      );
    });
    const mockStopRequest = vi.fn();
    const mockNewAnswer = { current: 'Mock AI response' };

    render(
      <InputArea
        newAnswer={mockNewAnswer}
        requestLLM={mockRequestLLM}
        stopRequest={mockStopRequest}
      />
    );

    // 输入消息
    const input = screen.getByTestId('message-input');
    fireEvent.change(input, { target: { value: 'Hello AI!' } });

    // 点击发送按钮
    const sendButton = screen.getByTestId('button-primary');
    await act(async () => {
      fireEvent.click(sendButton);
    });

    // 等待进入思考状态
    await waitFor(() => {
      expect(chatStore.useChatStore.getState().isThinking).toBe(true);
    });

    // 点击停止按钮
    const pauseButton = screen.getByText('停止'); // 使用文本而不是 testid
    await act(async () => {
      fireEvent.click(pauseButton);
    });

    // 验证停止函数被调用
    expect(mockStopRequest).toHaveBeenCalled();

    // 验证退出思考状态
    expect(chatStore.useChatStore.getState().isThinking).toBe(false);
  });

  it('当没有输入内容时，发送按钮应该被禁用', () => {
    const mockRequestLLM = vi.fn();
    const mockStopRequest = vi.fn();
    const mockNewAnswer = { current: 'Mock AI response' };

    render(
      <InputArea
        newAnswer={mockNewAnswer}
        requestLLM={mockRequestLLM}
        stopRequest={mockStopRequest}
      />
    );

    const sendButton = screen.getByText('发送'); // 使用文本而不是 testid
    expect(sendButton).toBeDisabled();

    // 输入内容后按钮应该启用
    const input = screen.getByTestId('message-input');
    fireEvent.change(input, { target: { value: 'Hello' } });

    expect(sendButton).not.toBeDisabled();
  });
});
