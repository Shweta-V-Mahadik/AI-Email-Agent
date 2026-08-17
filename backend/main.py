import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# =========================================================
# DATABASE
# =========================================================

from database import (
    initialize_database,
    get_all_emails,
    get_email,
    update_generated_reply,
    mark_reply_sent
)


# =========================================================
# AI AGENT
# =========================================================

from agent.email_agent import (
    process_single_email,
    generate_email_reply
)
from ai.reply_generator import regenerate_reply


# =========================================================
# GMAIL
# =========================================================

from gmail.reader import (
    get_emails
)

from gmail.sender import (
    send_email
)


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="AI Email Agent",
    version="1.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# =========================================================
# DATABASE INITIALIZATION
# =========================================================

initialize_database()


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "AI Email Agent API is running",
        "model": "Ollama Llama 3.2"
    }


# =========================================================
# GET GMAIL EMAILS (MERGED WITH DB HISTORY)
# =========================================================

@app.get("/gmail/emails")
def gmail_emails():
    try:
        raw_emails = get_emails(limit=20)
        db_emails = get_all_emails()

        db_map = {}
        for item in db_emails:
            gid = str(item.get("gmail_id", ""))
            if gid:
                db_map[gid] = item

        merged_emails = []
        for e in raw_emails:
            gid = str(e.get("id", ""))
            if gid in db_map:
                db_item = db_map[gid]
                merged_emails.append({
                    "id": gid,
                    "db_id": db_item.get("id"),
                    "gmail_id": gid,
                    "sender": e.get("sender") or db_item.get("sender"),
                    "subject": e.get("subject") or db_item.get("subject"),
                    "body": e.get("body") or db_item.get("body"),
                    "date": e.get("date") or db_item.get("date"),
                    "summary": db_item.get("summary", ""),
                    "category": db_item.get("category", ""),
                    "generated_reply": db_item.get("generated_reply", ""),
                    "reply_sent": db_item.get("reply_sent", 0),
                    "processed": db_item.get("processed", 1)
                })
            else:
                merged_emails.append({
                    "id": gid,
                    "gmail_id": gid,
                    "sender": e.get("sender"),
                    "subject": e.get("subject"),
                    "body": e.get("body"),
                    "date": e.get("date"),
                    "summary": "",
                    "category": "",
                    "generated_reply": "",
                    "reply_sent": 0,
                    "processed": 0
                })

        return {
            "count": len(merged_emails),
            "emails": merged_emails
        }

    except Exception as e:
        print("GMAIL ERROR:", e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET PROCESSED EMAILS
# =========================================================

@app.get("/emails")
def emails():
    return get_all_emails()


# =========================================================
# GET ONE PROCESSED EMAIL
# =========================================================

@app.get("/emails/{email_id}")
def email_details(email_id: str):
    result = get_email(email_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail="Email not found"
        )
    return result


# =========================================================
# PROCESS ONE EMAIL
# =========================================================

@app.post("/process/{gmail_id}")
def process_email(gmail_id: str):
    try:
        result = process_single_email(gmail_id)
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to process email"
            )

        return {
            "id": result.get("gmail_id") or str(result.get("id", "")),
            "db_id": result.get("id"),
            "gmail_id": result.get("gmail_id"),
            "sender": result.get("sender"),
            "subject": result.get("subject"),
            "body": result.get("body"),
            "date": result.get("date"),
            "summary": result.get("summary"),
            "category": result.get("category"),
            "generated_reply": result.get("generated_reply", ""),
            "reply_sent": result.get("reply_sent", 0),
            "processed": 1
        }

    except Exception as e:
        print("PROCESS ERROR:", e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GENERATE REPLY
# =========================================================

@app.post("/generate-reply/{email_id}")
def generate_reply_endpoint(email_id: str):
    try:
        result = generate_email_reply(email_id)
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate reply"
            )

        return {
            "id": result.get("gmail_id") or str(result.get("id", "")),
            "db_id": result.get("id"),
            "gmail_id": result.get("gmail_id"),
            "sender": result.get("sender"),
            "subject": result.get("subject"),
            "summary": result.get("summary"),
            "category": result.get("category"),
            "generated_reply": result.get("generated_reply", ""),
            "reply_sent": result.get("reply_sent", 0),
            "processed": result.get("processed", 1)
        }

    except Exception as e:
        print("REPLY GENERATION ERROR:", e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# REGENERATE REPLY
# =========================================================

@app.post("/emails/{email_id}/regenerate-reply")
def regenerate_reply_endpoint(email_id: str, payload: dict):
    email_data = get_email(email_id)

    if not email_data:
        raise HTTPException(
            status_code=404,
            detail="Email not found"
        )

    current_reply = email_data.get("generated_reply", "") or ""
    if not current_reply.strip():
        raise HTTPException(
            status_code=400,
            detail="No existing generated reply found"
        )

    email_body = email_data.get("body", "") or ""
    subject = email_data.get("subject", "") or ""
    instruction = payload.get("instruction", "") if isinstance(payload, dict) else ""

    if not instruction.strip():
        raise HTTPException(
            status_code=400,
            detail="Instruction is required"
        )

    try:
        new_reply = regenerate_reply(
            email_body=email_body,
            subject=subject,
            current_reply=current_reply,
            instruction=instruction
        )

        if not new_reply or not new_reply.strip():
            raise HTTPException(
                status_code=500,
                detail="Ollama failed to regenerate reply"
            )

        updated_email = update_generated_reply(email_id, new_reply)

        if not updated_email:
            raise HTTPException(
                status_code=500,
                detail="Could not save regenerated reply"
            )

        return {
            "success": True,
            "reply": new_reply
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        print("REGENERATE ERROR:", e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# SEND REPLY
# =========================================================

@app.post("/send/{email_id}")
def send_reply(email_id: str):
    email_data = get_email(email_id)

    if not email_data:
        raise HTTPException(
            status_code=404,
            detail="Email not found"
        )

    sender = email_data.get("sender", "") or ""

    if "<" in sender and ">" in sender:
        recipient = (
            sender
            .split("<")[1]
            .split(">")[0]
            .strip()
        )
    else:
        recipient = sender.strip()

    subject = email_data.get("subject", "Reply") or "Reply"
    if not subject.lower().startswith("re:"):
        subject = "Re: " + subject

    reply = email_data.get("generated_reply", "") or ""

    if not reply.strip():
        raise HTTPException(
            status_code=400,
            detail="Please generate a reply before sending."
        )

    try:
        send_email(
            recipient,
            subject,
            reply
        )
    except Exception as e:
        print("SEND ERROR:", e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    mark_reply_sent(email_id)

    return {
        "message": "Reply sent successfully",
        "recipient": recipient,
        "subject": subject
    }


if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)