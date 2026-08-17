import { useState } from "react";
import {
    Copy,
    RefreshCw,
    Send,
    Check,
    Sparkles,
    X
} from "lucide-react";

function GeneratedReply({
    reply,
    setReply,
    onRegenerate,
    onSend,
    generating,
    regenerating,
    sending,
    sent
}) {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState("");
    const [customInstruction, setCustomInstruction] = useState("");

    const presetStyles = [
        {
            label: "More Professional",
            instruction: "Rewrite the reply in a professional and polished tone."
        },
        {
            label: "More Friendly",
            instruction: "Rewrite the reply in a warm, friendly and approachable tone."
        },
        {
            label: "Shorter",
            instruction: "Make the reply shorter and more concise while preserving all important information."
        },
        {
            label: "More Detailed",
            instruction: "Make the reply more detailed and informative while remaining professional."
        },
        {
            label: "More Formal",
            instruction: "Rewrite the reply in a formal, respectful and professional tone."
        }
    ];

    if (!reply && !generating && !regenerating) {
        return (
            <div className="reply-empty">
                <div className="reply-empty-icon">
                    <Send size={21} />
                </div>
                <h3>No AI reply generated yet</h3>
                <p>Click "Generate AI Reply" to create a response.</p>
            </div>
        );
    }

    const copyReply = async () => {
        try {
            await navigator.clipboard.writeText(reply);
            alert("Reply copied to clipboard.");
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectPreset = (style) => {
        setSelectedPreset(style.label);
        setCustomInstruction(style.instruction);
    };

    const handleConfirmRegenerate = () => {
        const finalInstruction = customInstruction.trim();
        if (!finalInstruction) return;

        setShowOptions(false);
        onRegenerate(finalInstruction);
    };

    return (
        <div className="reply-card">

            <div className="reply-header">
                <div>
                    <h2>AI Generated Reply</h2>
                    <p>Review and edit before sending.</p>
                </div>
                <span className="draft-badge">Draft</span>
            </div>

            {generating || regenerating ? (
                <div className="reply-loading">
                    <div className="spinner"></div>
                    <span>
                        {regenerating ? "Regenerating reply..." : "Generating AI reply..."}
                    </span>
                </div>
            ) : (
                <>
                    <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        className="reply-textarea"
                        placeholder="Your generated reply will appear here..."
                    />

                    <div className="reply-actions">
                        <button
                            className="secondary-button"
                            onClick={() => setShowOptions(true)}
                            disabled={generating || regenerating}
                        >
                            <RefreshCw size={16} className={regenerating ? "spin" : ""} />
                            <span>Regenerate</span>
                        </button>

                        <button
                            className="secondary-button"
                            onClick={copyReply}
                            disabled={generating || regenerating || !reply.trim()}
                        >
                            <Copy size={16} />
                            <span>Copy</span>
                        </button>

                        <button
                            className="send-button"
                            onClick={onSend}
                            disabled={
                                sending ||
                                sent ||
                                generating ||
                                regenerating ||
                                !reply.trim()
                            }
                        >
                            {sent ? <Check size={16} /> : <Send size={16} />}
                            <span>
                                {sent
                                    ? "Sent"
                                    : sending
                                        ? "Sending..."
                                        : "Send Reply"}
                            </span>
                        </button>
                    </div>
                </>
            )}

            {/* Regeneration Options Popover/Modal */}
            {showOptions && (
                <div className="regen-overlay" onClick={() => setShowOptions(false)}>
                    <div className="regen-modal" onClick={(e) => e.stopPropagation()}>

                        <div className="regen-header">
                            <div className="regen-title">
                                <Sparkles size={18} style={{ color: "#636EFA" }} />
                                <h3>Regenerate Reply</h3>
                            </div>
                            <button
                                className="regen-close-btn"
                                onClick={() => setShowOptions(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="regen-body">
                            <label className="regen-label">Choose a style:</label>
                            <div className="style-chips">
                                {presetStyles.map((style) => (
                                    <button
                                        key={style.label}
                                        className={`style-chip ${selectedPreset === style.label ? "active" : ""}`}
                                        onClick={() => handleSelectPreset(style)}
                                    >
                                        {style.label}
                                    </button>
                                ))}
                            </div>

                            <label className="regen-label" style={{ marginTop: "14px" }}>
                                Custom Instruction
                            </label>
                            <input
                                type="text"
                                className="regen-input"
                                placeholder="e.g. Make this reply more concise and polite"
                                value={customInstruction}
                                onChange={(e) => {
                                    setCustomInstruction(e.target.value);
                                    setSelectedPreset("");
                                }}
                            />
                        </div>

                        <div className="regen-footer">
                            <button
                                className="secondary-button"
                                onClick={() => setShowOptions(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="generate-button"
                                onClick={handleConfirmRegenerate}
                                disabled={!customInstruction.trim()}
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                            >
                                <Sparkles size={16} />
                                <span>Generate</span>
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default GeneratedReply;