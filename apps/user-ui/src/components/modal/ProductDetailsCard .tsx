import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Star, ShoppingBag, Heart, Truck, Shield, CreditCard, Package, Store, MapPin } from 'lucide-react';

// ... (keep your interfaces)

interface ProductDetailsCardProps {
  data: {
    id: number;
    title: string;
    category: string;
    subCategory: string;
    rating: number;
    images: { id: number; url: string }[];
    sale_price: number;
    regular_price: number;
    short_description: string;
    colors: string[];
    stock: number;
    warranty: number;
    cashOnDelivery: string;
    shop?: {
      name: string;
      address?: string;
      ratings?: number;
      category?: string;
    };
  };
  setIsQuickViewOpen: (open: boolean) => void;
}

function ProductDetailsCard({ data, setIsQuickViewOpen }: ProductDetailsCardProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  
  const hasSale = data.sale_price > 0 && data.sale_price < data.regular_price;
  const discountPercentage = hasSale 
    ? Math.round(((data.regular_price - data.sale_price) / data.regular_price) * 100)
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
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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
    setIsWishlisted(!isWishlisted);
  };

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (type === 'increment' && quantity < data.stock) {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', { productId: data.id, quantity });
    setIsQuickViewOpen(false);
  };

  const handleBuyNow = () => {
    console.log('Buy now:', { productId: data.id, quantity });
    setIsQuickViewOpen(false);
  };

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
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{data.rating.toFixed(1)}</span>
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
                      Save ${(data.regular_price - data.sale_price).toFixed(2)} ({discountPercentage}% off)
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
                    <p className="font-medium text-gray-900">Available Colors</p>
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

                {/* Quantity Selector */}
                <div className="space-y-2 pt-4 border-t">
                  <p className="font-medium text-gray-900">Quantity</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange('decrement')}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange('increment')}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
                        disabled={quantity >= data.stock}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {data.stock} items available
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <button
                    onClick={handleAddToCart}
                    disabled={data.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag size={20} />
                    {data.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={data.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>

                  <button
                    onClick={handleWishlistToggle}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart
                      size={20}
                      className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                    />
                  </button>
                </div>

                {/* Features & Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Truck size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Free Shipping</p>
                      <p className="text-sm text-gray-500">On orders over $50</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Shield size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{data.warranty} Year Warranty</p>
                      <p className="text-sm text-gray-500">Manufacturer warranty</p>
                    </div>
                  </div>
                  
                  {data.cashOnDelivery === 'yes' && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <CreditCard size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Package size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Easy Returns</p>
                      <p className="text-sm text-gray-500">30-day return policy</p>
                    </div>
                  </div>
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
                          <p className="text-lg font-bold text-gray-900">{data.shop.name}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Visit Shop →
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={14} />
                      <span>{data.shop.address || 'No address provided'}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{data.shop.ratings?.toFixed(1) || '0.0'}</span>
                      </div>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">Category: {data.shop.category}</span>
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