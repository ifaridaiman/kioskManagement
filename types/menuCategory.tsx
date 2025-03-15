export interface MenuResponse {
  status: string; // ✅ Fix: API returns "status", not "success"
  data: MenuCategory[]; // ✅ Fix: API returns { data: [...] }
}

export interface MenuCategory {
  id: string;
  title: string; // ✅ Fix: API returns "title", not "name"
  description: string;
  menus: MenuItem[];
}

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: string;
  image_url: string;
  inventory: InventoryItem[];
}

export interface InventoryItem {
  quantity: number;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  order_type: {
    name: string;
    description: string;
  };
}

export interface OrderType {
  id: string;
  name: string;
  description: string;
  order_type_rule: OrderTypeRule[]; // ✅ Include order_type_rule array
}

export interface OrderTypeRule {
  id: string;
  order_type_id: string;
  rule_type: string;
  close_time: string;
  close_date: string;
  created_at: string;
  updated_at: string;
}

export interface AvailableDateResponse {
  status: string; // ✅ Fix: API returns "status", not "success"
  data: AvailableDate[]; // ✅ Fix: API returns { data: [...] }
}

export interface AvailableDate {
  date: string;
}