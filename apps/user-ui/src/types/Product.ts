// src/types/Product.ts

export interface ProductImage {
  id: number;
  url: string;
  file_id: string;
}

export interface Shop {
  id: string;
  name: string;
  address?: string;
  ratings?: number;
  category?: string;
}

interface BaseProduct {
  id: string;
  title: string;
  slug: string;
  category: string;
  subCategory: string;
  short_description: string;
  stock: number;
  regular_price: number;
  sale_price: number;
  rating: number;
  colors: string[];
  tags: string[];
}
// API product
export interface Product extends BaseProduct {
  brand: string;
  warranty: number;
  sizes: string[];
  cashOnDelivery: string;
  images: ProductImage[];
  shop: Shop;
  ending_date: Date;
  createdAt: string;
}

// Cart product
export interface CartProduct extends BaseProduct {
  brand: string | null;
  warranty: number | null;
  sizes: string[] | false;
  cashOnDelivery: boolean;
  images: string;
  shopId: string;
  ending_date: Date | null;
  createdAt: string | null;
  quantity: number;
}

export interface ProductDetails {
  id: string;
  title: string;
  slug: string;
  category: string;
  subCategory: string;
  rating: number;
  images: { id: number; url: string }[];
  sale_price: number;
  regular_price: number;
  short_description: string;
  colors: string[];
  tags: string[];
  brand: string;
  stock: number;
  warranty: number;
  cashOnDelivery: string;
  sizes: string[];
  ending_date: Date;
  createdAt: string;
  shop?: {
    id: string;
    name: string;
    address?: string;
    ratings?: number;
    category?: string;
  };
}
