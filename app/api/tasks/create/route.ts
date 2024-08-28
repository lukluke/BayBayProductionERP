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
      title: rawFormData.get("title"),
      description: rawFormData.get("description"),
      assigner: rawFormData.get("assigner"),
      assignee: rawFormData.get("assignee"),
      deadline: rawFormData.get("deadline"),
    };

    if (
      !formData.title ||
      !formData.description ||
      !formData.assigner ||
      !formData.assignee ||
      !formData.deadline
    ) {
      return errorResponse("Bad Request", 400);
    }

    await prisma.task.create({
      data: {
        id: uuid(),
        title: formData.title as string,
        description: formData.description as string,
        assignerId: formData.assigner as string,
        assigneeId: formData.assignee as string,
        deadline: new Date(formData.deadline as string),
      },
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
