import nodemailer from 'nodemailer';

// ───────────────────────────────────────────────────────────────
// Professional HTML Email Template Generator
// ───────────────────────────────────────────────────────────────
interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
}

function generateContactEmailHTML(data: ContactEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Message</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 20px 0; }
    .card { background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #06b6d4, #10b981); padding: 32px 36px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 13px; }
    .body { padding: 32px 36px; }
    .badge { display: inline-block; background: linear-gradient(135deg, #06b6d4, #10b981); color: #fff; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 14px; border-radius: 20px; margin-bottom: 24px; }
    .field-group { margin-bottom: 20px; }
    .field-label { color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .field-value { color: #e2e8f0; font-size: 15px; line-height: 1.6; word-wrap: break-word; }
    .field-value a { color: #06b6d4; text-decoration: none; }
    .field-value a:hover { text-decoration: underline; }
    .message-box { background-color: #0f172a; border: 1px solid rgba(6,182,212,0.15); border-radius: 12px; padding: 20px 24px; margin-top: 8px; }
    .message-box p { margin: 0; color: #cbd5e1; font-size: 14px; line-height: 1.8; white-space: pre-wrap; word-wrap: break-word; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(6,182,212,0.2), transparent); margin: 8px 0; }
    .footer { padding: 24px 36px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
    .footer p { margin: 0; color: #475569; font-size: 12px; line-height: 1.6; }
    .footer a { color: #06b6d4; text-decoration: none; }
    .footer .brand { color: #94a3b8; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <!-- Header -->
      <div class="header">
        <h1>📩 New Contact Message</h1>
        <p>Someone reached out through your portfolio website</p>
      </div>

      <!-- Body -->
      <div class="body">
        <div class="badge">New Inquiry</div>

        <!-- Name -->
        <div class="field-group">
          <div class="field-label">From</div>
          <div class="field-value">${data.name}</div>
        </div>

        <!-- Email -->
        <div class="field-group">
          <div class="field-label">Email Address</div>
          <div class="field-value"><a href="mailto:${data.email}">${data.email}</a></div>
        </div>

        <!-- Subject -->
        <div class="field-group">
          <div class="field-label">Subject</div>
          <div class="field-value">${data.subject}</div>
        </div>

        <div class="divider"></div>

        <!-- Message -->
        <div class="field-group">
          <div class="field-label">Message</div>
          <div class="message-box">
            <p>${data.message}</p>
          </div>
        </div>

        <!-- Timestamp -->
        <div class="field-group" style="margin-bottom: 0; margin-top: 24px;">
          <div class="field-label">Received</div>
          <div class="field-value" style="color: #64748b; font-size: 13px;">${data.receivedAt}</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>
          This message was sent from the contact form on<br />
          <span class="brand">Upam's Portfolio Website</span><br />
          <a href="https://www.fiverr.com/upam1721">fiverr.com/upam1721</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ───────────────────────────────────────────────────────────────
// Email Transport Setup
// ───────────────────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });
}

// ───────────────────────────────────────────────────────────────
// Send Contact Form Notification Email
// ───────────────────────────────────────────────────────────────
export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  // Skip if SMTP is not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[Email] SMTP not configured — skipping email notification.');
    return { success: true }; // Don't fail the request
  }

  try {
    const transporter = createTransporter();
    const receivedAt = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const htmlContent = generateContactEmailHTML({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      receivedAt,
    });

    // Send to Upam's email
    await transporter.sendMail({
      from: `"Upam Portfolio" <${process.env.SMTP_USER}>`,
      to: 'mailupamm@gmail.com',
      replyTo: data.email,
      subject: `📩 New Inquiry: ${data.subject}`,
      html: htmlContent,
      text: `New contact form submission:\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\nMessage:\n${data.message}\n\nReceived: ${receivedAt}`,
    });

    console.log('[Email] Contact notification sent to mailupamm@gmail.com');
    return { success: true };
  } catch (error) {
    console.error('[Email] Failed to send contact notification:', error);
    // Don't fail the contact form request if email fails
    return { success: false, error: 'Email delivery failed' };
  }
}
