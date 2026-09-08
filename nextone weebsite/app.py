import os
import re
import csv
import io
import smtplib
import threading
from datetime import datetime, timezone
from functools import wraps
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from flask import (
    Flask, Response, flash, get_flashed_messages, jsonify,
    redirect, render_template, request, session, url_for
)
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, instance_relative_config=True)

# Ensure instance directory exists
os.makedirs(app.instance_path, exist_ok=True)

# Load Environment Configuration Variables from instance/.env and root .env
load_dotenv(os.path.join(app.instance_path, '.env'))
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Flask Session & Security Configuration
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "nextone_engineering_secret_key_2026")
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

# Database Configuration (stored in instance/database.db)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# ==============================================================================
# DATABASE MODELS
# ==============================================================================

class Inquiry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(30), nullable=False)
    message = db.Column(db.Text, nullable=False)
    product = db.Column(db.String(150), nullable=True)
    status = db.Column(db.String(30), default="New", nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    notes = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "message": self.message,
            "product": self.product or "General Inquiry",
            "status": self.status or "New",
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else "",
            "notes": self.notes or ""
        }

# Self-Healing Non-Destructive Auto-Migration
with app.app_context():
    db.create_all()
    try:
        result = db.session.execute(db.text("PRAGMA table_info(inquiry)")).fetchall()
        existing_columns = [row[1] for row in result]

        if "product" not in existing_columns:
            db.session.execute(db.text("ALTER TABLE inquiry ADD COLUMN product VARCHAR(150)"))
            print("Successfully migrated: Added 'product' column to inquiry.")

        if "status" not in existing_columns:
            db.session.execute(db.text("ALTER TABLE inquiry ADD COLUMN status VARCHAR(30) DEFAULT 'New'"))
            db.session.execute(db.text("UPDATE inquiry SET status = 'New' WHERE status IS NULL"))
            print("Successfully migrated: Added 'status' column to inquiry.")

        if "created_at" not in existing_columns:
            db.session.execute(db.text("ALTER TABLE inquiry ADD COLUMN created_at DATETIME"))
            now_str = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
            db.session.execute(db.text(f"UPDATE inquiry SET created_at = '{now_str}' WHERE created_at IS NULL"))
            print("Successfully migrated: Added 'created_at' column to inquiry.")

        if "notes" not in existing_columns:
            db.session.execute(db.text("ALTER TABLE inquiry ADD COLUMN notes TEXT"))
            print("Successfully migrated: Added 'notes' column to inquiry.")

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error during self-healing DB migration: {e}")

# ==============================================================================
# INPUT VALIDATION & ANTI-SPAM UTILITY
# ==============================================================================

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')

def validate_inquiry(data):
    # Honeypot check for bots
    honeypot = (data.get("website_source") or data.get("website") or "").strip()
    if honeypot:
        return None, "Spam submission detected."

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    phone = (data.get("phone") or "").strip()
    message = (data.get("message") or "").strip()
    product = (data.get("product") or "General Inquiry").strip()

    if not name or len(name) < 2:
        return None, "Please provide a valid name (at least 2 characters)."
    if not email or not EMAIL_REGEX.match(email):
        return None, "Please provide a valid email address."
    cleaned_phone = re.sub(r'[\s\-\+\(\)]', '', phone)
    if not phone or len(cleaned_phone) < 7:
        return None, "Please provide a valid contact phone number."
    if not message or len(message) < 5:
        return None, "Please describe your project or inquiry requirement."

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "message": message,
        "product": product
    }, None

# ==============================================================================
# ASYNCHRONOUS BRANDED EMAIL SYSTEM
# ==============================================================================

