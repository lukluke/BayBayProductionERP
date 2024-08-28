import AvatorIcon from "@/ui/icons/avatar";
import CouponIcon from "@/ui/icons/coupon";
import DashboardIcon from "@/ui/icons/dashboard";
import EnquiryIcon from "@/ui/icons/enquiry";
import ProductIcon from "@/ui/icons/product";
import TopupIcon from "@/ui/icons/topup";

const SIDE_BAR_ROUTES = [
  {
    path: "/dashboard",
    name: "控制面板",
    icon: <DashboardIcon />,
    role: ["admin", "staff"],
    subRoutes: [],
  },
  {
    path: "/dashboard/members",
    name: "會員",
    icon: <AvatorIcon />,
    role: ["admin"],
    subRoutes: [],
  },
  {
    path: "/dashboard/products",
    name: "商品",
    icon: <ProductIcon />,
    role: ["admin"],
    subRoutes: [
      {
        name: "商品種類",
        path: "/dashboard/products/categories",
      },
      {
        name: "商品",
        path: "/dashboard/products",
      },
    ],
  },
  {
    path: "/dashboard/coupons/associated",
    name: "禮卷",
    icon: <CouponIcon />,
    role: ["admin"],
    subRoutes: [
      {
        name: "禮卷種類",
        path: "/dashboard/coupons/categories",
      },
      {
        name: "已發出禮卷",
        path: "/dashboard/coupons/associated",
      },
    ],
  },
  {
    path: "/dashboard/enquiries",
    name: "查詢",
    icon: <EnquiryIcon />,
    role: ["admin"],
    subRoutes: [],
  },
  {
    path: "/dashboard/topups",
    name: "增值",
    icon: <TopupIcon />,
    role: ["admin"],
    subRoutes: [],
  },
  {
    path: "/dashboard/orders",
    name: "訂單",
    icon: <ProductIcon />,
    role: ["admin"],
    subRoutes: [],
  },
  {
    path: "/dashboard/reports",
    name: "報告",
    icon: <CouponIcon />,
    role: ["admin"],
    subRoutes: [],
  },
  {
    path: "/dashboard/tasks",
    name: "任務及案件",
    icon: <ProductIcon />,
    role: ["admin", "staff"],
    subRoutes: [],
  },
  {
    path: "/dashboard/bookings",
    name: "預約",
    icon: <TopupIcon />,
    role: ["admin"],
    subRoutes: [],
  },
  {
    path: "/dashboard/activities",
    name: "活動",
    icon: <EnquiryIcon />,
    role: ["admin", "staff"],
    subRoutes: [],
  },
  {
    path: "/dashboard/opportunities",
    name: "機會",
    icon: <EnquiryIcon />,
    role: ["admin"],
    subRoutes: [],
  },
  {
    path: "/dashboard/deals",
    name: "交易",
    icon: <EnquiryIcon />,
    role: ["admin"],
    subRoutes: [],
  },
];

export default SIDE_BAR_ROUTES;
