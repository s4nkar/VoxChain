import { useState, useEffect, useRef, useCallback } from 'react';
import type { Message } from '../types';

export const useVoiceChat = () => {
    const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'speaking'>('idle');
    const [messages, setMessages] = useState<Message[]>([]);

    const socketRef = useRef<WebSocket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const isConnecting = useRef(false);


    // 1. Add a temporary User message with local audio blob
    const addUserMessage = (audioBlob: Blob) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            audioUrl: audioUrl,
            transcript: 'Processing...',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    // 2. Update the last user message with actual text from server
    const updateUserTranscript = (text: string) => {
        setMessages(prev => {
            const newArr = [...prev];
            // Last user message
            for (let i = newArr.length - 1; i >= 0; i--) {
                if (newArr[i].sender === 'user') {
                    newArr[i] = { ...newArr[i], transcript: text };
                    break;
                }
            }
            return newArr;
        });
    };

    // 3. Add a new Bot message (Text first)
    const addBotMessage = (text: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'bot',
            audioUrl: '', // Will be filled when audio blob arrives
            transcript: text,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    // 4. Update the last bot message with Audio URL
    const updateBotAudio = (audioBlob: Blob) => {
        const audioUrl = URL.createObjectURL(audioBlob);

        // Auto-play the response
        const audio = new Audio(audioUrl);
        audio.play().catch(e => console.error("Auto-play blocked:", e));
        audio.onended = () => setStatus('idle');

        setMessages(prev => {
            const newArr = [...prev];
            // Find last bot message
            for (let i = newArr.length - 1; i >= 0; i--) {
                if (newArr[i].sender === 'bot') {
                    newArr[i] = { ...newArr[i], audioUrl: audioUrl };
                    break;
                }
            }
            return newArr;
        });
    };

    // WebSocket Logic

    const connect = useCallback(() => {
        if (isConnecting.current) return;
        isConnecting.current = true;

        const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://127.0.0.1:8000/ws/audio';
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('Connected to VoxChain Server');
            isConnecting.current = false;
        };

        ws.onclose = () => {
            isConnecting.current = false;
            setTimeout(() => connect(), 3000); // Auto-reconnect
        };

        ws.onmessage = async (event) => {
            // Bot Audio
            if (event.data instanceof Blob) {
                setStatus('speaking');
                updateBotAudio(event.data);
            }
            // JSON Control Messages
            else {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'transcription') {
                        updateUserTranscript(data.payload);
                    } else if (data.type === 'text_response') {
                        addBotMessage(data.payload);
                        setStatus('speaking');
                    }
                } catch (e) {
                    console.error('JSON Error', e);
                }
            }
        };

        socketRef.current = ws;
    }, []);

    useEffect(() => {
        connect();
        return () => {
            socketRef.current?.close();
        };
    }, [connect]);

    // Recorder Logic

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const mimeType = mediaRecorder.mimeType || 'audio/webm';
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

                // Show user message immediately
                addUserMessage(audioBlob);

                // Send to backend
                if (socketRef.current?.readyState === WebSocket.OPEN) {
                    setStatus('processing');
                    socketRef.current.send(audioBlob);
                }
            };

            mediaRecorder.start();
            setStatus('recording');
        } catch (error) {
            console.error('Microphone error:', error);
            alert('Could not access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    return {
        status,
        messages,
        startRecording,
        stopRecording
    };
};