"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Container } from "../../components/container";
import { products } from "@/lib/products";
import { Product } from "@/types/product";

export default function ProductPage() {
  const params = useParams();
  const product = products.find(p => p.id === params.id);

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [selectedFlavor, setSelectedFlavor] = useState(product?.flavors?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div>Product not found</div>;
  }

  const basePrice = product.price;
  const sizeMultiplier = selectedSize === "8 inch" ? 1.2 : selectedSize === "10 inch" ? 1.5 : 1;
  const totalPrice = basePrice * sizeMultiplier * quantity;

  const addToCart = () => {
    const cartItem = {
      ...product,
      selectedSize,
      selectedFlavor,
      quantity,
      totalPrice,
    };
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
  };

  const addToFavorites = () => {
    const favorites: Product[] = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (!favorites.find((f) => f.id === product.id)) {
      favorites.push(product);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Added to favorites!");
    } else {
      alert("Already in favorites!");
    }
  };

  return (
    <main className="py-16">
      <Container>
        <div className="grid gap-8 md:grid-cols-2">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={400}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-4 text-muted-foreground">{product.description}</p>
            <p className="mt-4 text-2xl font-bold text-pink-600">${totalPrice.toFixed(2)}</p>

            {product.sizes && (
              <div className="mt-6">
                <label className="block font-semibold">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="mt-2 w-full rounded border p-2"
                >
                  {product.sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            {product.flavors && (
              <div className="mt-6">
                <label className="block font-semibold">Flavor</label>
                <select
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  className="mt-2 w-full rounded border p-2"
                >
                  {product.flavors.map(flavor => (
                    <option key={flavor} value={flavor}>{flavor}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-6">
              <label className="block font-semibold">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-2 w-full rounded border p-2"
              />
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={addToCart}
                className="rounded bg-pink-500 px-6 py-2 text-white hover:bg-pink-600"
              >
                Add to Cart
              </button>
              <button
                onClick={addToFavorites}
                className="rounded border px-6 py-2 hover:bg-gray-100"
              >
                Add to Favorites
              </button>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}