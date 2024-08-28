import Form from "@/components/(dashboard)/dashboard/products/edit";
import prisma from "@/utils/prisma";

async function Page({ params }: { params: { id: string } }) {
  const categories = await prisma.category.findMany({
    where: {
      deletedAt: null,
    },
  });

  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
    },
  });
  return (
    <Form categories={categories ?? undefined} product={product ?? undefined} />
  );
}

export default Page;
