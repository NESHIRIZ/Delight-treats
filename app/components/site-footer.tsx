import Link from "next/link";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-4">
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="font-heading text-lg font-semibold">
              Delight Treats
            </Link>
            <p className="text-sm leading-6 text-muted-foreground">
              Delicious homemade treats for every occasion.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Shop</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link className="hover:text-foreground" href="/products">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-foreground" href="/recipes">
                    Recipes
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-foreground" href="/favorites">
                    Favorites
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-foreground" href="/cart">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">About</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link className="hover:text-foreground" href="/#about">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-foreground" href="/contact">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link className="hover:text-foreground" href="/privacy">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-foreground" href="/terms">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-border/70 py-6 text-sm text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Delight Treats. All rights reserved.</p>
          <p>Delicious treats for every sweet moment.</p>
        </div>
      </Container>
    </footer>
  );
}
