"use client";
import LoadingSpinner from "@/components/ui/spinner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Form({
  categories,
}: {
  categories: Partial<Category>[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/products/bulk-create", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
    } else {
      router.push("/dashboard/products");
    }
    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center">
      <form
        className="w-2/3 h-2/3 p-6 border border-slate-300 rounded-md flex flex-col gap-4 overflow-y-scroll custom-scrollbar"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h1 className="text-2xl font-bold">Bulk Create Product</h1>
        <Link
          className="text-blue-500 font-bold underline"
          href="https://publicen.s3.ap-southeast-2.amazonaws.com/sample.csv"
          download={true}
          target="_blank"
        >
          下載 Sample.csv
        </Link>
        <div>
          <div className="font-bold text-lg">商品種類ID表</div>
          <table className="border">
            <tbody>
              {categories.map((category, index) => {
                return (
                  <tr className="border-b" key={`category-${index}`}>
                    <td className="p-2">{category.id}</td>
                    <td className="p-2">{category.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <label htmlFor="csv">CSV</label>
          <input id="csv" name="csv" type="file" />
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
