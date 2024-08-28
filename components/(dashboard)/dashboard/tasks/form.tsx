"use client";
import LoadingSpinner from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Form({
  assigneeList,
  assignerList,
}: {
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
    const response = await fetch("/api/tasks/create", {
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
        <h1 className="text-2xl font-bold">Create Task / Case</h1>
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={6} />
        </div>
        <div>
          <label htmlFor="assigner">分派者</label>
          <select id="assigner" name="assigner">
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
          <select id="assignee" name="assignee">
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
          <input id="deadline" name="deadline" type="date" />
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
