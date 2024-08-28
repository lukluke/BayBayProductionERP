import Form from "@/components/(dashboard)/dashboard/activities/edit";
import prisma from "@/utils/prisma";

async function Page({ params }: { params: { id: string } }) {
  const activity = await prisma.activity.findUnique({
    where: {
      id: params.id,
    },
  });
  return <Form activity={activity ?? undefined} />;
}

export default Page;
