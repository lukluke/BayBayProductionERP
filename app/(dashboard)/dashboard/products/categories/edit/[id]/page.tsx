import Form from "@/components/(dashboard)/dashboard/products/categories/edit";
import prisma from "@/utils/prisma";

async function Page({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({
    where: {
      id: params.id,
    },
  });
  return <Form category={category ?? undefined} />;
}

export default Page;
