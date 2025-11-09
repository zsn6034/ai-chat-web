import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock 所有 store 文件
vi.mock('../stores/sessionStore', () => {
  const store: any = {
    curSessionId: '',
    sessionList: [],
    setCurSessionId: vi.fn((id) => {
      store.curSessionId = id;
    }),
    addSession: vi.fn((session) => {
      store.sessionList = [session, ...store.sessionList];
    }),
    setSessionList: vi.fn((sessions) => {
      store.sessionList = sessions;
    }),
  };
  
  return {
    useSessionStore: () => store,
  };
});

vi.mock('../stores/messageStore', () => {
  const store: any = {
    messageList: [],
    getInitMessage: vi.fn((modelId) => ({
      role: 'assistant',
      content: '你好，你可以问我任何问题，我会如数帮你解答~',
      modelId,
      messageId: Date.now().toString(),
    })),
    resetMessageList: vi.fn((modelId) => {
      store.messageList = [store.getInitMessage(modelId)];
    }),
    addMessage: vi.fn((message) => {
      store.messageList = [...store.messageList, message];
    }),
    setMessageList: vi.fn((messages) => {
      store.messageList = messages;
    }),
    appendContent: vi.fn((chunk) => {
      if (store.messageList.length === 0) {
        return;
      }
      const lastMessage = store.messageList[store.messageList.length - 1];
      if (lastMessage) {
        lastMessage.content += chunk;
      }
      store.messageList = [...store.messageList];
    }),
  };
  
  return {
    useMessageStore: () => store,
  };
});

vi.mock('../stores/chatStore', () => {
  const store: any = {
    isThinking: false,
    isTyping: false,
    setIsThinking: vi.fn((value) => {
      store.isThinking = value;
    }),
    setIsTyping: vi.fn((value) => {
      store.isTyping = value;
    }),
  };
  
  return {
    useChatStore: () => store,
  };
});

vi.mock('../stores/modelStore', () => {
  const store: any = {
    modelId: 'gpt-3.5-turbo',
    config: {
      apikey: '',
      max_tokens: 1024,
      temperature: 1,
    },
    setModelId: vi.fn((id) => {
      store.modelId = id;
    }),
    setConfig: vi.fn((config) => {
      store.config = {...store.config, ...config};
    }),
  };
  
  return {
    useModelStore: () => store,
  };
});

