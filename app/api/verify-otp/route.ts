import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { ApiResponse } from "@/types/ApiResponse";

interface requestedDataTypes {
  email: string;
  otp: string;
}

export async function POST(req: Request) {
  try {
    const { email, otp }: requestedDataTypes = await req.json();
    const record = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        verifyCode: true,
        verifyCodeExpiry: true,
      },
    });

    if (!record || record.verifyCode !== otp) {
      return errorResponse("Invalid verification code", 400);
    }

    if (!record.verifyCodeExpiry || record.verifyCodeExpiry < new Date()) {
      return errorResponse("Verification code expired", 403);
    }

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        isVerified: true,
        verifyCode: null,
        verifyCodeExpiry: null,
      },
    });

    return successResponse({ message: "User verified successfully" }, 200);
  } catch (error) {
    return errorResponse("Error verifying user", 500);
  }
}
