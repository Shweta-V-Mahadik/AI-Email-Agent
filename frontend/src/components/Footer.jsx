import { Bot, Sparkles, Heart } from "lucide-react";

function Footer() {
    return (
        <footer className="app-footer">
            <div className="footer-content">

                <div className="footer-brand">
                    <div className="footer-logo">
                        <Bot size={16} />
                    </div>
                    <span className="footer-title">EmailAI</span>
                    <span className="footer-divider">•</span>
                    <span className="footer-model">
                        <Sparkles size={12} style={{ display: "inline", marginRight: "4px", color: "var(--periwinkle)" }} />
                        Ollama Llama 3.2 Engine
                    </span>
                </div>

                <div className="footer-right">
                    <span>Autonomous Email Assistant</span>
                    <span className="footer-divider">•</span>
                    <span>© {new Date().getFullYear()} EmailAI</span>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
