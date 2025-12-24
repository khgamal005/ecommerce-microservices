'use client'
import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { Link } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    const router = useRouter();
    const [isProductsLoading, setIsProductsLoading] = useState(false);
    const [priceRange, setPriceRange] = useState([0.1199]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSize, setSelectedSize] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const[page , setPage] = useState(1)
    const[totalPages , setTotalPages] = useState(1)
    const[products , setProducts] = useState<any[]>([])
    const[tempPriceRange , setTempPriceRange] =useState([0.1199]);

const updateUrl= () => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set('priceRange', priceRange.join(','));
  if(selectedCategories.length > 0) searchParams.set('categories', selectedCategories.join(','));
  if(selectedColors.length > 0) searchParams.set('colors', selectedColors.join(','));
  if(selectedSize.length > 0) searchParams.set('sizes', selectedSize.join(','));
  searchParams.set('limit', '12');
  searchParams.set('page', page.toString());
router.replace(`/products?${decodeURIComponent(searchParams.toString())}`) 
}


    const  fetchFilteredProducts = async () => {
        setIsProductsLoading(true); 
  try {
    const query = new URLSearchParams();
    query.set('priceRange', priceRange.join(','));
    if(selectedCategories.length > 0) query.set('categories', selectedCategories.join(','));
    if(selectedColors.length > 0) query.set('colors', selectedColors.join(','));
    if(selectedSize.length > 0) query.set('sizes', selectedSize.join(','));
    query.set('limit', '12');
    query.set('page', page.toString());

    const res = await axiosInstance.get(
      `/product/api/get-filtered-products?${query.toString()}`
    );

    setProducts(res.data.products);
    setTotalPages(res.data.pagination.totalPages);
  } catch (error) {
    console.error('Error fetching recommended products:', error);
  }finally {
    setIsProductsLoading(false);
  }
};
useEffect(() => {
  updateUrl();
  fetchFilteredProducts();
},[priceRange])

    
interface Category {
  id: string;
  name: string;
}

const { data, isError, isLoading } = useQuery<Category[]>({
  queryKey: ['categories'],
  queryFn: async () => {
    const res = await axiosInstance.get('/product/api/get-categories');
    return res.data;
  },
  staleTime: 1000 * 60 * 2, // 2 minutes
});


  return (
    <div className='w-full bg-[#f5f5f5] pb-7'>
        <div className='w-[90%] lg-w-[80%] m-auto'>
            <div>
                <h1 className='font-medium leading-1 mb-[14px] font-jots'>
                    All Products

                </h1>
                <Link href='/'>
                Home
                </Link>
                <span className='inline-block  rounded-full'></span>
                <span className='text-red-100'>All Products</span>
            </div>

            <div className='w-full flex flex-col lg-flex-row gap-4'>
                {/* aside */}
                <aside className='w-full lg-w-[20%] bg-white p-4'>
                    <h3 className='font-medium text-xl '>price filter
                    </h3>
                        <div className='ml-2'>

                        </div>

                </aside>
            </div>

        </div>
    </div>
  )
}

export default page