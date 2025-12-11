// app/cart/page.tsx
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ChevronRight,
  Shield,
  Truck,
  Package,
  CreditCard,
  RefreshCw,
  Heart,
  X,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useStore } from '../../store';

export default function CartPage() {
  const { cart, removeFromCart, addToCart, clearCart } = useStore();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  // Initialize quantities from cart
  React.useEffect(() => {
    const initialQuantities: Record<string, number> = {};
    cart.forEach((item) => {
      initialQuantities[item.id] = item.quantity || 1;
    });
    setQuantities(initialQuantities);
  }, [cart]);

  // Calculate totals
  const subtotal = cart.reduce((total, item) => {
    const price = item.sale_price > 0 ? item.sale_price : item.regular_price;
    const quantity = quantities[item.id] || item.quantity || 1;
    return total + price * quantity;
  }, 0);

  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const discount = couponApplied ? subtotal * 0.1 : 0; // 10% discount if coupon applied
  const total = subtotal + shipping + tax - discount;

  const handleQuantityChange = (id: string, change: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const newQuantity = Math.max(1, current + change);

      // Find the item to check stock
      const item = cart.find((item) => item.id === id);
      if (item && newQuantity > item.stock) {
        alert(`Only ${item.stock} items available in stock`);
        return prev;
      }

      return { ...prev, [id]: newQuantity };
    });
  };

  const handleRemoveItem = (id: string) => {
    const item = cart.find((item) => item.id === id);
    if (item && item.trackingInfo?.user) {
      removeFromCart(
        id,
        item.trackingInfo.user,
        'cart-page',
        navigator.userAgent
      );
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim() === 'SAVE10') {
      setCouponApplied(true);
      alert('Coupon applied! 10% discount added.');
    } else {
      alert('Invalid coupon code. Try "SAVE10"');
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map((item) => item.id)));
    }
  };

  const handleToggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const selectedSubtotal = cart
    .filter((item) => selectedItems.has(item.id))
    .reduce((total, item) => {
      const price = item.sale_price > 0 ? item.sale_price : item.regular_price;
      const quantity = quantities[item.id] || item.quantity || 1;
      return total + price * quantity;
    }, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Start Shopping
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors ml-4"
              >
                <Package className="w-5 h-5 mr-2" />
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-2">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your
                cart
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear your cart?')) {
                    clearCart();
                  }
                }}
                className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Clear Cart
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mt-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium">Cart</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Cart Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={handleSelectAll}
                    className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                      selectedItems.size === cart.length
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedItems.size === cart.length && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    Select All ({selectedItems.size}/{cart.length})
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">Total</span>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {cart.map((item) => {
                const hasSale =
                  item.sale_price > 0 && item.sale_price < item.regular_price;
                const discountPercentage = hasSale
                  ? Math.round(
                      ((item.regular_price - item.sale_price) /
                        item.regular_price) *
                        100
                    )
                  : 0;
                const quantity = quantities[item.id] || item.quantity || 1;
                const itemTotal =
                  (hasSale ? item.sale_price : item.regular_price) * quantity;
                const isSelected = selectedItems.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-blue-500 shadow-blue-100'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Selection and Image */}
                        <div className="flex items-start">
                          <button
                            onClick={() => handleToggleItem(item.id)}
                            className={`w-5 h-5 rounded border-2 mt-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300'
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </button>
                          <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 ml-4">
                            <Image
                              src={item.images || '/placeholder.jpg'}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 128px) 100vw, 128px"
                            />
                            {hasSale && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                {discountPercentage}% OFF
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    <Link
                                      href={`/product/${item.slug || item.id}`}
                                      className="hover:text-blue-600 transition-colors"
                                    >
                                      {item.title}
                                    </Link>
                                  </h3>

                                  {/* Product Meta */}
                                  <div className="space-y-1 mb-3">
                                    <p className="text-sm text-gray-500">
                                      Category:{' '}
                                      <span className="font-medium">
                                        {item.category}
                                      </span>
                                    </p>
                                    {item.brand && (
                                      <p className="text-sm text-gray-500">
                                        Brand:{' '}
                                        <span className="font-medium">
                                          {item.brand}
                                        </span>
                                      </p>
                                    )}
                                    {item.warranty && (
                                      <p className="text-sm text-gray-500">
                                        Warranty:{' '}
                                        <span className="font-medium">
                                          {item.warranty} year
                                          {item.warranty !== '1' ? 's' : ''}
                                        </span>
                                      </p>
                                    )}
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
                                  <div className="text-sm text-gray-500">
                                    $
                                    {(hasSale
                                      ? item.sale_price
                                      : item.regular_price
                                    ).toFixed(2)}{' '}
                                    × {quantity}
                                  </div>
                                </div>
                              </div>

                              {/* Colors and Sizes */}
                              <div className="flex flex-wrap gap-4 mb-4">
                                {item.colors && item.colors.length > 0 && (
                                  <div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      Color:
                                    </p>
                                    <div className="flex gap-2">
                                      {item.colors.map((color, index) => (
                                        <div
                                          key={index}
                                          className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                                          style={{ backgroundColor: color }}
                                          title={`Color ${index + 1}`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {Array.isArray(item.sizes) && item.sizes.length > 0 && (
                                  <div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      Size:
                                    </p>
                                    <div className="flex gap-2">
                                      {Array.isArray(item.sizes) && item.sizes.map((size, index) => (
                                        <span
                                          key={index}
                                          className="px-2 py-1 text-xs border border-gray-300 rounded"
                                        >
                                          {size}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Stock Status */}
                              <div className="flex items-center gap-2">
                                {item.stock > 0 ? (
                                  <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-green-600">
                                      {item.stock} in stock
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-sm text-red-600">
                                      Out of stock
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col items-end gap-4">
                              {/* Quantity Control */}
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(item.id, -1)
                                  }
                                  disabled={quantity <= 1}
                                  className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 border-x border-gray-300 min-w-[40px] text-center">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(item.id, 1)
                                  }
                                  disabled={quantity >= item.stock}
                                  className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Item Total */}
                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  Item Total
                                </p>
                                <p className="text-xl font-bold text-gray-900">
                                  ${itemTotal.toFixed(2)}
                                </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                                <Link
                                  href={`/product/${item.slug || item.id}`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View details"
                                ></Link>
                                <button
                                  className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                                  title="Move to wishlist"
                                ></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Order Summary
                  </h3>

                  <div className="space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Shipping</span>
                        <Truck className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="font-medium">
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    {/* Tax */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>

                    {/* Discount */}
                    {couponApplied && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Discount (10%)</span>
                        <span className="font-medium">
                          -${discount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Total
                        </span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ${total.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {selectedItems.size > 0 ? (
                              <>
                                Selected:{' '}
                                <span className="font-medium">
                                  ${selectedSubtotal.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              'All items'
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="mt-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponApplied}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          couponApplied
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {couponApplied ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Try coupon code: <span className="font-mono">SAVE10</span>
                    </p>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => (window.location.href = '/checkout')}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Proceed to Checkout
                    <CreditCard className="w-5 h-5 inline ml-2" />
                  </button>

                  {/* Security Note */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Shield className="w-4 h-4" />
                      <span>Secure checkout • 100% safe & protected</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Why Shop With Us
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Free Shipping</p>
                      <p className="text-sm text-gray-500">
                        On orders over $100
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Secure Payment
                      </p>
                      <p className="text-sm text-gray-500">
                        100% secure & encrypted
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <RefreshCw className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Easy Returns</p>
                      <p className="text-sm text-gray-500">
                        30-day return policy
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-700 mb-4">
                  Our customer support team is here to help!
                </p>
                <div className="space-y-2">
                  <a
                    href="mailto:support@example.com"
                    className="block text-sm text-blue-600 hover:text-blue-800"
                  >
                    ✉️ khgamal005@gmail.com
                  </a>
                  <a
                    href="tel:+01229705511"
                    className="block text-sm text-blue-600 hover:text-blue-800"
                  >
                    📞 201229705511
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
