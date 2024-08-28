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
      contactName: rawFormData.get("contactName"),
      contactNo: rawFormData.get("contactNo"),
      dealAmount: rawFormData.get("dealAmount"),
    };

    if (
      !formData.title ||
      !formData.contactName ||
      !formData.contactNo ||
      !formData.dealAmount
    ) {
      return errorResponse("Bad Request", 400);
    }

    await prisma.deal.create({
      data: {
        id: uuid(),
        title: formData.title as string,
        contactName: formData.contactName as string,
        contactNo: formData.contactNo as string,
        dealAmount: parseFloat(formData.dealAmount as string),
      },
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
