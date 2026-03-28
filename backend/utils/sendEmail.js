const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});

/**
 * Send an OTP email to the artisan during signup.
 */
const sendOtpEmail = async (to, name, otp) => {
  const mailOptions = {
    from: `"MarketLink for Women Artisans" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your OTP for MarketLink Signup",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#b5451b;">MarketLink for Women Artisans</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Use the OTP below to complete your signup. It is valid for <strong>${process.env.OTP_EXPIRY || 10} minutes</strong>.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#b5451b;text-align:center;padding:16px 0;">${otp}</div>
        <p style="color:#888;font-size:13px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

/**
 * Send an approval notification email to the artisan.
 */
const sendApprovalEmail = async (to, name) => {
  const loginUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/seller/login`;
  const mailOptions = {
    from: `"MarketLink for Women Artisans" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your Seller Application Has Been Approved",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#b5451b;">MarketLink for Women Artisans</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Good news — your seller application on Handora has been approved.</p>
        <p>You can now log in to your seller account and start accessing your seller dashboard.</p>
        <a href="${loginUrl}" 
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#b5451b;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">
          Login to Your Seller Account
        </a>
        <p style="margin-top: 16px;">If the button does not work, use this link:<br/>
        <a href="${loginUrl}">${loginUrl}</a></p>
        <p style="color:#888;font-size:13px;margin-top:24px;">Thank you,<br/>Handora Admin Team</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

/**
 * Send a rejection notification email to the artisan.
 */
const sendRejectionEmail = async (to, name, reason) => {
  const mailOptions = {
    from: `"MarketLink for Women Artisans" <${process.env.MAIL_USER}>`,
    to,
    subject: "Update on Your Seller Application",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#b5451b;">MarketLink for Women Artisans</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>We regret to inform you that your artisan account application has been <strong style="color:red;">rejected</strong>.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
        <p>If you believe this is a mistake or wish to re-apply, please contact our support team or re-register with updated documents.</p>
        <p style="color:#888;font-size:13px;margin-top:24px;">Thank you for your interest in MarketLink.</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

/**
 * Send a support ticket email to admin and auto-response to the artisan.
 */
const sendSupportEmail = async (sellerName, sellerEmail, subject, category, message) => {
  const adminEmail = process.env.MAIL_USER; // admin email address
  
  // 1. Email to Admin
  const mailToAdmin = {
    from: `"Handora Support System" <${process.env.MAIL_USER}>`,
    to: adminEmail,
    replyTo: sellerEmail,
    subject: `Support Ticket: [${category}] ${subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#b5451b;">New Support Ticket</h2>
        <p><strong>From:</strong> ${sellerName} (<a href="mailto:${sellerEmail}">${sellerEmail}</a>)</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr style="border:0;border-top:1px solid #eee;margin:20px 0;"/>
        <p style="white-space:pre-wrap;">${message}</p>
      </div>
    `,
  };
  await transporter.sendMail(mailToAdmin);

  // 2. Auto-reply to Seller
  const autoReplyOptions = {
    from: `"Handora Support" <${process.env.MAIL_USER}>`,
    to: sellerEmail,
    subject: `We received your request: "${subject}"`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <p>Hello <strong>${sellerName}</strong>,</p>
        <p>Thank you for reaching out to us. We have received your support request regarding <strong>${category}</strong>.</p>
        <p>Our team will review your message and get back to you shortly.</p>
        <p style="color:#888;font-size:13px;margin-top:24px;">Thank you,<br/>Handora Support Team</p>
      </div>
    `,
  };
  await transporter.sendMail(autoReplyOptions);
};

module.exports = { sendOtpEmail, sendApprovalEmail, sendRejectionEmail, sendSupportEmail };
