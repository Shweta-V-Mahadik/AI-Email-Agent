from .ollama_client import ask_ollama


def generate_reply(sender, subject, body):

    prompt = f"""
You are a professional email assistant.

Read the following email and write an appropriate reply.

SENDER:
{sender}

SUBJECT:
{subject}

EMAIL:
{body}

RULES:
- Write only the reply.
- Do not explain your reasoning.
- Do not mention AI.
- Do not create a subject line.
- Be polite and professional.
- Keep the reply concise.
- Respond appropriately to the email.

REPLY:
"""

    return ask_ollama(prompt)


def regenerate_reply(email_body, subject, current_reply, instruction):

    prompt = f"""You are an AI email assistant.

Rewrite the existing email reply according to the user's instruction.

Original email:
{email_body}

Subject:
{subject}

Existing reply:
{current_reply}

User instruction:
{instruction}

Requirements:
- Preserve the original meaning.
- Do not invent facts.
- Do not change names, dates, amounts or important information.
- Follow the requested tone/style.
- Keep the response appropriate for email.
- Do not explain what you changed.
- Return ONLY the final email reply."""

    return ask_ollama(prompt)