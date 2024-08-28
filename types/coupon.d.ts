type Coupon = {
  id: string;
  createdAt: string;
  usedAt: string | null;
  couponCategory: {
    value: number;
  };
  user: {
    id: string;
    username: string;
  };
};

type couponCategory = {
  id: string;
  name: string;
  value: number;
  active: boolean;
  createdAt: string;
}