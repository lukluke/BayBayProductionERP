import { authOptions } from "@/utils/authOptions";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { uploadBlob } from "@/utils/s3";
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
      id: rawFormData.get("id"),
      categoryId: rawFormData.get("categoryId"),
      image: rawFormData.get("image"),
      name: rawFormData.get("name"),
      price: rawFormData.get("price"),
      stock: rawFormData.get("stock"),
      discount: rawFormData.get("discount"),
      couponPoint: rawFormData.get("couponPoint"),
      delete: rawFormData.get("delete"),
    };

    if (
      !formData.id ||
      !formData.categoryId ||
      !formData.stock ||
      !formData.name ||
      !formData.price ||
      !formData.discount ||
      !formData.couponPoint ||
      formData.delete === undefined
    ) {
      return errorResponse("Bad Request", 400);
    }

    if (formData.image) {
      await uploadBlob(
        "publicen",
        `images/products/${formData.id}.jpg`,
        formData.image as File
      );
    }

    await prisma.product.update({
      data: {
        categoryId: formData.categoryId as string,
        name: formData.name as string,
        image: `images/products/${formData.id}.jpg`,
        price: parseFloat(formData.price as string),
        stock: parseInt(formData.stock as string),
        discount: parseFloat(formData.discount as string),
        couponPoint: parseInt(formData.couponPoint as string),
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
