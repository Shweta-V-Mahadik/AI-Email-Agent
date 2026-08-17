import {
    Mail
} from "lucide-react";

import EmailCard from "./EmailCard";

function EmailList({
    emails,
    selectedEmail,
    onSelect
}) {

    if (!emails.length) {

        return (
            <div className="empty-state">

                <div className="empty-icon">
                    <Mail size={25} />
                </div>

                <h3>
                    No emails found
                </h3>

                <p>
                    Your inbox is currently empty.
                </p>

            </div>
        );
    }


    return (
        <div className="email-list">

            {emails.map(email => (

                <EmailCard
                    key={email.id}
                    email={email}
                    selected={
                        selectedEmail?.id === email.id
                    }
                    onClick={() =>
                        onSelect(email)
                    }
                />

            ))}

        </div>
    );
}

export default EmailList;