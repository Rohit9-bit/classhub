import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";

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
