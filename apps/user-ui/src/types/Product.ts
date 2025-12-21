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
export interface CartProduct {
  id: string;
  title: string;
  slug: string;
  category: string;
  shopId: string;
stock: number;
  regular_price: number;
  sale_price: number;

  selectedSize: string;
  selectedColor?: string;

  image: string;

  // metadata
  brand: string;
  warranty: number;
  cashOnDelivery: boolean;

  // cart logic
  quantity: number;
}


export interface LocationInfo {
  country: string | null;
  city: string | null;
  ip: string;
  latitude: number;
  longitude: number;
  loading: boolean;
}

export type CleanLocationInfo = Omit<LocationInfo, 'loading' | 'country' | 'city'> & {
  country: string;
  city: string;
};


export interface ProductDetailsInfo {
  id: string;
  shopId: string;
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
  cashOnDelivery: boolean;
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

