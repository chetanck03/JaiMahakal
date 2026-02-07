import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(email: string, otp: string, name: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'StartupOps <noreply@startupops.com>',
    to: email,
    subject: 'Your OTP Code - StartupOps',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .otp-box { background: white; border: 2px solid #2563eb; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>StartupOps</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Your One-Time Password (OTP) for signing in to StartupOps is:</p>
              <div class="otp-box">${otp}</div>
              <p><strong>This code will expire in 10 minutes.</strong></p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} StartupOps. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
