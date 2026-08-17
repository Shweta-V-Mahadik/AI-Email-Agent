import {
    Paperclip
} from "lucide-react";

function EmailCard({
    email,
    selected,
    onClick
}) {

    const senderName =
        email.sender?.includes("<")
            ? email.sender
                .split("<")[0]
                .trim()
            : email.sender || "Unknown";

    const senderEmail =
        email.sender?.includes("<")
            ? email.sender
                .split("<")[1]
                ?.replace(">", "")
            : email.sender || "";


    const category =
        email.category || "";


    const getCategoryClass = () => {

        const value =
            category.toLowerCase();

        if (value.includes("important")) {
            return "category-important";
        }

        if (value.includes("work")) {
            return "category-work";
        }

        if (value.includes("personal")) {
            return "category-personal";
        }

        if (value.includes("promotion")) {
            return "category-promotion";
        }

        if (value.includes("spam")) {
            return "category-spam";
        }

        return "category-default";
    };


    const stripHtml = (html) => {
        if (!html) return "";
        return html
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/&nbsp;/gi, " ")
            .replace(/&amp;/gi, "&")
            .replace(/&lt;/gi, "<")
            .replace(/&gt;/gi, ">")
            .replace(/&quot;/gi, '"')
            .replace(/\s+/g, " ")
            .trim();
    };

    return (
        <div
            className={`email-card ${
                selected
                    ? "email-selected"
                    : ""
            }`}
            onClick={onClick}
        >

            <div className="email-avatar">
                {senderName
                    .charAt(0)
                    .toUpperCase()}
            </div>


            <div className="email-card-content">

                <div className="email-card-top">

                    <div className="sender-info">

                        <strong>
                            {senderName}
                        </strong>

                        <span>
                            {senderEmail}
                        </span>

                    </div>

                    <span className="email-time">
                        {email.date || ""}
                    </span>

                </div>


                <div className="email-card-subject">
                    {email.subject || "No subject"}
                </div>


                <div className="email-card-preview">
                    {stripHtml(email.body) || "No preview available"}
                </div>


                <div className="email-card-bottom">

                    {category && (
                        <span
                            className={`category-badge ${getCategoryClass()}`}
                        >
                            {category}
                        </span>
                    )}

                    {email.processed === 1 && (
                        <span className="processed-label">
                            AI analyzed
                        </span>
                    )}

                </div>

            </div>

        </div>
    );
}

export default EmailCard;