import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/lib/resend";

interface requestedDataTypes {
  name: string;
  email: string;
  password: string;
  otp: string;
}

async function registerUser(name: string, email: string, password: string) {
  try {
    const generatedVerifyCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const generatedVerifyCodeExpiry = new Date();
    generatedVerifyCodeExpiry.setMinutes(
      generatedVerifyCodeExpiry.getMinutes() + 15,
    );

    const hashedPassword = await bcrypt.hash(password, 12);

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingEmail) {
      return null;
    } else {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          verifyCode: generatedVerifyCode,
          verifyCodeExpiry: generatedVerifyCodeExpiry,
        },
      });

      await sendVerificationEmail(name, generatedVerifyCode, email);

      return { user, generatedVerifyCode };
    }
  } catch (error) {
    console.log("Error Registering User: ", error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password, otp }: requestedDataTypes = await req.json();
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email,
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

    const resultOfUserRegistration = await registerUser(name, email, password);

    if (resultOfUserRegistration === null) {
      return Response.json(
        {
          success: false,
          message: "Error Registering User",
        },
        { status: 500 },
      );
    }

    const record = await prisma.user.findFirst({
      where: {
        email,
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
        message: "Uesr Verified Successfully",
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
