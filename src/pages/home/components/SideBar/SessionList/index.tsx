import { useState } from 'react'
import styles from './index.module.less'

interface Session {
  id: string
  title: string
}

const SessionList= () => {
  const [sessions, setSessions] = useState<Session[]>([
    { id: '1', title: '会话 1' },
    { id: '2', title: '会话 2' },
    { id: '3', title: '会话 3' },
    { id: '4', title: '会话 4' },
    { id: '5', title: '会话 5' },
    { id: '6', title: '会话 6' },
    { id: '7', title: '会话 7' },
    { id: '8', title: '会话 8' },
    { id: '9', title: '会话 9' },
    { id: '10', title: '会话 10' },
    { id: '11', title: '会话 11' },
    { id: '12', title: '会话 12' },
    { id: '13', title: '会话 13' },
    { id: '14', title: '会话 14' },
    { id: '15', title: '会话 15' },
    { id: '16', title: '会话 16' },
    { id: '17', title: '会话 17' },
    { id: '18', title: '会话 18' },
    { id: '19', title: '会话 19' },
    { id: '20', title: '会话 20' },
  ])

  const [activeSession, setActiveSession] = useState<string>('1')

  return (
    <div className={styles.sessionList}>
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`${styles.sessionItem} ${
            activeSession === session.id ? styles.active : ''
          }`}
          onClick={() => setActiveSession(session.id)}
        >
          {session.title}
        </div>
      ))}
    </div>
  )
}

export default SessionList
