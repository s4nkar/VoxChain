from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services import llm_chain, transcriber, synthesizer
import json

router = APIRouter()

@router.websocket("/audio")
async def audio_websocket(websocket: WebSocket):
    await websocket.accept()
    print("Client connected via WebSocket")

    try:
        while True:
            # 1. Receive data from Frontend
            data = await websocket.receive()

            if "bytes" in data:
                audio_bytes = data["bytes"]
                
                # Transcribe audio to text
                user_text = transcriber.transcribe_audio(audio_bytes)
                print(f"User audio: {user_text}")
                
                # Send transcription back to UI
                await websocket.send_json({"type": "transcription", "payload": user_text})

                # Get Langchain response
                response = llm_chain.get_model_response(user_text)
                print(f"Model response: {response}")
                
                # Send text response back to UI
                await websocket.send_json({"type": "text_response", "payload": response})

                # Synthesize Audio
                audio_output = synthesizer.text_to_speech(response)
                
                # Send audio bytes back to frontend to play
                await websocket.send_bytes(audio_output)

            elif "text" in data:
                # Handle control messages
                pass

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error: {e}")
        await websocket.close()