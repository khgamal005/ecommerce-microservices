'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import ReactImageMagnify from 'react-image-magnify';
import Ratings from './Ratings';

const ProductDetails = ({ productDetails }: { productDetails: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(productDetails.images[0]?.url || productDetails.image);

  const prevImage = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentImage(productDetails.images[newIndex]?.url || productDetails.image);
    }
  };

  const nextImage = () => {
    if (currentIndex < productDetails.images.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentImage(productDetails.images[newIndex]?.url || productDetails.image);
    }
  };

  return (
    <div className="w-full bg-gray-50 py-8 min-h-screen">
      <div className="w-[90%] max-w-7xl mx-auto">
        {/* Main Grid Container */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
          
          {/* Left Column - Images (40% width) */}
          <div className="lg:col-span-5">
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
                      currentIndex === productDetails.images.length - 1 ? 'opacity-40 cursor-not-allowed' : ''
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
                    <div className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentIndex === index 
                        ? 'border-blue-600 ring-2 ring-blue-100' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
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

          {/* Middle Column - Product Info (44% width) */}
          <div className="lg:col-span-7 space-y-6">
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
                  ${productDetails.price?.toFixed(2) || '0.00'}
                </span>
                {productDetails.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${productDetails.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-sm font-medium">
                      Save ${(productDetails.originalPrice - productDetails.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-600 text-sm">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {productDetails.description || 'No description available.'}
              </p>
            </div>

            {/* Specifications/Features */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Key Features</h3>
              <ul className="space-y-2">
                {(productDetails.features || [
                  'High-quality materials',
                  'Durable construction',
                  'Easy to use',
                  'Value for money'
                ]).slice(0, 5).map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over $50</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-500">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;