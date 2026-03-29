"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <main className="py-16">
      <Container>
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

        {cart.length === 0 ? (
          <p>Your cart is empty. <Link href="/products" className="text-pink-500">Shop now</Link></p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center gap-4 rounded border p-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                    {item.selectedFlavor && <p>Flavor: {item.selectedFlavor}</p>}
                    <p>Quantity: {item.quantity}</p>
                    <p className="font-bold">${item.totalPrice.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-right">
              <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
              <Link
                href="/checkout"
                className="mt-4 inline-block rounded bg-pink-500 px-6 py-2 text-white hover:bg-pink-600"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </Container>
    </main>
  );
}