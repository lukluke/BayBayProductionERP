import moment from "moment";
import Link from "next/link";

function TaskList({ state, tasks }: { state: string; tasks?: Task[] }) {
  return (
    <div className="w-full custom-scrollbar p-2 rounded-lg shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="font-bold text-gray-500">
        {state.replaceAll("_", " ")} {tasks?.length ?? 0}
      </div>
      {tasks?.map((task) => {
        return (
          <Link href={`/dashboard/tasks/details/${task.id}`} key={task.id}>
            <div className="rounded-lg shadow-sm border bg-white w-full p-2 hover:bg-slate-50 mt-2">
              <div>{task.title}</div>
              <div className="text-sm">By {moment(task.deadline).format("MM/DD")}</div>
              <div className="text-right">{task.assigneeUser?.username}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default TaskList;
