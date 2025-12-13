// src/utils/formatProductForStore.ts
import { CartProduct } from '../types/Product';

export const formatProductForStore = (
  data: {
    id: string;
    title: string;
    slug?: string;
    category?: string;
    subCategory?: string;
    short_description?: string;
    stock: number;
    regular_price: number;
    sale_price: number;
    rating: number;
    colors?: string[];
    tags?: string[];
    brand?: string;
    warranty?: number;
    sizes?: string[];
    cashOnDelivery?: boolean | string;
    images?: { url: string }[];
    shop?: { id: string };
    ending_date?: Date;
    createdAt?: string;
  },
  quantity: number = 1
): CartProduct => ({
  id: data.id,
  title: data.title,
  slug: data.slug ?? '',
  category: data.category ?? '',
  subCategory: data.subCategory ?? '',
  short_description: data.short_description ?? '',
  stock: data.stock,
  regular_price: data.regular_price,
  sale_price: data.sale_price,
  rating: data.rating,
  colors: data.colors ?? [],
  tags: data.tags ?? [],
  brand: data.brand ?? null,
  warranty: data.warranty ?? null,
  sizes: data.sizes?.length ? data.sizes : false,
  cashOnDelivery: Boolean(data.cashOnDelivery),
  images: data.images?.[0]?.url ?? '',
  shopId: data.shop?.id ?? '',
  ending_date: data.ending_date ?? null,
  createdAt: data.createdAt ?? null,
  quantity,
});
