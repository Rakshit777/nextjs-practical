import { NextResponse } from 'next/server';
import { mockOrders } from '@/services/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const allOrders = mockOrders;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedOrders = allOrders.slice(start, end);

    return NextResponse.json({
      data: paginatedOrders,
      total: allOrders.length,
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

    const newOrder = {
      id: Math.floor(Math.random() * 10000),
      user_id: body.user_id,
      total_amount: "0.00",
      status: 'PENDING' as const,
      created_at: new Date().toISOString(),
    };

    mockOrders.unshift(newOrder);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
