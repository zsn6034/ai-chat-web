import { useState } from 'react'
import { useChatStore } from './stores/chatStore'
import './App.less'

function App() {
  const { messages, addMessage, clearMessages } = useChatStore()
  const [inputValue, setInputValue] = useState('')

  const handleAddMessage = () => {
    if (inputValue.trim()) {
      addMessage(inputValue)
      setInputValue('')
    }
  }

  return (
    <>
      <div className="app">
        <div className="container">
          <div className="main-content">
            <div className="chat-section">
              <h2>Zustand Chat Demo</h2>
              <div className="input-group">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter a message"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMessage()}
                />
                <button onClick={handleAddMessage} className="add-button">
                  Add
                </button>
              </div>
              <div>
                <button onClick={clearMessages} className="clear-button">
                  Clear Messages
                </button>
              </div>
              <div className="messages-container">
                {messages.length === 0 ? (
                  <p className="no-messages">No messages yet</p>
                ) : (
                  <ul>
                    {messages.map((msg, index) => (
                      <li key={index}>{msg}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
