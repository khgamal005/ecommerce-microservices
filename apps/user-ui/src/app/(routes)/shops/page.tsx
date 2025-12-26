'use client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Range } from 'react-range';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from 'apps/user-ui/src/components/cards/ProductCard';
import { set } from 'react-hook-form';
import { categories } from 'apps/user-ui/src/configs/categories';
import ShopCard from 'apps/user-ui/src/components/cards/ShopCard';

const page = () => {
  const router = useRouter();
  const [isShopLoading, setIsShopLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [shops, setShops] = useState<any[]>([]);

  // Initialize tempPriceRange when priceRange changes from URL or other sources

  const updateUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (selectedCategories.length > 0)
      searchParams.set('categories', selectedCategories.join(','));
    if (selectedCountries.length > 0)
      searchParams.set('countries', selectedCountries.join(','));

    searchParams.set('limit', '12');
    searchParams.set('page', page.toString());
    router.replace(`/shops?${decodeURIComponent(searchParams.toString())}`);
  };

const fetchFilteredShops = async () => {
  setIsShopLoading(true);
  try {
    const query = new URLSearchParams();

    if (selectedCategories.length > 0)
      query.set("categories", selectedCategories.join(","));

    if (selectedCountries.length > 0)
      query.set("countries", selectedCountries.join(","));

    query.set("limit", "12");
    query.set("page", page.toString());

    const res = await axiosInstance.get(
      `/product/api/get-filtered-shops?${query.toString()}`
    );

    setShops(res.data.shops);
    setTotalPages(res.data.pagination.totalPages);
  } catch (error) {
    console.error("Error fetching shops:", error);
  } finally {
    setIsShopLoading(false);
  }
};


    useEffect(() => {
      updateUrl();
      fetchFilteredShops();
    }, [selectedCategories, page]);

  return (
    <div className="w-full bg-[#f5f5f5] pb-7">
      <div className="w-[90%] lg:w-[80%] m-auto">
        <div className="py-4">
          <h1 className="font-medium text-2xl mb-4 font-jots">All shops</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-800">All shops</span>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-[25%]">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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

                <div className="space-y-3">
                  <ul className="max-h-56 overflow-y-auto space-y-1 pr-2">
                    {categories.map((category, index) => {
                      const isChecked = selectedCategories.includes(
                        category.value
                      );

                      return (
                        <li key={index}>
                          <label
                            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
              transition
              ${isChecked ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}
            `}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCategories((prev) => [
                                    ...prev,
                                    category.value,
                                  ]);
                                } else {
                                  setSelectedCategories((prev) =>
                                    prev.filter((c) => c !== category.value)
                                  );
                                }
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />

                            <span className="text-sm font-medium">
                              {category.label}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="w-full lg:w-[75%]">
            {isShopLoading ? (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {shops.map((shop) => (
                    <div
                      key={shop.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {shops.map((shop) => (
                        <ShopCard
                          key={shop.id}
                          shop={{
                            id: shop.id,
                            name: shop.name,
                            avatar: shop.avatar,
                            category: shop.category,
                            bio: shop.bio,
                            country: shop.country,
                            ratings: shop.ratings,
                            followersCount: shop.followers.length,
                            productsCount: shop.products.length,
                          }}
                        />
                      ))}
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
