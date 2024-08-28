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

    const body: {
      id: string;
      done: string | boolean;
    } = await request.json();

    if (!body.id || typeof body.done === "undefined")
      return NextResponse.json(
        { success: false, message: "Missing Params" },
        { status: 400 }
      );

    await prisma.enquiry.update({
      where: {
        id: body.id,
      },
      data: {
        done: body.done === "true" || body.done === true ? false : true,
      },
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
