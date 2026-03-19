import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // your gmail
    pass: process.env.MAIL_PASS, // your app password (NOT your real password)
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: `"YourApp" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your OTP Verification Code",
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>New Device Login Detected</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 8px; color: #4F46E5;">${otp}</h1>
        <p>This code expires in <strong>5 minutes</strong>.</p>
        <p>If this wasn't you, please secure your account immediately.</p>
      </div>
    `,
  });
}
