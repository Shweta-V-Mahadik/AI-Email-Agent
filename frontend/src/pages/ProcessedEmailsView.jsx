import { useState } from "react";
import { Search, MailCheck, Sparkles, Filter } from "lucide-react";
import ProcessedEmailCard from "../components/ProcessedEmailCard";

function ProcessedEmailsView({ emails, onSelectEmail }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    // Filter processed emails
    const processedEmails = emails.filter(
        email => Number(email.processed) === 1 || Boolean(email.summary)
    );

    const categories = ["ALL", "WORK", "IMPORTANT", "PERSONAL", "PROMOTION", "SPAM"];

    const filteredEmails = processedEmails.filter(email => {
        const matchesSearch =
            !searchTerm ||
            (email.subject || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (email.sender || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (email.summary || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCat =
            selectedCategory === "ALL" ||
            (email.category || "").toUpperCase().includes(selectedCategory);

        return matchesSearch && matchesCat;
    });

    return (
        <div className="processed-emails-view">

            {/* Top Toolbar */}
            <div className="processed-toolbar">

                <div className="processed-search">
                    <Search size={16} className="processed-search-icon" />
                    <input
                        type="text"
                        placeholder="Search processed email summaries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="processed-category-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

            </div>

            {/* Email Grid or Empty State */}
            {filteredEmails.length === 0 ? (
                <div className="analysis-empty" style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid var(--border)", padding: "48px 24px" }}>
                    <div className="analysis-empty-icon" style={{ background: "#E4ECF8", color: "var(--periwinkle)" }}>
                        <MailCheck size={28} />
                    </div>
                    <h3>No Processed Emails Found</h3>
                    <p>
                        {processedEmails.length === 0
                            ? "Select emails from your inbox to analyze them with AI. Their summaries and replies will appear here."
                            : "No processed emails match your search filter."}
                    </p>
                </div>
            ) : (
                <div className="processed-grid">
                    {filteredEmails.map(email => (
                        <ProcessedEmailCard
                            key={email.id || email.gmail_id}
                            email={email}
                            onViewDetails={onSelectEmail}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}

export default ProcessedEmailsView;
