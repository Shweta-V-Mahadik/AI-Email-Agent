import { useState } from "react";
import {
    Brain,
    Bot,
    Sparkles,
    Send,
    MailCheck,
    Inbox,
    Shield,
    Database,
    Zap,
    ArrowRight,
    Flame,
    Clock,
    CheckCircle2,
    Check
} from "lucide-react";
import DonutChart from "../components/DonutChart";

function cleanSummary(text) {
    if (!text) return "";
    const lines = text.trim().split("\n").filter(l => l.trim());
    if (lines.length > 0 && /^(here\s+is|this\s+is|summary:)/i.test(lines[0])) {
        return lines.slice(1).join("\n").trim();
    }
    return text.trim();
}

function DashboardOverview({ emails = [], onNavigateTab, onSelectEmail }) {
    const [readPriorityIds, setReadPriorityIds] = useState(() => {
        try {
            const saved = localStorage.getItem("readPriorityIds");
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch (e) {
            return new Set();
        }
    });

    const handleMarkAsRead = (id) => {
        if (!id) return;
        setReadPriorityIds(prev => {
            const next = new Set(prev);
            next.add(String(id));
            try {
                localStorage.setItem("readPriorityIds", JSON.stringify(Array.from(next)));
            } catch (e) {
                console.error(e);
            }
            return next;
        });
    };

    const totalEmails = emails.length;

    const processedCount = emails.filter(
        e => Number(e.processed) === 1 || Boolean(e.summary)
    ).length;

    const pendingCount = totalEmails - processedCount;

    const repliesGenerated = emails.filter(
        e => e.generated_reply && e.generated_reply.trim()
    ).length;

    const repliesSent = emails.filter(
        e => Number(e.reply_sent) === 1
    ).length;

    const repliesPendingSend = Math.max(0, repliesGenerated - repliesSent);

    // Filter High Priority Emails (Work, Important or Urgent keywords AND not marked as read)
    const isHighPriority = (e) => {
        const emailId = String(e.id || e.gmail_id || "");
        if (readPriorityIds.has(emailId)) return false;

        const cat = (e.category || "").toUpperCase();
        const subj = (e.subject || "").toLowerCase();
        const summ = (e.summary || "").toLowerCase();

        const isUrgentCat = cat.includes("IMPORTANT") || cat.includes("WORK");
        const hasUrgentKeywords =
            /urgent|asap|deadline|action|priority|critical|alert|immediately|payment|meeting|important|due|security/i.test(subj) ||
            /urgent|asap|deadline|action|priority|critical|alert|immediately|payment|meeting|important|due/i.test(summ);

        return isUrgentCat || hasUrgentKeywords;
    };

    const priorityEmails = emails.filter(isHighPriority);

    const getCategoryClass = (cat = "") => {
        const val = cat.toLowerCase();
        if (val.includes("important") || val.includes("personal")) return "category-important";
        if (val.includes("work")) return "category-work";
        if (val.includes("promotion")) return "category-promotion";
        return "category-default";
    };

    // Categories Breakdown
    const catMap = {
        WORK: 0,
        IMPORTANT: 0,
        PERSONAL: 0,
        PROMOTION: 0,
        SPAM: 0,
        OTHER: 0
    };

    emails.forEach(e => {
        const cat = (e.category || "").toUpperCase();
        if (cat.includes("WORK")) catMap.WORK++;
        else if (cat.includes("IMPORTANT")) catMap.IMPORTANT++;
        else if (cat.includes("PERSONAL")) catMap.PERSONAL++;
        else if (cat.includes("PROMOTION")) catMap.PROMOTION++;
        else if (cat.includes("SPAM")) catMap.SPAM++;
        else if (e.processed === 1) catMap.OTHER++;
    });

    // Chart 1: Processing Status
    const statusChartData = [
        { label: "Processed", value: processedCount, color: "#00CC96" },
        { label: "Pending", value: pendingCount, color: "#636EFA" }
    ];

    // Chart 2: Category Distribution
    const categoryChartData = [
        { label: "Work", value: catMap.WORK, color: "#636EFA" },
        { label: "Important", value: catMap.IMPORTANT, color: "#AB63FA" },
        { label: "Personal", value: catMap.PERSONAL, color: "#00CC96" },
        { label: "Promotion", value: catMap.PROMOTION, color: "#FECB52" },
        { label: "Spam / Other", value: catMap.SPAM + catMap.OTHER, color: "#EF553B" }
    ].filter(item => item.value > 0 || processedCount === 0);

    // Chart 3: AI Activity
    const aiActivityChartData = [
        { label: "Replies Sent", value: repliesSent, color: "#00CC96" },
        { label: "Drafts Ready", value: repliesPendingSend, color: "#636EFA" },
        { label: "Awaiting Reply", value: Math.max(0, processedCount - repliesGenerated), color: "#FECB52" }
    ];

    return (
        <div className="dashboard-overview">

            {/* Landing Hero Banner */}
            <div className="overview-hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Bot size={15} />
                        <span>Autonomous Agentic AI</span>
                    </div>

                    <h2>AI Email Agent & Intelligence Suite</h2>
                    <p>
                        Powered by <strong>Ollama Llama 3.2</strong>. An end-to-end intelligent assistant for automatic email summarization, multi-class classification, contextual draft generation, and secure SMTP delivery.
                    </p>

                    <div className="hero-actions">
                        <button
                            className="hero-btn primary"
                            onClick={() => onNavigateTab("inbox")}
                        >
                            <Inbox size={16} />
                            <span>Go to Inbox</span>
                            <ArrowRight size={15} />
                        </button>

                        <button
                            className="hero-btn secondary"
                            onClick={() => onNavigateTab("processed")}
                        >
                            <MailCheck size={16} />
                            <span>View Processed Summaries</span>
                        </button>
                    </div>
                </div>

                <div className="hero-model-card">
                    <div className="model-header">
                        <Brain size={22} className="model-icon" />
                        <div>
                            <h4>Ollama Llama 3.2</h4>
                            <span>Active Agent Model</span>
                        </div>
                    </div>
                    <div className="model-stats">
                        <div className="m-stat">
                            <span className="m-val">{totalEmails}</span>
                            <span className="m-lbl">Emails Fetched</span>
                        </div>
                        <div className="m-stat">
                            <span className="m-val">{processedCount}</span>
                            <span className="m-lbl">AI Summarized</span>
                        </div>
                        <div className="m-stat">
                            <span className="m-val">{priorityEmails.length}</span>
                            <span className="m-lbl">High Priority</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===================================================== */}
            {/* HIGH PRIORITY EMAILS SECTION */}
            {/* ===================================================== */}
            <div className="overview-section-title" style={{ marginTop: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="priority-section-badge">
                        <Flame size={16} />
                        <span>High Priority</span>
                    </div>
                    <div>
                        <h3>High Priority Action Emails</h3>
                        <p>Emails requiring immediate attention based on AI category and urgency detection</p>
                    </div>
                </div>
                <span className="priority-count-pill">
                    {priorityEmails.length} Urgent Email{priorityEmails.length !== 1 ? "s" : ""}
                </span>
            </div>

            {priorityEmails.length === 0 ? (
                <div className="priority-empty-card">
                    <div className="priority-empty-icon">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h4>All Clear! No High Priority Emails Pending</h4>
                        <p>All priority emails have been reviewed or marked as read.</p>
                    </div>
                </div>
            ) : (
                <div className="priority-emails-grid">
                    {priorityEmails.slice(0, 4).map(email => (
                        <div key={email.id || email.gmail_id} className="priority-card">
                            <div className="priority-card-header">
                                <span className="priority-flame-tag">
                                    <Flame size={12} /> High Priority
                                </span>
                                <span className="priority-date">
                                    <Clock size={12} /> {email.date || ""}
                                </span>
                            </div>

                            <div className="priority-sender-info">
                                <strong>{email.sender?.split("<")[0]?.trim() || email.sender || "Sender"}</strong>
                                <span>{email.sender?.includes("<") ? email.sender.split("<")[1]?.replace(">", "") : ""}</span>
                            </div>

                            <h4 className="priority-subject">
                                {email.subject || "No Subject"}
                            </h4>

                            {email.summary ? (
                                <div className="priority-summary-preview">
                                    {cleanSummary(email.summary)}
                                </div>
                            ) : (
                                <div className="priority-summary-preview" style={{ fontStyle: "italic", opacity: 0.8 }}>
                                    Pending AI analysis summary...
                                </div>
                            )}

                            <div className="priority-card-footer">
                                <button
                                    className="mark-read-btn"
                                    onClick={(ev) => {
                                        ev.stopPropagation();
                                        handleMarkAsRead(email.id || email.gmail_id);
                                    }}
                                    title="Mark as read and remove from priority section"
                                >
                                    <Check size={14} />
                                    <span>Mark as Read</span>
                                </button>

                                <button
                                    className="priority-action-btn"
                                    onClick={() => onSelectEmail(email)}
                                >
                                    <span>Open & Respond</span>
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Analytics Section Title */}
            <div className="overview-section-title" style={{ marginTop: "10px" }}>
                <div>
                    <h3>Analytics & Inbox Insights</h3>
                    <p>Real-time analytics distribution of your email workflows</p>
                </div>
            </div>

            {/* Donut Charts Grid */}
            <div className="donuts-grid">
                <DonutChart
                    title="Processing Overview"
                    subtitle="Processed vs Pending AI analysis"
                    data={statusChartData}
                    centerLabel="Total Inbox"
                    centerValue={totalEmails}
                />

                <DonutChart
                    title="Category Distribution"
                    subtitle="AI multi-class classification breakdown"
                    data={categoryChartData}
                    centerLabel="Categorized"
                    centerValue={processedCount}
                />

                <DonutChart
                    title="AI Reply & Delivery Status"
                    subtitle="Drafts generated, sent, and pending"
                    data={aiActivityChartData}
                    centerLabel="AI Drafts"
                    centerValue={repliesGenerated}
                />
            </div>

            {/* Agent Capabilities Showcase */}
            <div className="overview-section-title" style={{ marginTop: "12px" }}>
                <div>
                    <h3>Agent Capabilities & System Architecture</h3>
                    <p>Core features and pipeline design of the AI Email Agent</p>
                </div>
            </div>

            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon-wrapper" style={{ background: "#E4ECF8", color: "#636EFA" }}>
                        <Brain size={20} />
                    </div>
                    <h4>Auto-Summarization</h4>
                    <p>
                        Condenses lengthy email threads and HTML newsletters into clean 2-to-3 sentence executive summaries.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon-wrapper" style={{ background: "#F3DCF1", color: "#793175" }}>
                        <Zap size={20} />
                    </div>
                    <h4>Smart Categorization</h4>
                    <p>
                        Automatically routes emails into Work, Important, Personal, Promotion, or Spam for prioritized triage.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon-wrapper" style={{ background: "#E0F2E3", color: "#2E7D32" }}>
                        <Sparkles size={20} />
                    </div>
                    <h4>Contextual AI Replies</h4>
                    <p>
                        Generates polite, professional responses tailored to the sender and topic using Ollama Llama 3.2.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon-wrapper" style={{ background: "#F4E8D7", color: "#8C6228" }}>
                        <Send size={20} />
                    </div>
                    <h4>SMTP Direct Sending</h4>
                    <p>
                        Dispatches approved responses directly to recipients via secure Gmail SMTP with one click.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon-wrapper" style={{ background: "#E4ECF8", color: "#636EFA" }}>
                        <Database size={20} />
                    </div>
                    <h4>Persistent SQLite Memory</h4>
                    <p>
                        Stores all fetched emails, AI summaries, and generated drafts in SQLite (`emails.db`) across restarts.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon-wrapper" style={{ background: "#EFECE6", color: "#121824" }}>
                        <Shield size={20} />
                    </div>
                    <h4>Privacy-First Architecture</h4>
                    <p>
                        Executes local LLM inference via Ollama without sharing sensitive email contents with third parties.
                    </p>
                </div>
            </div>

        </div>
    );
}

export default DashboardOverview;
