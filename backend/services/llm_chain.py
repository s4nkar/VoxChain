import os
import torch
from langchain_huggingface import HuggingFacePipeline
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from transformers import AutoTokenizer, BitsAndBytesConfig, StoppingCriteria, StoppingCriteriaList
from dotenv import load_dotenv

load_dotenv()


# Model ID
model_id = "mistralai/Mistral-7B-Instruct-v0.3"

# Tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_id)

# Quantization config
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
)

# StopOnEos class
class StopOnEos(StoppingCriteria):
    def __call__(self, input_ids, scores, **kwargs):
        return input_ids[0][-1] == tokenizer.eos_token_id

# HuggingFacePipeline
llm = HuggingFacePipeline.from_model_id(
    model_id=model_id,
    task="text-generation",
    pipeline_kwargs={
        "max_new_tokens": 200,
        "temperature": 0.5,
        "repetition_penalty": 1.2,
        "do_sample": True,
        "eos_token_id": tokenizer.eos_token_id,
        "pad_token_id": tokenizer.eos_token_id,
        "stopping_criteria": StoppingCriteriaList([StopOnEos()]),
        "return_full_text": False
    },
    model_kwargs={
        "quantization_config": quantization_config,
        "device_map": "auto"
    }
)


# A persona for the bot
prompt_template_name = PromptTemplate(
    input_variables = ['question'],
    template="""You are VoxChain, a helpful and concise audio assistant. 
    Answer the user's question in 1-2 sentences. Keep it conversational.
    User: {question}
    VoxChain:
    """
)

# Function to normalize the name
def normalize_name(text: str) -> str:
    return text.strip().strip('"')

# Create the LLM chain
llm_chain = prompt_template_name | llm | StrOutputParser() | normalize_name

# Function to get Model's response
def get_model_response(text: str) -> str:
    try:
        response = llm_chain.invoke({"question": text})
        return response.strip()
    except Exception as e:
        print(f"LLM Error: {e}")
        return "I'm having trouble thinking right now."