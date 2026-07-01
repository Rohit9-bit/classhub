// emails/OtpVerificationEmail.tsx
import * as React from "react";

interface OtpVerificationEmailProps {
  name: string;
  otp: string;
}

export const OtpVerificationEmail = ({
  name,
  otp,
}: OtpVerificationEmailProps) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.6",
      color: "#333",
    }}
  >
    <h2 style={{ color: "#4A90E2" }}>Verify Your Email</h2>
    <p>Hi {name},</p>
    <p>
      Thank you for signing up with <strong>ClassHub</strong>! To complete your
      registration, please use the following One-Time Password (OTP):
    </p>
    <div
      style={{
        backgroundColor: "#f4f4f4",
        padding: "12px 20px",
        borderRadius: "6px",
        fontSize: "20px",
        fontWeight: "bold",
        letterSpacing: "2px",
        textAlign: "center",
        margin: "20px 0",
      }}
    >
      {otp}
    </div>
    <p>
      This OTP will expire in <strong>10 minutes</strong>. Please enter it
      promptly.
    </p>
    <p>
      If you didn’t request this, you can safely ignore this email. Your account
      will remain secure.
    </p>
    <p style={{ marginTop: "30px" }}>
      Best regards,
      <br />
      ClassHub Team
    </p>
  </div>
);
