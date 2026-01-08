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
}

export interface InputAreaProps {
    isRecording: boolean;
    onToggleRecord: () => void;
    disabled: boolean;
}

export interface MessageItemProps {
    message: Message;
}