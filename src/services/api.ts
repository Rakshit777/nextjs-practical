import { mockProducts, mockOrders } from './mockData';

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  stock: number;
  created_at?: string;
};

export type Order = {
  id: number;
  user_id: number;
  total_amount: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  productId?: string;
  quantity?: number;
};

const BASE_URL = 'http://localhost:3001';

export const api = {
  async getProducts(page: number = 1, limit: number = 10): Promise<{ data: Product[], total: number }> {
    try {
      const response = await fetch(`${BASE_URL}/products?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();

      if (Array.isArray(data)) {
        return { data, total: data.length };
      }
      return {
        data: data.data || data.products || [],
        total: data.total || data.count || 0
      };
    } catch (error) {
      console.warn("Using mock products due to fetch failure:", error);
      return { data: mockProducts, total: mockProducts.length };
    }
  },

  async getOrders(page: number = 1, limit: number = 10): Promise<{ data: Order[], total: number }> {
    try {
      const response = await fetch(`${BASE_URL}/orders?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();

      if (Array.isArray(data)) {
        return { data, total: data.length };
      }
      return {
        data: data.data || data.orders || [],
        total: data.total || data.count || 0
      };
    } catch (error) {
      console.warn("Using mock orders due to fetch failure:", error);
      return { data: mockOrders, total: mockOrders.length };
    }
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  async createOrder(orderData: { user_id: number, items: { product_id: any, quantity: number }[] }): Promise<Order> {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  async cancelOrder(orderId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to cancel order');

    // Update local mock data as well
    const order = mockOrders.find(o => o.id === orderId);
    if (order) order.status = 'CANCELLED';
  },

  async completeOrder(orderId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/orders/${orderId}/complete`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to complete order');

    // Update local mock data as well
    const order = mockOrders.find(o => o.id === orderId);
    if (order) order.status = 'COMPLETED';
  }
};
