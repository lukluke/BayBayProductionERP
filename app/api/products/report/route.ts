import { authOptions } from "@/utils/authOptions";
import { errorResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth/next";
import { stringify } from "csv-stringify/sync";
import moment from "moment";

export async function GET() {
  try {
    const user = await getServerSession(authOptions);

    console.log(user);
    if (!user?.user.role || user.user.role !== "admin") {
      return errorResponse("Unauthorized", 401);
    }

    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
      },
    });

    const csvData = products.map((product) => ({
      id: product.id,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      discount: product.discount.toString(),
      couponPoint: product.couponPoint.toString(),
      createdAt: moment(product.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(product.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
    }));

    const productsCsv = stringify(csvData, {
      header: true,
      columns: [
        "id",
        "categoryId",
        "name",
        "description",
        "price",
        "stock",
        "discount",
        "couponPoint",
        "createdAt",
        "updatedAt",
      ],
    });

    // Set the filename for the download
    const filename = `products_${new Date().toISOString().split("T")[0]}.csv`;

    return new Response(productsCsv, {
      headers: {
        "content-type": "text/csv",
        "content-disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e: any) {
    console.log(e);
    return errorResponse("Internal Server Error", 500);
  }
}
