export interface OrderItem {
  id: string;
  quantity: number;
  menu: {
    id: string;
    title: string;
    price: number;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

export interface Order {
  id: string;
  customer: Customer | null;
  payment_method: string;
  delivery_method: string;
  created_at: string;
  status: string;
  items: OrderItem[];
}

export interface OrdersApiResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}