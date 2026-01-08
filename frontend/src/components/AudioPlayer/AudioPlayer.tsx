import type { AudioPlayerProps } from '../../types';
import './AudioPlayer.css';


export function AudioPlayer({ sender, duration = "0:05" }: AudioPlayerProps) {
    return (
        <div className="audio-player">
            <button className="play-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </button>
            <div className={`audio-waveform ${sender === 'user' ? 'waveform-user' : 'waveform-bot'}`}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="waveform-bar" style={{ height: `${Math.random() * 100}%` }}></div>
                ))}
            </div>
            <span className="audio-duration">{duration}</span>
        </div>
    );
}
