type Category = {
  id: string;
  name: string;
  discount: number;
  createdAt: string;
};

type Product = {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  price: number;
  discount: number;
  couponPoint: number;
  createdAt: string;
};
