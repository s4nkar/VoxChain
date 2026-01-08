import './InputArea.css';
import type { InputAreaProps } from '../../types';

export function InputArea({ isRecording, onToggleRecord, disabled }: InputAreaProps) {
    return (
        <footer className="input-area">
            <div className="input-glass-wrapper glass-panel">
                <div className={`recording-status ${isRecording ? 'active' : ''}`}>
                    {isRecording ? 'Listening...' : 'Tap to Speak'}
                </div>

                <button
                    className={`record-btn ${isRecording ? 'recording' : ''}`}
                    onClick={onToggleRecord}
                    disabled={disabled}
                >
                    <div className="mic-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" height="32" width="32">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.66 9 5v6c0 1.66 1.34 3 3 3z" />
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                        </svg>
                    </div>
                    {isRecording && <div className="record-ripple"></div>}
                </button>
            </div>
        </footer>
    );
}
