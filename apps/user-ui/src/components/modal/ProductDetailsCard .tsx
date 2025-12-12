import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Store,
  MapPin,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store';
import useLocationTracking from '../../hooks/useLocationTracking';
import useDeviceTracking from '../../hooks/useDeviceTracking';
import useUser from '../../hooks/use-user';

interface ProductDetailsCardProps {
  data: {
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
  };
  setIsQuickViewOpen: (open: boolean) => void;
}

function ProductDetailsCard({
  data,
  setIsQuickViewOpen,
}: ProductDetailsCardProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const router = useRouter();
  
  // Get user from React Query
  const { user, isLoading: userLoading } = useUser();
  
  // Get store state and actions
  const {
    cart,
    wishlist,
    addToCart,
    addToWishlist,
    removeFromWishlist,
    decreaseQuantity,
    removeFromCart
  } = useStore();
  
  const formatProductForCart = () => ({
    id: data.id,
    title: data.title,
    slug: data.slug || '',
    category: data.category || '',
    subCategory: data.subCategory || '',
    short_description: data.short_description || '',
    stock: data.stock,
    regular_price: data.regular_price,
    sale_price: data.sale_price,
    rating: data.rating,
    colors: data.colors || [],
    tags: data.tags || [],
    brand: data.brand || null,
    warranty: data.warranty || null,
    sizes: data.sizes || false,
    cashOnDelivery: data.cashOnDelivery ?? false,
    images: data.images?.[0]?.url || '',
    shopId: data.shop?.id || '',
    ending_date: data.ending_date || null,
    createdAt: data.createdAt || null,
    quantity: 1,
  });
  
  const locationData = useLocationTracking(); 
  const deviceData = useDeviceTracking(); 
  
  // Check if product is in wishlist
  const isWishlisted = wishlist.some(item => item.id === data.id);
  
  // Check if product is in cart and get its quantity
  const cartItem = cart.find(item => item.id === data.id);
  const currentCartQuantity = cartItem?.quantity || 0;
  
  // Calculate max quantity that can be added
  const maxQuantityToAdd = Math.max(0, data.stock - currentCartQuantity);
  
  const hasSale = data.sale_price > 0 && data.sale_price < data.regular_price;
  const discountPercentage = hasSale
    ? Math.round(
        ((data.regular_price - data.sale_price) / data.regular_price) * 100
      )
    : 0;

  // Close modal on ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsQuickViewOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [setIsQuickViewOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsQuickViewOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsQuickViewOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleWishlistToggle = () => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(data.id, user, locationData?.city ?? '', deviceData);
    } else {
      addToWishlist(
        {
          id: data.id,
          title: data.title,
          stock: data.stock,
          regular_price: data.regular_price,
          sale_price: data.sale_price,
          rating: data.rating,
          colors: data.colors,
          images: data.images[0]?.url || '',
          shopId: data.shop?.id || '',
        },
        user,
        locationData?.city ?? '',
        deviceData
      );
    }
  };

  const handleIncrement = () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    // Check if we can add more based on stock
    if (currentCartQuantity >= data.stock) {
      alert(`Only ${data.stock} items available in stock`);
      return;
    }

    // Use addToCart to increment quantity
    addToCart(
      formatProductForCart(),
      user,
      locationData?.city ?? '',
      deviceData
    );
  };

  const handleDecrement = () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (currentCartQuantity > 1) {
      // If quantity > 1, decrease by 1
      decreaseQuantity(data.id, user, locationData?.city ?? '', deviceData);
    } else if (currentCartQuantity === 1) {
      // If quantity = 1, remove from cart completely
      removeFromCart(data.id, user, locationData?.city ?? '', deviceData);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (data.stock === 0 || maxQuantityToAdd <= 0) return;

    // Add one item to cart (or add to existing quantity via addToCart)
    addToCart(
      formatProductForCart(),
      user,
      locationData?.city ?? '',
      deviceData
    );

    setIsQuickViewOpen(false);
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (data.stock === 0 || maxQuantityToAdd <= 0) return;

    // Add to cart first
    addToCart(
      formatProductForCart(),
      user,
      locationData?.city ?? '',
      deviceData
    );

    setIsQuickViewOpen(false);
    router.push('/checkout');
  };

  // If user data is loading, you can show a loading state or nothing
  if (userLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
        {/* Modal Container */}
        <div
          ref={modalRef}
          className="bg-white rounded-2xl w-full max-w-6xl my-8 shadow-2xl animate-in fade-in zoom-in duration-300"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsQuickViewOpen(false)}
            className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 hover:bg-gray-100 transition-all duration-200 shadow-lg"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-700" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Images */}
            <div className="p-6 lg:p-8 bg-gray-50">
              {/* Main Image */}
              <div className="relative h-80 lg:h-96 w-full rounded-xl overflow-hidden bg-white shadow-lg mb-4">
                <Image
                  src={data.images[selectedImage]?.url || '/placeholder.jpg'}
                  alt={data.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {hasSale && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-lg">
                    {discountPercentage}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {data.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-2">
                  {data.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={`${data.title} - View ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="p-6 lg:p-8">
              <div className="space-y-6">
                {/* Category & Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                    {data.category} • {data.subCategory}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="font-medium">
                      {data.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Product Title */}
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {data.title}
                </h1>

                {/* Price Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {hasSale ? (
                      <>
                        <span className="text-3xl font-bold text-gray-900">
                          ${data.sale_price.toFixed(2)}
                        </span>
                        <span className="text-xl text-gray-500 line-through">
                          ${data.regular_price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">
                        ${data.regular_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {hasSale && (
                    <p className="text-lg font-bold text-red-600">
                      Save ${(data.regular_price - data.sale_price).toFixed(2)}{' '}
                      ({discountPercentage}% off)
                    </p>
                  )}
                </div>

                {/* Short Description */}
                <div className="text-gray-600 leading-relaxed border-t pt-4">
                  {data.short_description}
                </div>

                {/* Colors */}
                {data.colors.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <p className="font-medium text-gray-900">
                      Available Colors
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {data.colors.map((color, index) => (
                        <button
                          key={index}
                          className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                          style={{ backgroundColor: color }}
                          aria-label={`Color option ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Sizes */}
                {data.sizes && data.sizes.length > 0 && (
                  <div className="space-y-3 pt-6 border-t">
                    <p className="font-medium text-gray-900">Select Size</p>
                    <div className="grid grid-cols-5 gap-2 max-w-xs">
                      {data.sizes.map((size, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSize(size)}
                          className={`px-2 py-3 text-center border rounded-md transition-colors font-medium ${
                            selectedSize === size
                              ? 'border-blue-600 bg-blue-50 text-blue-600'
                              : 'border-gray-300 hover:border-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector - Updated to match cart page */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">Quantity</p>
                    {!user && (
                      <p className="text-sm text-red-600">
                        Please login to adjust quantity
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={handleDecrement}
                        disabled={currentCartQuantity <= 0 || !user}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                        {currentCartQuantity || 0}
                      </span>
                      <button
                        onClick={handleIncrement}
                        disabled={currentCartQuantity >= data.stock || !user}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {data.stock} items available
                      {currentCartQuantity > 0 && (
                        <span className="text-blue-600 ml-1">
                          ({currentCartQuantity} in cart)
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <button
                    onClick={handleAddToCart}
                    disabled={!user || data.stock === 0 || maxQuantityToAdd <= 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    title={!user ? 'Please login to add to cart' : ''}
                  >
                    <ShoppingBag size={20} />
                    {!user 
                      ? 'Login to Add' 
                      : data.stock > 0 
                        ? maxQuantityToAdd > 0 
                          ? currentCartQuantity > 0
                            ? 'Add More to Cart'
                            : 'Add to Cart' 
                          : 'Max Stock Reached'
                        : 'Out of Stock'}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={!user || data.stock === 0 || maxQuantityToAdd <= 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    title={!user ? 'Please login to buy now' : ''}
                  >
                    {!user ? 'Login to Buy' : currentCartQuantity > 0 ? 'Checkout Now' : 'Buy Now'}
                  </button>

                  <button
                    onClick={handleWishlistToggle}
                    disabled={!user}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={
                      isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
                    }
                    title={!user ? 'Please login to use wishlist' : ''}
                  >
                    <Heart
                      size={20}
                      className={
                        isWishlisted
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                      }
                    />
                  </button>
                </div>

                {/* Shop Information */}
                {data.shop && (
                  <div className="pt-6 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Store size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Sold by</p>
                          <p className="text-lg font-bold text-gray-900">
                            {data.shop.name}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          router.push(`/inbox/shopId=${data?.shop?.id}`)
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50
                         hover:bg-blue-100 text-blue-700 hover:text-blue-900 font-medium rounded-lg border
                          border-blue-200 transition-all duration-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Chat with Seller
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={14} />
                      <span>{data.shop.address || 'No address provided'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailsCard;