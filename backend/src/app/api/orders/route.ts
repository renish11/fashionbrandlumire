import { NextResponse } from "next/server";
import { orders } from "@/data/orders";
import type { Order } from "@/types";

// In-memory array initialized with mock orders
const ordersList: Order[] = [...orders];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get("customerId");

  if (customerId) {
    return NextResponse.json(
      ordersList.filter((o) => o.customerId === customerId)
    );
  }

  return NextResponse.json(ordersList);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Order>;
    const newOrder: Order = {
      id: `ord-${Date.now().toString().slice(-6)}`,
      orderNumber: body.orderNumber ?? `LUM-${Date.now().toString().slice(-6)}`,
      customerId: body.customerId ?? "cust-guest",
      customerName: body.customerName ?? "Guest Customer",
      customerEmail: body.customerEmail ?? "guest@example.com",
      items: body.items ?? [],
      shippingAddress: body.shippingAddress ?? {
        firstName: "Guest",
        lastName: "",
        email: "guest@example.com",
        phone: "",
        address1: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
      },
      billingAddress: body.billingAddress ?? {
        firstName: "Guest",
        lastName: "",
        email: "guest@example.com",
        phone: "",
        address1: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
      },
      status: body.status ?? "processing",
      paymentMethod: body.paymentMethod ?? "card",
      subtotal: body.subtotal ?? 0,
      shipping: body.shipping ?? 0,
      tax: body.tax ?? 0,
      discount: body.discount ?? 0,
      total: body.total ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    };

    ordersList.unshift(newOrder);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 400 }
    );
  }
}
