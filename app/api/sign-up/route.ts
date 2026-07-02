import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/lib/resend";

interface requestedDataTypes {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const { name, email, password }: requestedDataTypes = await req.json();
    console.log("Received data:", { name, email, password });
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        email: true,
      },
    });

    if (existingEmail) {
      return Response.json(
        {
          success: false,
          message: "User with this email already exists.",
        },
        { status: 400 },
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
      return Response.json(
        {
          success: false,
          message: "Failed to send verification email.",
        },
        { status: 500 },
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verifyCode: generatedVerifyCode,
        verifyCodeExpiry: generatedVerifyCodeExpiry,
      },
    });

    return Response.json(
      {
        success: true,
        message: "User Registered Successfully",
        data: user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Error Registering User: ",
        error,
      },
      { status: 500 },
    );
  }
}
