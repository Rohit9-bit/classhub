import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";

export async function POST(request: Request) {
  try {
    const { organizationName, description, slug } = await request.json();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const existingOrganization = await prisma.organization.findFirst({
      where: {
        slug: slug,
      },
    });

    if (existingOrganization) {
      return errorResponse("Organization with this slug already exists", 400);
    }

    const newOrganization = await prisma.organization.create({
      data: {
        name: organizationName,
        description: description,
        slug: slug,
      },
    });

    await prisma.organizationMember.create({
      data: {
        userId: session.user._id,
        organizationId: newOrganization.id,
        role: "OWNER",
      },
    });

    return successResponse({ message: "Organization created successfully" });
  } catch (error) {
    console.error("Error creating organization:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
