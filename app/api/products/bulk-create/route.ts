import { authOptions } from "@/utils/authOptions";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { Product } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { parse } from "csv-parse";

export async function POST(request: NextRequest) {
  try {
    const user = await getServerSession(authOptions);

    if (!user?.user.role || user.user.role !== "admin") {
      return errorResponse("Unauthorized", 401);
    }

    const rawFormData = await request.formData();
    const formData = {
      csv: rawFormData.get("csv"),
    };

    if (!formData.csv) {
      return errorResponse("Bad Request", 400);
    }

    const products: {
      categoryId: string;
      name: string;
      price: string;
      discount: string;
      couponPoint: string;
    }[] = await parseCSVToObject(formData.csv as File);

    console.log(products);

    await prisma.product.createMany({
      data: products.map((product) => {
        return {
          id: uuid(),
          categoryId: product.categoryId,
          name: product.name,
          price: parseFloat(product.price),
          discount: parseFloat(product.discount),
          couponPoint: parseInt(product.couponPoint),
        };
      }),
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    console.log(e);
    return errorResponse("Internal Server Error", 500);
  }
}

async function parseCSVToObject(file: File): Promise<
  {
    categoryId: string;
    name: string;
    price: string;
    discount: string;
    couponPoint: string;
  }[]
> {
  const csvText = await file.text();
  return new Promise((resolve, reject) => {
    parse(
      csvText,
      {
        columns: true,
        skip_empty_lines: true,
      },
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}
