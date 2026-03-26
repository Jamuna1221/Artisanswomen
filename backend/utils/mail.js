const nodemailer = require("nodemailer");

const sendOtpEmail = async (email, otp) => {
  // Create transporter inside the function to ensure process.env variables are loaded
  console.log("MAIL_DEBUG: Sender Account:", process.env.MAIL_USER);
  console.log("MAIL_DEBUG: Password Length:", process.env.MAIL_APP_PASSWORD?.length);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Handora Support" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "🛡️ Handora Admin Verification | Secure One-Time Password",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 20px; color: #333; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 35px;">
           <h1 style="color: #C05641; margin: 0; font-size: 34px; font-weight: 800; letter-spacing: -0.5px;">Handora</h1>
           <p style="color: #666; margin: 5px 0; font-size: 13px; letter-spacing: 4px; text-transform: uppercase; font-weight: 600;">Hand Made Haven</p>
        </div>
        
        <div style="background: #FDFBF7; padding: 35px; border-radius: 16px; text-align: center; border: 1px solid #FAF3E0;">
          <h2 style="color: #264653; font-size: 22px; margin-bottom: 12px; font-weight: 700;">Identity Verification</h2>
          <p style="color: #555; line-height: 1.6; font-size: 15px;">A request to access your Handora Master Dashboard was made. If this was you, please use the following secure code to proceed.</p>
          
          <div style="margin: 35px 0; font-size: 48px; font-weight: 800; color: #C05641; letter-spacing: 12px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(192, 86, 65, 0.05); display: inline-block; width: 80%;">
            ${otp}
          </div>
          
          <p style="color: #888; font-size: 13px; margin-top: 25px;">This code is strictly for your administrative account and will expire in <strong style="color: #E76F51;">${process.env.OTP_EXPIRY || 10} minutes</strong>.</p>
        </div>
        
        <div style="margin-top: 40px; font-size: 11px; color: #aaa; text-align: center; border-top: 1px solid #f0f0f0; padding-top: 25px;">
          <p style="margin-bottom: 5px;">&copy; 2026 Handora Marketplace for Women Artisans &bull; Secured Protocol</p>
          <p>If you did not attempt this login, please contact technical support immediately.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("MAIL_DEBUG: Email successfully sent. ID:", info.messageId);
    return true;
  } catch (err) {
    console.error("MAIL_DEBUG: Error sending email:", err.message);
    return false;
  }
};

module.exports = { sendOtpEmail };
