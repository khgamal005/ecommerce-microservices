import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Tag, ShoppingBag, Store, Clock, Heart, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProductDetailsCard from '../modal/ProductDetailsCard ';
import { useStore } from '../../store';
import useLocationTracking from '../../hooks/useLocationTracking';
import useDeviceTracking from '../../hooks/useDeviceTracking';
import useUser from '../../hooks/use-user';
import {
  CartProduct,
  CleanLocationInfo,
  ProductDetailsInfo,
} from '../../types/Product';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: any;
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
  const router = useRouter();

  // Zustand store
  const {
    cart,
    wishlist,
    addToCart,
    addToWishlist,
    removeFromWishlist,
  } = useStore();

  // Get user from React Query
  const { user, isLoading: userLoading } = useUser();
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0] || []
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] || []
  );
  const [quantity, setQuantity] = useState(1);

  const locationData = useLocationTracking();
  const deviceData = useDeviceTracking();

  // Check if product is in wishlist
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  // Check if product is in cart (with quantity)
  const cartItem = cart.find((item) => item.id === product.id);
  const cartQuantity = cartItem?.quantity || 0;

  const safeLocation: CleanLocationInfo = {
    ip: locationData?.ip ?? '0.0.0.0',
    latitude: locationData?.latitude ?? 0,
    longitude: locationData?.longitude ?? 0,
    country: locationData?.country ?? 'unknown',
    city: locationData?.city ?? 'unknown',
  };

  const mapProductToCartProduct = (
    product: ProductDetailsInfo,
    selectedSize: string,
    selectedColor?: string
  ): CartProduct => ({
    id: product.id,
    title: product.title,
    slug: product.slug,
    category: product.category,
    shopId: product.shopId,
    stock: product.stock,

    regular_price: product.regular_price,
    sale_price: product.sale_price,

    selectedSize,
    selectedColor,

    image: product.images?.[0]?.url || '',

    brand: product.brand,
    warranty: product.warranty,
    cashOnDelivery: product.cashOnDelivery,

    quantity: 1,
  });
        const cartItems = mapProductToCartProduct(
      product,
      selectedSize,
      selectedColor
    );

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

  const handleWishlistToggle = () => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push(
        '/login?redirect=' + encodeURIComponent(window.location.pathname)
      );
      return;
    }
    

    if (isWishlisted) {
      removeFromWishlist(product.id, user, safeLocation, deviceData);
    } else {
      addToWishlist(
        cartItems,
        user,
        safeLocation,
        deviceData
      );
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  // const handleQuickAddToCart = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   if (!user) {
  //     router.push(
  //       '/login?redirect=' + encodeURIComponent(window.location.pathname)
  //     );
  //     return;
  //   }

  //   if (product.stock === 0 || cartQuantity >= product.stock) return;

  //   addToCart(formatProductForCart(product), user, safeLocation, deviceData);
  // };

  const handleAddToCart = () => {
    if (!user) {
      router.push(
        '/login?redirect=' + encodeURIComponent(window.location.pathname)
      );
      return;
    }
    if (!selectedSize || !selectedColor) {
      toast.error('Please select a size and color');
      return;
    }

    // Check if we can add more based on stock
    if (cartQuantity >= product.stock) {
      toast.success(`Only ${product.stock} items available in stock`);

      return;
    }


    // Use addToCart to increment quantity
    addToCart(cartItems, user, safeLocation, deviceData);
    toast.success('Added to cart!');
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
  const canAddToCart = !isOutOfStock && !maxStockReached && user;

  let buttonText = '';
  if (!user) buttonText = 'Login to Add';
  else if (isOutOfStock) buttonText = 'Out of Stock';
  else if (maxStockReached) buttonText = `Max (${cartQuantity})`;
  else if (cartQuantity > 0) buttonText = `${cartQuantity} in Cart • Add More`;
  else buttonText = 'Add to Cart';

  // Optional: Show loading state while user data is loading
  if (userLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
        <div className="h-56 w-full bg-gray-200" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    );
  }

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
          title={!user ? 'Please login to use wishlist' : ''}
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${
              isWishlisted
                ? 'fill-red-500 text-red-500 scale-110'
                : user
                ? 'text-gray-700 hover:text-red-500'
                : 'text-gray-400'
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
          title={!user ? 'Please login to add to cart' : ''}
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
            {timeLeft}
          </span>
        </div>
      )}

      {/* Price Section */}
      <div className="flex items-center justify-between mb-3">
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
        </div>
      </div>

      {/* Colors Section */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            {product.colors.map((color: string, index: number) => (
              <button
                key={index}
                className={`
                  relative rounded-full flex items-center justify-center 
                  cursor-pointer transition-all duration-200 hover:scale-105
                  ${
                    selectedColor === color
                      ? 'bg-blue-100 ring-2 ring-blue-500 ring-offset-2'
                      : 'bg-[#F4F7F9] hover:bg-gray-100'
                  }
                `}
                onClick={() =>
                  setSelectedColor((prev) => (prev === color ? '' : color))
                }
                aria-label={`Select ${color} color`}
                aria-pressed={selectedColor === color}
                title={color.charAt(0).toUpperCase() + color.slice(1)}
              >
                {/* Color circle - reduced size */}
                <div
                  className={`
                    w-[20px] h-[20px] rounded-full transition-all duration-200
                    ${selectedColor === color ? 'scale-110' : ''}
                  `}
                  style={{ backgroundColor: color }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Section - Moved below colors and reduced */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size: string, index: number) => {
              const inStock = true; // You can replace this with actual stock check

              return (
                <button
                  key={index}
                  disabled={!inStock}
                  className={`
                    relative min-w-[28px] h-[28px] px-2.5 rounded-full text-center
                    text-xs font-medium transition-all duration-200
                    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1
                    ${
                      selectedSize === size
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-95'
                        : inStock
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-sm'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                    }
                    ${!inStock && 'line-through'}
                  `}
                  onClick={() =>
                    setSelectedSize((prev) => (prev === size ? '' : size))
                  }
                  aria-label={`${
                    inStock ? 'Select' : 'Out of stock'
                  } size ${size}`}
                  aria-pressed={selectedSize === size}
                  aria-disabled={!inStock}
                >
                  {size}

                  {/* Stock status indicator - smaller */}
                  {!inStock && (
                    <span className="absolute -top-0.5 -right-0.5 text-[8px] text-red-500 font-bold">
                      X
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  </div>
);
}

export default ProductCard;
