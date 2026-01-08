import torch
from langchain_huggingface import HuggingFacePipeline
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from transformers import AutoTokenizer
from dotenv import load_dotenv

load_dotenv()


# Model ID
# model_id = "mistralai/Mistral-7B-Instruct-v0.3"
model_id = "Qwen/Qwen2.5-1.5B-Instruct"

# LLM Chain
llm_chain = None 

# Function to build LLM Chain (Lazy Loading, Avoid building on Start)
def build_llm_chain():
    tokenizer = AutoTokenizer.from_pretrained(model_id)

    llm = HuggingFacePipeline.from_model_id(
        model_id=model_id,
        task="text-generation",
        pipeline_kwargs={
            "max_new_tokens": 120,
            "temperature": 0.4,
            "return_full_text": False,
            "pad_token_id": tokenizer.eos_token_id,
        },
        model_kwargs={
            "device_map": "auto",
            "torch_dtype": torch.float16,
        },
    )

    prompt = PromptTemplate(
        input_variables=["question"],
        template=(
            "You are VoxChain, a concise voice assistant.\n"
            "Reply in 1–2 sentences.\n"
            "User: {question}\n"
            "VoxChain:"
        ),
    )

    return prompt | llm | StrOutputParser()

# Function to get LLM Chain
def get_llm_chain():
    global llm_chain
    if llm_chain is None:
        llm_chain = build_llm_chain()
    return llm_chain

# Function to get Model's response
def get_model_response(text: str) -> str:
    try:
        llm_chain = get_llm_chain()
        response = llm_chain.invoke({"question": text})
        return response.strip()
    except Exception as e:
        print(f"LLM Error: {e}")
        return "Something went wrong. Please try again."