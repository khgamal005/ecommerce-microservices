import ProductDetails from 'apps/user-ui/src/components/modules/ProductDetails';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import React from 'react';

const fetchProductDetails = async (slug: string) => {
  const res = await axiosInstance.get(`/product/api/get-product/${slug}`);
  return res.data.product;
};

export async function generateMetaData({
  params,
}: {
  params: { slug: string };
}) {
  const productDetails = await fetchProductDetails(params.slug);
  return {
    title: productDetails.title || 'EasyShop marketPlace',
    description:
      productDetails.short_description || 'discover high products on EasyShop',
    openGraph: {
      images: [productDetails.images[0].url],
      title: productDetails.title || 'EasyShop marketPlace',
      description:
        productDetails.short_description ||
        'discover high products on EasyShop',
    },
  };
}

const page = async ({ params }: { params: { slug: string } }) => {
  const productDetails = await fetchProductDetails(params.slug);
  return <ProductDetails productDetails={productDetails} />;
};

export default page;
