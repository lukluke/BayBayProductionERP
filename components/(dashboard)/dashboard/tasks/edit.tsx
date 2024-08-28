"use client";
import LoadingSpinner from "@/components/ui/spinner";
import { Task } from "@prisma/client";
import moment from "moment";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Form({
  task,
  assigneeList,
  assignerList,
}: {
  task?: Task;
  assigneeList: { id: string; username: string }[];
  assignerList: { id: string; username: string }[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/tasks/edit", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
    } else {
      router.push("/dashboard/tasks");
    }
    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center">
      <form
        className="w-2/3 h-2/3 p-6 border border-slate-300 rounded-md flex flex-col gap-4 overflow-y-scroll custom-scrollbar"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h1 className="text-2xl font-bold">Edit Task / Case</h1>
        <div>
          <label htmlFor="id">Id</label>
          <input
            id="id"
            name="id"
            type="text"
            defaultValue={task?.id}
            required
          />
        </div>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={task?.title ?? ""}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            defaultValue={task?.description ?? ""}
            rows={6}
          />
        </div>
        <div>
          <label htmlFor="assigner">分派者</label>
          <select
            id="assigner"
            name="assigner"
            defaultValue={task?.assignerId ?? ""}
          >
            {assignerList.map((assigner, index) => {
              return (
                <option value={assigner.id} key={`assigner-${index}`}>
                  {assigner.username}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="assignee">接受者</label>
          <select
            id="assignee"
            name="assignee"
            defaultValue={task?.assigneeId ?? ""}
          >
            {assigneeList.map((assignee, index) => {
              return (
                <option value={assignee.id} key={`assignee-${index}`}>
                  {assignee.username}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="deadline">Deadline</label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            defaultValue={moment(task?.deadline).format("YYYY-MM-DD")}
            required
          />
        </div>
        <div>
          <label htmlFor="state">狀態</label>
          <select id="state" name="state" defaultValue={task?.state ?? "TODO"}>
            <option value={"TODO"}>TODO</option>
            <option value={"IN_PROGRESS"}>IN PROGRESS</option>
            <option value={"READY"}>READY</option>
            <option value={"DONE"}>DONE</option>
          </select>
        </div>
        <div>
          <label htmlFor="delete">Delete this category</label>
          <div>
            <input
              id="delete"
              name="delete"
              type="checkbox"
              defaultChecked={task?.deletedAt ? true : false}
            />
          </div>
        </div>
        <p className="text-sm text-red-500">{error}</p>
        <button
          className="w-full bg-blue-500 hover:bg-blue-400 text-white text-center px-3 py-1 rounded-md mt-auto"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : "Submit"}
        </button>
      </form>
    </div>
  );
}
