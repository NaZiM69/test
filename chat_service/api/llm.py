import os
from dotenv import load_dotenv
from groq import Groq

# Load .env from backend root if running locally
load_dotenv(dotenv_path="../../.env")

def chat_with_coach(messages: list, context: dict = None) -> str:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    model_name = "llama-3.3-70b-versatile"
    
    system_prompt = (
        "You are an expert fitness and nutrition coach. "
        "You help the user achieve their goals by answering their questions. "
        "Be encouraging, precise, and professional. answer in user's question language "
    )
    
    if context and "profile" in context:
        profile = context["profile"]
        system_prompt += f"\ Current user profile  : Name={profile.get('name')}, Goal={profile.get('goal')}, Level={profile.get('level')}."
        
    groq_messages = [{"role": "system", "content": system_prompt}]
    
    # Transform existing messages to format for Groq
    for msg in messages:
        # handle dict from DRF serializer
        groq_messages.append({"role": msg["role"], "content": msg["content"]})
        
    chat_completion = client.chat.completions.create(
        messages=groq_messages,
        model=model_name,
        temperature=0.7,
        max_tokens=1024,
    )
    return chat_completion.choices[0].message.content
