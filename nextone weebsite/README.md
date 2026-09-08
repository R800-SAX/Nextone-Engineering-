# NextOne Engineering - Website & Inquiry Backend

A modern, mobile-friendly responsive website built with Flask, SQLAlchemy, and Bootstrap 5 for NextOne Engineering Pvt. Ltd. The application features a secure admin dashboard, search and filter features, email alert triggers, and interactive inquiry forms.

---

## Features

- **Responsive Design**: Compatible across all modern browsers and viewport sizes (desktops, tablets, and mobile devices).
- **Interactive Inquiries**: Pre-filled targeted quotes via AJAX modal forms and direct WhatsApp chat links.
- **Secure Admin Panel**: Dashboard (`/admin`) requiring username/password authentication.
- **Search & Filters**: Search fields to find inquiries by keyword or product categories.
- **Automated Emails**: Integrated notification handler to email the administrator and auto-reply to users when forms are submitted.

---

## Installation & Setup

### 1. Requirements
Ensure you have Python 3.12+ installed. Install the package dependencies:
```bash
pip install -r requirements.txt
```

### 2. Environment Configuration
Copy the template configuration file to create your active `.env` file:
```bash
copy .env.example .env
```
Open `.env` and fill in your details:
- **`FLASK_SECRET_KEY`**: Set a random secret string.
- **`ADMIN_USERNAME` / `ADMIN_PASSWORD`**: Credentials for the admin panel.
- **`SMTP_EMAIL` / `SMTP_PASSWORD`**: Setup details for live email notifications.

### 3. Setting Up Gmail App Passwords
Gmail requires an App Password instead of your primary password to authenticate scripts:
1. Log in to [Google Account Security](https://myaccount.google.com/security).
2. Enable **2-Step Verification** if it isn't already.
3. Under *2-Step Verification*, scroll to the bottom and select **App passwords**.
4. Select **Mail** and device, then click **Generate**.
5. Copy the 16-character code and paste it into the `SMTP_PASSWORD` line inside your `.env` file.

---

## Running the Application

### Local Development
Run the server locally:
```bash
python app.py
```
Or run the included batch file:
```bash
run_server.bat
```
The site will be live at `http://127.0.0.1:5000`.

### Admin Access
Go to `http://127.0.0.1:5000/login` and log in with your configured admin credentials (Default: `admin` / `Password123`).