def _send_emails_worker(inquiry_data):
    smtp_server = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", 587))
    smtp_email = os.environ.get("SMTP_EMAIL")
    smtp_password = os.environ.get("SMTP_PASSWORD")
    admin_recipient = os.environ.get("ADMIN_RECIPIENT", "nextone.engg@gmail.com")

    name = inquiry_data.get("name", "Valued Client")
    email = inquiry_data.get("email", "")
    phone = inquiry_data.get("phone", "")
    product = inquiry_data.get("product", "General Inquiry")
    message = inquiry_data.get("message", "")
    inquiry_id = inquiry_data.get("id", "N/A")
    timestamp = inquiry_data.get("created_at") or datetime.now().strftime("%d %b %Y, %I:%M %p")

    subject_admin = f"[Inquiry #{inquiry_id}] New Query: {name} - {product}"
    subject_user = f"Thank you for contacting NextOne Engineering! [Ref #{inquiry_id}]"

    text_admin = f"""New NextOne Inquiry #{inquiry_id}
Timestamp: {timestamp}
Name: {name}
Email: {email}
Phone: {phone}
Product/Subject: {product}

Message:
{message}
"""

    text_user = f"""Dear {name},

Thank you for reaching out to NextOne Engineering Pvt. Ltd. We have received your inquiry regarding "{product}" (Ref #{inquiry_id}).
Our engineering team is reviewing your requirements and will connect with you shortly.

Submitted Details:
- Name: {name}
- Phone: {phone}
- Inquiry: {message}

Contact NextOne Engineering:
Phone/WhatsApp: +91 98292 99520
Email: nextone.engg@gmail.com
Address: 120, Aditya Awas, Kota, Rajasthan - 324001, India

Best regards,
NextOne Engineering Pvt. Ltd.
"""

    html_admin = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f1f5f9; color: #1e293b; margin: 0; padding: 20px; }}
