import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { hasPermission } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const organizationId = params.id;

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return errorResponse("Organization not found", 404);
    }

    const userRole = await prisma.organizationMember.findFirst({
      where: {
        userId: session.user._id,
        organizationId: organizationId,
      },
      select: {
        role: true,
      },
    });

    if (
      !userRole ||
      !hasPermission(
        { id: session.user._id, role: userRole.role },
        "delete:organization",
      )
    ) {
      return errorResponse("Forbidden", 403);
    }

    await prisma.organizationMember.deleteMany({
      where: { organizationId: organizationId },
    });

    return successResponse({ message: "Organization deleted successfully" });
  } catch (error) {
    return errorResponse(
      "An error occurred while deleting the organization",
      500,
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const organizationId = params.id;

    const { organizationName, description, slug } = await request.json();

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return errorResponse("Organization not found", 404);
    }

    const userRole = await prisma.organizationMember.findFirst({
      where: {
        userId: session.user._id,
        organizationId: organizationId,
      },
      select: {
        role: true,
      },
    });

    if (
      !userRole ||
      !hasPermission(
        { id: session.user._id, role: userRole.role },
        "edit:organization",
      )
    ) {
      return errorResponse("Forbidden", 403);
    }

    const updatedOrganization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        name: organizationName,
        description: description,
        slug: slug,
      },
    });

    return successResponse({
      message: "Organization updated successfully",
      organization: updatedOrganization,
    });
  } catch (error) {
    return errorResponse(
      "An error occurred while updating the organization",
      500,
    );
  }
}
