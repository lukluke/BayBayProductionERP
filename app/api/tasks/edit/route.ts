import { authOptions } from "@/utils/authOptions";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { uploadBlob } from "@/utils/s3";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getServerSession(authOptions);

    if (!user?.user.role || !["admin", "staff"].includes(user.user.role)) {
      return errorResponse("Unauthorized", 401);
    }

    const rawFormData = await request.formData();
    const formData = {
      id: rawFormData.get("id"),
      title: rawFormData.get("title"),
      description: rawFormData.get("description"),
      assigner: rawFormData.get("assigner"),
      assignee: rawFormData.get("assignee"),
      deadline: rawFormData.get("deadline"),
      state: rawFormData.get("state"),
      delete: rawFormData.get("delete"),
    };

    if (
      !formData.id ||
      !formData.title ||
      !formData.description ||
      !formData.assigner ||
      !formData.assignee ||
      !formData.deadline ||
      !formData.state ||
      formData.delete === undefined ||
      !["TODO", "IN_PROGRESS", "READY", "DONE"].includes(
        formData.state as string
      )
    ) {
      return errorResponse("Bad Request", 400);
    }

    const task = await prisma.task.findUnique({
      where: {
        id: formData.id as string,
      },
    });

    if (!task) {
      return errorResponse("Bad Request", 400);
    }

    if (
      user.user.role === "staff" &&
      task.assignerId !== user.user.id &&
      task.assigneeId !== user.user.id
    ) {
      return errorResponse("Unauthorized", 401);
    }

    await prisma.task.update({
      data: {
        title: formData.title as string,
        description: formData.description as string,
        assignerId: formData.assigner as string,
        assigneeId: formData.assignee as string,
        deadline: new Date(formData.deadline as string),
        state: formData.state as string,
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
