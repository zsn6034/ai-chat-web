import React from 'react';
import styles from './index.module.less';

interface UserBubbleProps {
  text: string;
}

const UserBubble: React.FC<UserBubbleProps> = ({ text }) => {
  return <div className={styles.userBubble}>{text}</div>;
};

export default UserBubble;
