import { authOptions } from "@/utils/authOptions";
import { errorResponse } from "@/utils/httpResponse";
import { generatePresignedUrl } from "@/utils/s3";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getServerSession(authOptions);

    if (!user?.user.role || user.user.role !== "admin") {
      return errorResponse("Unauthorized", 401);
    }

    const body: {
      path: string;
    } = await request.json();

    if (!body.path)
      return NextResponse.json(
        { success: false, message: "Missing Params" },
        { status: 400 }
      );

    const file = await generatePresignedUrl("privateen", body.path);

    return NextResponse.json({ url: file });
  } catch (e: any) {
    console.log(e);
    return errorResponse("Internal Server Error", 500);
  }
}
