import os
import json
from dotenv import load_dotenv
from groq import Groq

# Load .env from backend root if running locally
load_dotenv(dotenv_path="../../.env")

# We expect the prompt to enforce strict JSON
def generate_program_json(prompt: str) -> dict:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    model_name = "llama-3.3-70b-versatile"
    
    # helper to make the API call
    def call_groq(content: str):
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": content,
                }
            ],
            model=model_name,
            temperature=0.7,
            max_tokens=2048,
        )
        return chat_completion.choices[0].message.content

    print("Generating program with LLM...")
    raw_response = call_groq(prompt)
    
    try:
        # Try finding JSON boundaries in case the model replies with markdown blocks
        start = raw_response.find("{")
        end = raw_response.rfind("}") + 1
        if start != -1 and end != 0:
            json_str = raw_response[start:end]
            return json.loads(json_str)
        return json.loads(raw_response)
    except Exception as e:
        print(f"Failed to parse initial JSON. Retrying with stricter prompt. Error: {e}")
        # Retry once with stricter prompt
        stricter_prompt = prompt + "\n\nCRITICAL DANGER: THE PREVIOUS RESPONSE WAS NOT VALID JSON. YOU MUST RETURN ONLY THE RAW JSON OBJECT AND ABSOLUTELY NOTHING ELSE. DO NOT WRAP IN MARKDOWN."
        retry_response = call_groq(stricter_prompt)
        start = retry_response.find("{")
        end = retry_response.rfind("}") + 1
        if start != -1 and end != 0:
            json_str = retry_response[start:end]
            return json.loads(json_str)
        return json.loads(retry_response)
