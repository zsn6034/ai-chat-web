import { useState } from 'react';
import { Button, Select, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import styles from './index.module.less';

const InputArea = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  const handleSend = () => {
    if (inputValue.trim()) {
      // 这里处理发送逻辑
      console.log('发送消息:', inputValue);
      console.log('选中的模型:', selectedModel);
      setInputValue(''); // 清空输入框
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const modelOptions = [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'claude-3', label: 'Claude-3' },
  ];

  return (
    <div className={styles.inputArea}>
      <Input.TextArea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="请输入内容，Enter发送，Shift+Enter换行"
        autoSize
        className={styles.textarea}
      />
      <div className={styles.bottom}>
        <Select
          value={selectedModel}
          onChange={setSelectedModel}
          options={modelOptions}
          size="small"
          className={styles.modelSelect}
        />
        <Button
          className={styles.sendButton}
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!inputValue.trim()}
        >
          发送
        </Button>
      </div>
    </div>
  );
};

export default InputArea;
