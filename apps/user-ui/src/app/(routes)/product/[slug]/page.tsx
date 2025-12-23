import ProductDetails from 'apps/user-ui/src/components/modules/ProductDetails';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import React from 'react';

const fetchProductDetails = async (slug: string) => {
  const res = await axiosInstance.get(`/product/api/get-product/${slug}`);
  return res.data.product;
};

// ✅ correct name + async params
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productDetails = await fetchProductDetails(slug);

  return {
    title: productDetails.title || 'EasyShop marketPlace',
    description:
      productDetails.short_description || 'discover high products on EasyShop',
    openGraph: {
      images: [productDetails.images?.[0]?.url],
      title: productDetails.title || 'EasyShop marketPlace',
      description:
        productDetails.short_description ||
        'discover high products on EasyShop',
    },
  };
}

// ✅ same fix here
const page = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const productDetails = await fetchProductDetails(slug);

  return <ProductDetails productDetails={productDetails} />;
};

export default page;
