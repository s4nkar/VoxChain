import { useState, useRef, useEffect } from 'react';
import type { AudioPlayerProps } from '../../types';
import './AudioPlayer.css';

export function AudioPlayer({ sender, audioUrl, duration = "0:05" }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (!audioRef.current || !audioUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };

    useEffect(() => {
        if (audioRef.current && audioUrl) {
            audioRef.current.load();
        }
    }, [audioUrl]);

    return (
        <div className="audio-player">
            <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={handleEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
            <button
                className="play-btn"
                onClick={togglePlay}
                disabled={!audioUrl}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>
            <div className={`audio-waveform ${sender === 'user' ? 'waveform-user' : 'waveform-bot'}`}>
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="waveform-bar"
                        style={{
                            height: `${Math.random() * 100}%`,
                            animationPlayState: isPlaying ? 'running' : 'paused'
                        }}
                    ></div>
                ))}
            </div>
            <span className="audio-duration">{duration}</span>
        </div>
    );
}
