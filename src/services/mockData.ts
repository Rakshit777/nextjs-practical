import { Product, Order } from './api';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    description: 'High-fidelity audio with active noise cancellation and 40-hour battery life.',
    price: "299.99",
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    stock: 15
  },
  {
    id: 2,
    name: 'Minimalist Wall Clock',
    description: 'A sleek, silent wall clock that fits perfectly in any modern interior.',
    price: "45.00",
    imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&q=80',
    stock: 24
  },
  {
    id: 3,
    name: 'Leather Notebook',
    description: 'Handcrafted genuine leather notebook with premium recycled paper.',
    price: "32.50",
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    stock: 50
  },
  {
    id: 4,
    name: 'Ergonomic Desk Chair',
    description: 'Stay comfortable all day with our fully adjustable ergonomic chair.',
    price: "189.00",
    imageUrl: 'https://images.unsplash.com/photo-1505843490701-5be550b33063?w=800&q=80',
    stock: 8
  }
];

export let mockOrders: Order[] = [
  {
    id: 11,
    user_id: 1,
    total_amount: "200.00",
    status: "CANCELLED",
    created_at: "2026-05-01T13:20:48.000Z"
  },
  {
    id: 10,
    user_id: 1,
    total_amount: "4000.00",
    status: "COMPLETED",
    created_at: "2026-05-01T12:43:06.000Z"
  }
];
