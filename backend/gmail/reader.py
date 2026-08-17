import imaplib
import email
import os

from email.header import decode_header

from bs4 import BeautifulSoup

from dotenv import load_dotenv


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()


EMAIL = os.getenv("GMAIL_EMAIL")

APP_PASSWORD = os.getenv(
    "GMAIL_APP_PASSWORD"
)

IMAP_SERVER = os.getenv(
    "IMAP_SERVER",
    "imap.gmail.com"
)

IMAP_PORT = int(
    os.getenv(
        "IMAP_PORT",
        993
    )
)


# =========================================================
# DECODE EMAIL TEXT
# =========================================================

def decode_text(value):

    if not value:

        return ""


    decoded = decode_header(
        value
    )


    result = ""


    for part, encoding in decoded:

        if isinstance(
            part,
            bytes
        ):

            result += part.decode(
                encoding or "utf-8",
                errors="ignore"
            )

        else:

            result += part


    return result


# =========================================================
# EXTRACT EMAIL BODY
# =========================================================

def extract_body(msg):

    body = ""


    # -----------------------------------------------------
    # MULTIPART EMAIL
    # -----------------------------------------------------

    if msg.is_multipart():

        # First try plain text

        for part in msg.walk():

            content_type = (
                part.get_content_type()
            )

            content_disposition = str(
                part.get(
                    "Content-Disposition",
                    ""
                )
            )


            if (

                content_type == "text/plain"

                and
                "attachment"
                not in content_disposition

            ):

                payload = part.get_payload(
                    decode=True
                )


                if payload:

                    body = payload.decode(

                        part.get_content_charset()
                        or "utf-8",

                        errors="ignore"

                    )

                    break


        # -------------------------------------------------
        # IF NO PLAIN TEXT, TRY HTML
        # -------------------------------------------------

        if not body:

            for part in msg.walk():

                if (
                    part.get_content_type()
                    == "text/html"
                ):

                    payload = part.get_payload(
                        decode=True
                    )


                    if payload:

                        html = payload.decode(

                            part.get_content_charset()
                            or "utf-8",

                            errors="ignore"

                        )


                        soup = BeautifulSoup(
                            html,
                            "html.parser"
                        )


                        body = soup.get_text(

                            separator="\n",

                            strip=True

                        )


                        break


    # -----------------------------------------------------
    # SIMPLE EMAIL
    # -----------------------------------------------------

    else:

        payload = msg.get_payload(
            decode=True
        )


        if payload:

            body = payload.decode(

                msg.get_content_charset()
                or "utf-8",

                errors="ignore"

            )


    return body.strip()


# =========================================================
# CONNECT TO GMAIL
# =========================================================

def connect_to_gmail():

    if not EMAIL:

        raise Exception(
            "GMAIL_EMAIL is not configured in .env"
        )


    if not APP_PASSWORD:

        raise Exception(
            "GMAIL_APP_PASSWORD is not configured in .env"
        )


    mail = imaplib.IMAP4_SSL(

        IMAP_SERVER,

        IMAP_PORT

    )


    mail.login(

        EMAIL,

        APP_PASSWORD

    )


    return mail


# =========================================================
# GET EMAILS
# =========================================================
#
# This function is used by:
#
# GET /gmail/emails
#
# It only FETCHES emails.
#
# It does NOT run Ollama.
#
# =========================================================

def get_emails(limit=20):

    mail = connect_to_gmail()


    try:

        mail.select(
            "INBOX"
        )


        status, messages = mail.search(

            None,

            "ALL"

        )


        if status != "OK":

            return []


        email_ids = messages[0].split()


        # Get latest emails

        email_ids = email_ids[-limit:]


        results = []


        # Newest first

        for email_id in reversed(
            email_ids
        ):

            status, msg_data = mail.fetch(

                email_id,

                "(RFC822)"

            )


            if status != "OK":

                continue


            raw_email = None


            for response_part in msg_data:

                if isinstance(
                    response_part,
                    tuple
                ):

                    raw_email = (
                        response_part[1]
                    )

                    break


            if not raw_email:

                continue


            msg = email.message_from_bytes(
                raw_email
            )


            sender = decode_text(
                msg.get("From")
            )


            subject = decode_text(
                msg.get("Subject")
            )


            date = msg.get(
                "Date"
            )


            body = extract_body(
                msg
            )


            results.append({

                "id":
                    email_id.decode(),

                "sender":
                    sender,

                "subject":
                    subject,

                "date":
                    date,

                "body":
                    body

            })


        return results


    finally:

        try:

            mail.logout()

        except:

            pass


# =========================================================
# GET ONE SPECIFIC EMAIL
# =========================================================
#
# This is used when the user selects ONE email
# and clicks "Process with AI".
#
# =========================================================

def get_email_by_id(gmail_id):

    mail = connect_to_gmail()


    try:

        mail.select(
            "INBOX"
        )


        status, msg_data = mail.fetch(

            gmail_id,

            "(RFC822)"

        )


        if status != "OK":

            return None


        raw_email = None


        for response_part in msg_data:

            if isinstance(
                response_part,
                tuple
            ):

                raw_email = (
                    response_part[1]
                )

                break


        if not raw_email:

            return None


        msg = email.message_from_bytes(
            raw_email
        )


        sender = decode_text(
            msg.get("From")
        )


        subject = decode_text(
            msg.get("Subject")
        )


        date = msg.get(
            "Date"
        )


        body = extract_body(
            msg
        )


        return {

            "id":
                str(gmail_id),

            "sender":
                sender,

            "subject":
                subject,

            "date":
                date,

            "body":
                body

        }


    finally:

        try:

            mail.logout()

        except:

            pass