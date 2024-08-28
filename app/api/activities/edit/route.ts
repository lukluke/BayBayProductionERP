import { confirmEmail } from "@/components/emails/confirm";
import { authOptions } from "@/utils/authOptions";
import { sendMail } from "@/utils/email";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { uploadBlob } from "@/utils/s3";
import moment from "moment";
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
      title: rawFormData.get("title"),
      start: rawFormData.get("start"),
      end: rawFormData.get("end"),
      date: rawFormData.get("date"),
      approved: rawFormData.get("approved"),
      attendance: rawFormData.get("attendance"),
    };

    if (
      !formData.id ||
      !formData.title ||
      !formData.start ||
      !formData.end ||
      !formData.date ||
      formData.approved === undefined ||
      formData.attendance === undefined
    ) {
      return errorResponse("Bad Request", 400);
    }

    const activity = await prisma.activity.findUnique({
      where: {
        id: formData.id as string,
      },
    });

    if (!activity) {
      return errorResponse("Bad Request", 400);
    }

    if (!activity.approved && Boolean(formData.approved)) {
      const mail = confirmEmail({
        id: activity.id,
        details: `${activity.title}`,
        extra: `日期及時間: ${moment.utc(activity.date).format("DD/MM/YYYY")} ${moment
          .utc(activity.start)
          .format("HH:mm")}-${moment.utc(activity.end).format("HH:mm")}`,
      });

      await sendMail("預約確認", "tohongwong@gmail.com", mail);
    }

    await prisma.activity.update({
      data: {
        title: formData.title as string,
        start: `1970-01-01T${formData.start as string}:00Z`,
        end: `1970-01-01T${formData.end as string}:00Z`,
        date: formData.date as string,
        approved: Boolean(formData.approved),
        attendance: Boolean(formData.attendance),
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
