import { NextResponse } from 'next/server';
import { api } from '@/services/api';
import { mockProducts } from '@/services/mockData';

export async function GET(request: Request) {
  try {
    return NextResponse.json(mockProducts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = await api.createProduct({
      name: body.name,
      price: body.price,
      stock: body.stock,
      description: body.description || 'New product description.',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
