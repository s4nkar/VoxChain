import { useState, useRef, useEffect } from 'react';
import type { AudioPlayerProps } from '../../types';
import './AudioPlayer.css';

export function AudioPlayer({ sender, audioUrl, duration = "0:05", isPlaying: externalIsPlaying, onPlay, onPause, onEnded }: AudioPlayerProps) {
    const [internalIsPlaying, setInternalIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

    const togglePlay = () => {
        if (!audioRef.current || !audioUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
            onPause?.();
            setInternalIsPlaying(false);
        } else {
            if (externalIsPlaying !== undefined) {
                onPlay?.();
            } else {
                audioRef.current.play();
                setInternalIsPlaying(true);
            }
        }
    };

    const handleEnded = () => {
        setInternalIsPlaying(false);
        onEnded?.();
    };

    useEffect(() => {
        if (externalIsPlaying !== undefined && audioRef.current) {
            if (externalIsPlaying) {
                audioRef.current.play().catch(e => {
                    console.error("Audio playback failed:", e);
                    onPause?.();
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [externalIsPlaying, audioUrl]);

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
                onPause={() => {
                    if (externalIsPlaying === undefined) setInternalIsPlaying(false);
                }}
                onPlay={() => {
                    if (externalIsPlaying === undefined) setInternalIsPlaying(true);
                }}
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
