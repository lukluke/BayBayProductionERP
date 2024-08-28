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
      contactName: rawFormData.get("contactName"),
      contactNo: rawFormData.get("contactNo"),
      dealAmount: rawFormData.get("dealAmount"),
    };

    if (
      !formData.state ||
      !formData.title ||
      !formData.contactName ||
      !formData.contactNo ||
      !formData.dealAmount
    ) {
      return errorResponse("Bad Request", 400);
    }

    await prisma.deal.update({
      data: {
        state: formData.state as string,
        title: formData.title as string,
        contactName: formData.contactName as string,
        contactNo: formData.contactNo as string,
        dealAmount: parseFloat(formData.dealAmount as string),
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
