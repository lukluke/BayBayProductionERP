"use client";
import { Order, OrderItem } from "@prisma/client";

function OrderDetails({
  order,
  orderItems,
}: {
  order: Order;
  orderItems?: { quantity: number; product: { name: string } }[];
}) {
  const handleConfirmOrder = async () => {
    const res = await fetch("/api/orders/confirm", {
      method: "POST",
      body: JSON.stringify({ id: order.id }),
    });

    if (res.ok) {
      alert("訂單確認成功");
      window.location.reload();
    } else {
      alert("訂單確認失敗");
    }
  };

  return (
    <div className="p-2">
      <div className="font-bold text-lg">Order Details</div>
      <hr />
      <div className="p-2 flex gap-4">
        <button
          onClick={() => handleConfirmOrder()}
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg"
        >
          確定訂單
        </button>
      </div>
      <table className="border">
        <tbody>
          {order &&
            Object.keys(order).map((key) => {
              const orderKey = key as keyof Order;
              return (
                <tr key={key} className={"border-b p-1"}>
                  <td className="p-1 border-r">{key}</td>
                  <td className="p-1">
                    {order[orderKey] instanceof Date
                      ? order[orderKey].toISOString()
                      : order[orderKey] ?? ""}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div>商品細項</div>
      <table className="border">
        <tbody>
          {order &&
            orderItems?.map((orderItem, index) => {
              return (
                <tr key={`item-${index}`} className={"border-b p-1"}>
                  <td className="p-1">{orderItem.quantity}個</td>
                  <td className="p-1">{orderItem.product.name}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default OrderDetails;
