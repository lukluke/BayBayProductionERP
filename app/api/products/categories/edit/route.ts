import { authOptions } from "@/utils/authOptions";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getServerSession(authOptions);

    if (!user?.user.role || user.user.role !== "admin") {
      return errorResponse("Unauthorized", 401);
    }

    const rawFormData = await request.formData();
    const formData = {
      id: rawFormData.get("id"),
      name: rawFormData.get("name"),
      discount: rawFormData.get("discount"),
      delete: rawFormData.get("delete"),
    };

    if (
      !formData.name ||
      !formData.id ||
      !formData.discount ||
      formData.delete === undefined
    ) {
      return errorResponse("Bad Request", 400);
    }

    await prisma.category.update({
      data: {
        name: formData.name as string,
        discount: parseFloat(formData.discount as string),
        deletedAt: formData.delete ? new Date() : null,
      },
      where: {
        id: rawFormData.get("id") as string,
      },
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
