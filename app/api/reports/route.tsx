import { renderToBuffer } from "@react-pdf/renderer";
import Quotation from "@/components/pdfs/quotation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { errorResponse } from "@/utils/httpResponse";
import { NextRequest } from "next/server";
import { camelToTitle } from "@/utils/strings";
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return errorResponse("Unauthorized", 401);
  }

  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const amount = searchParams.get("amount");
  const date = searchParams.get("date");
  const companyName = searchParams.get("companyName");
  const companyAddress = searchParams.get("companyAddress");
  const companyEmail = searchParams.get("companyEmail");
  const items = JSON.parse(searchParams.get("items") || "[]");

  const pdf = await renderToBuffer(
    <Quotation
      props={{
        name: camelToTitle(name ?? "Quotation"),
        amount: Number(amount),
        date: date || "",
        companyName: companyName || "",
        companyAddress: companyAddress || "",
        companyEmail: companyEmail || "",
        items: items,
      }}
    />
  );

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
