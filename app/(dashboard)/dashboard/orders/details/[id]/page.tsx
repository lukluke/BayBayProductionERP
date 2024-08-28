import NotFound from "@/app/not-found";
import OrderDetails from "@/components/(dashboard)/dashboard/orders/details";
import prisma from "@/utils/prisma";

async function Page({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
    },
  });

  const orderItems = await prisma.orderItem.findMany({
    select: {
      quantity: true,
      product: {
        select: {
          name: true,
        },
      },
    },
    where: {
      orderId: params.id,
    },
  });

  if (!order) return <NotFound />;

  return <OrderDetails order={order} orderItems={orderItems} />;
}

export default Page;
