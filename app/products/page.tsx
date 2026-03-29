"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../components/container";
import { products } from "@/lib/products";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="py-16">
      <Container>
        <h1 className="mb-8 text-3xl font-bold">Our Products</h1>

        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded border p-2"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded border p-2"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="rounded-lg border bg-card p-4 shadow-sm transition hover:shadow-md">
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
              <Link
                href={`/products/${product.id}`}
                className="mt-4 inline-block rounded bg-pink-500 px-4 py-2 text-sm text-white hover:bg-pink-600"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}