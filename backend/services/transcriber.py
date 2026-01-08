import whisper

# Load the Whisper model
model = whisper.load_model("small") 

def transcribe_audio(audio_bytes: bytes) -> str:
    # Transcribe the audio
    result = model.transcribe(audio_bytes)

    # Print the transcription
    print(f"Transcribing {len(audio_bytes)} bytes of audio...")
    return result["text"]


