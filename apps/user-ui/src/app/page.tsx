'use client';
import React from 'react';
import Header from './shared/widgets/header/Header';
import Hero from '../components/modules/Hero';
import SectionTitle from '../components/section/section-title';
import SuggestedProducts from '../components/modules/SuggestedProducts';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

// parent page component
const Page = () => {
  const { data: latestProducts, isError, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-all-products?page=1&limit=10&type=latest');
      console.log(res.data);
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2
  });

  return (
    <>
      <Header />
      <Hero />
      <div className="md:w-[80%] w-[90%] my-10 m-auto">
        <div className="mb-8">
          <SectionTitle
            title="Suggested Products"
            variant="gradient"
            subtitle="Discover handpicked items just for you"
          />
        </div>
        <SuggestedProducts 
          products={latestProducts || []}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </>
  );
};

export default Page;

