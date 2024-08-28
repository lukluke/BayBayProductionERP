import NotFound from "@/app/not-found";
import Form from "@/components/(dashboard)/dashboard/tasks/edit";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth/next";

async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <NotFound />;
  }

  const assignerList = await prisma.user.findMany({
    where:
      session.user.role === "admin"
        ? {
            role: {
              in: ["admin", "staff"],
            },
          }
        : {
            id: session.user.id,
          },
  });

  const assigneeList = await prisma.user.findMany({
    where: {
      role: {
        in: ["admin", "staff"],
      },
    },
  });

  const task = await prisma.task.findUnique({
    where: {
      id: params.id,
    },
  });

  return (
    <Form
      task={task ?? undefined}
      assigneeList={assigneeList}
      assignerList={assignerList}
    />
  );
}

export default Page;
