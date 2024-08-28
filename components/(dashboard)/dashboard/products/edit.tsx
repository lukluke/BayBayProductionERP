"use client";
import LoadingSpinner from "@/components/ui/spinner";
import { Category, Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Form({
  categories,
  product,
}: {
  categories: Partial<Category>[];
  product?: Partial<Product>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/products/edit", {
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
        <h1 className="text-2xl font-bold">Edit Product</h1>

        <div>
          <label htmlFor="categoryId">商品種類</label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={product?.categoryId}
          >
            {categories.map((category, index) => {
              return (
                <option value={category.id} key={`category-${index}`}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="id">id</label>
          <input
            id="id"
            name="id"
            type="text"
            defaultValue={product?.id}
            required
          />
        </div>
        <div>
          <label htmlFor="image">商品圖片</label>
          <input
            id="image"
            name="image"
            type="file"
          />
        </div>
        <div>
          <label htmlFor="name">商品名稱</label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={product?.name}
            required
          />
        </div>
        <div>
          <label htmlFor="price">價格</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={product?.price}
            required
          />
        </div>
        <div>
          <label htmlFor="discount">折扣金額</label>
          <input
            id="discount"
            name="discount"
            type="number"
            step="0.01"
            defaultValue={product?.discount}
            required
          />
        </div>
        <div>
          <label htmlFor="couponPoint">賺取積分</label>
          <input
            id="couponPoint"
            name="couponPoint"
            type="number"
            step="0.01"
            defaultValue={product?.couponPoint}
            required
          />
        </div>
        <div>
          <label htmlFor="stock">貨存</label>
          <input
            id="stock"
            name="stock"
            type="number"
            defaultValue={product?.stock}
            required
          />
        </div>
        <div>
          <label htmlFor="delete">Delete this product</label>
          <div>
            <input
              id="delete"
              name="delete"
              type="checkbox"
              defaultChecked={product?.deletedAt ? true : false}
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
