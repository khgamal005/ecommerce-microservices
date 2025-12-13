'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Trash2,
  Eye,
  ChevronRight,
  ArrowLeft,
  Star,
  Package,
  Clock,
  MapPin,
  Store,
} from 'lucide-react';
import { useStore } from '../../store';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  // Get user and location info for tracking
  const getUserInfo = () => {
    // Get user from localStorage or your auth context
    const userStr = localStorage.getItem('user-storage');
    if (userStr) {
      const parsed = JSON.parse(userStr);
      return parsed.state?.wishlist?.[0]?.trackingInfo?.user || null;
    }
    return null;
  };

  const handleRemoveFromWishlist = (id: string) => {
    const user = getUserInfo();
    const deviceInfo = navigator.userAgent;
    const location = 'wishlist-page'; // You can get actual location if needed

    if (user) {
      removeFromWishlist(id, user, location, deviceInfo);
    } else {
      // Fallback if no user found
      removeFromWishlist(id, null, location, deviceInfo);
    }
  };

  const handleAddToCart = (product: any) => {
    const user = getUserInfo();
    const deviceInfo = navigator.userAgent;
    const location = 'wishlist-page';

    if (user) {
      addToCart(product, user, location, deviceInfo);
      toast.success(`${product.title} added to cart!`);
    } else {
      toast.error('Please login to add items to cart');
    }
  };

  const handleMoveAllToCart = () => {
    const user = getUserInfo();
    const deviceInfo = navigator.userAgent;
    const location = 'wishlist-page';

    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    let addedCount = 0;
    wishlist.forEach((product) => {
      addToCart(product, user, location, deviceInfo);
      addedCount++;
    });

    toast.success(`Added ${addedCount} items to cart!`);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't added any products to your wishlist yet. Start
              exploring and add items you love!
            </p>
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}{' '}
                saved for later
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleMoveAllToCart}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Move All to Cart
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mt-4">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium">Wishlist</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Wishlist Items */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {wishlist.map((item) => {
                  const hasSale =
                    item.sale_price > 0 && item.sale_price < item.regular_price;
                  const discountPercentage = hasSale
                    ? Math.round(
                        ((item.regular_price - item.sale_price) /
                          item.regular_price) *
                          100
                      )
                    : 0;

                  return (
                    <div
                      key={item.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Product Image */}
                        <div className="relative w-full sm:w-48 h-48 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.images || '/placeholder.jpg'}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 192px) 100vw, 192px"
                          />
                          {hasSale && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              {discountPercentage}% OFF
                            </div>
                          )}
                          {item.stock <= 5 && item.stock > 0 && (
                            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                              Low Stock
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    <Link
                                      href={`/product/${item.id}`}
                                      className="hover:text-blue-600"
                                    >
                                      {item.title}
                                    </Link>
                                  </h3>

                                  {/* Rating */}
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          size={14}
                                          className={`${
                                            i < Math.floor(item.rating)
                                              ? 'fill-yellow-400 text-yellow-400'
                                              : 'fill-gray-200 text-gray-200'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      ({item.rating.toFixed(1)})
                                    </span>
                                  </div>
                                </div>

                                {/* Price */}
                                <div className="text-right">
                                  <div className="flex items-center gap-2 mb-1">
                                    {hasSale ? (
                                      <>
                                        <span className="text-xl font-bold text-gray-900">
                                          ${item.sale_price.toFixed(2)}
                                        </span>
                                        <span className="text-sm text-gray-500 line-through">
                                          ${item.regular_price.toFixed(2)}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-xl font-bold text-gray-900">
                                        ${item.regular_price.toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {item.stock} in stock
                                  </span>
                                </div>
                              </div>

                              {/* Colors */}
                              {item.colors && item.colors.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-sm text-gray-600 mb-2">
                                    Colors:
                                  </p>
                                  <div className="flex gap-2">
                                    {item.colors.map((color, index) => (
                                      <div
                                        key={index}
                                        className="w-6 h-6 rounded-full border border-gray-300"
                                        style={{ backgroundColor: color }}
                                        title={`Color ${index + 1}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Added Info */}
                              {item.trackingInfo && (
                                <div className="text-sm text-gray-500 space-y-1 mt-4">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                      Added on{' '}
                                      {new Date(
                                        item.trackingInfo.addedAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {item.trackingInfo.location && (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" />
                                      <span>
                                        From {item.trackingInfo.location}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3">
                              <button
                                onClick={() => handleAddToCart(item)}
                                disabled={item.stock === 0}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                  item.stock > 0
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                <ShoppingBag className="w-5 h-5" />
                                {item.stock > 0
                                  ? 'Add to Cart'
                                  : 'Out of Stock'}
                              </button>

                              <Link
                                href={`/product/${item.id}`}
                                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Eye className="w-5 h-5" />
                                View Details
                              </Link>

                              <button
                                onClick={() =>
                                  handleRemoveFromWishlist(item.id)
                                }
                                className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Wishlist Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Items</span>
                    <span className="font-medium">{wishlist.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Value</span>
                    <span className="text-xl font-bold text-gray-900">
                      $
                      {wishlist
                        .reduce((total, item) => {
                          const price =
                            item.sale_price > 0
                              ? item.sale_price
                              : item.regular_price;
                          return total + price;
                        }, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-4 border-t">
                    <button
                      onClick={handleMoveAllToCart}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Move All to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  You Might Also Like
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Based on your wishlist, we think you'll love these items.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Browse More Products
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Clear Wishlist */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Manage Wishlist
                </h3>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        'Are you sure you want to clear your entire wishlist?'
                      )
                    ) {
                      // You can add clearWishlist function to your store if needed
                      // For now, remove items one by one
                      wishlist.forEach((item) =>
                        handleRemoveFromWishlist(item.id)
                      );
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 border border-red-300 text-red-600 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
