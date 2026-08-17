# 📧 AI Email Agent

An intelligent, privacy-focused AI Email Management System powered by **FastAPI**, **React (Vite)**, **SQLite**, and local LLMs via **Ollama (Llama 3.2)**. 

This agent automatically fetches incoming emails from Gmail, summarizes their content, categorizes them, generates smart context-aware draft replies, allows prompt-driven reply regeneration, and sends emails back directly via SMTP.

---

## 🌟 Key Features

- **📥 Real-Time Gmail Fetching**: Connects securely to your Gmail inbox using IMAP.
- **🤖 Local AI Processing**: Powered by Ollama (`llama3.2`) running locally—completely free, private, and offline-capable without relying on paid APIs.
- **📝 Automatic Summarization & Classification**: Summarizes lengthy emails into key points and categorizes them (e.g., Work, Personal, Important, Marketing, etc.).
- **⚡ Smart Reply Generation**: Generates appropriate, polite response drafts automatically based on email context.
- **✏️ Interactive Reply Regeneration**: Refine and tweak generated replies by giving custom instructions (e.g., *"Make it more formal"*, *"Decline politely"*).
- **📤 One-Click Email Dispatch**: Send replies directly to recipients using Gmail SMTP with automatic `Re:` subject formatting.
- **💾 Local SQLite Storage**: Stores processed emails, summaries, categories, and reply status in a local `emails.db` database.
- **🎨 Modern React UI**: Built with React 19, Vite, and custom CSS for a fast, responsive user experience.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 + Vite
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: Modern Custom CSS

### **Backend**
- **Framework**: FastAPI + Uvicorn
- **Language**: Python 3.10+
- **Database**: SQLite3
- **Email Protocols**: `imaplib` (IMAP) & `smtplib` (SMTP)
- **HTML Parsing**: BeautifulSoup4

### **AI Engine**
- **LLM Runner**: [Ollama](https://ollama.com/)
- **Model**: `llama3.2`

---

## 📋 Prerequisites

Before running the project, make sure you have installed:

1. **Python 3.10 or higher**  
   Check version: `python --version`
2. **Node.js (v18+) and npm**  
   Check version: `node -v` and `npm -v`
3. **Ollama**  
   Download and install from [Ollama.com](https://ollama.com/)
4. **Gmail Account with App Password**  
   Standard Gmail passwords will **not** work due to Google security policies. You must generate a 16-character **App Password**.

---

## 🔑 Setting Up Gmail App Password

1. Go to your **[Google Account Settings](https://myaccount.google.com/)**.
2. Navigate to **Security** and enable **2-Step Verification** (if not already enabled).
3. Search for **App passwords** in the search bar at the top of the Google Account page.
4. Create a new App Password:
   - **App Name**: `AI Email Agent`
5. Copy the generated **16-character code** (e.g., `abcd efgh ijkl mnop`).

---

## 🚀 Execution Steps

Follow these steps to set up and launch the project locally.

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/your-username/email-agent.git
cd email-agent
```

---

### **Step 2: Environment Configuration**

Create a `.env` file in the root directory of the project (or copy `.env.example`):

```bash
# On Windows (PowerShell)
Copy-Item .env.example .env

# On Linux / macOS
cp .env.example .env
```

Open `.env` and fill in your details:

```env
# Gmail Credentials
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Ollama LLM Configuration
OLLAMA_MODEL=llama3.2

# Server Configurations
IMAP_SERVER=imap.gmail.com
IMAP_PORT=993

SMTP_SERVER=smtp.gmail.com
SMTP_PORT=465
```

---

### **Step 3: Start Ollama Model**

Open a terminal and start the local AI model:

```bash
# Pull the model (first time only)
ollama pull llama3.2

# Run Ollama server
ollama run llama3.2
```

> **Note**: Keep Ollama running in the background.

---

### **Step 4: Setup & Launch Backend (FastAPI)**

Open a new terminal window:

1. **Navigate to project root and set up virtual environment**:
   ```bash
   # Create virtual environment
   python -m venv venv

   # Activate virtual environment
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On Windows (CMD):
   .\venv\Scripts\activate.bat
   # On Linux / macOS:
   source venv/bin/activate
   ```

2. **Install backend dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Run the FastAPI server**:
   ```bash
   cd backend
   python main.py
   ```

   The backend will start at: `http://127.0.0.1:8000`  
   API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`

---

### **Step 5: Setup & Launch Frontend (React + Vite)**

Open another terminal window:

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the Web Application**:
   Open your browser and visit: `http://localhost:5173` (or the URL displayed in the terminal).

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check endpoint |
| `GET` | `/gmail/emails` | Fetch recent emails from Gmail merged with DB status |
| `GET` | `/emails` | Get all processed emails stored in SQLite |
| `GET` | `/emails/{id}` | Get details of a specific email |
| `POST` | `/process/{gmail_id}` | Process email: summarize and categorize using AI |
| `POST` | `/generate-reply/{id}` | Generate AI draft response for an email |
| `POST` | `/emails/{id}/regenerate-reply` | Regenerate reply with custom user prompt instructions |
| `POST` | `/send/{id}` | Send the generated reply via Gmail SMTP |

---

## 📁 Project Structure

```
email-agent/
├── .env.example              # Environment variables template
├── .gitignore                # Files to ignore in Git (venv, .env, DB)
├── README.md                 # Project documentation
│
├── backend/                  # FastAPI Backend Application
│   ├── main.py               # Application entry point & API routes
│   ├── database.py           # SQLite database schema and queries
│   ├── requirements.txt      # Python dependencies
│   ├── emails.db             # Local SQLite database file (git ignored)
│   ├── agent/
│   │   └── email_agent.py    # Core email processing workflow logic
│   ├── ai/
│   │   ├── classifier.py     # AI categorization logic
│   │   ├── summarizer.py     # AI email summarizer
│   │   ├── reply_generator.py# AI draft generation & instruction prompt refiner
│   │   └── ollama_client.py  # Interface for local Ollama API
│   └── gmail/
│       ├── reader.py         # IMAP client for fetching emails
│       └── sender.py         # SMTP client for sending replies
│
└── frontend/                 # React Frontend Application (Vite)
    ├── package.json          # Node dependencies & scripts
    ├── index.html            # Entry HTML file
    ├── src/
    │   ├── main.jsx          # React app mount
    │   ├── App.jsx           # Main application routing & view container
    │   ├── components/       # UI Components (EmailCard, DetailModal, etc.)
    │   └── services/
    │       └── api.js        # Axios API client functions
```

---

## ❓ Troubleshooting

- **`IMAP authentication failed` / `Application-specific password required`**
  - Make sure you generated a 16-character **App Password** from Google Account settings, not your regular Gmail password.
  - Ensure 2-Step Verification is active on your Google Account.

- **`Ollama connection refused` or model errors**
  - Verify Ollama service is running locally (`ollama list`).
  - Run `ollama run llama3.2` to ensure the model is pulled and working.

- **Frontend cannot communicate with Backend**
  - Check that the FastAPI server is running on `http://127.0.0.1:8000`.
  - Confirm CORS middleware is allowed in `backend/main.py`.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
