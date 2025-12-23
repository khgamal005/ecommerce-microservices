'use client';
import { ChevronLeft, ChevronRight, Heart, MapPin, MessagesSquare, Package, ShoppingBag, Store, WalletMinimal } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ReactImageMagnify from 'react-image-magnify';
import Ratings from './Ratings';
import { useStore } from '../../store';
import useLocationTracking from '../../hooks/useLocationTracking';
import useDeviceTracking from '../../hooks/useDeviceTracking';
import useUser from '../../hooks/use-user';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  CartProduct,
  CleanLocationInfo,
  ProductDetailsInfo,
} from '../../types/Product';
import ProductCard from '../cards/ProductCard';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

const ProductDetails = ({ productDetails }: { productDetails: any }) => {
  const {
    cart,
    wishlist,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    decreaseQuantity,
  } = useStore();
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  const locationData = useLocationTracking();
  const deviceData = useDeviceTracking();

  const safeLocation: CleanLocationInfo = {
    ip: locationData?.ip ?? '0.0.0.0',
    latitude: locationData?.latitude ?? 0,
    longitude: locationData?.longitude ?? 0,
    country: locationData?.country ?? 'unknown',
    city: locationData?.city ?? 'unknown',
  };

  // Check if product is in wishlist
  const isWishlisted = wishlist.some((item) => item.id === productDetails.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(
    productDetails.images[0]?.url || productDetails.image
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    productDetails.colors?.[0] || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    productDetails.sizes?.[0] || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [priceRange, setPriceRange] = useState(
    productDetails.sale_price || 1199
  );
  
  // Check if product is in cart and get its quantity
  const cartItem = cart.find((item) => item.id === productDetails.id);
  const currentCartQuantity = cartItem?.quantity || 0;
  const maxQuantityToAdd = Math.max(
    0,
    productDetails.stock - currentCartQuantity
  );

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
    image:  product.images?.[0]?.url || '',
    brand: product.brand,
    warranty: product.warranty,
    cashOnDelivery: product.cashOnDelivery,
    quantity: 1,
  });
  
  const cartItems = mapProductToCartProduct(
    productDetails,
    selectedSize,
    selectedColor
  );

  const prevImage = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentImage(
        productDetails.images[newIndex]?.url || productDetails.image
      );
    }
  };

  const nextImage = () => {
    if (currentIndex < productDetails.images.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentImage(
        productDetails.images[newIndex]?.url || productDetails.image
      );
    }
  };

  const handleWishlistToggle = () => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push(
        '/login?redirect=' + encodeURIComponent(window.location.pathname)
      );
      return;
    }
    
    if (isWishlisted) {
      removeFromWishlist(productDetails.id, user, safeLocation, deviceData);
    } else {
      addToWishlist(
        cartItems,
        user,
        safeLocation,
        deviceData
      );
    }
  };

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
    if (currentCartQuantity >= productDetails.stock) {
      toast.success(`Only ${productDetails.stock} items available in stock`);
      return;
    }

    // Use addToCart to increment quantity
    addToCart(cartItems, user, safeLocation, deviceData);
    toast.success('Added to cart!');
  };

  const handleDecrement = () => {
    if (!user) {
      router.push(
        '/login?redirect=' + encodeURIComponent(window.location.pathname)
      );
      return;
    }

    if (currentCartQuantity > 1) {
      // If quantity > 1, decrease by 1
      decreaseQuantity(productDetails.id, user, safeLocation, deviceData);
    } else if (currentCartQuantity === 1) {
      // If quantity = 1, remove from cart completely
      removeFromCart(productDetails.id, user, safeLocation, deviceData);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push(
        '/login?redirect=' + encodeURIComponent(window.location.pathname)
      );
      return;
    }

    if (productDetails.stock === 0 || maxQuantityToAdd <= 0) return;

    // Add to cart first
    addToCart(
      cartItems,
      user,
      safeLocation,
      deviceData
    );

    router.push('/checkout');
  };


