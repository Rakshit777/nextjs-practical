import { NextResponse } from 'next/server';
import { api } from '@/services/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const allOrders = await api.getOrders();
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedOrders = allOrders.data.slice(start, end);

    return NextResponse.json({
      data: paginatedOrders,
      total: allOrders.total,
      page,
      limit
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = await api.createOrder({
      userId: String(body.user_id || '1'),
      productId: String(body.items?.[0]?.product_id || ''),
      quantity: body.items?.[0]?.quantity || 1,
      total: 0,
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
