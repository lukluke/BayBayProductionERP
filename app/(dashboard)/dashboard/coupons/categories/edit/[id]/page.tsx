import Form from "@/components/(dashboard)/dashboard/coupons/categories/edit";
import prisma from "@/utils/prisma";

async function Page({ params }: { params: { id: string } }) {
  const couponCategory = await prisma.couponCategory.findUnique({
    where: {
      id: params.id,
    },
  });
  return <Form couponCategory={couponCategory ?? undefined} />;
}

export default Page;
