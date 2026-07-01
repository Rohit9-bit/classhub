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
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "ClassHub Verification Code",
      react: OtpVerificationEmail({ name, otp: verifyCode }),
    });

    return {
      success: true,
      messages: "Verification email has been send successfully",
    };
  } catch (error) {
    console.log("Error Sending Verification Code", error);
    return { success: false, messages: "Failed to send verification email" };
  }
}
