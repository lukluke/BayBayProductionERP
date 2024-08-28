import SalesChart from "@/components/(dashboard)/dashboard/chart";
import UpdateWebsiteContents from "@/components/(dashboard)/dashboard/contactInput";
import DropImageBanner from "@/components/(dashboard)/dashboard/dropImageBanner";
import DropImageIcon from "@/components/(dashboard)/dashboard/dropImageIcon";
import DropImagePopup from "@/components/(dashboard)/dashboard/dropImagePopup";
import prisma from "@/utils/prisma";
export default async function Page() {
  const dailySales: any[] =
    await prisma.$queryRawUnsafe(`SELECT DATE(created_at) AS saleDate, SUM(total_price) AS dailySales
FROM orders WHERE created_at >= NOW() - INTERVAL 7 DAY GROUP BY saleDate ORDER BY saleDate ASC`);

const about = await prisma.websiteContent.findMany({
  select: {
    key: true,
    content: true,
  },
  where: {
    key: {
      in: ["about-us", "address", "email", "tel", "terms"],
    },
  },
});

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 [&>div]:border [&>div]:rounded-md [&>div]:p-2 [&>div]:bg-slate-50 overflow-y-scroll custom-scrollbar">
      <div className="col-span-1">
        <div className="font-bold">關於我們</div>
        <UpdateWebsiteContents defaultValue={about.find((c) => c.key === "about-us")?.content} contentKey="about-us" />
        <div className="font-bold">電郵</div>
        <UpdateWebsiteContents defaultValue={about.find((c) => c.key === "email")?.content} contentKey="email" />
        <div className="font-bold">聯絡地址</div>
        <UpdateWebsiteContents defaultValue={about.find((c) => c.key === "address")?.content} contentKey="address" />
        <div className="font-bold">聯絡電話</div>
        <UpdateWebsiteContents defaultValue={about.find((c) => c.key === "tel")?.content} contentKey="tel" />
        <div className="font-bold">條款及細則</div>
        <UpdateWebsiteContents defaultValue={about.find((c) => c.key === "terms")?.content} contentKey="terms" />
      </div>
      <div className="col-span-2">
        <div className="font-bold">銷售</div>
        <div>
          <SalesChart
            formatDate={true}
            xAxis={[
              {
                data: dailySales.map((d) => d.saleDate),
                scaleType: "time",
              },
            ]}
            series={[{ data: dailySales.map((d) => parseInt(d.dailySales)) }]}
            grid={{ vertical: true, horizontal: true }}
          />
        </div>
      </div>
      <div className="col-span-1">
        <div className="font-bold">彈出式廣告</div>
        <DropImagePopup />
      </div>
      <div className="col-span-1">
        <div className="font-bold">Banner</div>
        <DropImageBanner />
      </div>
      <div className="col-span-1">
        <div className="font-bold">公司標誌</div>
        <DropImageIcon />
      </div>
      <div className="col-span-1"></div>
      <div className="col-span-3"></div>
    </div>
  );
}
