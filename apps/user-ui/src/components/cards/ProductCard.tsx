import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Tag, ShoppingBag, Store, Clock, Heart, Eye } from 'lucide-react';
import ProductDetailsCard from '../modal/ProductDetailsCard ';
import { useStore } from '../../store';
import useLocationTracking from '../../hooks/useLocationTracking';
import useDeviceTracking from '../../hooks/useDeviceTracking';

interface ProductImage {
  id: number;
  url: string;
  file_id: string;
}

interface Shop {
  id: string;
  name: string;
  address?: string;
  ratings?: number;
  category?: string;
}

interface Product {
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
  brand: string;
  warranty: number;
  sizes: string[];
  cashOnDelivery: string;
  images: ProductImage[];
  shop: Shop;
  ending_date: Date;
  createdAt: string;
}

interface ProductCardProps {
  product: Product;
  isEvent?: boolean;
  showShop?: boolean;
}

function ProductCard({
  product,
  isEvent = false,
  showShop = true,
}: ProductCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);

  // Zustand store
  const {
    cart,
    wishlist,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
  } = useStore();

  const locationData = useLocationTracking(); // Changed variable name
  const deviceData = useDeviceTracking(); // Changed variable name

  // Check if product is in wishlist
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const isInCart = cart.some((item) => item.id === product.id);

  // Check if product is in cart (with quantity)
  const cartItem = cart.find((item) => item.id === product.id);
  const cartQuantity = cartItem?.quantity || 0;

  useEffect(() => {
    if (!isEvent) return;
    if (!product?.ending_date) return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const endingTime = new Date(product.ending_date).getTime();
      const diff = endingTime - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(intervalId);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isEvent, product?.ending_date]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const user = null; // You can get user from your auth context

      if (isWishlisted) {
        removeFromWishlist(product.id, user, locationData?.city ?? '', deviceData); // Pass city as string
      } else {
        // Create a product object matching the store interface
        const productForStore = {
          id: product.id,
          title: product.title,
          stock: product.stock,
          regular_price: product.regular_price,
          sale_price: product.sale_price,
          rating: product.rating,
          colors: product.colors,
          images: product.images[0]?.url || '',
          shopId: product.shop.id,
          quantity: 1,
        };

        addToWishlist(productForStore, user, locationData?.city ?? '', deviceData); // Pass city as string
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0 || cartQuantity >= product.stock) return;

    const user = null; // You can get user from your auth context

    // Create a product object matching the store interface
    const productForStore = {
      id: product.id,
      title: product.title,
      stock: product.stock,
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      rating: product.rating,
      colors: product.colors,
      images: product.images[0]?.url || '',
      shopId: product.shop.id,
      quantity: 1,
    };

    addToCart(productForStore, user, locationData?.city ?? '', deviceData); // Pass city as string
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0 || cartQuantity >= product.stock) return;

    const user = null; // You can get user from your auth context

    // Create a product object matching the store interface
    const productForStore = {
      id: product.id,
      title: product.title,
      stock: product.stock,
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      rating: product.rating,
      colors: product.colors,
      images: product.images[0]?.url || '',
      shopId: product.shop.id,
      quantity: 1,
    };

    addToCart(productForStore, user, locationData?.city ?? '', deviceData); // Pass city as string
  };

  const imageUrl =
    product?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1567620905733-2ea1ede2d8ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80';

  const hasSale =
    product.sale_price > 0 && product.sale_price < product.regular_price;
  const discountPercentage = hasSale
    ? Math.round(
        ((product.regular_price - product.sale_price) / product.regular_price) *
          100
      )
    : 0;

  // Extract the logic for cleaner JSX
  const isOutOfStock = product.stock === 0;
  const maxStockReached = cartQuantity >= product.stock;
  const canAddToCart = !isOutOfStock && !maxStockReached;

  let buttonText = '';
  if (isOutOfStock) buttonText = 'Out of Stock';
  else if (maxStockReached) buttonText = `Max (${cartQuantity})`;
  else if (cartQuantity > 0) buttonText = `${cartQuantity} in Cart • Add More`;
  else buttonText = 'Add to Cart';

  return (
    <div className="group w-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isEvent && (
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              LIMITED OFFER
            </span>
          )}

          {hasSale && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              {discountPercentage}% OFF
            </span>
          )}

          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              LOW STOCK
            </span>
          )}

          {product.stock === 0 && (
            <span className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Quick Actions Column */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {/* Wishlist Heart Icon */}
          <button
            onClick={handleWishlistToggle}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label={
              isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
            }
          >
            <Heart
              size={18}
              className={`transition-all duration-300 ${
                isWishlisted
                  ? 'fill-red-500 text-red-500 scale-110'
                  : 'text-gray-700 hover:text-red-500'
              }`}
            />
          </button>

          {/* Quick View Eye Icon */}
          <button
            onClick={handleQuickView}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Quick view"
          >
            <Eye
              size={18}
              className="text-gray-700 hover:text-blue-600 transition-all duration-300"
            />
          </button>

          {/* Quick Add to Cart Icon */}
          <button
            onClick={handleQuickAddToCart}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Add to cart"
            disabled={product.stock === 0}
          >
            <ShoppingBag
              size={18}
              className={`transition-all duration-300 ${
                product.stock === 0
                  ? 'text-gray-400'
                  : 'text-gray-700 hover:text-green-600'
              }`}
            />
          </button>
        </div>

        {isQuickViewOpen && (
          <ProductDetailsCard
            data={product}
            setIsQuickViewOpen={setIsQuickViewOpen}
          />
        )}

        {/* Product Image */}
        <Link href={`/product/${product.slug}`}>
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Add to Cart Button at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              canAddToCart
                ? 'bg-white text-gray-800 hover:bg-gray-50'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canAddToCart}
          >
            <ShoppingBag size={16} />
            {buttonText}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Category & Shop */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-100 rounded">
            {product.category}
          </span>

          {showShop && product.shop && (
            <Link
              href={`/shop/${product.shop.id}`}
              className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Store size={12} />
              {product.shop.name}
            </Link>
          )}
        </div>

        {/* Product Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-10 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.rating.toFixed(1)})
          </span>
        </div>

        {/* Event Timer */}
        {isEvent && timeLeft !== 'Expired' && (
          <div className="flex items-center gap-1 mb-4">
            <span className="inline-flex items-center gap-1 text-xs text-gray-600 px-2 py-1 bg-gray-50 rounded-md">
              <Clock size={10} />
              {timeLeft} left
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              {hasSale ? (
                <>
                  <span className="text-xl font-bold text-gray-900">
                    ${product.sale_price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.regular_price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  ${product.regular_price.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-500">
                {product.stock} in stock • {product.warranty} year warranty
              </p>
              {product.cashOnDelivery === 'yes' && (
                <span className="text-xs text-blue-600 font-medium">
                  • COD Available
                </span>
              )}
            </div>
          </div>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="flex flex-col items-end gap-1">
              <p className="text-xs text-gray-500">Colors</p>
              <div className="flex gap-1">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                    title={`Color ${index + 1}`}
                  />
                ))}
                {product.colors.length > 3 && (
                  <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">
                      +{product.colors.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;