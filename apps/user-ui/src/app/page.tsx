'use client';

import React from 'react';
import Header from './shared/widgets/header/Header';
import Hero from '../components/modules/Hero';
import SectionTitle from '../components/section/section-title';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import ProductCard from '../components/cards/ProductCard';
import ShopCard from '../components/cards/ShopCard';

const Page = () => {
  // Products
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axiosInstance.get(
        '/product/api/get-all-products?page=1&limit=10'
      );
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2,
  });

  // Latest products
  const {
    data: latestProducts,
    isLoading: latestLoading,
    isError: latestError,
  } = useQuery({
    queryKey: ['latest-products'],
    queryFn: async () => {
      const res = await axiosInstance.get(
        '/product/api/get-all-products?page=1&limit=10&type=latest'
      );
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2,
  });

  // Shops
  const {
    data: shops,
    isLoading: shopsLoading,
    isError: shopsError,
  } = useQuery({
    queryKey: ['top-shops'],
    queryFn: async () => {
      const res = await axiosInstance.get(
        '/product/api/top-shops'
      );
      return res.data.top10Shops;
    },
    staleTime: 1000 * 60 * 2,
  });
    const {
    data: offers,
    isLoading: offersLoading,
    isError: offersError,
  } = useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      const res = await axiosInstance.get(
        '/product/api/get-all-events?page=1&limit=10'
      );
            console.log(res.data);

      return res.data.events;
    },
    staleTime: 1000 * 60 * 2,
  });

  return (
    <>
      <Header />
      <Hero />

      <div className="md:w-[80%] w-[90%] my-10 m-auto">
        {/* Suggested Products */}
        <SectionTitle
          title="Suggested Products"
          variant="gradient"
          subtitle="Discover handpicked items just for you"
        />

        {productsLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 h-[380px] rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {!productsLoading && !productsError && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Latest Products */}
        <div className="my-10">
          <SectionTitle
            title="Latest Products"
            variant="gradient"
            subtitle="Discover latest items just for you"
          />
        </div>

        {!latestLoading && !latestError && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {latestProducts?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Top Shops */}
        <div className="my-10">
          <SectionTitle
            title="Top Shops"
            variant="gradient"
            subtitle="Discover top shops"
          />
        </div>

        {shopsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 h-[260px] rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {shops?.map((shop: any) => (
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
                  // followersCount: shop.followers.length,
                  // productsCount: shop.products.length,
                }}
              />
            ))}
          </div>
        )}
                {/* offers */}
        <SectionTitle
          title="Top Offers"
          variant="gradient"
          subtitle="Discover handpicked items just for you"
        />
                {productsLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 h-[380px] rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {!offersLoading && !offersError && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {offers?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