.card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }}
.header {{ background: #0a0f1d; padding: 24px; text-align: center; border-bottom: 4px solid #f59e0b; }}
.header h1 {{ color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 0.5px; }}
.header p {{ color: #f59e0b; margin: 6px 0 0; font-size: 13px; font-weight: 700; text-transform: uppercase; }}
.body {{ padding: 28px; }}
.badge {{ display: inline-block; background: #fef3c7; color: #b45309; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 13px; }}
.info-table {{ width: 100%; border-collapse: collapse; margin-top: 16px; }}
.info-table td {{ padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }}
.info-table td.label {{ font-weight: 600; color: #64748b; width: 32%; }}
.message-box {{ background: #f8fafc; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin-top: 20px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }}
.btn {{ display: inline-block; background: #f59e0b; color: #0a0f1d; padding: 10px 20px; text-decoration: none; font-weight: 700; border-radius: 8px; margin-top: 20px; }}
.footer {{ padding: 16px 28px; background: #f8fafc; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }}
</style></head>
<body>
<div class="card">
  <div class="header">
    <h1>NextOne Engineering</h1>
    <p>New Website Inquiry Received</p>
  </div>
  <div class="body">
    <p style="margin-top:0;">A new client inquiry has been recorded:</p>
    <table class="info-table">
      <tr><td class="label">Inquiry ID:</td><td><strong>#{inquiry_id}</strong></td></tr>
      <tr><td class="label">Timestamp:</td><td>{timestamp}</td></tr>
      <tr><td class="label">Client Name:</td><td><strong>{name}</strong></td></tr>
      <tr><td class="label">Email:</td><td><a href="mailto:{email}" style="color:#0284c7;text-decoration:none;">{email}</a></td></tr>
      <tr><td class="label">Phone:</td><td><a href="tel:{phone}" style="color:#0284c7;text-decoration:none;">{phone}</a></td></tr>
      <tr><td class="label">Product / Scope:</td><td><span class="badge">{product}</span></td></tr>
    </table>
    <div class="message-box"><strong>Client Requirement:</strong><br>{message}</div>
    <div style="text-align: center;">
      <a href="mailto:{email}?subject=NextOne%20Engineering%20-%20Re:%20{product}" class="btn">Reply via Email</a>
    </div>
  </div>
  <div class="footer">NextOne Engineering Inquiry Manager &bull; Kota, Rajasthan</div>
</div>
</body>
</html>"""

    html_user = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f1f5f9; color: #1e293b; margin: 0; padding: 20px; }}
.card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }}
.header {{ background: #0a0f1d; padding: 28px 24px; text-align: center; border-bottom: 4px solid #f59e0b; }}
.header h1 {{ color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; }}
.header p {{ color: #f59e0b; margin: 6px 0 0; font-size: 13px; font-weight: 700; text-transform: uppercase; }}
.body {{ padding: 28px; line-height: 1.6; font-size: 14.5px; }}
.summary-box {{ background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px; }}
.contact-highlight {{ background: #fef3c7; border-left: 4px solid #f59e0b; padding: 14px; border-radius: 4px; margin: 20px 0; font-size: 13.5px; }}
.footer {{ padding: 20px; background: #0a0f1d; text-align: center; font-size: 12px; color: rgba(255,255,255,0.7); }}
</style></head>
<body>
<div class="card">
  <div class="header">
    <h1>NextOne Engineering Pvt. Ltd.</h1>
    <p>Industrial Engineering & Turnkey Solutions</p>
  </div>
  <div class="body">
    <p>Dear <strong>{name}</strong>,</p>
    <p>Thank you for contacting NextOne Engineering. We have received your inquiry regarding <strong>{product}</strong> (Reference <strong>#{inquiry_id}</strong>).</p>
    <p>Our engineering technical team is reviewing your requirements and will connect with you shortly with relevant technical specifications and proposals.</p>
    <div class="summary-box">
      <strong>Your Submitted Inquiry Details:</strong><br>
      &bull; <strong>Product:</strong> {product}<br>
      &bull; <strong>Contact Phone:</strong> {phone}<br>
      &bull; <strong>Requirement:</strong> {message}
    </div>
    <div class="contact-highlight">
      <strong>Need Immediate Discussion?</strong><br>
      Direct Call / WhatsApp: <strong>+91 98292 99520</strong><br>
      Email: <a href="mailto:nextone.engg@gmail.com" style="color:#b45309;font-weight:700;">nextone.engg@gmail.com</a>
    </div>
    <p style="margin-bottom:0;">Warm regards,<br><strong>NextOne Engineering Pvt. Ltd.</strong><br><span style="font-size:13px;color:#64748b;">Kota, Rajasthan - 324001, India</span></p>
  </div>
  <div class="footer">
    NextOne Engineering Pvt. Ltd. &bull; Turnkey Plants &bull; Industrial Machinery &bull; GST: 08AAICN3244L1Z6
  </div>
</div>
</body>
</html>"""

    # Live Console Logging
    print(f"\n================ [Asynchronous Email Dispatched] ================")
    print(f"TO ADMIN ({admin_recipient}) | Subject: {subject_admin}")
    print(f"TO CLIENT ({email}) | Subject: {subject_user}")
    print(f"===============================================================\n")

    if not smtp_email or not smtp_password or smtp_password == "your_gmail_app_password":
        print("SMTP credentials not configured in .env. Skipped live SMTP transmission.")
        return

    try:
        server = smtplib.SMTP(smtp_server, smtp_port, timeout=10)
        server.starttls()
        server.login(smtp_email, smtp_password)

        # Admin alert
        msg_admin = MIMEMultipart('alternative')
        msg_admin['From'] = smtp_email
        msg_admin['To'] = admin_recipient
        msg_admin['Subject'] = subject_admin
        msg_admin.attach(MIMEText(text_admin, 'plain'))
        msg_admin.attach(MIMEText(html_admin, 'html'))
        server.send_message(msg_admin)

        # Client auto-reply
        msg_user = MIMEMultipart('alternative')
        msg_user['From'] = smtp_email
        msg_user['To'] = email
        msg_user['Subject'] = subject_user
        msg_user.attach(MIMEText(text_user, 'plain'))
        msg_user.attach(MIMEText(html_user, 'html'))
        server.send_message(msg_user)

        server.quit()
        print("SMTP emails delivered successfully!")
    except Exception as err:
        print(f"SMTP delivery exception: {err}")

def send_inquiry_emails_async(inquiry):
    inquiry_data = inquiry.to_dict()
    thread = threading.Thread(target=_send_emails_worker, args=(inquiry_data,), daemon=True)
    thread.start()

# ==============================================================================
# AUTHENTICATION & SECURITY
# ==============================================================================

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("logged_in"):
            flash("Please log in to access the administrator panel.", "warning")
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated_function

def verify_admin_credentials(username, password):
    configured_user = os.environ.get("ADMIN_USERNAME", "admin")
    configured_hash = os.environ.get("ADMIN_PASSWORD_HASH")
    configured_pass = os.environ.get("ADMIN_PASSWORD", "Password123")

    if username != configured_user:
        return False

    if configured_hash:
        return check_password_hash(configured_hash, password)
    return password == configured_pass

# ==============================================================================
# PUBLIC WEBSITE ROUTES
# ==============================================================================

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/products")
def products():
    return render_template("products.html")

@app.route("/industries")
def industries():
    return render_template("industries.html")

@app.route("/projects")
def projects():
    return render_template("projects.html")

@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        cleaned_data, error = validate_inquiry(request.form)
        if error:
            return render_template("contact.html", error=error)

        inquiry = Inquiry(
            name=cleaned_data["name"],
            email=cleaned_data["email"],
            phone=cleaned_data["phone"],
            message=cleaned_data["message"],
            product=cleaned_data["product"],
            status="New",
            created_at=datetime.now(timezone.utc)
        )

        db.session.add(inquiry)
        db.session.commit()

        # Asynchronous non-blocking email notification
        send_inquiry_emails_async(inquiry)

        return render_template(
            "contact.html",
            success="Your inquiry has been submitted successfully! Our team will contact you shortly."
        )

    return render_template("contact.html")

# AJAX Endpoint for Inquiries (Contact form & Product modals)
@app.route("/api/inquire", methods=["POST"])
def api_inquire():
    try:
        if request.is_json:
            data = request.get_json() or {}
        else:
            data = request.form

        cleaned_data, error = validate_inquiry(data)
        if error:
            return jsonify({"success": False, "error": error}), 400

        inquiry = Inquiry(
            name=cleaned_data["name"],
            email=cleaned_data["email"],
            phone=cleaned_data["phone"],
            message=cleaned_data["message"],
            product=cleaned_data["product"],
            status="New",
            created_at=datetime.now(timezone.utc)
        )

        db.session.add(inquiry)
        db.session.commit()

        # Asynchronous non-blocking email notification
        send_inquiry_emails_async(inquiry)

        return jsonify({
            "success": True,
            "message": "Inquiry submitted successfully! Reference #" + str(inquiry.id),
            "inquiry_id": inquiry.id
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

# ==============================================================================
# ADMIN AUTHENTICATION & DASHBOARD
# ==============================================================================

@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")

        if verify_admin_credentials(username, password):
            session["logged_in"] = True
            session.permanent = True
            flash("Welcome to the NextOne Inquiry Manager.", "success")
            return redirect(url_for("admin"))
        else:
            error = "Invalid administrator username or password."

    return render_template("login.html", error=error)

@app.route("/logout")
def logout():
    session.pop("logged_in", None)
    flash("You have been signed out successfully.", "info")
    return redirect(url_for("login"))

@app.route("/admin")
@login_required
def admin():
    search_query = request.args.get("search", "").strip()
    product_filter = request.args.get("product_filter", "").strip()
    status_filter = request.args.get("status_filter", "").strip()
    page = request.args.get("page", 1, type=int)
    per_page = 15

    query = Inquiry.query

    if search_query:
        query = query.filter(
            (Inquiry.name.ilike(f"%{search_query}%")) |
            (Inquiry.email.ilike(f"%{search_query}%")) |
            (Inquiry.phone.ilike(f"%{search_query}%")) |
            (Inquiry.message.ilike(f"%{search_query}%")) |
            (Inquiry.notes.ilike(f"%{search_query}%"))
        )

    if product_filter:
        query = query.filter(Inquiry.product == product_filter)

    if status_filter:
        query = query.filter(Inquiry.status == status_filter)

    # Order newest first
    query = query.order_by(Inquiry.id.desc())

    # Pagination
    total_matches = query.count()
    total_pages = max(1, (total_matches + per_page - 1) // per_page)
    if page < 1:
        page = 1
    elif page > total_pages:
        page = total_pages

    inquiries = query.offset((page - 1) * per_page).limit(per_page).all()

    # KPI Statistics
    total_count = Inquiry.query.count()
    new_count = Inquiry.query.filter_by(status="New").count()
    contacted_count = Inquiry.query.filter_by(status="Contacted").count()
    in_discussion_count = Inquiry.query.filter_by(status="In Discussion").count()
    closed_count = Inquiry.query.filter_by(status="Closed").count()

    # Distinct product options
    distinct_products = [
        r[0] for r in db.session.query(Inquiry.product).distinct().all() if r[0]
    ]

    return render_template(
        "admin.html",
        inquiries=inquiries,
        search_query=search_query,
        product_filter=product_filter,
        status_filter=status_filter,
        distinct_products=distinct_products,
        page=page,
        total_pages=total_pages,
        total_matches=total_matches,
        total_count=total_count,
        new_count=new_count,
        contacted_count=contacted_count,
        in_discussion_count=in_discussion_count,
        closed_count=closed_count
    )

@app.route("/admin/inquiry/<int:id>/status", methods=["POST"])
@login_required
def update_inquiry_status(id):
    inquiry = Inquiry.query.get_or_404(id)
    new_status = request.form.get("status") or (request.json and request.json.get("status"))
    allowed_statuses = ["New", "Contacted", "In Discussion", "Closed"]

    if new_status in allowed_statuses:
        inquiry.status = new_status
        db.session.commit()
        if request.is_json:
            return jsonify({"success": True, "status": inquiry.status})
        flash(f"Inquiry #{id} status updated to '{new_status}'.", "success")
    else:
        if request.is_json:
            return jsonify({"success": False, "error": "Invalid status."}), 400
        flash("Invalid status specified.", "danger")

    return redirect(url_for("admin"))

@app.route("/admin/inquiry/<int:id>/notes", methods=["POST"])
@login_required
def update_inquiry_notes(id):
    inquiry = Inquiry.query.get_or_404(id)
    notes = request.form.get("notes") if not request.is_json else request.json.get("notes")
    inquiry.notes = notes.strip() if notes else None
    db.session.commit()

    if request.is_json:
        return jsonify({"success": True, "notes": inquiry.notes or ""})
    flash(f"Internal notes updated for Inquiry #{id}.", "success")
    return redirect(url_for("admin"))

@app.route("/admin/inquiry/<int:id>/delete", methods=["POST"])
@login_required
def delete_inquiry_post(id):
    inquiry = Inquiry.query.get_or_404(id)
    db.session.delete(inquiry)
    db.session.commit()
    if request.is_json:
        return jsonify({"success": True, "message": f"Inquiry #{id} deleted."})
    flash(f"Inquiry #{id} deleted successfully.", "success")
    return redirect(url_for("admin"))

@app.route("/delete/<int:id>", methods=["GET", "POST"])
@login_required
def delete(id):
    # Backward compatible delete route
    inquiry = Inquiry.query.get_or_404(id)
    db.session.delete(inquiry)
    db.session.commit()
    flash(f"Inquiry #{id} deleted successfully.", "success")
    return redirect(url_for("admin"))

@app.route("/admin/export/csv")
@login_required
def export_csv():
    search_query = request.args.get("search", "").strip()
    product_filter = request.args.get("product_filter", "").strip()
    status_filter = request.args.get("status_filter", "").strip()

    query = Inquiry.query

    if search_query:
        query = query.filter(
            (Inquiry.name.ilike(f"%{search_query}%")) |
            (Inquiry.email.ilike(f"%{search_query}%")) |
            (Inquiry.phone.ilike(f"%{search_query}%")) |
            (Inquiry.message.ilike(f"%{search_query}%"))
        )

    if product_filter:
        query = query.filter(Inquiry.product == product_filter)

    if status_filter:
        query = query.filter(Inquiry.status == status_filter)

    inquiries = query.order_by(Inquiry.id.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Inquiry ID", "Created At (UTC)", "Client Name", "Email Address",
        "Phone", "Product / Service", "Status", "Inquiry Message", "Internal Admin Notes"
    ])

    for item in inquiries:
        date_str = item.created_at.strftime("%Y-%m-%d %H:%M:%S") if item.created_at else ""
        writer.writerow([
            item.id,
            date_str,
            item.name,
            item.email,
            item.phone,
            item.product or "General Inquiry",
            item.status or "New",
            item.message,
            item.notes or ""
        ])

    output.seek(0)
    filename = f"NextOne_Inquiries_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv"

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# ==============================================================================
# SEO, UPTIME & SYSTEM ENDPOINTS
# ==============================================================================

@app.route("/health")
def health_check():
    try:
        db.session.execute(db.text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return jsonify({
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "NextOne Engineering Web Platform"
    })

@app.route("/robots.txt")
def robots_txt():
    content = f"""User-agent: *
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /api/

Sitemap: {request.url_root.rstrip('/')}/sitemap.xml
"""
    return Response(content, mimetype="text/plain")

@app.route("/sitemap.xml")
def sitemap_xml():
    base = request.url_root.rstrip('/')
    pages = [
        {"loc": f"{base}/", "priority": "1.0", "changefreq": "weekly"},
        {"loc": f"{base}/about", "priority": "0.8", "changefreq": "monthly"},
        {"loc": f"{base}/products", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{base}/industries", "priority": "0.8", "changefreq": "monthly"},
        {"loc": f"{base}/projects", "priority": "0.8", "changefreq": "monthly"},
        {"loc": f"{base}/contact", "priority": "0.9", "changefreq": "monthly"},
    ]

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    for p in pages:
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{p['loc']}</loc>")
        xml_lines.append(f"    <changefreq>{p['changefreq']}</changefreq>")
        xml_lines.append(f"    <priority>{p['priority']}</priority>")
        xml_lines.append("  </url>")
    xml_lines.append("</urlset>")

    return Response("\n".join(xml_lines), mimetype="application/xml")

# ==============================================================================
# ERROR HANDLERS
# ==============================================================================

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template("500.html"), 500

# ==============================================================================
# MAIN RUNNER
# ==============================================================================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "true").lower() in ["true", "1"]
    app.run(host="0.0.0.0", port=port, debug=debug)