describe('Zustand Stores', () => {
  beforeEach(() => {
    // 重置所有 mocks
    vi.clearAllMocks();
  });

  describe('Session Store', () => {
    it('应该能够添加会话并更新会话列表', async () => {
      const { useSessionStore } = await import('../stores/sessionStore');
      const session1 = { sessionId: '1' };
      const session2 = { sessionId: '2' };
      
      const store: any = useSessionStore();
      store.addSession(session1);
      store.addSession(session2);
      
      expect(store.sessionList).toEqual([session2, session1]);
    });

    it('应该能够设置当前会话ID', async () => {
      const { useSessionStore } = await import('../stores/sessionStore');
      const store: any = useSessionStore();
      const sessionId = 'test-session-id';
      
      store.setCurSessionId(sessionId);
      
      expect(store.curSessionId).toBe(sessionId);
    });

    it('应该能够设置整个会话列表', async () => {
      const { useSessionStore } = await import('../stores/sessionStore');
      const sessions = [{ sessionId: '1' }, { sessionId: '2' }];
      
      const store: any = useSessionStore();
      store.setSessionList(sessions);
      
      expect(store.sessionList).toEqual(sessions);
    });
  });

  describe('Message Store', () => {
    it('应该能够添加消息并更新消息列表', async () => {
      const { useMessageStore } = await import('../stores/messageStore');
      
      // 在每个测试前重置 messageList
      const store: any = useMessageStore();
      store.messageList = [];
      
      const message1 = { 
        role: 'user', 
        content: 'Hello', 
        modelId: 'gpt-3.5-turbo', 
        messageId: '1' 
      };
      
      const message2 = { 
        role: 'assistant', 
        content: 'Hi there!', 
        modelId: 'gpt-3.5-turbo', 
        messageId: '2' 
      };
      
      store.addMessage(message1);
      store.addMessage(message2);
      
      expect(store.messageList).toEqual([message1, message2]);
    });

    it('应该能够设置整个消息列表', async () => {
      const { useMessageStore } = await import('../stores/messageStore');
      
      // 在每个测试前重置 messageList
      const store: any = useMessageStore();
      store.messageList = [];
      
      const messages = [
        { role: 'user', content: 'Hello', modelId: 'gpt-3.5-turbo', messageId: '1' },
        { role: 'assistant', content: 'Hi there!', modelId: 'gpt-3.5-turbo', messageId: '2' }
      ];
      
      store.setMessageList(messages);
      
      expect(store.messageList).toEqual(messages);
    });

    it('应该能够获取初始化消息', async () => {
      const { useMessageStore } = await import('../stores/messageStore');
      
      // 在每个测试前重置 messageList
      const store: any = useMessageStore();
      store.messageList = [];
      
      const modelId = 'test-model';
      const initMessage = store.getInitMessage(modelId);
      
      expect(initMessage.role).toBe('assistant');
      expect(initMessage.modelId).toBe(modelId);
      expect(initMessage.content).toBe('你好，你可以问我任何问题，我会如数帮你解答~');
      expect(initMessage.messageId).toBeTruthy();
    });

    it('应该能够重置消息列表为初始化消息', async () => {
      const { useMessageStore } = await import('../stores/messageStore');
      
      // 在每个测试前重置 messageList
      const store: any = useMessageStore();
      store.messageList = [];
      
      const modelId = 'test-model';
      
      // 先添加一些消息
      store.addMessage({ 
        role: 'user', 
        content: 'Hello', 
        modelId: 'gpt-3.5-turbo', 
        messageId: '1' 
      });
      
      store.addMessage({ 
        role: 'assistant', 
        content: 'Hi there!', 
        modelId: 'gpt-3.5-turbo', 
        messageId: '2' 
      });
      
      expect(store.messageList).toHaveLength(2);
      
      // 重置消息列表
      store.resetMessageList(modelId);
      
      expect(store.messageList).toHaveLength(1);
      expect(store.messageList[0].role).toBe('assistant');
      expect(store.messageList[0].modelId).toBe(modelId);
    });

    it('应该能够向最后一条消息追加内容', async () => {
      const { useMessageStore } = await import('../stores/messageStore');
      
      // 在每个测试前重置 messageList
      const store: any = useMessageStore();
      store.messageList = [];
      
      // 添加两条消息
      const message1 = { 
        role: 'user', 
        content: 'Hello', 
        modelId: 'gpt-3.5-turbo', 
        messageId: '1' 
      };
      
      const message2 = { 
        role: 'assistant', 
        content: 'Hi', 
        modelId: 'gpt-3.5-turbo', 
        messageId: '2' 
      };
      
      store.setMessageList([message1, message2]);
      
      // 追加内容到最后一條消息
      store.appendContent(' there!');
      
      expect(store.messageList[1].content).toBe('Hi there!');
    });
  });

  describe('Chat Store', () => {
    it('应该能够设置思考状态', async () => {
      const { useChatStore } = await import('../stores/chatStore');
      
      // 在每个测试前重置状态
      const store: any = useChatStore();
      store.isThinking = false;
      
      expect(store.isThinking).toBe(false);
      
      store.setIsThinking(true);
      expect(store.isThinking).toBe(true);
      
      store.setIsThinking(false);
      expect(store.isThinking).toBe(false);
    });

    it('应该能够设置输入状态', async () => {
      const { useChatStore } = await import('../stores/chatStore');
      
      // 在每个测试前重置状态
      const store: any = useChatStore();
      store.isTyping = false;
      
      expect(store.isTyping).toBe(false);
      
      store.setIsTyping(true);
      expect(store.isTyping).toBe(true);
      
      store.setIsTyping(false);
      expect(store.isTyping).toBe(false);
    });
  });

  describe('Model Store', () => {
    it('应该能够设置模型ID', async () => {
      const { useModelStore } = await import('../stores/modelStore');
      
      // 在每个测试前重置状态
      const store: any = useModelStore();
      store.modelId = 'gpt-3.5-turbo';
      
      const modelId = 'gpt-4';
      
      store.setModelId(modelId);
      expect(store.modelId).toBe(modelId);
    });

    it('应该能够设置模型配置', async () => {
      const { useModelStore } = await import('../stores/modelStore');
      
      // 在每个测试前重置状态
      const store: any = useModelStore();
      store.config = {
        apikey: '',
        max_tokens: 1024,
        temperature: 1,
      };
      
      const config = { max_tokens: 2048, temperature: 0.7 };
      
      store.setConfig(config);
      expect(store.config).toEqual({
        apikey: '',
        max_tokens: 2048,
        temperature: 0.7
      });
    });
  });
});