import './App.css';

import { useRef, useEffect, useState } from 'react';
import { Header } from './components/header/Header';
import { MessageItem } from './components/MessageItem/MessageItem';
import { InputArea } from './components/InputArea/InputArea';
import { useVoiceChat } from './hooks/useVoiceChat';

function App() {
  const { stopRecording, startRecording, messages, status } = useVoiceChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const lastAutoPlayedIdRef = useRef<string | null>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-play new bot messages
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === 'bot' && lastMsg.audioUrl) {
      // If this is a new message we haven't auto-played yet
      if (lastMsg.id !== lastAutoPlayedIdRef.current) {
        setPlayingMessageId(lastMsg.id);
        lastAutoPlayedIdRef.current = lastMsg.id;
      }
    }
  }, [messages]);

  // Handle toggle record
  const handleToggleRecord = () => {
    if (status === 'recording') {
      stopRecording();
    } else {
      // Stop any playback before recording
      setPlayingMessageId(null);
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
            <MessageItem
              key={msg.id}
              message={msg}
              isPlaying={playingMessageId === msg.id}
              onPlay={() => setPlayingMessageId(msg.id)}
              onPause={() => setPlayingMessageId(null)}
              onEnded={() => setPlayingMessageId(null)}
            />
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
        disabled={status === 'processing'}
      />
    </div>
  );
}

export default App;
