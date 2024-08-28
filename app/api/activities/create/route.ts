import { authOptions } from "@/utils/authOptions";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user.role ||
      !["admin", "staff"].includes(session.user.role)
    ) {
      return errorResponse("Unauthorized", 401);
    }

    const rawFormData = await request.formData();
    const formData = {
      title: rawFormData.get("title"),
      start: rawFormData.get("start"),
      end: rawFormData.get("end"),
      date: rawFormData.get("date"),
    };

    console.log(formData);

    if (!formData.title || !formData.start || !formData.end || !formData.date) {
      return errorResponse("Bad Request", 400);
    }

    await prisma.activity.create({
      data: {
        id: uuid(),
        creatorId: session.user.id,
        title: formData.title as string,
        start: `1970-01-01T${formData.start as string}:00Z`,
        end: `1970-01-01T${formData.end as string}:00Z`,
        date: formData.date as string,
      },
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    console.log(e);
    return errorResponse("Internal Server Error", 500);
  }
}
