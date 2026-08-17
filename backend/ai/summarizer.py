import re
from .ollama_client import ask_ollama


def clean_summary(text):
    if not text:
        return ""
    lines = [l for l in text.strip().split("\n") if l.strip()]
    if lines and re.search(r'^(here\s+is|this\s+is|summary:)', lines[0], re.IGNORECASE):
        lines = lines[1:]
    return "\n".join(lines).strip()


def summarize_email(body):

    prompt = f"""
Summarize the following email in 2 or 3 short sentences. Do not include any intro line like "Here is a summary". Start directly with the summary text.

EMAIL:
{body}

Rules:
- Mention the main purpose.
- Mention important dates, actions or requests.
- Keep it concise.
- Return only the summary text directly without intro phrases.

SUMMARY:
"""

    response = ask_ollama(prompt)
    return clean_summary(response)