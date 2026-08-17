import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3.2"


def ask_ollama(prompt):

    try:

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()

        data = response.json()

        result = data.get("response", "").strip()

        print("\n========== OLLAMA RESPONSE ==========")
        print(result)
        print("=====================================\n")

        return result

    except requests.exceptions.ConnectionError:

        print("ERROR: Cannot connect to Ollama.")
        return ""

    except requests.exceptions.Timeout:

        print("ERROR: Ollama request timed out.")
        return ""

    except Exception as e:

        print(f"OLLAMA ERROR: {e}")
        return ""