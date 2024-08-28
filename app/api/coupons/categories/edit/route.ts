import { authOptions } from "@/utils/authOptions";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { uploadBlob } from "@/utils/s3";
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
      id: rawFormData.get("id"),
      image: rawFormData.get("image"),
      name: rawFormData.get("name"),
      description: rawFormData.get("description"),
      value: rawFormData.get("value"),
      stock: rawFormData.get("stock"),
      active: rawFormData.get("active"),
      point: rawFormData.get("point"),
      delete: rawFormData.get("delete"),
    };

    if (
      !formData.id ||
      !formData.name ||
      !formData.description ||
      !formData.value ||
      !formData.stock ||
      !formData.point ||
      formData.active === undefined ||
      formData.delete === undefined
    ) {
      return errorResponse("Bad Request", 400);
    }

    if (formData.image) {
      await uploadBlob(
        "publicen",
        `images/coupons/${formData.id}.jpg`,
        formData.image as File
      );
    }

    await prisma.couponCategory.update({
      data: {
        name: formData.name as string,
        point: parseInt(formData.point as string),
        description: formData.description as string,
        imagePath: `images/coupons/${formData.id}.jpg`,
        active: Boolean(formData.active),
        value: parseFloat(formData.value as string),
        stock: parseInt(formData.stock as string),
        deletedAt: formData.delete ? new Date() : null,
      },
      where: {
        id: formData.id as string,
      },
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
