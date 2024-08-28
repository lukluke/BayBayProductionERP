import NotFound from "@/app/not-found";
import TaskDetails from "@/components/(dashboard)/dashboard/tasks/details";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth/next";

async function Page({ params }: { params: { id: string } }) {
  const user = await getServerSession(authOptions);

  if (!user?.user.role || !["admin", "staff"].includes(user.user.role)) {
    return <NotFound />;
  }

  const task = await prisma.task.findUnique({
    select: {
      id: true,
      title: true,
      description: true,
      state: true,
      deadline: true,
      createdAt: true,
      assigneeId: true,
      assignerId: true,
      assigneeUser: {
        select: {
          username: true,
        },
      },
      assignerUser: {
        select: {
          username: true,
        },
      },
    },
    where: {
      id: params.id,
    },
  });

  if (
    !task ||
    (user.user.role === "staff" &&
      task.assignerId !== user.user.id &&
      task.assigneeId !== user.user.id)
  ) {
    return <NotFound />;
  }

  return <TaskDetails task={task} />;
}

export default Page;
