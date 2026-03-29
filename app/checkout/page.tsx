"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    deliveryDate: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.deliveryDate) newErrors.deliveryDate = "Delivery date is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const order = {
      id: Date.now().toString(),
      items: cart,
      customer: formData,
      total: cart.reduce((sum, item) => sum + item.totalPrice, 0),
      date: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart");

    alert("Order placed successfully!");
    router.push("/orders");
  };

  const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  if (cart.length === 0) {
    return (
      <main className="py-16">
        <Container>
          <p>Your cart is empty. <Link href="/products" className="text-pink-500">Shop now</Link></p>
        </Container>
      </main>
    );
  }

  return (
    <main className="py-16">
      <Container>
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            <div className="space-y-2">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-bold">
                <span>Total: ${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded border p-2"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-semibold">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 w-full rounded border p-2"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div>
              <label className="block font-semibold">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 w-full rounded border p-2"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label className="block font-semibold">Delivery Date</label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="mt-1 w-full rounded border p-2"
              />
              {errors.deliveryDate && <p className="text-red-500 text-sm">{errors.deliveryDate}</p>}
            </div>

            <div>
              <label className="block font-semibold">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 w-full rounded border p-2"
                rows={3}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded bg-pink-500 py-2 text-white hover:bg-pink-600"
            >
              Place Order
            </button>
          </form>
        </div>
      </Container>
    </main>
  );
}