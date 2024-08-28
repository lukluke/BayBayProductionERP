"use client";
import LoadingSpinner from "@/components/ui/spinner";
import { Activity } from "@prisma/client";
import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";
import { FormEvent, useState } from "react";

export default function Form({ activity }: { activity?: Activity }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/activities/edit", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
    } else {
      router.push("/dashboard/activities");
    }
    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center">
      <form
        className="w-2/3 h-2/3 p-6 border border-slate-300 rounded-md flex flex-col gap-4 overflow-y-scroll custom-scrollbar"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h1 className="text-2xl font-bold">Edit Activity</h1>
        <div>
          <label htmlFor="id">Id</label>
          <input
            id="id"
            name="id"
            type="text"
            defaultValue={activity?.id}
            required
          />
        </div>

        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={activity?.title}
            required
          />
        </div>
        <div>
          <label htmlFor="start">Start time</label>
          <input
            id="start"
            name="start"
            type="time"
            defaultValue={moment(activity?.start).format("HH:mm")}
            required
          />
        </div>
        <div>
          <label htmlFor="end">End time</label>
          <input
            id="end"
            name="end"
            type="time"
            defaultValue={moment(activity?.end).format("HH:mm")}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={moment(activity?.date).format("YYYY-MM-DD")}
            required
          />
        </div>
        <div>
          <label htmlFor="approved">Approve</label>
          <div>
            <input
              id="approved"
              name="approved"
              type="checkbox"
              defaultChecked={activity?.approved === true}
            />
          </div>
        </div>
        <div>
          <label htmlFor="attendance">Attendance</label>
          <div>
            <input
              id="attendance"
              name="attendance"
              type="checkbox"
              defaultChecked={activity?.attendance === true}
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
