"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../components/container";
import { Product } from "@/types/product";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const removeFromFavorites = (id: string) => {
    const newFavorites = favorites.filter(f => f.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  return (
    <main className="py-16">
      <Container>
        <h1 className="mb-8 text-3xl font-bold">My Favorites</h1>

        {favorites.length === 0 ? (
          <p>No favorites yet. <Link href="/products" className="text-pink-500">Browse products</Link></p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((product) => (
              <div key={product.id} className="rounded-lg border bg-card p-4 shadow-sm">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="h-48 w-full rounded-md object-cover"
                />
                <h3 className="mt-4 font-semibold">{product.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                <p className="mt-2 font-bold text-pink-600">${product.price}</p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="flex-1 rounded bg-pink-500 px-4 py-2 text-center text-sm text-white hover:bg-pink-600"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => removeFromFavorites(product.id)}
                    className="rounded border px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}