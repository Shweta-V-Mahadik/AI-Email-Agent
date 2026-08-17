from ai.ollama_client import ask_ollama
from ai.reply_generator import generate_reply
from ai.summarizer import summarize_email
from ai.classifier import classify_email


email_body = """
Dear Shweta,

We are pleased to inform you that you have been
shortlisted for the technical interview.

The interview will be conducted tomorrow at 11 AM.

Please confirm your availability.

Regards,
HR Team
"""


print("\n========== TEST SUMMARY ==========")

summary = summarize_email(email_body)

print(summary)


print("\n========== TEST CLASSIFICATION ==========")

category = classify_email(
    "Technical Interview Invitation",
    email_body
)

print(category)


print("\n========== TEST REPLY ==========")

reply = generate_reply(
    "HR Team",
    "Technical Interview Invitation",
    email_body
)

print(reply)