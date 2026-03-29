"use client";

import { useState, useEffect } from "react";
import { Container } from "../components/container";

interface CartItem {
  id: string;
  name: string;
  image: string;
  selectedSize?: string;
  selectedFlavor?: string;
  quantity: number;
  totalPrice: number;
}

interface Customer {
  name: string;
  phone: string;
  email: string;
  deliveryDate: string;
  address: string;
}

interface Order {
  id: string;
  items: CartItem[];
  customer: Customer;
  total: number;
  date: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  return (
    <main className="py-16">
      <Container>
        <h1 className="mb-8 text-3xl font-bold">Order History</h1>

        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-bold">${order.total.toFixed(2)}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold">Customer Details</h4>
                  <p>{order.customer.name}</p>
                  <p>{order.customer.phone}</p>
                  <p>{order.customer.email}</p>
                  <p>{order.customer.address}</p>
                  <p>Delivery: {order.customer.deliveryDate}</p>
                </div>

                <div>
                  <h4 className="font-semibold">Items</h4>
                  <ul className="space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item.name} x{item.quantity} - ${item.totalPrice.toFixed(2)}
                        {item.selectedSize && ` (${item.selectedSize})`}
                        {item.selectedFlavor && ` - ${item.selectedFlavor}`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}