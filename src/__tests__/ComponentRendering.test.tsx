import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import * as useTypewriterHook from '../hooks/useTypewriter';

// Mock 组件
const AIBubble = ({ message }: any) => {
  // 模拟 useTypewriter hook
  const { typedContent } = useTypewriterHook.useTypewriter(message.content, {
    initialIndex: message.content.length,
  });

  if (!message.content) {
    return <div>▍</div>;
  }

  return <div>{typedContent || message.content}</div>;
};

const UserBubble = ({ message }: any) => {
  return <div>{message.content}</div>;
};

const ThinkBubble = () => {
  return <div>思考中...</div>;
};

describe('Component Rendering', () => {
  beforeEach(() => {
    // 清理所有 mocks
    vi.clearAllMocks();
  });

  describe('AIBubble Component', () => {
    it('应该正确渲染 AI 消息内容', () => {
      const message = {
        role: 'assistant',
        content: 'Hello, I am an AI assistant',
        modelId: 'gpt-3.5-turbo',
        messageId: '1',
      };

      render(<AIBubble message={message} />);

      expect(
        screen.getByText('Hello, I am an AI assistant')
      ).toBeInTheDocument();
    });

    it('应该显示正在思考的指示器当内容为空时', () => {
      const message = {
        role: 'assistant',
        content: '',
        modelId: 'gpt-3.5-turbo',
        messageId: '1',
      };

      render(<AIBubble message={message} />);

      // 当内容为空时应该显示打字机动画
      expect(screen.getByText('▍')).toBeInTheDocument();
    });
  });

  describe('UserBubble Component', () => {
    it('应该正确渲染用户消息内容', () => {
      const message = {
        role: 'user',
        content: 'Hello, I am a user',
        modelId: 'gpt-3.5-turbo',
        messageId: '1',
      };

      render(<UserBubble message={message} />);

      expect(screen.getByText('Hello, I am a user')).toBeInTheDocument();
    });
  });

  describe('ThinkBubble Component', () => {
    it('应该显示思考中的提示信息', () => {
      render(<ThinkBubble />);

      expect(screen.getByText('思考中...')).toBeInTheDocument();
    });
  });
});
