import {
    LayoutDashboard,
    Inbox,
    MailCheck,
    Bot,
    X
} from "lucide-react";

function Sidebar({
    activeTab = "dashboard",
    onTabChange = () => {},
    mobileOpen,
    setMobileOpen
}) {

    return (
        <>
            {mobileOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={`sidebar ${
                    mobileOpen
                        ? "sidebar-open"
                        : ""
                }`}
            >

                <div className="sidebar-top">

                    <div className="brand">

                        <div className="brand-icon">
                            <Bot size={21} />
                        </div>

                        <div>
                            <div className="brand-name">
                                EmailAI
                            </div>

                            <div className="brand-subtitle">
                                Smart AI inbox
                            </div>
                        </div>

                    </div>

                    <button
                        className="mobile-close"
                        onClick={() =>
                            setMobileOpen(false)
                        }
                    >
                        <X size={20} />
                    </button>

                </div>


                <nav className="sidebar-nav">

                    <div className="nav-label">
                        WORKSPACE
                    </div>

                    <a
                        className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                        onClick={() => {
                            onTabChange("dashboard");
                            setMobileOpen(false);
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </a>

                    <a
                        className={`nav-item ${activeTab === "inbox" ? "active" : ""}`}
                        onClick={() => {
                            onTabChange("inbox");
                            setMobileOpen(false);
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        <Inbox size={18} />
                        <span>Inbox</span>
                    </a>

                    <a
                        className={`nav-item ${activeTab === "processed" ? "active" : ""}`}
                        onClick={() => {
                            onTabChange("processed");
                            setMobileOpen(false);
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        <MailCheck size={18} />
                        <span>Processed Emails</span>
                    </a>

                </nav>


                <div className="agent-status">

                    <div className="status-title">
                        <span className="status-dot"></span>
                        AI Agent Status
                    </div>

                    <div className="status-active">
                        Active
                    </div>

                    <div className="status-model">
                        Ollama · Llama 3.2
                    </div>

                </div>

            </aside>
        </>
    );
}

export default Sidebar;