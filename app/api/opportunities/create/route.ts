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
      priority: rawFormData.get("priority"),
      contactName: rawFormData.get("contactName"),
      contactNo: rawFormData.get("contactNo"),
      opportunityAmount: rawFormData.get("opportunityAmount"),
    };

    if (
      !formData.title ||
      !formData.priority ||
      !formData.contactName ||
      !formData.contactNo ||
      !formData.opportunityAmount
    ) {
      return errorResponse("Bad Request", 400);
    }

    await prisma.opportunity.create({
      data: {
        id: uuid(),
        title: formData.title as string,
        priority: parseInt(formData.priority as string),
        contactName: formData.contactName as string,
        contactNo: formData.contactNo as string,
        opportunityAmount: parseFloat(formData.opportunityAmount as string),
      },
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
