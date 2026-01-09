import whisper
import subprocess
import numpy as np

# Load the Whisper model
# model = whisper.load_model("tiny")
model = whisper.load_model("small")


def decode_webm_to_pcm(webm_bytes: bytes) -> np.ndarray:
    process = subprocess.Popen(
        [
            "ffmpeg",
            "-loglevel", "quiet",
            "-i", "pipe:0",
            "-f", "f32le",
            "-ac", "1",
            "-ar", "16000",
            "pipe:1",
        ],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
    )


    pcm_bytes, _ = process.communicate(webm_bytes)
    pcm = np.frombuffer(pcm_bytes, np.float32)
    print("Decoded PCM samples:", pcm.size)
    return pcm


def transcribe_audio(audio_bytes: bytes) -> str:
    pcm = decode_webm_to_pcm(audio_bytes)
    if pcm.size == 0:
        return ""

    pcm = pcm.astype(np.float32)
    max_val = np.max(np.abs(pcm))
    if max_val > 0:
        pcm = pcm / max_val

    # Transcribe the entire audio clip
    # We still use language="en" to force English
    try:
        result = model.transcribe(pcm, language="en", fp16=False)
        text = result["text"].strip()
        return text
    except Exception as e:
        print(f"Transcription error: {e}")
        return ""
