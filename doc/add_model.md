## 如何新增第三方模型的指南

本文档介绍了如何在本项目中添加新的第三方模型。

#### 项目当前模型架构

目前项目采用字节跳动的火山引擎作为默认模型提供商，通过 API 请求与后端进行通信。模型相关的核心文件包括：

1. src/const/model.ts：定义模型选项和默认配置
2. src/types/model.d.ts：定义模型配置的TypeScript类型
3. src/stores/modelStore.ts：管理模型状态的 Zustand store
4. src/hooks/useRequest.ts：处理模型 API 请求的逻辑

#### 添加新模型的步骤

##### 1. 在模型选项中添加新模型

编辑src/const/model.ts文件，在MODEL_OPTIONS数组中添加新的模型选项：

```typescript
export const MODEL_OPTIONS = [
  { value: 'deepseek-v3-1-terminus', label: 'DeepSeek-V3' },
  { value: 'doubao-seed-1-6-251015', label: 'Doubao-Seed-1.6' },
  // 添加你的新模型
  { value: 'your-model-id', label: 'Your Model Name' },
];
```

##### 2. 如果需要支持不同的 API 提供商

如果需要接入其他模型提供商（如 OpenAI、Anthropic 等），需要修改src/hooks/useRequest.ts：

1. 修改请求 URL 的逻辑，根据模型 ID 判断应该使用的 API 端点
2. 根据不同提供商的 API 规范调整请求头和请求体格式
3. 处理不同的响应格式

##### 3. 调整模型配置表单（可选）

如新模型需特殊配置，可修改src/pages/home/components/SideBar/ConfigDialog/index.tsx组件，添加对应表单项。

##### 4. 处理不同模型的响应格式

不同模型提供商返回的数据格式可能不同，可能需要修改src/hooks/useRequest.ts中解析响应的部分。

#### 注意事项

1. 不同模型提供商的 API Key 格式和验证方式可能不同，请确保正确配置
2. 各模型对参数的支持情况不同，如 `temperature`、`max_tokens` 等参数的取值范围可能有差异
3. 流式输出的实现方式可能因提供商而异，需要针对性处理
4. 错误处理机制也需要根据不同提供商的错误响应格式做相应调整

#### 测试新模型

添加完新模型后，建议进行以下测试：

1. 模型是否能正常显示在模型选择下拉框中
2. 配置参数是否能正确保存和读取
3. API 请求能否成功发送
4. 响应内容能否正确解析并显示
5. 流式输出是否正常工作
6. 停止请求功能是否正常
