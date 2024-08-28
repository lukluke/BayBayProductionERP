import { confirmEmail } from "@/components/emails/confirm";
import { authOptions } from "@/utils/authOptions";
import { sendMail } from "@/utils/email";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import moment from "moment";
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

    const activityDetails = await prisma.activity.findUnique({
      where: { id: body.id },
    });

    if (!activityDetails)
      return NextResponse.json(
        { success: false, message: "Not Found" },
        { status: 400 }
      );

    if (activityDetails.approved) {
      return NextResponse.json(
        { success: false, message: "Already approved" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const mail = confirmEmail({
        id: activityDetails.id,
        details: `${moment
          .utc(activityDetails.date)
          .format("DD/MM/YYYY")} ${moment
          .utc(activityDetails.start)
          .format("HH:mm")}-${moment.utc(activityDetails.end).format("HH:mm")}`,
      });

      await sendMail("預約確認", "tohongwong@gmail.com", mail);

      await tx.activity.update({
        where: {
          id: body.id,
        },
        data: {
          approved: true,
        },
      });
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
