"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
}

export default function SuggestedProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  // Fake loading simulation (you can replace with real API later)
  useEffect(() => {
    setTimeout(() => {
      setProducts([
        {
          id: "1",
          title: "Wireless Headphones",
          image: "/placeholder.png",
          price: 120,
        },
        {
          id: "2",
          title: "Smart Watch",
          image: "/placeholder.png",
          price: 180,
        },
        {
          id: "3",
          title: "Portable Speaker",
          image: "/placeholder.png",
          price: 90,
        },
        {
          id: "4",
          title: "Gaming Mouse",
          image: "/placeholder.png",
          price: 40,
        },
      ]);
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading
        ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        : products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-gray-200 rounded-xl h-[220px] w-full"></div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-3 hover:shadow-lg transition">
      <div className="relative w-full h-[140px] rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>

      <h3 className="mt-3 text-sm font-medium truncate">{product.title}</h3>

      <p className="text-blue-600 font-semibold mt-1">${product.price}</p>
    </div>
  );
}
