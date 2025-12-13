// src/utils/formatProduct.ts
import { Product } from '../types/Product';
import { CartProduct } from '../types/Product';

export const formatProductForCart = (
  product: Product,
  quantity: number = 1
): CartProduct => ({
  id: product.id,
  title: product.title,
  slug: product.slug || '',
  category: product.category || '',
  subCategory: product.subCategory || '',
  short_description: product.short_description || '',
  stock: product.stock,
  regular_price: product.regular_price,
  sale_price: product.sale_price,
  rating: product.rating,
  colors: product.colors || [],
  tags: product.tags || [],
  brand: product.brand || null,
  warranty: product.warranty || null,
  sizes: product.sizes?.length ? product.sizes : false,
  cashOnDelivery: Boolean(product.cashOnDelivery),
  images: product.images?.[0]?.url || '',
  shopId: product.shop?.id || '',
  ending_date: product.ending_date ?? null,
  createdAt: product.createdAt ?? null,
  quantity,
});
