import Form from "@/components/(dashboard)/dashboard/products/form";
import prisma from "@/utils/prisma";

async function Page() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      deletedAt: null,
    },
  });
  return <Form categories={categories} />;
}

export default Page;
