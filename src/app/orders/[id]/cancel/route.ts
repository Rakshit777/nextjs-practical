import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    
    return NextResponse.json({ 
      message: `Order ${id} has been cancelled successfully`,
      orderId: id,
      status: 'CANCELLED'
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}
