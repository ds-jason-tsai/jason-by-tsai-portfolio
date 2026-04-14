import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = "AIzaSyAzolGvKxc2V8hiuWIBZEBu4JIkW47sd2g"

client = genai.Client(api_key=api_key)

models_to_test = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-2.0-flash"
]

for m in models_to_test:
    print(f"Testing {m}...")
    try:
        response = client.models.generate_content(
            model=m,
            contents="Say hi"
        )
        print(f"SUCCESS with {m}: {response.text}")
        break
    except Exception as e:
        print(f"FAILED with {m}: {e}")
