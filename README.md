# VoxChain 

VoxChain is a cutting-edge, real-time voice-to-voice AI chat application. It allows users to have natural spoken conversations with an AI assistant. The system captures audio, transcribes it locally, processes it through a Large Language Model (LLM), and synthesizes a spoken response back to the user—all in real-time.

## ✨ Features

- **🗣️ Voice-to-Voice Interaction**: Seamless audio input and output.
- **⚡ Real-time Transcription**: Uses OpenAI's **Whisper** model for accurate speech-to-text.
- **🧠 Intelligent Responses**: Powered by **LangChain** and **HuggingFace** (Qwen 2.5) for conversational intelligence.
- **🔊 Text-to-Speech**: Converts AI text responses back to audio using **gTTS** (Google Text-to-Speech).
- **🎨 Glassmorphism UI**: A beautiful, modern interface built with React and CSS variables.
- **🔌 WebSocket Streaming**: Low-latency communication between frontend and backend.
- **🐳 Dockerized**: Fully containerized for easy deployment.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React TS
- **node**: v20

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.12.3
- **Protocol**: WebSockets
- **AI Models**:
    - **Transcription**: OpenAI Whisper (`small` model)
    - **LLM**: HuggingFace (`Qwen/Qwen2.5-1.5B-Instruct`)
    - **TTS**: gTTS

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **System Dependencies**: FFmpeg (for audio processing)

## 🚀 Getting Started

### Prerequisites

- Not fully configured for running: [Docker](https://www.docker.com/) & Docker Compose
- For local dev without Docker:
    - Node.js v20
    - Python 3.12.3
    - FFmpeg installed and added to system PATH.

### 👨‍💻 Manual Local Development

Please prefer to run services individually:

#### Environment Setup

Create a `.env` file in the root directory (copy from `.env.example`):
```bash
cp .env.example .env
```
**Important**: You must add your HuggingFace API Token in `.env`:
```env
HUGGINGFACE_API_TOKEN=your_token_here
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

#### Backend
1. Ensure **FFmpeg** is installed on your system.
2. Create virtual environment:
    ```bash
    cd backend
    cp .env.example .env
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. Run server:
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```

## 📁 Project Structure

```
voxchain/
├── backend/                # FastAPI Python Backend
│   ├── api/                # WebSocket Routes
│   ├── services/           # Core AI Services (LLM, Transcriber, Synthesizer)
│   ├── main.py             # Entry point
│   ├── requirements.txt    # Python deps
│   └── Dockerfile
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (AudioPlayer, InputArea, etc.)
│   │   ├── hooks/          # Custom hooks (useVoiceChat)
│   │   └── App.tsx         # Main App logic
│   └── Dockerfile
├── docker-compose.yml      # Orchestration
└── README.md
```

