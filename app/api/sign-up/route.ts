import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/lib/resend";
import { errorResponse, successResponse } from "@/lib/response";

interface requestedDataTypes {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const { name, email, password }: requestedDataTypes = await req.json();
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        email: true,
      },
    });

    if (existingEmail) {
      return errorResponse(
        "Email already exists. Please use a different email.",
        400,
      );
    }

    const generatedVerifyCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const generatedVerifyCodeExpiry = new Date();
    generatedVerifyCodeExpiry.setMinutes(
      generatedVerifyCodeExpiry.getMinutes() + 15,
    );

    const hashedPassword = await bcrypt.hash(password, 12);

    const statusOfEmail = await sendVerificationEmail(
      name,
      generatedVerifyCode,
      email,
    );

    if (statusOfEmail.success === false) {
      return errorResponse("Error sending verification email", 500);
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verifyCode: generatedVerifyCode,
        verifyCodeExpiry: generatedVerifyCodeExpiry,
      },
    });

    return successResponse({ message: "User created successfully" }, 201);
  } catch (error: any) {
    console.log(error);
    return errorResponse("Error registering user", 500);
  }
}
