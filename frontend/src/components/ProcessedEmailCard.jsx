import {
    Brain,
    Sparkles,
    CheckCircle2,
    Clock,
    ArrowRight
} from "lucide-react";

function cleanSummary(text) {
    if (!text) return "";
    const lines = text.trim().split("\n").filter(l => l.trim());
    if (lines.length > 0 && /^(here\s+is|this\s+is|summary:)/i.test(lines[0])) {
        return lines.slice(1).join("\n").trim();
    }
    return text.trim();
}

function ProcessedEmailCard({ email, onViewDetails }) {
    const senderName = email.sender?.includes("<")
        ? email.sender.split("<")[0].trim()
        : email.sender || "Unknown";

    const senderEmail = email.sender?.includes("<")
        ? email.sender.split("<")[1]?.replace(">", "")
        : email.sender || "";

    const category = email.category || "General";

    const getCategoryClass = (cat) => {
        const val = cat.toLowerCase();
        if (val.includes("important") || val.includes("personal")) return "category-important";
        if (val.includes("work")) return "category-work";
        if (val.includes("promotion")) return "category-promotion";
        return "category-default";
    };

    const displaySummary = cleanSummary(email.summary);

    return (
        <div className="processed-card">

            <div className="processed-card-header">

                <div className="processed-sender">

                    <div className="processed-avatar">
                        {senderName.charAt(0).toUpperCase()}
                    </div>

                    <div>

                        <div className="processed-sender-name">
                            {senderName}
                        </div>

                        <div className="processed-sender-email">
                            {senderEmail}
                        </div>

                    </div>

                </div>

                <div className="processed-header-right">

                    <span className={`category-badge ${getCategoryClass(category)}`}>
                        {category}
                    </span>

                    <span className="processed-date">
                        <Clock size={13} />
                        {email.date || ""}
                    </span>

                </div>

            </div>

            <h3 className="processed-subject">
                {email.subject || "No subject"}
            </h3>

            {/* AI Summary Card Block */}
            <div className="processed-summary-box">

                <div className="processed-box-title">
                    <Brain size={16} />
                    <span>AI Summary</span>
                </div>

                <p className="processed-summary-text">
                    {displaySummary || "No summary available."}
                </p>

            </div>

            {/* Generated Reply Card Block */}
            {email.generated_reply && email.generated_reply.trim() ? (
                <div className="processed-reply-box">

                    <div className="processed-box-title reply-title">

                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Sparkles size={15} />
                            <span>Generated Reply</span>
                        </div>

                        {email.reply_sent === 1 && (
                            <span className="sent-badge">
                                <CheckCircle2 size={13} /> Sent
                            </span>
                        )}

                    </div>

                    <div className="processed-reply-text">
                        {email.generated_reply}
                    </div>

                </div>
            ) : null}

            <div className="processed-card-footer">
                <button
                    className="view-details-btn"
                    onClick={() => onViewDetails(email)}
                >
                    <span>View Email Details</span>
                    <ArrowRight size={15} />
                </button>
            </div>

        </div>
    );
}

export default ProcessedEmailCard;
