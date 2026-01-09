from fastapi import FastAPI
from api.websocket import router
from fastapi.middleware.cors import CORSMiddleware
from services.llm_chain import warm_up

app = FastAPI(title="VoxChain API")

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/ws")

@app.get("/")
def read_root():
    return {"status": "VoxChain is Online"}

# Function to warm up the LLM
@app.on_event("startup")
def startup():
    print("Warming up the LLM...")
    warm_up()
