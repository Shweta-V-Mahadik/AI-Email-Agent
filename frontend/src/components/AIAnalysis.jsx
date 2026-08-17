import {
    Brain,
    Tag,
    Sparkles
} from "lucide-react";

function AIAnalysis({
    email,
    analyzing,
    onGenerateReply,
    generatingReply
}) {

    if (!email && !analyzing) {

        return (
            <div className="analysis-empty">

                <div className="analysis-empty-icon">
                    <Brain size={24} />
                </div>

                <h3>
                    Select an email
                </h3>

                <p>
                    Choose an email from your inbox
                    to view AI analysis.
                </p>

            </div>
        );
    }


    const cleanSummaryText = (text) => {
        if (!text) return "";
        const lines = text.trim().split("\n").filter(l => l.trim());
        if (lines.length > 0 && /^(here\s+is|this\s+is|summary:)/i.test(lines[0])) {
            return lines.slice(1).join("\n").trim();
        }
        return text.trim();
    };

    const displaySummary = cleanSummaryText(email.summary);

    return (
        <div className="analysis-card">

            <div className="analysis-header">

                <div className="analysis-title">

                    <div className="analysis-icon">
                        <Brain size={19} />
                    </div>

                    <div>

                        <h2>
                            AI Analysis
                        </h2>

                        <p>
                            Intelligent email insights
                        </p>

                    </div>

                </div>

                <span className="ai-powered">
                    AI Powered
                </span>

            </div>


            {analyzing ? (

                <div className="analysis-loading">

                    <div className="spinner"></div>

                    <span>
                        Analyzing email...
                    </span>

                </div>

            ) : (

                <>

                    <div className="analysis-section">

                        <div className="analysis-label">
                            Summary
                        </div>

                        <p className="summary">
                            {displaySummary ||
                                "No AI summary available yet."}
                        </p>

                    </div>


                    <div className="analysis-meta">

                        <div className="analysis-meta-item">

                            <div className="meta-icon">
                                <Tag size={16} />
                            </div>

                            <div>

                                <span>
                                    Category
                                </span>

                                <strong>
                                    {email.category ||
                                        "Not classified"}
                                </strong>

                            </div>

                        </div>


                        <div className="analysis-meta-item">

                            <div className="meta-icon">
                                <Sparkles size={16} />
                            </div>

                            <div>

                                <span>
                                    Status
                                </span>

                                <strong>
                                    Analysis complete
                                </strong>

                            </div>

                        </div>

                    </div>


                    <div className="generate-area">

                        <div>

                            <h3>
                                AI Reply
                            </h3>

                            <p>
                                The reply will only be
                                generated when you request it.
                            </p>

                        </div>


                        <button
                            className="generate-button"
                            onClick={onGenerateReply}
                            disabled={generatingReply}
                        >

                            <Sparkles size={17} />

                            {generatingReply
                                ? "Generating..."
                                : "Generate AI Reply"}

                        </button>

                    </div>

                </>

            )}

        </div>
    );
}

export default AIAnalysis;