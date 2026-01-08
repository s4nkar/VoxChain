import torch
import threading
from transformers import AutoTokenizer, TextIteratorStreamer
from langchain_huggingface import HuggingFacePipeline
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()

# Model ID
# MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.3"
MODEL_ID = "Qwen/Qwen2.5-1.5B-Instruct"

_tokenizer = None
_pipeline = None
_llm_chain = None

# Function to initialize the LLM
def init_llm():
    global _tokenizer, _pipeline, _llm_chain

    if _llm_chain is not None:
        return

    _tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)

    _pipeline = HuggingFacePipeline.from_model_id(
        model_id=MODEL_ID,
        task="text-generation",
        pipeline_kwargs={
            "max_new_tokens": 120,
            "temperature": 0.55,
            "top_p": 0.9,
            "do_sample": True,
            "return_full_text": False,
            "pad_token_id": _tokenizer.eos_token_id,
        },
        model_kwargs={
            "device_map": "auto",
            "dtype": torch.float16,
        },
    )

    prompt = PromptTemplate(
        input_variables=["question"],
        template=(
            "You are VoxChain, a friendly voice assistant.\n"
            "Speak naturally, like a human conversation.\n"
            "Keep responses short.\n"
            "User: {question}\n"
            "VoxChain:"
        ),
    )

    _llm_chain = prompt | _pipeline | StrOutputParser()

# Function to warm up the LLM
def warm_up():
    init_llm()
    _llm_chain.invoke({"question": "Hello"})


# Function to get Model's response
def get_model_response(text: str) -> str:
    try:
        init_llm()
        return _llm_chain.invoke({"question": text}).strip()
    except Exception as e:
        print(f"LLM Error: {e}")
        return "I'm having trouble right now."


# Function to stream Model's response
def stream_model_response(text: str):
    init_llm()

    streamer = TextIteratorStreamer(
        _tokenizer,
        skip_prompt=True,
        skip_special_tokens=True,
    )

    prompt = (
        "You are VoxChain, a friendly voice assistant.\n"
        "Speak naturally, like talking to a human.\n"
        f"User: {text}\n"
        "VoxChain:"
    )

    generation_kwargs = dict(
        text_inputs=prompt,
        max_new_tokens=120,
        temperature=0.6,
        top_p=0.9,
        do_sample=True,
        streamer=streamer,
    )

    thread = threading.Thread(
        target=_pipeline.pipeline,
        kwargs=generation_kwargs,
        daemon=True,
    )
    thread.start()

    for token in streamer:
        yield token
