'use client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Range } from 'react-range';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from 'apps/user-ui/src/components/cards/ProductCard';

const page = () => {
  const router = useRouter();
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1199]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 1199]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const MIN = 0;
  const MAX = 1199;
  const COLORS = [
    'red',
    'blue',
    'green',
    'black',
    'white',
    'yellow',
    'orange',
    'purple',
  ];
  const SIZES = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    '3XL',
    '4XL',
    '5XL',
    '6XL',
    '7XL',
  ];

  // Initialize tempPriceRange when priceRange changes from URL or other sources
  useEffect(() => {
    setTempPriceRange(priceRange);
  }, [priceRange]);

  const updateUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('priceRange', priceRange.join(','));
    if (selectedCategories.length > 0)
      searchParams.set('categories', selectedCategories.join(','));
    if (selectedColors.length > 0)
      searchParams.set('colors', selectedColors.join(','));
    if (selectedSize.length > 0)
      searchParams.set('sizes', selectedSize.join(','));
    searchParams.set('limit', '12');
    searchParams.set('page', page.toString());
    router.replace(`/offers?${decodeURIComponent(searchParams.toString())}`);
  };

  const fetchFilteredProducts = async () => {
    setIsProductsLoading(true);
    try {
      const query = new URLSearchParams();
      query.set('priceRange', priceRange.join(','));
      if (selectedCategories.length > 0)
        query.set('categories', selectedCategories.join(','));
      if (selectedColors.length > 0)
        query.set('colors', selectedColors.join(','));
      if (selectedSize.length > 0) query.set('sizes', selectedSize.join(','));
      query.set('limit', '12');
      query.set('page', page.toString());

      const res = await axiosInstance.get(
        `/product/api/get-filtered-offers?${query.toString()}`
      );

      setProducts(res.data.products);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    } finally {
      setIsProductsLoading(false);
    }
  };

  const handleApplyFilter = () => {
    // Update the actual price range and trigger API call
    setPriceRange(tempPriceRange);
    // Reset to page 1 when applying new filters
    setPage(1);
  };

  const handleResetFilter = () => {
    // Reset to default price range
    setTempPriceRange([0, 1199]);
    setPriceRange([0, 1199]);
    setPage(1);
  };

  useEffect(() => {
    updateUrl();
    fetchFilteredProducts();
  }, [priceRange, page, selectedCategories, selectedColors, selectedSize]);

  interface CategoriesResponse {
    categories: string[];
    subcategories: Record<string, string[]>;
  }
  const { data, isError, isLoading } = useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-categories');
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  return (
    <div className="w-full bg-[#f5f5f5] pb-7">
      <div className="w-[90%] lg:w-[80%] m-auto">
        <div className="py-4">
          <h1 className="font-medium text-2xl mb-4 font-jots">All Products</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-800">All Products</span>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-[25%]">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              {/* Price Filter Section */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg text-gray-800">
                    Price Filter
                  </h3>
                  {(tempPriceRange[0] !== 0 || tempPriceRange[1] !== 1199) && (
                    <button
                      onClick={handleResetFilter}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Range Slider */}
                <div className="px-2">
                  <Range
                    step={1}
                    min={MIN}
                    max={MAX}
                    values={tempPriceRange}
                    onChange={(values) => setTempPriceRange(values)}
                    renderTrack={({ props, children }) => (
                      <div
                        ref={props.ref}
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={props.style}
                        className="h-2 bg-gray-200 rounded-full relative"
                      >
                        <div
                          className="absolute h-2 bg-blue-500 rounded-full"
                          style={{
                            left: `${
                              ((tempPriceRange[0] - MIN) / (MAX - MIN)) * 100
                            }%`,
                            width: `${
                              ((tempPriceRange[1] - tempPriceRange[0]) /
                                (MAX - MIN)) *
                              100
                            }%`,
                          }}
                        />
                        {children}
                      </div>
                    )}
                    renderThumb={({ props, index }) => (
                      <div
                        key={index}
                        ref={props.ref}
                        role={props.role}
                        tabIndex={props.tabIndex}
                        aria-valuemin={props['aria-valuemin']}
                        aria-valuemax={props['aria-valuemax']}
                        aria-valuenow={props['aria-valuenow']}
                        aria-label={props['aria-label']}
                        aria-labelledby={props['aria-labelledby']}
                        onKeyDown={props.onKeyDown}
                        onKeyUp={props.onKeyUp}
                        style={props.style}
                        className="h-6 w-6 rounded-full bg-white border-2 border-blue-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-shadow"
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-md">
                          ${tempPriceRange[index]}
                        </div>
                      </div>
                    )}
                  />
                </div>

                {/* Price Range Inputs */}
                <div className="flex gap-3 mt-6">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-2 font-medium">
                      Min ($)
                    </label>
                    <input
                      type="number"
                      min={MIN}
                      max={tempPriceRange[1]}
                      value={tempPriceRange[0]}
                      onChange={(e) => {
                        const value = Math.min(
                          Math.max(Number(e.target.value), MIN),
                          tempPriceRange[1] - 1
                        );
                        setTempPriceRange([value, tempPriceRange[1]]);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-2 font-medium">
                      Max ($)
                    </label>
                    <input
                      type="number"
                      min={tempPriceRange[0]}
                      max={MAX}
                      value={tempPriceRange[1]}
                      onChange={(e) => {
                        const value = Math.max(
                          Math.min(Number(e.target.value), MAX),
                          tempPriceRange[0] + 1
                        );
                        setTempPriceRange([tempPriceRange[0], value]);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Apply/Cancel Buttons */}
                <div className="flex gap-3 mt-6">
                  {JSON.stringify(tempPriceRange) !==
                    JSON.stringify(priceRange) && (
                    <button
                      onClick={handleApplyFilter}
                      className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Apply Filter
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setTempPriceRange(priceRange);
                    }}
                    disabled={
                      JSON.stringify(tempPriceRange) ===
                      JSON.stringify(priceRange)
                    }
                    className={`flex-1 py-2.5 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      JSON.stringify(tempPriceRange) ===
                      JSON.stringify(priceRange)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Category Filter Section */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg text-gray-800">
                    Categories
                  </h3>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={() => setSelectedCategories([])}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {data?.categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([
                              ...selectedCategories,
                              category,
                            ]);
                          } else {
                            setSelectedCategories(
                              selectedCategories.filter((c) => c !== category)
                            );
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-3 text-gray-700 capitalize">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Filter Section */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg text-gray-800">Colors</h3>
                  {selectedColors.length > 0 && (
                    <button
                      onClick={() => setSelectedColors([])}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => {
                    const active = selectedColors.includes(color);

                    return (
                      <button
                        key={color}
                        onClick={() =>
                          setSelectedColors(
                            active
                              ? selectedColors.filter((c) => c !== color)
                              : [...selectedColors, color]
                          )
                        }
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-200 ${
                          active
                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span
                          className="w-8 h-8 rounded-full border border-gray-300 shadow-inner"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs capitalize text-gray-700">
                          {color}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Filter Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg text-gray-800">Sizes</h3>
                  {selectedSize.length > 0 && (
                    <button
                      onClick={() => setSelectedSize([])}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {SIZES.map((size) => {
                    const active = selectedSize.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          if (active) {
                            setSelectedSize(
                              selectedSize.filter((s) => s !== size)
                            );
                          } else {
                            setSelectedSize([...selectedSize, size]);
                          }
                        }}
                        className={`py-2 px-2 border rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                          active
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="w-full lg:w-[75%]">
            {/* Active Filters Display */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-600">Active filters:</span>

                {/* Price Filter Badge */}
                {(priceRange[0] !== 0 || priceRange[1] !== 1199) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Price: ${priceRange[0]} - ${priceRange[1]}
                    <button
                      onClick={() => {
                        setPriceRange([0, 1199]);
                        setTempPriceRange([0, 1199]);
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}

                {/* Category Badges */}

                {/* Clear All Filters Button */}
                {(priceRange[0] !== 0 ||
                  priceRange[1] !== 1199 ||
                  selectedCategories.length > 0 ||
                  selectedColors.length > 0 ||
                  selectedSize.length > 0) && (
                  <button
                    onClick={() => {
                      setPriceRange([0, 1199]);
                      setTempPriceRange([0, 1199]);
                      setSelectedCategories([]);
                      setSelectedColors([]);
                      setSelectedSize([]);
                      setPage(1);
                    }}
                    className="ml-auto text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>

            {isProductsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
                  >
                    <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-gray-600">
                    Showing {products.length} of {products.length} products
                  </p>
                  <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }).map(
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`w-10 h-10 rounded-md ${
                                page === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'border hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      <button
                        onClick={() =>
                          setPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={page === totalPages}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default page;
