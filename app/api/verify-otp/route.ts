import { prisma } from "@/lib/prisma";

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
      return Response.json(
        {
          success: false,
          message: "Invalid Otp",
        },
        { status: 403 },
      );
    }

    if (!record.verifyCodeExpiry || record.verifyCodeExpiry < new Date()) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired",
        },
        { status: 403 },
      );
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

    return Response.json(
      {
        success: true,
        message: "User Verified Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "An error occurred while verifying the user",
      },
      { status: 500 },
    );
  }
}
