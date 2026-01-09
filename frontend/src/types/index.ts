// Mock data types
export interface Message {
    id: string;
    sender: 'user' | 'bot';
    audioUrl: string;
    transcript: string;
    timestamp: Date;
}

export interface AudioPlayerProps {
    sender: 'user' | 'bot';
    audioUrl?: string;
    duration?: string;
    isPlaying?: boolean;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
}

export interface InputAreaProps {
    isRecording: boolean;
    onToggleRecord: () => void;
    disabled: boolean;
}

export interface MessageItemProps {
    message: Message;
    isPlaying?: boolean;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
}