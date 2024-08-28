import Form from "@/components/(dashboard)/dashboard/opportunities/edit";
import prisma from "@/utils/prisma";

async function Page({ params }: { params: { id: string } }) {
  const opportunity = await prisma.opportunity.findUnique({
    where: {
      id: params.id,
    },
  });
  return (
    <Form opportunity={opportunity ?? undefined} />
  );
}

export default Page;
