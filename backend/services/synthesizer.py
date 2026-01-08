from gtts import gTTS
import io

def text_to_speech(text: str) -> bytes:
    try:
        # Generate audio in memory
        tts = gTTS(text=text, lang='en')
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return fp.getvalue()
    except Exception as e:
        print(f"TTS Error: {e}")
        return b""