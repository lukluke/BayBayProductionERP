import Form from "@/components/(dashboard)/dashboard/deals/edit";
import prisma from "@/utils/prisma";

async function Page({ params }: { params: { id: string } }) {
  const deal = await prisma.deal.findUnique({
    where: {
      id: params.id,
    },
  });
  return (
    <Form deal={deal ?? undefined} />
  );
}

export default Page;
