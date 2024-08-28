import { authOptions } from "@/utils/authOptions";
import { errorResponse, successResponse } from "@/utils/httpResponse";
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
      bucket: rawFormData.get("bucket"),
      path: rawFormData.get("path"),
      file: rawFormData.get("file"),
    };

    if (!formData.bucket || !formData.path || !formData.file) {
      return errorResponse("Bad Request", 400);
    }

    await uploadBlob(
      formData.bucket.toString(),
      formData.path.toString(),
      formData.file as File
    );

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
