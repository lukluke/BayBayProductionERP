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
    } = await request.json();

    if (!body.id)
      return NextResponse.json(
        { success: false, message: "Missing Params" },
        { status: 400 }
      );

    const topupDetails = await prisma.topup.findUnique({
      where: { id: body.id },
    });

    if (!topupDetails)
      return NextResponse.json(
        { success: false, message: "Not Found" },
        { status: 400 }
      );

    if (topupDetails.approved) {
      return NextResponse.json(
        { success: false, message: "Already approved" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await prisma.topup.update({
        where: {
          id: body.id,
        },
        data: {
          approved: true,
        },
      });

      const orderAssociated = await prisma.order.findFirst({
        where: {
          paymentId: topupDetails.id,
          state: "TO_BE_PAID",
        },
      });

      if (orderAssociated) {
        await prisma.order.updateMany({
          where: {
            paymentId: topupDetails.id,
            state: "TO_BE_PAID",
          },
          data: {
            state: "TO_BE_CONFIRMED",
          },
        });
      } else {
        await prisma.user.update({
          where: {
            id: topupDetails.userId,
          },
          data: {
            balance: {
              increment: topupDetails.amount,
            },
          },
        });
      }
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
