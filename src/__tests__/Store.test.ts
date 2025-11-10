import { describe, it, expect, beforeEach } from 'vitest';
import { useSessionStore } from '../stores/sessionStore';
import { useMessageStore } from '../stores/messageStore';
import { useChatStore } from '../stores/chatStore';
import { useModelStore } from '../stores/modelStore';
import { MODEL_OPTIONS } from '../const/model';
import type { Message } from '@/types/message';

describe('Zustand Stores', () => {
  // 在每次测试前重置所有 store 到初始状态
  beforeEach(() => {
    // 重置 session store
    useSessionStore.getState().setCurSessionId('');
    useSessionStore.getState().setSessionList([]);

    // 重置 message store
    useMessageStore.getState().setMessageList([]);

    // 重置 chat store
    useChatStore.getState().setIsThinking(false);
    useChatStore.getState().setIsTyping(false);

    // 重置 model store
    useModelStore.getState().setModelId(MODEL_OPTIONS[0].value);
    useModelStore.getState().setConfig({
      apikey: '',
      max_tokens: 1024,
      temperature: 1,
    });
  });

  describe('Session Store', () => {
    it('应该能够添加会话并更新会话列表', () => {
      const session1 = { sessionId: '1' } as any;
      const session2 = { sessionId: '2' } as any;

      useSessionStore.getState().addSession(session1);
      useSessionStore.getState().addSession(session2);

      expect(useSessionStore.getState().sessionList).toEqual([
        session2,
        session1,
      ]);
    });

    it('应该能够设置当前会话ID', () => {
      const sessionId = 'test-session-id';

      useSessionStore.getState().setCurSessionId(sessionId);

      expect(useSessionStore.getState().curSessionId).toBe(sessionId);
    });

    it('应该能够设置整个会话列表', () => {
      const sessions = [{ sessionId: '1' }, { sessionId: '2' }] as any;

      useSessionStore.getState().setSessionList(sessions);

      expect(useSessionStore.getState().sessionList).toEqual(sessions);
    });
  });

  describe('Message Store', () => {
    it('应该能够添加消息并更新消息列表', () => {
      const message1: Message = {
        role: 'user',
        content: 'Hello',
        modelId: 'gpt-3.5-turbo',
        messageId: '1',
      };

      const message2: Message = {
        role: 'assistant',
        content: 'Hi there!',
        modelId: 'gpt-3.5-turbo',
        messageId: '2',
      };

      useMessageStore.getState().addMessage(message1);
      useMessageStore.getState().addMessage(message2);

      expect(useMessageStore.getState().messageList).toEqual([
        message1,
        message2,
      ]);
    });

    it('应该能够设置整个消息列表', () => {
      const messages = [
        {
          role: 'user',
          content: 'Hello',
          modelId: 'gpt-3.5-turbo',
          messageId: '1',
        },
        {
          role: 'assistant',
          content: 'Hi there!',
          modelId: 'gpt-3.5-turbo',
          messageId: '2',
        },
      ] as any;

      useMessageStore.getState().setMessageList(messages);

      expect(useMessageStore.getState().messageList).toEqual(messages);
    });

    it('应该能够获取初始化消息', () => {
      const modelId = 'test-model';
      const initMessage = useMessageStore.getState().getInitMessage(modelId);

      expect(initMessage.role).toBe('assistant');
      expect(initMessage.modelId).toBe(modelId);
      expect(initMessage.content).toBe(
        '你好，你可以问我任何问题，我会如数帮你解答~'
      );
      expect(initMessage.messageId).toBeTruthy();
    });

    it('应该能够重置消息列表为初始化消息', () => {
      const modelId = 'test-model';

      // 先添加一些消息
      useMessageStore.getState().addMessage({
        role: 'user',
        content: 'Hello',
        modelId: 'gpt-3.5-turbo',
        messageId: '1',
      } as any);

      useMessageStore.getState().addMessage({
        role: 'assistant',
        content: 'Hi there!',
        modelId: 'gpt-3.5-turbo',
        messageId: '2',
      } as any);

      expect(useMessageStore.getState().messageList).toHaveLength(2);

      // 重置消息列表
      useMessageStore.getState().resetMessageList(modelId);

      expect(useMessageStore.getState().messageList).toHaveLength(1);
      expect(useMessageStore.getState().messageList[0].role).toBe('assistant');
      expect(useMessageStore.getState().messageList[0].modelId).toBe(modelId);
    });

    it('应该能够向最后一条消息追加内容', () => {
      // 添加两条消息
      const message1 = {
        role: 'user',
        content: 'Hello',
        modelId: 'gpt-3.5-turbo',
        messageId: '1',
      };

      const message2 = {
        role: 'assistant',
        content: 'Hi',
        modelId: 'gpt-3.5-turbo',
        messageId: '2',
      };

      useMessageStore
        .getState()
        .setMessageList([message1 as any, message2 as any]);

      // 追加内容到最后一條消息
      useMessageStore.getState().appendContent(' there!');

      expect(useMessageStore.getState().messageList[1].content).toBe(
        'Hi there!'
      );
    });
  });

  describe('Chat Store', () => {
    it('应该能够设置思考状态', () => {
      expect(useChatStore.getState().isThinking).toBe(false);

      useChatStore.getState().setIsThinking(true);
      expect(useChatStore.getState().isThinking).toBe(true);

      useChatStore.getState().setIsThinking(false);
      expect(useChatStore.getState().isThinking).toBe(false);
    });

    it('应该能够设置输入状态', () => {
      expect(useChatStore.getState().isTyping).toBe(false);

      useChatStore.getState().setIsTyping(true);
      expect(useChatStore.getState().isTyping).toBe(true);

      useChatStore.getState().setIsTyping(false);
      expect(useChatStore.getState().isTyping).toBe(false);
    });
  });

  describe('Model Store', () => {
    it('应该能够设置模型ID', () => {
      const modelId = 'gpt-4';

      useModelStore.getState().setModelId(modelId);
      expect(useModelStore.getState().modelId).toBe(modelId);
    });

    it('应该能够设置模型配置', () => {
      const config = {
        apikey: '',
        max_tokens: 2048,
        temperature: 0.7,
      } as any;

      useModelStore.getState().setConfig(config);
      expect(useModelStore.getState().config).toEqual({
        apikey: '',
        max_tokens: 2048,
        temperature: 0.7,
      });
    });
  });
});
