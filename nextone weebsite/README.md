# NextOne Engineering Pvt. Ltd.
### Industrial Engineering, Turnkey Plants & Machinery Web Platform

[![Python](https://img.shields.io/badge/Python-3.12%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.3-black.svg?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-purple.svg?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red.svg)](https://www.sqlalchemy.org/)
[![Status](https://img.shields.io/badge/Deployment-Production--Ready-success.svg)]()

A modern, full-stack industrial engineering web application built for **NextOne Engineering Pvt. Ltd.** (Kota, Rajasthan, India). The platform serves as both a high-conversion digital showcase for industrial turnkey machinery and a full-featured lead management CRM for engineering inquiries.

---

## 🌟 Key Features

### 🏢 Industrial Frontend & User Experience
* **Responsive Showcase**: Engineered with Bootstrap 5 and modern CSS tokens, delivering sleek dark-mode accents, glassmorphism, and responsive layouts across all viewport sizes.
* **Turnkey Equipment Catalog**: Detailed technical presentations for:
  * Edible Oil Extraction & Refinery Plants
  * Solvent Extraction & Fractionation Systems
  * Bulk Material Handling (Conveyors, Elevators, Silos)
  * Industrial Water Treatment (ETP, WTP, Demineralization)
  * Packaging Automation & Food Processing
* **Interactive Modal Quotations**: Targeted modal inquiry forms dynamically pre-filled with product context and direct WhatsApp consultation routing (`+91 98292 99520`).
* **SEO & Crawler Optimization**: Integrated `/robots.txt` and dynamically generated `/sitemap.xml` for maximum B2B search indexation.
* **Branded Error Pages**: Custom-styled `404 Not Found` and `500 Server Error` templates matching the industrial design system.

---

### ⚙️ Backend Architecture & Robustness
* **Asynchronous Email Dispatch**: Email delivery runs in non-blocking background daemon threads (`threading.Thread`), enabling instant (<150ms) form submissions without waiting for SMTP handshakes.
* **Dual Branded HTML Email Notifications**:
  * **Executive Alert (Admin)**: Formatted table with inquiry reference number, product scope, client details, and one-click "Reply via Email" and "Call Client" action buttons.
  * **Client Auto-Acknowledgment**: Corporate confirmation with NextOne Engineering registration, GST details, and contact points.
* **Self-Healing Schema Auto-Migration**: Non-destructive database migrations executed on startup via SQLite `PRAGMA table_info` to guarantee schema integrity and prevent data loss.
* **Anti-Spam & Input Validation**: RFC-compliant email/phone syntax verification combined with hidden honeypot traps to catch automated bots silently.
* **System Health Endpoint**: Real-time `/health` check returning database connectivity, service status, and UTC timestamp.

---

### 📊 Inquiry Manager Admin Dashboard (`/admin`)
* **KPI Metrics Overview**: Live summary cards showing Total Inquiries, New/Unread leads, Contacted clients, and Closed projects.
* **One-Click CSV Export**: `/admin/export/csv` generates structured spreadsheets formatted for Microsoft Excel, Google Sheets, or CRM imports.
* **Inline Lifecycle Status Tracking**: Color-coded AJAX status selector (`New`, `Contacted`, `In Discussion`, `Closed`) with instant feedback.
* **Confidential Internal Notes**: Dedicated modal allowing administrators to save internal quotation notes and follow-up remarks per client.
* **Search, Filters & Pagination**: Multi-parameter search by keyword, product category, and status with clean page navigation.
* **Secure Authentication**: Protected session management (`/login` & `/logout`) with password verification and HTTP-only cookie policies.

---

## 📂 Project Structure

```text
nextone-engineering/
├── app.py                      # Core Flask backend (routes, models, email worker, admin API)
├── Procfile                    # Production WSGI process file (Gunicorn)
├── requirements.txt            # Python dependencies
├── .env.example                # Configuration template
├── .gitignore                  # Git ignore rules (secrets, sqlite db, cache)
├── run_server.bat              # Quick local launcher script (Windows)
├── instance/
│   └── database.db             # Local SQLite database (auto-created)
├── static/
│   ├── css/
│   │   └── style.css           # Global custom styling & design system
│   └── images/                 # Optimized WebP machinery, logos & slide assets
└── templates/
    ├── base.html               # Master layout with header, navbar & footer
    ├── home.html               # Landing page with hero slider & core services
    ├── about.html              # Company history, mission & engineering expertise
    ├── products.html           # Full turnkey catalog with interactive quote modals
    ├── industries.html         # Industry sectors served (Agro, Oil, Mining, Power)
    ├── projects.html           # Completed projects & turnkey implementations
    ├── contact.html            # Contact directory & inquiry submission form
    ├── login.html              # Secure administrator authentication page
    ├── admin.html              # Comprehensive Inquiry Manager dashboard
    ├── 404.html                # Custom Not Found page
    └── 500.html                # Custom Server Error page
```

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
* Python 3.12 or newer installed.
* Git installed.

### 2. Installation
Clone the repository and install the required dependencies:
```bash
git clone https://github.com/R800-SAX/Nextone-Engineering-.git
cd Nextone-Engineering-
pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file from the example template:
```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Open `.env` in your editor and configure your variables:
```ini
# Flask Security
FLASK_SECRET_KEY=replace_with_a_secure_random_key_here

# Admin Dashboard Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Password123

# Live Gmail SMTP (For Email Dispatch)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=nextone.engg@gmail.com
SMTP_PASSWORD=your_16_digit_google_app_password
```

> **Note on Gmail App Passwords:**
> Gmail requires a dedicated **App Password** for script access.
> 1. Go to your [Google Account Security](https://myaccount.google.com/security).
> 2. Ensure **2-Step Verification** is enabled.
> 3. Search for **App passwords** $\rightarrow$ create one under "Mail" $\rightarrow$ copy the 16-character string into `SMTP_PASSWORD`.
> *(If SMTP credentials are left blank, the application automatically logs formatted emails to the local console for debugging without errors.)*

### 4. Running the Local Server
Start the development server:
```bash
python app.py
```
Or double-click `run_server.bat` on Windows.

Open your browser and navigate to:
* **Website**: [http://127.0.0.1:5000](http://127.0.0.1:5000)
* **Admin Login**: [http://127.0.0.1:5000/login](http://127.0.0.1:5000/login)
* **Health Check**: [http://127.0.0.1:5000/health](http://127.0.0.1:5000/health)

---

## 🌐 100% Free Production Deployment

Because this is a unified Flask application, **both the frontend and backend are deployed together** under one service.

### Deploying to Render.com (Recommended)
1. Push your code to your GitHub repository.
2. Sign in to **[render.com](https://render.com)** using your GitHub account.
3. Click **New +** $\rightarrow$ select **Web Service**.
4. Select repository `R800-SAX/Nextone-Engineering-` and configure:
   * **Runtime**: `Python 3`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `gunicorn app:app`
   * **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   * `FLASK_SECRET_KEY`: *(random secure string)*
   * `ADMIN_USERNAME`: `admin`
   * `ADMIN_PASSWORD`: *(your custom admin password)*
   * `SMTP_EMAIL`: `nextone.engg@gmail.com`
   * `SMTP_PASSWORD`: *(your 16-character Gmail App Password)*
   * `FLASK_DEBUG`: `false`
6. Click **Create Web Service**. Your website will be live with automatic free SSL (`https://`).

---

## 🛡️ Security & Production Best Practices
* **Database Isolation**: The SQLite database (`instance/database.db`) is excluded from Git via `.gitignore` to prevent leaking client leads or sensitive records.
* **Session Cookies**: Hardened with `SESSION_COOKIE_HTTPONLY = True` and `SESSION_COOKIE_SAMESITE = 'Lax'`.
* **Dynamic Cloud Ports**: Automatically binds to cloud-assigned `$PORT` environment variables with local fallback.

---

## 📞 Corporate Contact Information

**NextOne Engineering Pvt. Ltd.**  
*Turnkey Engineering Solutions, Machinery & Industrial Systems*

* **Registered Office**: 120, Aditya Awas, Kota, Rajasthan - 324001, India
* **Contact Person**: Hemant Saxena
* **Phone / WhatsApp**: +91 98292 99520
* **Official Email**: [nextone.engg@gmail.com](mailto:nextone.engg@gmail.com)
* **GST Number**: `08AAICN3244L1Z6`
* **Business Hours**: Monday – Saturday: 9:00 AM – 7:00 PM IST
