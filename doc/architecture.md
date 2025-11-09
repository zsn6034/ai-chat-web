## 技术选型

本项目是一个基于现代前端技术栈构建的AI聊天Web应用程序，采用了以下关键技术：

#### 核心框架与语言

- **React 18**：作为核心前端框架，利用其最新的特性如并发渲染等提升用户体验
- **TypeScript**：为JavaScript添加静态类型检查，提高代码质量和开发效率
- **Vite**：现代化的构建工具，提供快速的开发环境和优化的生产构建

#### 状态管理

- **Zustand**：轻量级的状态管理库，用于管理应用的各种状态。选用理由主要是：

1. **简洁易用**：API简单，样板代码少，学习和开发成本低（无需provider）
2. **TypeScript支持好**：与TypeScript集成良好，能够提供完整的类型推导和检查
3. **React友好**：专门为React设计，提供了React Hooks接口，使用起来非常自然
4. **性能优秀**：内置了合理的重渲染控制机制，避免不必要的组件更新
5. **符合项目规模**：对于中小型项目而言，Zustand提供的功能完全足够，同时避免了过度设计

#### UI组件库与样式

- **Ant Design**：企业级UI设计语言和React组件库，提供丰富的界面组件
- **Less**：CSS预处理器，提供变量、嵌套等高级功能增强样式编写体验

#### 开发工具链

- **ESLint & Prettier**：代码质量检查和格式化工具，保证代码风格统一
- **Vitest**：基于Vite的单元测试框架，提供快速的测试执行环境

## 架构说明

#### 整体架构分层

项目采用分层架构设计，各层之间职责明确，便于维护和扩展：

```
src/
├── components/           # 公共组件层
├── pages/               # 页面组件层
├── stores/              # 状态管理层
├── hooks/               # 自定义Hooks层
├── types/               # TypeScript类型定义层
├── utils/               # 工具函数层
└── const/               # 常量定义层
```

#### 组件（Components）

- **公共层组件**：公共复用，如主题配置容器ThemeProvider
- **页面内组件**：页面维度管理，如侧边栏SideBar，对话区
  ChatContainer，以及其下属的其余组件

#### 状态管理（Store）

使用Zustand作为状态管理方案，按业务模块拆分成多个独立store：

- chatStore：管理聊天过程中的状态，如是否正在思考、是否正在输入等
- sessionStore：管理会话相关状态，如当前会话ID、会话列表等
- messageStore：管理消息列表及相关的操作方法
- modelStore：管理模型配置相关信息

每个store都是独立的，遵循单一职责原则，便于维护和测试。

#### Hooks

自定义Hooks封装了可复用的逻辑，包括：

- useRequest：封装与后端API通信的逻辑，处理流式响应
- useTheme：处理主题切换逻辑
- useTypewriter：实现AI模型回答的打字机效果

#### TypeScript定义

所有TypeScript类型定义集中放在types目录下维护，按业务实体分类：

- api.d.ts：API请求和响应
- chat.d.ts：聊天相关
- message.d.ts：消息相关
- session.d.ts：会话相关
- model.d.ts：模型相关