const fetchRecommendedProducts = async () => {
  try {
    const query = new URLSearchParams();
    query.set('priceRange', priceRange.join(','));
    query.set('limit', '4');
    query.set('page', '1');

    const res = await axiosInstance.get(
      `/product/api/get-filtered-products?${query.toString()}`
    );

    setRecommendedProducts(res.data.products);
  } catch (error) {
    console.error('Error fetching recommended products:', error);
  }
};
useEffect(() => {
  fetchRecommendedProducts();
},[priceRange])

  return (
    <div className="w-full bg-gray-50 py-8 min-h-screen">
      <div className="w-[90%] max-w-7xl mx-auto">
        {/* Main Grid Container - Now with 3 columns */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
          
          {/* Left Column - Images (4 columns) */}
          <div className="lg:col-span-4">
            {/* Main Image with Magnify */}
            <div className="relative border border-gray-200 rounded-lg bg-white p-4 mb-6">
              <div className="relative w-full h-[400px] z-10">
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: productDetails.title || 'Product Image',
                      isFluidWidth: true,
                      src: currentImage,
                    },
                    largeImage: {
                      src: currentImage,
                      width: 800,
                      height: 800,
                    },
                    enlargedImageContainerDimensions: {
                      width: '160%',
                      height: '160%',
                    },
                    enlargedImagePosition: 'left',
                    enlargedImageStyle: {
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    },
                  }}
                />
              </div>

              {/* Image Navigation Arrows */}
              {productDetails.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentIndex === 0}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg ${
                      currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  >
                    <ChevronLeft size={20} className="text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={currentIndex === productDetails.images.length - 1}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg ${
                      currentIndex === productDetails.images.length - 1
                        ? 'opacity-40 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <ChevronRight size={20} className="text-gray-700" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {productDetails.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {productDetails.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="relative">
              {productDetails.images.length > 4 && (
                <button
                  onClick={prevImage}
                  disabled={currentIndex === 0}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:shadow-lg"
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide px-2">
                {productDetails.images.map((image: any, index: number) => (
                  <div
                    key={index}
                    className="flex-shrink-0 relative cursor-pointer"
                    onClick={() => {
                      setCurrentIndex(index);
                      setCurrentImage(image.url);
                    }}
                  >
                    <div
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        currentIndex === index
                          ? 'border-blue-600 ring-2 ring-blue-100'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image?.url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {productDetails.images.length > 4 && (
                <button
                  onClick={nextImage}
                  disabled={currentIndex === productDetails.images.length - 1}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:shadow-lg"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Middle Column - Product Info (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {productDetails.title}
              </h1>

              {/* Ratings and Reviews */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Ratings rating={productDetails.rating || 0} />
                  <span className="ml-2 text-sm text-gray-600">
                    ({productDetails.reviewCount || 0} reviews)
                  </span>
                </div>
                <span className="text-green-600 text-sm font-medium">
                  {productDetails.stockStatus || 'In Stock'}
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  EGP{productDetails.sale_price?.toFixed(2) || '0.00'}
                </span>
                {productDetails.sale_price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      EGP{productDetails.regular_price.toFixed(1)}
                    </span>
                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-sm font-medium">
                      Save EGP
                      {(
                        productDetails.regular_price - productDetails.sale_price
                      ).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-600 text-sm">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {productDetails.description || 'No description available.'}
              </p>
            </div>

            {/* Brand */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Brand
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {productDetails.brand || 'No brand available.'}
              </p>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <h3 className="text-black font-medium text-[20px]">Select Colors</h3>
              <div className="flex flex-wrap gap-3">
                {productDetails.colors.map((color: string, index: number) => (
                  <button
                    key={index}
                    className={`
                      relative w-[60px] h-[60px] rounded-full flex items-center justify-center 
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
                    {/* Color circle */}
                    <div
                      className={`
                        w-[32px] h-[32px] rounded-full transition-all duration-200
                        ${selectedColor === color ? 'scale-110' : ''}
                      `}
                      style={{ backgroundColor: color }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="text-black font-medium text-[20px]">
                Select Size
              </h3>

              <div className="flex flex-wrap gap-2.5">
                {productDetails.sizes?.map((size: string, index: number) => {
                  const inStock = true; // Replace with your stock check logic

                  return (
                    <button
                      key={index}
                      disabled={!inStock}
                      className={`
                        relative min-w-[70px] px-5 py-3.5 rounded-full text-center
                        font-medium transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        ${
                          selectedSize === size
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
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

                      {/* Stock status indicator */}
                      {!inStock && (
                        <span className="absolute -top-1 -right-1 text-[10px] text-red-500 font-bold">
                          X
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
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
                    onClick={handleAddToCart}
                    disabled={
                      currentCartQuantity >= productDetails.stock || !user
                    }
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {productDetails.stock} items available
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
                disabled={
                  !user || productDetails.stock === 0 || maxQuantityToAdd <= 0
                }
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                title={!user ? 'Please login to add to cart' : ''}
              >
                <ShoppingBag size={20} />
                {!user
                  ? 'Login to Add'
                  : productDetails.stock > 0
                  ? maxQuantityToAdd > 0
                    ? currentCartQuantity > 0
                      ? 'Add More to Cart'
                      : 'Add to Cart'
                    : 'Max Stock Reached'
                  : 'Out of Stock'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!user || productDetails.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                title={!user ? 'Please login to buy now' : ''}
              >
                {!user
                  ? 'Login to Buy'
                  : currentCartQuantity > 0
                  ? 'Checkout Now'
                  : 'Buy Now'}
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
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }
                />
              </button>
            </div>
          </div>

          {/* Right Column - Seller & Delivery Info (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Delivery Options Card */}
            <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Options</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Delivery to</p>
                    <p className="text-gray-600">
                      {safeLocation?.city || 'City'}, {safeLocation?.country || 'Country'}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Standard Delivery</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  <p className="text-sm text-gray-600">Delivery within 3-7 business days</p>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Express Delivery</span>
                    <span className="font-bold">EGP 50.00</span>
                  </div>
                  <p className="text-sm text-gray-600">Delivery within 1-2 business days</p>
                </div>
              </div>
            </div>

            {/* Return & Warranty Card */}
            <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Return & Warranty</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium">7 Days Returns</p>
                    <p className="text-sm text-gray-600">Easy return policy</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <WalletMinimal size={20} className="text-gray-600" />
                  <div>
                    <p className="font-medium">Warranty</p>
                    <p className="text-sm text-gray-600">Not available for this product</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Info Card */}
            <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">
                    {productDetails.shop?.name?.charAt(0) || 'S'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sold by</p>
                  <p className="font-medium truncate max-w-[150px]">
                    {productDetails.shop?.name || 'Seller Name'}
                  </p>
                </div>
              </div>

              {/* Seller Performance */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Seller Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {productDetails.shop?.rating || '4.5'}
                  </p>
                  <div className="flex justify-center mt-1">
                    <Ratings rating={productDetails.shop?.rating || 4.5}  />
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Ship on Time</p>
                  <p className="text-2xl font-bold text-green-600">100%</p>
                  <p className="text-xs text-gray-500 mt-1">Reliable</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href={`/shop/${productDetails.shop?.slug}`}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <MessagesSquare size={18} />
                  Chat with Seller
                </Link>
                
                <Link
                  href={`/shop/${productDetails.shop?.slug}`}
                  className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-2.5 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  <Store size={18} />
                  Visit Store
                </Link>
              </div>
            </div>


          </div>
        </div>
        <div className='bg-[#fafafa] -mt-6'>
          <div className='bg-white min-[60vh] h-full p-5'>
            <h3 className='text-lg font-semibold'> product details of {productDetails.title} </h3>
            <div className='prose prose-sm text-slate-200 max-w-none'
            dangerouslySetInnerHTML={{ __html: productDetails.description }}
            >

            </div>

          </div>
          <div>
            <div>
              <h3>Reviews & ratings of {productDetails?.title}</h3>
              <p>No reviews available yet</p>
            </div>
          </div>
          <div className='w-[90%] lg:w-lg-[80%] mx-auto'>
            <div className='w-full h-full my-5 p-5'>
              <h3>You may also like</h3>
              <div className='m-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {recommendedProducts.map((product: ProductDetailsInfo) => (
                  <ProductCard key={product.id} product={product} showShop={true} />
                ))}
              </div>

            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ProductDetails;