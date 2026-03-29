# Delight Treats

Delight Treats is a web application for a small baking business that allows customers to browse, customize, and order delicious homemade treats like cakes, cupcakes, cookies, and other desserts.

## Features

- **Product Catalog**: Browse available treats with images, descriptions, and prices
- **Search & Filter**: Find products by name or category
- **Custom Order Builder**: Customize cakes with size, flavor, and quantity
- **Shopping Cart**: Add items, manage quantities, and proceed to checkout
- **Order Management**: Complete order form with validation and local storage
- **Order History**: View previous orders
- **Favorites/Wishlist**: Save favorite treats for later
- **Responsive Design**: Works on mobile, tablet, and desktop
- **API Integration**: Fetches dessert recipes from TheMealDB and uses Unsplash images

## Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks with localStorage
- **APIs**: TheMealDB, Unsplash
- **Deployment**: Ready for Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

## Project Structure

```
app/
├── api/          # API routes (auth, etc.)
├── components/   # Reusable UI components
├── cart/         # Shopping cart page
├── checkout/     # Order checkout
├── favorites/    # Wishlist page
├── orders/       # Order history
├── products/     # Product catalog and details
├── recipes/      # Dessert recipes from API
└── ...

lib/
├── products.ts   # Product data
└── ...

types/
└── product.ts    # TypeScript interfaces
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
