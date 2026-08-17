from gmail.reader import get_emails


emails = get_emails(
    limit=5
)


for email in emails:

    print("=" * 60)

    print(
        "ID:",
        email["id"]
    )

    print(
        "FROM:",
        email["sender"]
    )

    print(
        "SUBJECT:",
        email["subject"]
    )

    print(
        "DATE:",
        email["date"]
    )

    print(
        "BODY:",
        email["body"][:500]
    )