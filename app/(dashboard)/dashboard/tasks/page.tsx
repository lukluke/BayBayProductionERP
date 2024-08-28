import NotFound from "@/app/not-found";
import TaskList from "@/components/(dashboard)/dashboard/tasks/list";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";

async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <NotFound />;
  }

  const tasks = await prisma.task.findMany({
    select: {
      id: true,
      title: true,
      state: true,
      deadline: true,
      assigneeUser: {
        select: {
          username: true,
        },
      },
    },
    where:
      session.user.role === "admin"
        ? undefined
        : {
            OR: [
              {
                assigneeId: session.user.id,
              },
              {
                assignerId: session.user.id,
              },
            ],
          },
  });

  const groupedTasks: Record<string, Task[]> = {};
  for (const task of tasks) {
    if (!groupedTasks[task.state]) {
      groupedTasks[task.state] = [];
    }
    groupedTasks[task.state].push(task);
  }

  return (
    <div className="p-2 h-full flex flex-col gap-1">
      <div className="flex gap-2">
        <Link
          href={"/dashboard/tasks/create"}
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg"
        >
          New Task/Case
        </Link>
      </div>
      <div className="flex-1 grid grid-cols-4 gap-2 overflow-auto">
        <TaskList state="TODO" tasks={groupedTasks["TODO"]} />
        <TaskList state="IN_PROGRESS" tasks={groupedTasks["IN_PROGRESS"]} />
        <TaskList state="READY" tasks={groupedTasks["READY"]} />
        <TaskList state="DONE" tasks={groupedTasks["DONE"]} />
      </div>
    </div>
  );
}

export default Page;
