import nodemailer from 'nodemailer';

// ───────────────────────────────────────────────────────────────
// Master Admin Email — ALL notifications go here
// ───────────────────────────────────────────────────────────────
export const MASTER_ADMIN_EMAIL = 'mailupamm@gmail.com';

// ───────────────────────────────────────────────────────────────
// Professional HTML Email Template Generator
// ───────────────────────────────────────────────────────────────

function generateEmailWrapper(title: string, badge: string, badgeEmoji: string, bodyHTML: string): string {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
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
    .priority-tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .priority-urgent { background: rgba(239,68,68,0.2); color: #ef4444; }
    .priority-high { background: rgba(249,115,22,0.2); color: #f97316; }
    .priority-medium { background: rgba(234,179,8,0.2); color: #eab308; }
    .priority-low { background: rgba(34,197,94,0.2); color: #22c55e; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <h1>${badgeEmoji} ${title}</h1>
        <p>Client Portal — Upam's Portfolio Website</p>
      </div>
      <div class="body">
        <div class="badge">${badge}</div>
        ${bodyHTML}
      </div>
      <div class="footer">
        <p>
          This notification was sent from the Client Portal on<br />
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
// Specific Email Generators
// ───────────────────────────────────────────────────────────────

function generateContactEmailHTML(data: { name: string; email: string; subject: string; message: string; receivedAt: string }): string {
  const bodyHTML = `
    <div class="field-group">
      <div class="field-label">From</div>
      <div class="field-value">${data.name}</div>
    </div>
    <div class="field-group">
      <div class="field-label">Email Address</div>
      <div class="field-value"><a href="mailto:${data.email}">${data.email}</a></div>
    </div>
    <div class="field-group">
      <div class="field-label">Subject</div>
      <div class="field-value">${data.subject}</div>
    </div>
    <div class="divider"></div>
    <div class="field-group">
      <div class="field-label">Message</div>
      <div class="message-box">
        <p>${data.message}</p>
      </div>
    </div>
    <div class="field-group" style="margin-bottom: 0; margin-top: 24px;">
      <div class="field-label">Received</div>
      <div class="field-value" style="color: #64748b; font-size: 13px;">${data.receivedAt}</div>
    </div>`;
  return generateEmailWrapper('New Contact Message', 'New Inquiry', '📩', bodyHTML);
}

function generateNewClientEmailHTML(data: { name: string; email: string; company: string | null; createdAt: string }): string {
  const bodyHTML = `
    <div class="field-group">
      <div class="field-label">Client Name</div>
      <div class="field-value">${data.name}</div>
    </div>
    <div class="field-group">
      <div class="field-label">Email Address</div>
      <div class="field-value"><a href="mailto:${data.email}">${data.email}</a></div>
    </div>
    ${data.company ? `<div class="field-group">
      <div class="field-label">Company</div>
      <div class="field-value">${data.company}</div>
    </div>` : ''}
    <div class="field-group" style="margin-bottom: 0; margin-top: 24px;">
      <div class="field-label">Registered At</div>
      <div class="field-value" style="color: #64748b; font-size: 13px;">${data.createdAt}</div>
    </div>`;
  return generateEmailWrapper('New Client Registered', 'New Account', '👤', bodyHTML);
}

function generateNewMessageEmailHTML(data: { senderName: string; senderRole: string; content: string; sentAt: string }): string {
  const bodyHTML = `
    <div class="field-group">
      <div class="field-label">From</div>
      <div class="field-value">${data.senderName} <span style="color: #64748b; font-size: 12px;">(${data.senderRole})</span></div>
    </div>
    <div class="divider"></div>
    <div class="field-group">
      <div class="field-label">Message</div>
      <div class="message-box">
        <p>${data.content}</p>
      </div>
    </div>
    <div class="field-group" style="margin-bottom: 0; margin-top: 24px;">
      <div class="field-label">Sent At</div>
      <div class="field-value" style="color: #64748b; font-size: 13px;">${data.sentAt}</div>
    </div>`;
  return generateEmailWrapper('New Portal Message', 'Message', '💬', bodyHTML);
}

function generateNewTicketEmailHTML(data: { clientName: string; subject: string; description: string; priority: string; category: string; createdAt: string }): string {
  const priorityClass = `priority-${data.priority}`;
  const bodyHTML = `
    <div class="field-group">
      <div class="field-label">Client</div>
      <div class="field-value">${data.clientName}</div>
    </div>
    <div class="field-group">
      <div class="field-label">Subject</div>
      <div class="field-value">${data.subject}</div>
    </div>
    <div class="field-group">
      <div class="field-label">Priority</div>
      <div class="field-value"><span class="priority-tag ${priorityClass}">${data.priority}</span></div>
    </div>
    <div class="field-group">
      <div class="field-label">Category</div>
      <div class="field-value" style="text-transform: capitalize;">${data.category}</div>
    </div>
    <div class="divider"></div>
    <div class="field-group">
      <div class="field-label">Description</div>
      <div class="message-box">
        <p>${data.description}</p>
      </div>
    </div>
    <div class="field-group" style="margin-bottom: 0; margin-top: 24px;">
      <div class="field-label">Submitted At</div>
      <div class="field-value" style="color: #64748b; font-size: 13px;">${data.createdAt}</div>
    </div>`;
  return generateEmailWrapper('New Support Ticket', 'Support Ticket', '🎫', bodyHTML);
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

function getTimestamp(): string {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function isSMTPConfigured(): boolean {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
}

// ───────────────────────────────────────────────────────────────
// Generic Send Function
// ───────────────────────────────────────────────────────────────
async function sendMailToAdmin(subject: string, htmlContent: string, textContent: string, replyTo?: string): Promise<{ success: boolean; error?: string }> {
  if (!isSMTPConfigured()) {
    console.log('[Email] SMTP not configured — skipping email notification.');
    return { success: true }; // Don't fail the request
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Upam Portfolio" <${process.env.SMTP_USER}>`,
      to: MASTER_ADMIN_EMAIL,
      replyTo: replyTo || process.env.SMTP_USER,
      subject,
      html: htmlContent,
      text: textContent,
    });
    console.log(`[Email] Notification sent to ${MASTER_ADMIN_EMAIL}: ${subject}`);
    return { success: true };
  } catch (error) {
    console.error(`[Email] Failed to send notification (${subject}):`, error);
    return { success: false, error: 'Email delivery failed' };
  }
}

// ───────────────────────────────────────────────────────────────
// PUBLIC: Send Contact Form Notification Email
// ───────────────────────────────────────────────────────────────
export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const receivedAt = getTimestamp();
  const htmlContent = generateContactEmailHTML({ ...data, receivedAt });
  const textContent = `New contact form submission:\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\nMessage:\n${data.message}\n\nReceived: ${receivedAt}`;
  return sendMailToAdmin(`📩 New Inquiry: ${data.subject}`, htmlContent, textContent, data.email);
}

// ───────────────────────────────────────────────────────────────
// PUBLIC: Send New Client Registration Notification
// ───────────────────────────────────────────────────────────────
export async function sendNewClientNotification(data: {
  name: string;
  email: string;
  company: string | null;
}): Promise<{ success: boolean; error?: string }> {
  const createdAt = getTimestamp();
  const htmlContent = generateNewClientEmailHTML({ ...data, createdAt });
  const textContent = `New client registered:\n\nName: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || 'N/A'}\nRegistered: ${createdAt}`;
  return sendMailToAdmin(`👤 New Client: ${data.name}`, htmlContent, textContent, data.email);
}

// ───────────────────────────────────────────────────────────────
// PUBLIC: Send New Portal Message Notification
// ───────────────────────────────────────────────────────────────
export async function sendNewMessageNotification(data: {
  senderName: string;
  senderRole: string;
  content: string;
}): Promise<{ success: boolean; error?: string }> {
  const sentAt = getTimestamp();
  const htmlContent = generateNewMessageEmailHTML({ ...data, sentAt });
  const preview = data.content.length > 200 ? data.content.substring(0, 200) + '...' : data.content;
  const textContent = `New portal message from ${data.senderName} (${data.senderRole}):\n\n${preview}\n\nSent: ${sentAt}`;
  return sendMailToAdmin(`💬 New Message from ${data.senderName}`, htmlContent, textContent);
}

// ───────────────────────────────────────────────────────────────
// PRIVATE: Send OTP Email to User (NOT to admin, to the registering user)
// ───────────────────────────────────────────────────────────────

function generateOTPEmailHTML(otp: string, name: string): string {
  const bodyHTML = `
    <div class="field-group">
      <div class="field-label">Hello, ${name}!</div>
      <div class="field-value" style="margin-bottom: 20px;">Thank you for registering on the Client Portal. Please use the verification code below to complete your registration:</div>
    </div>
    <div style="text-align: center; margin: 32px 0;">
      <div style="display: inline-block; background: linear-gradient(135deg, #06b6d4, #10b981); color: #fff; font-size: 36px; font-weight: 800; letter-spacing: 12px; padding: 16px 40px; border-radius: 16px; font-family: 'Courier New', monospace;">${otp}</div>
    </div>
    <div class="field-group">
      <div class="field-label">Important</div>
      <div class="field-value" style="color: #94a3b8; font-size: 13px;">
        • This code expires in <strong style="color: #e2e8f0;">5 minutes</strong>.<br />
        • Do not share this code with anyone.<br />
        • If you did not request this code, please ignore this email.
      </div>
    </div>`;
  return generateEmailWrapper('Email Verification', 'Verify Your Email', '🔐', bodyHTML);
}

async function sendOTPEmail(toEmail: string, name: string, otp: string): Promise<{ success: boolean; error?: string }> {
  if (!isSMTPConfigured()) {
    console.log('[Email] SMTP not configured — skipping OTP email.');
    return { success: true }; // Don't fail the request
  }

  try {
    const transporter = createTransporter();
    const htmlContent = generateOTPEmailHTML(otp, name);
    const textContent = `Your verification code is: ${otp}\n\nThis code expires in 5 minutes. Do not share this code with anyone.`;

    await transporter.sendMail({
      from: `"Upam Portfolio" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `🔐 Verify Your Email — Code: ${otp}`,
      html: htmlContent,
      text: textContent,
    });
    console.log(`[Email] OTP sent to ${toEmail}: ${otp}`);
    return { success: true };
  } catch (error) {
    console.error(`[Email] Failed to send OTP to ${toEmail}:`, error);
    return { success: false, error: 'OTP email delivery failed' };
  }
}

// ───────────────────────────────────────────────────────────────
// PUBLIC: Send OTP to a registering user
// ───────────────────────────────────────────────────────────────
export async function sendOTPToUser(email: string, name: string, otp: string): Promise<{ success: boolean; error?: string }> {
  return sendOTPEmail(email, name, otp);
}

// ───────────────────────────────────────────────────────────────
// PUBLIC: Send New Support Ticket Notification
// ───────────────────────────────────────────────────────────────
export async function sendNewTicketNotification(data: {
  clientName: string;
  subject: string;
  description: string;
  priority: string;
  category: string;
}): Promise<{ success: boolean; error?: string }> {
  const createdAt = getTimestamp();
  const htmlContent = generateNewTicketEmailHTML({ ...data, createdAt });
  const textContent = `New support ticket:\n\nClient: ${data.clientName}\nSubject: ${data.subject}\nPriority: ${data.priority}\nCategory: ${data.category}\nDescription:\n${data.description}\n\nSubmitted: ${createdAt}`;
  return sendMailToAdmin(`🎫 New Ticket: ${data.subject}`, htmlContent, textContent);
}
