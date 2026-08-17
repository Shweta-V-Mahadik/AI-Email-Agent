import { useState, useRef, useEffect } from "react";
import {
    ArrowLeft,
    User,
    Clock,
    Mail,
    Eye,
    FileText
} from "lucide-react";

function isHtml(str) {
    if (!str) return false;
    const trimmed = str.trim();
    return (
        trimmed.startsWith("<!DOCTYPE") ||
        trimmed.startsWith("<html") ||
        /<[a-z][\s\S]*>/i.test(trimmed)
    );
}

function stripHtml(html) {
    if (!html) return "";
    return html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/<[^>]+>/g, "\n")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/\n\s*\n/g, "\n\n")
        .trim();
}

function EmailIframe({ content }) {
    const iframeRef = useRef(null);
    const [height, setHeight] = useState("350px");

    useEffect(() => {
        const updateHeight = () => {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                try {
                    const doc = iframeRef.current.contentWindow.document;
                    if (doc && doc.body) {
                        const newHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
                        if (newHeight > 50) {
                            setHeight(`${newHeight + 30}px`);
                        }
                    }
                } catch (e) {
                    // cross-origin safety
                }
            }
        };

        const t1 = setTimeout(updateHeight, 200);
        const t2 = setTimeout(updateHeight, 600);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [content]);

    return (
        <iframe
            ref={iframeRef}
            title="Email Content"
            srcDoc={content}
            style={{
                width: "100%",
                height: height,
                border: "none",
                borderRadius: "8px",
                background: "#ffffff",
                minHeight: "200px"
            }}
            onLoad={() => {
                if (iframeRef.current && iframeRef.current.contentWindow) {
                    try {
                        const doc = iframeRef.current.contentWindow.document;
                        if (doc && doc.body) {
                            const newHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
                            if (newHeight > 50) {
                                setHeight(`${newHeight + 30}px`);
                            }
                        }
                    } catch (e) {}
                }
            }}
            sandbox="allow-popups allow-same-origin"
        />
    );
}

function EmailDetails({
    email,
    onBack
}) {
    const [viewMode, setViewMode] = useState("formatted");

    if (!email) {
        return null;
    }

    const senderName =
        email.sender?.includes("<")
            ? email.sender
                .split("<")[0]
                .trim()
            : email.sender || "Unknown";

    const hasHtml = isHtml(email.body);

    return (
        <div className="email-details">

            <button
                className="back-button"
                onClick={onBack}
            >

                <ArrowLeft size={17} />

                Back to inbox

            </button>


            <div className="detail-header">

                <div className="detail-avatar">
                    {senderName
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div>

                    <h2>
                        {email.subject ||
                            "No subject"}
                    </h2>

                    <div className="detail-meta">

                        <span>
                            <User size={14} />

                            {email.sender}
                        </span>

                        <span>
                            <Clock size={14} />

                            {email.date}
                        </span>

                    </div>

                </div>

            </div>


            <div className="email-content-card">

                <div className="content-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Mail size={16} />

                        Email Content
                    </div>

                    {hasHtml && (
                        <div className="view-toggle" style={{ display: "flex", gap: "6px" }}>
                            <button
                                type="button"
                                onClick={() => setViewMode("formatted")}
                                style={{
                                    padding: "4px 10px",
                                    fontSize: "12px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--border)",
                                    background: viewMode === "formatted" ? "var(--primary)" : "transparent",
                                    color: viewMode === "formatted" ? "#fff" : "var(--secondary)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px"
                                }}
                            >
                                <Eye size={13} />
                                Formatted
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("text")}
                                style={{
                                    padding: "4px 10px",
                                    fontSize: "12px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--border)",
                                    background: viewMode === "text" ? "var(--primary)" : "transparent",
                                    color: viewMode === "text" ? "#fff" : "var(--secondary)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px"
                                }}
                            >
                                <FileText size={13} />
                                Plain Text
                            </button>
                        </div>
                    )}

                </div>

                <div className="email-body-wrapper" style={{ marginTop: "12px" }}>
                    {!email.body ? (
                        <div className="email-body">No email content available.</div>
                    ) : hasHtml && viewMode === "formatted" ? (
                        <EmailIframe content={email.body} />
                    ) : (
                        <div className="email-body" style={{ whiteSpace: "pre-wrap" }}>
                            {hasHtml ? stripHtml(email.body) : email.body}
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}

export default EmailDetails;