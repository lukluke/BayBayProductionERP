"use client";
import moment from "moment";
import Link from "next/link";

function TaskDetails({ task }: { task: TaskDetail }) {
  return (
    <div className="p-2">
      <div className="font-bold text-xl">Title: {task.title}</div>
      <div className="flex gap-4">
        <Link
          href={`/dashboard/tasks/edit/${task.id}`}
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg"
        >
          更改
        </Link>
      </div>

      <div className="font-bold mt-4">Description</div>
      <pre>{task.description}</pre>
      
      <div className="font-bold mt-4">State</div>
      <div>{task.state}</div>
      
      <div className="font-bold mt-4">Deadline</div>
      <div>{moment(task.deadline).format("MM/DD")}</div>
      
      <div className="font-bold mt-4">Assignor</div>
      <div>{task.assignerUser?.username}</div>
      
      <div className="font-bold mt-4">Assignee</div>
      <div>{task.assigneeUser?.username}</div>
      
      <div className="font-bold mt-4">Created At</div>
      <div>{moment(task.createdAt).format("YYYY/MM/DD HH:mm:ss")}</div>
    </div>
  );
}

export default TaskDetails;
