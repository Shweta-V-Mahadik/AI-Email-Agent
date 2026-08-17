from .ollama_client import ask_ollama


def classify_email(subject, body):

    prompt = f"""
Classify the following email into exactly ONE category.

SUBJECT:
{subject}

EMAIL:
{body}

Available categories:

JOB
COLLEGE
PERSONAL
FINANCE
PROMOTION
IMPORTANT
SPAM
OTHER

Return ONLY the category name.

CATEGORY:
"""

    result = ask_ollama(prompt).strip().upper()

    categories = [
        "JOB",
        "COLLEGE",
        "PERSONAL",
        "FINANCE",
        "PROMOTION",
        "IMPORTANT",
        "SPAM",
        "OTHER"
    ]

    for category in categories:

        if category in result:
            return category

    return "OTHER"