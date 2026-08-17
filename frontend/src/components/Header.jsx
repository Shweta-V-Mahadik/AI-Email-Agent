import {
    Menu,
    RefreshCw,
    User,
    Bot,
    Sparkles
} from "lucide-react";

function Header({
    setMobileOpen,
    onRefresh,
    refreshing
}) {

    return (
        <header className="header">

            <div className="header-left">

                <button
                    className="menu-button"
                    onClick={() =>
                        setMobileOpen(true)
                    }
                >
                    <Menu size={21} />
                </button>

                <div className="header-brand-logo">
                    <div className="nav-logo-badge">
                        <Bot size={20} />
                    </div>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <h1 style={{ margin: 0 }}>
                                EmailAI
                            </h1>
                            <span className="header-ai-tag">
                                <Sparkles size={11} />
                                AI Powered
                            </span>
                        </div>

                        <p style={{ margin: "2px 0 0" }}>
                            Intelligent email agent & workspace
                        </p>
                    </div>
                </div>

            </div>


            <div className="header-actions">

                <button
                    className="refresh-button"
                    onClick={onRefresh}
                    disabled={refreshing}
                >

                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? "spin"
                                : ""
                        }
                    />

                    <span>
                        Refresh
                    </span>

                </button>


                <div className="profile">

                    <div className="profile-avatar">
                        <User size={17} />
                    </div>

                    <div className="profile-info">

                        <strong>
                            Shweta
                        </strong>

                        <span>
                            User
                        </span>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Header;