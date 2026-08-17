import smtplib
import os

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from dotenv import load_dotenv

load_dotenv()

EMAIL = os.getenv("GMAIL_EMAIL")
APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")

SMTP_SERVER = os.getenv(
    "SMTP_SERVER",
    "smtp.gmail.com"
)

SMTP_PORT = int(
    os.getenv(
        "SMTP_PORT",
        465
    )
)


def send_email(
    recipient,
    subject,
    body
):

    message = MIMEMultipart()

    message["From"] = EMAIL
    message["To"] = recipient
    message["Subject"] = subject

    message.attach(
        MIMEText(body, "plain")
    )

    with smtplib.SMTP_SSL(
        SMTP_SERVER,
        SMTP_PORT
    ) as server:

        server.login(
            EMAIL,
            APP_PASSWORD
        )

        server.sendmail(
            EMAIL,
            recipient,
            message.as_string()
        )

    return True