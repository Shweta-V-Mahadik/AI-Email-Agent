from bs4 import BeautifulSoup

from ai.summarizer import summarize_email
from ai.classifier import classify_email
from ai.reply_generator import generate_reply

from database import (
    save_email,
    update_generated_reply
)

from gmail.reader import get_email_by_id


def clean_text_for_ai(text):
    if not text:
        return ""
    if "<" in text and ">" in text:
        try:
            soup = BeautifulSoup(text, "html.parser")
            for script_or_style in soup(["script", "style"]):
                script_or_style.decompose()
            clean = soup.get_text(separator="\n", strip=True)
            if clean:
                return clean
        except Exception:
            pass
    return text


# =========================================================
# PROCESS EMAIL
# SUMMARY + CATEGORY ONLY
# =========================================================

def process_single_email(gmail_id):

    print("\n" + "=" * 60)
    print("PROCESSING SELECTED EMAIL")
    print("=" * 60)

    print("Gmail ID:", gmail_id)

    # -----------------------------------------------------
    # GET EMAIL FROM GMAIL
    # -----------------------------------------------------

    email_data = get_email_by_id(gmail_id)

    if not email_data:

        raise Exception(
            "Could not find selected email in Gmail"
        )

    sender = email_data.get(
        "sender",
        ""
    )

    subject = email_data.get(
        "subject",
        ""
    )

    body = email_data.get(
        "body",
        ""
    )

    date = email_data.get(
        "date",
        ""
    )

    clean_body = clean_text_for_ai(body)

    # -----------------------------------------------------
    # SUMMARY
    # -----------------------------------------------------

    print("\nGenerating summary...")

    summary = summarize_email(clean_body)

    if not summary:

        summary = "Summary could not be generated."

    print("\nSUMMARY:")
    print(summary)

    # -----------------------------------------------------
    # CATEGORY
    # -----------------------------------------------------

    print("\nClassifying email...")

    category = classify_email(
        subject,
        clean_body
    )

    if not category:

        category = "OTHER"

    print("\nCATEGORY:")
    print(category)

    # -----------------------------------------------------
    # SAVE EMAIL
    #
    # IMPORTANT:
    # Reply is empty at this stage.
    # -----------------------------------------------------

    saved_email = save_email(

        gmail_id,

        sender,

        subject,

        body,

        date,

        summary,

        category,

        ""

    )

    if not saved_email:

        raise Exception(
            "Could not save processed email"
        )

    print("\n" + "=" * 60)
    print("SUMMARY + CATEGORY GENERATED")
    print("=" * 60)

    print(saved_email)

    return saved_email


# =========================================================
# GENERATE REPLY
# =========================================================

def generate_email_reply(email_id):

    print("\n" + "=" * 60)
    print("GENERATING EMAIL REPLY")
    print("=" * 60)

    print("Database Email ID:", email_id)

    from database import get_email

    email_data = get_email(
        email_id
    )

    if not email_data:

        raise Exception(
            "Email not found in database"
        )

    sender = email_data.get(
        "sender",
        ""
    )

    subject = email_data.get(
        "subject",
        ""
    )

    body = email_data.get(
        "body",
        ""
    )

    clean_body = clean_text_for_ai(body)

    # -----------------------------------------------------
    # GENERATE REPLY USING OLLAMA
    # -----------------------------------------------------

    print("\nCalling Ollama...")

    reply = generate_reply(

        sender,

        subject,

        clean_body

    )

    if not reply:

        raise Exception(
            "Ollama could not generate a reply"
        )

    print("\nGENERATED REPLY:")
    print(reply)

    # -----------------------------------------------------
    # SAVE REPLY
    # -----------------------------------------------------

    updated_email = update_generated_reply(

        email_id,

        reply

    )

    if not updated_email:

        raise Exception(
            "Could not save generated reply"
        )

    print("\nReply saved successfully.")

    return updated_email