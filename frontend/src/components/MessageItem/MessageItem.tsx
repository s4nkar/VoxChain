import { AudioPlayer } from '../AudioPlayer/AudioPlayer';
import './MessageItem.css';
import type { MessageItemProps } from '../../types';

export function MessageItem({ message, isPlaying, onPlay, onPause, onEnded }: MessageItemProps) {
    return (
        <div
            className={`message-row ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}
        >
            <div className={`message-bubble glass-panel ${message.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                <AudioPlayer
                    sender={message.sender}
                    audioUrl={message.audioUrl}
                    isPlaying={isPlaying}
                    onPlay={onPlay}
                    onPause={onPause}
                    onEnded={onEnded}
                />

                {/* Transcript */}
                <div className="transcript">
                    <p>{message.transcript}</p>
                </div>
            </div>
            <span className="timestamp">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
}
