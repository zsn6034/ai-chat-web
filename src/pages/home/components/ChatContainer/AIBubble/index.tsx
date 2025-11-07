import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './index.module.less';
import { useTypewriter } from '@/hooks/useTypewriter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AIBubbleProps {
  text: string;
}

const AIBubble: React.FC<AIBubbleProps> = ({ text }) => {
  // 参考chatui的实现：https://github.com/alibaba/ChatUI/blob/master/src/components/TypingBubble/index.tsx
  const { typedContent, isTyping } = useTypewriter(text, { interval: 10 });
  const effect = isTyping ? 'typing' : null;

  return (
    <div className={styles.aiBubble} data-effect={effect}>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {/* {typedContent} */}
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default AIBubble;
