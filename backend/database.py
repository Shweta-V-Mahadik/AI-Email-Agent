import sqlite3


DATABASE = "emails.db"


# =========================================================
# CONNECTION
# =========================================================

def get_connection():

    connection = sqlite3.connect(
        DATABASE
    )

    connection.row_factory = sqlite3.Row

    return connection


# =========================================================
# INITIALIZE DATABASE
# =========================================================

def initialize_database():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS emails (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            gmail_id TEXT UNIQUE,

            sender TEXT,

            subject TEXT,

            body TEXT,

            date TEXT,

            summary TEXT,

            category TEXT,

            generated_reply TEXT,

            reply_sent INTEGER DEFAULT 0,

            processed INTEGER DEFAULT 0

        )
    """)

    connection.commit()

    connection.close()


# =========================================================
# SAVE EMAIL
# =========================================================

def save_email(
    gmail_id,
    sender,
    subject,
    body,
    date,
    summary,
    category,
    reply=""
):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO emails
        (
            gmail_id,
            sender,
            subject,
            body,
            date,
            summary,
            category,
            generated_reply,
            reply_sent,
            processed
        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 1)

        ON CONFLICT(gmail_id)

        DO UPDATE SET

            sender = excluded.sender,

            subject = excluded.subject,

            body = excluded.body,

            date = excluded.date,

            summary = excluded.summary,

            category = excluded.category,

            processed = 1

    """, (

        gmail_id,
        sender,
        subject,
        body,
        date,
        summary,
        category,
        reply

    ))

    connection.commit()

    # Get the saved record

    cursor.execute("""
        SELECT *
        FROM emails
        WHERE gmail_id = ?
    """, (
        gmail_id,
    ))

    row = cursor.fetchone()

    connection.close()

    if row:

        return dict(row)

    return None


# =========================================================
# GET ALL EMAILS
# =========================================================

def get_all_emails():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM emails
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    connection.close()

    return [
        dict(row)
        for row in rows
    ]


# =========================================================
# GET ONE EMAIL
# =========================================================

def get_email(email_id):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM emails
        WHERE id = ? OR gmail_id = ?
    """, (
        email_id,
        str(email_id)
    ))

    row = cursor.fetchone()

    connection.close()

    if row:

        return dict(row)

    return None


# =========================================================
# UPDATE GENERATED REPLY
# =========================================================

def update_generated_reply(
    email_id,
    reply
):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        UPDATE emails

        SET generated_reply = ?

        WHERE id = ? OR gmail_id = ?
    """, (

        reply,

        email_id,

        str(email_id)

    ))

    connection.commit()

    # Return updated email

    cursor.execute("""
        SELECT *
        FROM emails
        WHERE id = ? OR gmail_id = ?
    """, (
        email_id,
        str(email_id)
    ))

    row = cursor.fetchone()

    connection.close()

    if row:

        return dict(row)

    return None


# =========================================================
# MARK REPLY SENT
# =========================================================

def mark_reply_sent(email_id):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        UPDATE emails

        SET reply_sent = 1

        WHERE id = ? OR gmail_id = ?
    """, (
        email_id,
        str(email_id)
    ))

    connection.commit()

    connection.close()