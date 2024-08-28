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
      state: rawFormData.get("state"),
      title: rawFormData.get("title"),
      priority: rawFormData.get("priority"),
      contactName: rawFormData.get("contactName"),
      contactNo: rawFormData.get("contactNo"),
      opportunityAmount: rawFormData.get("opportunityAmount"),
    };

    if (
      !formData.state ||
      !formData.title ||
      !formData.priority ||
      !formData.contactName ||
      !formData.contactNo ||
      !formData.opportunityAmount
    ) {
      return errorResponse("Bad Request", 400);
    }

    await prisma.opportunity.update({
      data: {
        state: formData.state as string,
        title: formData.title as string,
        contactName: formData.contactName as string,
        contactNo: formData.contactNo as string,
        priority: parseInt(formData.priority as string),
        opportunityAmount: parseFloat(formData.opportunityAmount as string),
      },
      where: {
        id: rawFormData.get("id") as string,
      },
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    console.log(e);
    return errorResponse("Internal Server Error", 500);
  }
}
