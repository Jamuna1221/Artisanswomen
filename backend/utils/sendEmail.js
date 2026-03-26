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
  const mailOptions = {
    from: `"MarketLink for Women Artisans" <${process.env.MAIL_USER}>`,
    to,
    subject: "🎉 Congratulations! Your Artisan Account is Approved",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#b5451b;">MarketLink for Women Artisans</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>🎉 Great news! Your artisan account has been <strong style="color:green;">approved</strong> by our admin team.</p>
        <p>You can now log in to your <strong>Seller Dashboard</strong> and start listing your beautiful products.</p>
        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/seller/login" 
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#b5451b;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">
          Go to Seller Dashboard
        </a>
        <p style="color:#888;font-size:13px;margin-top:24px;">Thank you for joining our platform!</p>
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
    subject: "Update on Your MarketLink Application",
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

module.exports = { sendOtpEmail, sendApprovalEmail, sendRejectionEmail };
