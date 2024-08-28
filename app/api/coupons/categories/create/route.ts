import { authOptions } from "@/utils/authOptions";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const user = await getServerSession(authOptions);

    if (!user?.user.role || user.user.role !== "admin") {
      return errorResponse("Unauthorized", 401);
    }

    const rawFormData = await request.formData();
    const formData = {
      name: rawFormData.get("name"),
      description: rawFormData.get("description"),
      value: rawFormData.get("value"),
      point: rawFormData.get("point"),
    };

    if (
      !formData.name ||
      !formData.description ||
      !formData.value ||
      !formData.point
    ) {
      return errorResponse("Bad Request", 400);
    }

    await prisma.couponCategory.create({
      data: {
        id: uuid(),
        name: formData.name as string,
        point: parseInt(formData.point as string),
        description: formData.description as string,
        value: parseFloat(formData.value as string),
      },
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
