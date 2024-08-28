"use client";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

function Page() {
  const [pdfType, setPdfType] = useState("quotation");
  const [pdfUrl, setPdfUrl] = useState("");
  const [numberOfItems, setNumberOfItems] = useState(1);
  const items = useRef<
    {
      name: string;
      quantity: number;
      amount: number;
    }[]
  >([]);

  useEffect(() => {
    if (items.current.length < numberOfItems) {
      items.current.push({ name: "", quantity: 1, amount: 0 });
    } else if (items.current.length > numberOfItems) {
      items.current.pop();
    }
  }, [numberOfItems]);

  function handleGeneratePdf(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const queryParams = new URLSearchParams({
      name: pdfType,
      amount: data.amount.toString(),
      date: data.date.toString(),
      companyName: data.companyName.toString(),
      companyAddress: data.companyAddress.toString(),
      companyEmail: data.companyEmail.toString(),
      items: JSON.stringify(items.current),
    });

    setPdfUrl(`/api/reports?${queryParams}`);
  }

  return (
    <div className="p-2 h-full flex flex-col gap-1">
      <form
        onSubmit={(e) => handleGeneratePdf(e)}
        className="flex flex-col gap-2"
      >
        <div>
          <label htmlFor="pdfType">Type</label>
          <select
            id="amount"
            name="amount"
            value={pdfType}
            onChange={(e) => setPdfType(e.currentTarget.value)}
          >
            <option value={"quotation"}>Quotation</option>
            <option value={"purchaseOrder"}>Purchase Order</option>
            <option value={"invoice"}>Invoice</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount">Total Amount</label>
          <input type="number" step={0.01} id="amount" name="amount" required />
        </div>
        <div>
          <label htmlFor="companyName">Company Name</label>
          <input type="text" id="companyName" name="companyName" />
        </div>
        <div>
          <label htmlFor="companyAddress">Company Address</label>
          <input type="text" id="companyAddress" name="companyAddress" />
        </div>
        <div>
          <label htmlFor="companyEmail">Company Email</label>
          <input type="text" id="companyEmail" name="companyEmail" />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" />
        </div>
        {Array(numberOfItems)
          .fill(0)
          .map((_, idx) => {
            console.log(idx);
            return (
              <div key={`item-${idx}`}>
                <div>Item #{idx + 1}</div>
                <label>Name</label>
                <input
                  type="text"
                  onChange={(e) => (items.current[idx].name = e.currentTarget.value)}
                />
                <label>Quantity</label>
                <input
                  type="number"
                  onChange={(e) =>
                    (items.current[idx].quantity = Number(e.currentTarget.value))
                  }
                />
                <label>Unit Price</label>
                <input
                  type="number"
                  onChange={(e) =>
                    (items.current[idx].amount = Number(e.currentTarget.value))
                  }
                />
              </div>
            );
          })}
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white text-center font-bold rounded-lg"
            onClick={() => setNumberOfItems(numberOfItems + 1)}
          >
            Add Item
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white text-center font-bold rounded-lg"
            onClick={() => setNumberOfItems(Math.max(numberOfItems - 1, 0))}
          >
            Remove Item
          </button>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white text-center font-bold rounded-lg"
        >
          Generate
        </button>
      </form>
      <div className="border">
        <iframe src={pdfUrl} className="w-full aspect-square" />
      </div>
      <Link
        href={pdfUrl}
        className="px-4 py-2 bg-green-500 text-white text-center font-bold rounded-lg"
      >
        Download
      </Link>
    </div>
  );
}

export default Page;
