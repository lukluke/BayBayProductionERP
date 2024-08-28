"use client";
import LoadingSpinner from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Form() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/opportunities/create", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
    } else {
      router.push("/dashboard/opportunities");
    }
    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center">
      <form
        className="w-2/3 h-2/3 p-6 border border-slate-300 rounded-md flex flex-col gap-4 overflow-y-scroll custom-scrollbar"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h1 className="text-2xl font-bold">Create Opportunity</h1>
        <div>
          <label htmlFor="title">名稱</label>
          <input id="title" name="title" type="text" />
        </div>
        <div>
          <label htmlFor="priority">優先度</label>
          <input id="priority" name="priority" type="number" />
        </div>
        <div>
          <label htmlFor="contactName">聯絡人</label>
          <input id="contactName" name="contactName" type="text" />
        </div>
        <div>
          <label htmlFor="contactNo">聯絡電話</label>
          <input id="contactNo" name="contactNo" type="text" />
        </div>
        <div>
          <label htmlFor="opportunityAmount">潛在價值</label>
          <input
            id="opportunityAmount"
            name="opportunityAmount"
            type="number"
            step={0.01}
          />
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
