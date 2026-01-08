import './App.css';
import type { Message } from './types';
import { useRef, useEffect } from 'react';
import { Header } from './components/header/Header';
import { MessageItem } from './components/MessageItem/MessageItem';
import { InputArea } from './components/InputArea/InputArea';
import { useVoiceChat } from './hooks/useVoiceChat';

function App() {
  const { stopRecording, startRecording, messages, status } = useVoiceChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle toggle record
  const handleToggleRecord = () => {
    if (status === 'recording') {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="app-container">
      <Header />

      {/* Chat Area */}
      <main className="chat-area">
        <div className="messages-wrapper">
          {/* 3. Render messages from the hook */}
          {messages.length === 0 && (
            <div className="empty-state">
              <p>Start talking to VoxChain...</p>
            </div>
          )}

          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}

          {/* Status Indicator (Optional but helpful) */}
          {status === 'processing' && (
            <div className="status-indicator">Thinking...</div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <InputArea
        isRecording={status === 'recording'}
        onToggleRecord={handleToggleRecord}
        disabled={status === 'processing' || status === 'speaking'}
      />
    </div>
  );
}

export default App;
