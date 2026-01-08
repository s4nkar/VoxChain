import { useState, useRef, useEffect } from 'react';
import './App.css';
import type { Message } from './types';
import { Header } from './components/header/Header';
import { MessageItem } from './components/MessageItem/MessageItem';
import { InputArea } from './components/InputArea/InputArea';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      audioUrl: '#',
      transcript: 'Hello! I am VoxChain. Press the microphone button to start speaking.',
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording simulation
      setTimeout(() => {
        setIsRecording(false);
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: 'user',
          audioUrl: '#',
          transcript: 'This is a simulated user voice message.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);

        // Simulate bot response
        setTimeout(() => {
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            audioUrl: '#',
            transcript: 'I received your audio. Here is my audio response back to you.',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
        }, 1500);

      }, 2000);
    }
  };

  return (
    <div className="app-container">
      <Header />

      {/* Chat Area */}
      <main className="chat-area">
        <div className="messages-wrapper">
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <InputArea isRecording={isRecording} onToggleRecord={handleToggleRecord} />
    </div>
  );
}

export default App;
