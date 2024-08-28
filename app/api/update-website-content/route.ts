import { authOptions } from "@/utils/authOptions";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getServerSession(authOptions);

    if (!user?.user.role || user.user.role !== "admin") {
      return errorResponse("Unauthorized", 401);
    }

    const rawFormData = await request.formData();
    const formData = {
      content: rawFormData.get("content"),
      key: rawFormData.get("key"),
    };

    if (typeof formData.content === "undefined" || !formData.key) {
      return errorResponse("Bad Request", 400);
    }

    await prisma.websiteContent.update({
      data: {
        content: formData.content?.toString() ?? "",
      },
      where: {
        key: formData.key.toString(),
      },
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    console.log(e);
    return errorResponse("Internal Server Error", 500);
  }
}
