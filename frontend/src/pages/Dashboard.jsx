import {
    useEffect,
    useState
} from "react";

import {
    Mail,
    CheckCircle2,
    Clock3,
    Send
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import AIAnalysis from "../components/AIAnalysis";
import GeneratedReply from "../components/GeneratedReply";
import LoadingState from "../components/LoadingState";
import Footer from "../components/Footer";
import ProcessedEmailsView from "./ProcessedEmailsView";
import DashboardOverview from "./DashboardOverview";

import {
    getGmailEmails,
    processEmail,
    generateReply,
    sendReply,
    regenerateReply
} from "../services/api";


function Dashboard() {

    const [activeTab, setActiveTab] =
        useState("dashboard");

    const [emails, setEmails] =
        useState([]);

    const [selectedEmail, setSelectedEmail] =
        useState(null);

    const [processedEmail, setProcessedEmail] =
        useState(null);

    const [reply, setReply] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [analyzing, setAnalyzing] =
        useState(false);

    const [generatingReply, setGeneratingReply] =
        useState(false);

    const [regenerating, setRegenerating] =
        useState(false);

    const [sending, setSending] =
        useState(false);

    const [sent, setSent] =
        useState(false);

    const [mobileOpen, setMobileOpen] =
        useState(false);


    // =====================================================
    // LOAD EMAILS
    // =====================================================

    const loadEmails = async () => {

        try {

            setRefreshing(true);

            const data =
                await getGmailEmails();

            setEmails(
                data.emails || []
            );

        } catch (error) {

            console.error(
                "Failed to load emails:",
                error
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    useEffect(() => {

        loadEmails();

    }, []);


    // =====================================================
    // SELECT EMAIL
    // =====================================================

    // =====================================================
    // SELECT EMAIL
    // =====================================================

    const handleSelectEmail = async (email) => {

        setSelectedEmail(email);

        setReply("");

        setSent(false);

        setMobileOpen(false);

        // -------------------------------------------------
        // If email was already processed in database,
        // we can use its analysis immediately.
        // -------------------------------------------------

        const isAlreadyProcessed =
            Number(email.processed) === 1 ||
            Boolean(email.summary);

        if (isAlreadyProcessed) {

            setProcessedEmail(
                email
            );

            if (email.generated_reply) {
                setReply(email.generated_reply);
            }

            if (Number(email.reply_sent) === 1) {
                setSent(true);
            }

            return;
        }


        // -------------------------------------------------
        // Otherwise process this ONE email with AI.
        // -------------------------------------------------

        setProcessedEmail(null);

        setAnalyzing(true);


        try {

            const targetId =
                email.db_id ||
                email.id ||
                email.gmail_id;

            const result =
                await processEmail(
                    targetId
                );

            const updatedEmail = {
                ...email,
                ...result,
                processed: 1
            };


            setProcessedEmail(
                updatedEmail
            );

            if (result.generated_reply) {
                setReply(result.generated_reply);
            }

            if (Number(result.reply_sent) === 1) {
                setSent(true);
            }


            // Update email in list

            setEmails(prev =>
                prev.map(item =>
                    (item.id === email.id || item.gmail_id === result.gmail_id)
                        ? updatedEmail
                        : item
                )
            );

        } catch (error) {

            console.error(
                "Analysis error:",
                error
            );

            alert(
                "Unable to analyze this email. Please try again."
            );

        } finally {

            setAnalyzing(false);

        }
    };


    // =====================================================
    // GENERATE REPLY
    // =====================================================

    const handleGenerateReply = async () => {

        if (!processedEmail) {

            return;
        }


        setGeneratingReply(true);


        try {

            const targetId = processedEmail.db_id || processedEmail.id || processedEmail.gmail_id;

            const result =
                await generateReply(
                    targetId
                );


            setProcessedEmail(
                result
            );


            setReply(
                result.generated_reply ||
                ""
            );

            if (result.reply_sent === 1) {
                setSent(true);
            }

            // Update email in list state
            setEmails(prev =>
                prev.map(item =>
                    (item.id === selectedEmail?.id || item.gmail_id === result.gmail_id)
                        ? {
                            ...item,
                            ...result,
                            generated_reply: result.generated_reply
                        }
                        : item
                )
            );


        } catch (error) {

            console.error(
                "Reply generation error:",
                error
            );

            alert(
                "Unable to generate reply. Please try again."
            );

        } finally {

            setGeneratingReply(false);

        }
    };


    // =====================================================
    // REGENERATE
    // =====================================================

    const handleRegenerate = async (instruction) => {
        const targetEmail = processedEmail || selectedEmail;
        if (!targetEmail) return;

        if (!instruction || !instruction.trim()) {
            return;
        }

        const targetId = targetEmail.db_id || targetEmail.id || targetEmail.gmail_id;

        setRegenerating(true);

        try {
            const response = await regenerateReply(targetId, instruction);

            if (response && response.reply) {
                setReply(response.reply);

                setProcessedEmail(prev => prev ? { ...prev, generated_reply: response.reply } : prev);

                setEmails(prev =>
                    prev.map(item =>
                        (item.id === targetEmail.id || item.gmail_id === targetEmail.gmail_id)
                            ? { ...item, generated_reply: response.reply }
                            : item
                    )
                );
            }
        } catch (error) {
            console.error("Reply regeneration failed:", error);
            alert("Unable to regenerate reply. Please try again.");
        } finally {
            setRegenerating(false);
        }
    };


    // =====================================================
    // SEND REPLY
    // =====================================================

    const handleSendReply = async () => {

        if (!processedEmail) {

            return;
        }


        if (!reply.trim()) {

            alert(
                "Reply cannot be empty."
            );

            return;
        }


        setSending(true);


        try {

            const targetId = processedEmail.db_id || processedEmail.id || processedEmail.gmail_id;

            await sendReply(
                targetId
            );


            setSent(true);

            setEmails(prev =>
                prev.map(item =>
                    (item.id === selectedEmail?.id || item.gmail_id === processedEmail.gmail_id)
                        ? {
                            ...item,
                            reply_sent: 1
                        }
                        : item
                )
            );


        } catch (error) {

            console.error(
                "Send error:",
                error
            );

            alert(
                "Unable to send email."
            );

        } finally {

            setSending(false);

        }
    };


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalEmails =
        emails.length;


    const processedCount =
        emails.filter(
            email =>
                email.processed === 1
        ).length;


    const pendingCount =
        totalEmails -
        processedCount;


    const repliesGenerated =
        emails.filter(
            email =>
                email.generated_reply &&
                email.generated_reply.trim()
        ).length;


    return (
        <div className="app">

            <Sidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                    setActiveTab(tab);
                    setSelectedEmail(null);
                }}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />


            <main className="main-content">

                <Header
                    setMobileOpen={setMobileOpen}
                    onRefresh={loadEmails}
                    refreshing={refreshing}
                />


                <div className="dashboard-content">

                    {/* ================================= */}
                    {/* STATISTICS */}
                    {/* ================================= */}

                    <section className="stats-grid">

                        <StatCard
                            icon={<Mail size={19} />}
                            label="Total Emails"
                            value={totalEmails}
                            description="Emails in your inbox"
                        />

                        <StatCard
                            icon={
                                <CheckCircle2 size={19} />
                            }
                            label="Processed"
                            value={processedCount}
                            description="Analyzed by AI"
                        />

                        <StatCard
                            icon={<Clock3 size={19} />}
                            label="Pending"
                            value={pendingCount}
                            description="Awaiting analysis"
                        />

                        <StatCard
                            icon={<Send size={19} />}
                            label="Replies Generated"
                            value={repliesGenerated}
                            description="AI drafts created"
                        />

                    </section>


                    {/* ================================= */}
                    {/* MAIN WORKSPACE */}
                    {/* ================================= */}

                    {!selectedEmail ? (

                        activeTab === "dashboard" ? (

                            <DashboardOverview
                                emails={emails}
                                onNavigateTab={(tab) => {
                                    setActiveTab(tab);
                                    setSelectedEmail(null);
                                }}
                                onSelectEmail={handleSelectEmail}
                            />

                        ) : activeTab === "processed" ? (

                            <ProcessedEmailsView
                                emails={emails}
                                onSelectEmail={handleSelectEmail}
                            />

                        ) : (

                            <section className="inbox-section">

                                <div className="section-header">

                                    <div>

                                        <h2>
                                            Inbox
                                        </h2>

                                        <p>
                                            Select an email to analyze
                                        </p>

                                    </div>

                                    <span className="email-count">
                                        {totalEmails} emails
                                    </span>

                                </div>


                                {loading ? (

                                    <LoadingState
                                        text="Loading emails..."
                                    />

                                ) : (

                                    <EmailList
                                        emails={emails}
                                        selectedEmail={
                                            selectedEmail
                                        }
                                        onSelect={
                                            handleSelectEmail
                                        }
                                    />

                                )}

                            </section>

                        )

                    ) : (

                        <section className="email-workspace">

                            <EmailDetails
                                email={
                                    selectedEmail
                                }
                                onBack={() => {

                                    setSelectedEmail(
                                        null
                                    );

                                    setProcessedEmail(
                                        null
                                    );

                                }}
                            />


                            <AIAnalysis
                                email={
                                    processedEmail || selectedEmail
                                }
                                analyzing={
                                    analyzing
                                }
                                onGenerateReply={
                                    handleGenerateReply
                                }
                                generatingReply={
                                    generatingReply
                                }
                            />


                            {processedEmail && (
                                <GeneratedReply
                                    reply={reply}
                                    setReply={setReply}
                                    onRegenerate={
                                        handleRegenerate
                                    }
                                    onSend={
                                        handleSendReply
                                    }
                                    generating={
                                        generatingReply
                                    }
                                    regenerating={
                                        regenerating
                                    }
                                    sending={
                                        sending
                                    }
                                    sent={
                                        sent
                                    }
                                />
                            )}

                        </section>

                    )}

                </div>

                <Footer />

            </main>

        </div>
    );
}

export default Dashboard;