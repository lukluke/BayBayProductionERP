import Form from "@/components/(dashboard)/dashboard/products/edit";
import prisma from "@/utils/prisma";

async function Page() {
  const categories = await prisma.category.findMany({
    where: {
      deletedAt: null,
    },
  });
  return <Form categories={categories} />;
}

export default Page;
