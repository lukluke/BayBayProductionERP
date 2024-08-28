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
      categoryId: rawFormData.get("categoryId"),
      name: rawFormData.get("name"),
      price: rawFormData.get("price"),
      discount: rawFormData.get("discount"),
      couponPoint: rawFormData.get("couponPoint"),
    };

    if (
      !formData.categoryId ||
      !formData.name ||
      !formData.price ||
      !formData.discount ||
      !formData.couponPoint
    ) {
      return errorResponse("Bad Request", 400);
    }

    await prisma.product.create({
      data: {
        id: uuid(),
        categoryId: formData.categoryId as string,
        name: formData.name as string,
        price: parseFloat(formData.price as string),
        discount: parseFloat(formData.discount as string),
        couponPoint: parseInt(formData.couponPoint as string),
      },
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
