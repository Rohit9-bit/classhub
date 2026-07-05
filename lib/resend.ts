import { Resend } from "resend";
import { OtpVerificationEmail } from "@/emails/verificationEmailTemplate";
import { ApiResponse } from "@/types/ApiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  name: string,
  verifyCode: string,
  email: string,
): Promise<ApiResponse> {
  try {
    const response = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "ClassHub Verification Code",
      react: OtpVerificationEmail({ name, otp: verifyCode }),
    });

    if (response.error) {
      return {
        success: false,
        message: response.error.message || "Failed to send verification email",
        status: 500,
      };
    }

    return {
      success: true,
      message: "Verification email has been sent successfully",
      status: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send verification email",
      status: 500,
    };
  }
}
