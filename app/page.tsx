import Image from "next/image";
import Link from "next/link";
import { Container } from "./components/container";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-cream-50 to-brown-50 text-gray-900">
        <Container>
          <div className="relative z-10 py-24 text-center md:py-28">
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
              Delight Treats
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
              Delicious homemade treats like cakes, cupcakes, cookies, and other desserts for every sweet occasion.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-full bg-pink-500 px-8 text-sm font-semibold text-white shadow-lg transition hover:bg-pink-600"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border/50 bg-background py-16 md:py-20">
        <Container>
          <div className="mx-auto mb-8 max-w-4xl text-center">
            <h2 className="font-heading text-3xl font-bold leading-tight md:text-4xl">
              Our Products
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Freshly baked treats made with love
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
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
      </section>
    </main>
  );
}
