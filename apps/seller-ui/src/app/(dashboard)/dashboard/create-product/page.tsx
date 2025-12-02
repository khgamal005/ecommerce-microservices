'use client';

import { Controller, useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import Input from 'packages/components/input';
import ColorSelector from 'packages/components/color-selector';
import CustomSpecifications from 'packages/components/custom-spacification';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import RichTextEditor from 'packages/components/rich-text-editor';
import SizeSelector from 'packages/components/size-selector';
import { useImageManagement } from 'apps/seller-ui/src/hook/useImageManagement';
import {
  ImageModal,
  ImageUploadInfo,
} from 'apps/seller-ui/src/shared/components/ImageModal';
import ImagePlaceholder from 'apps/seller-ui/src/shared/components/image-placeholder';

interface UploadImage {
  fileId: string;
  file_Url: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
  brand: string;
  video_Url?: string;
  sale_price: number;
  regular_price: number;
  stock: number;
  sizes: string[];
  discount: string;
  tags: string;
  slug: string;
  warranty: number | string | null;
  images: (UploadImage | null)[];
  colors: string[];
  specifications: { key: string; value: string }[];
  customProperties: { label: string; values: string[] }[];
  cashOnDelivery: string;
  discount_code?: string[];
}

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isChanged, setIsChanged] = useState(true);

  const {
    register,
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      category: '',
      subCategory: '',
      video_Url: '',
      regular_price: 0,
      sale_price: 0,
      sizes: [],
      discount: 'none',
      cashOnDelivery: 'yes',
      brand: '',
      slug: '',
      warranty: '',
      stock: 0,
      tags: '',
      images: [null],
      colors: [],
      specifications: [],
      customProperties: [],
      discount_code: [],
    },
  });

  const {
    images,
    selectedImage,
    openImageModel,
    setOpenImageModel,
    setSelectedImage,
    handleImageChange,
    handleRemoveImage,
    // handleEditImage,
    getValidImages,
    isUploading,
    MAX_IMAGES,
  } = useImageManagement([]);


  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('product/api/get-categories');
        return res.data;
      } catch (err) {
        console.error('Error fetching categories:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const { data: disccountCodeData, isLoading: isDiscountCodeLoading } =
    useQuery({
      queryKey: ['shop-discounts'],
      queryFn: async () => {
        try {
          const res = await axiosInstance.get('product/api/get-discount-codes');
          return res.data;
        } catch (err) {
          console.error('Error fetching discount codes:', err);
          throw err;
        }
      },
      staleTime: 5 * 60 * 1000,
      retry: 2,
    });

  const Categories = data?.categories || [];
  const subcategoriesData = data?.subcategories || {};

  const selectedCategory = watch('category');
  const regularPrice = watch('regular_price');
  const salePrice = watch('sale_price');

  const subcategories = useMemo(() => {
    return selectedCategory ? subcategoriesData[selectedCategory] || [] : [];
  }, [selectedCategory, subcategoriesData]);

  const handleSaveDraft = () => {
    setIsChanged(false);
    // Implement save draft logic here
    console.log('Save draft functionality');
  };

  // In your main component, update the onSubmit and error handling
  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Validate images
      const validImages = getValidImages();

      if (validImages.length === 0) {
        throw new Error('At least one product image is required');
      }

      // Prepare product data
      const productData = {
        ...data,
        images: validImages,
        mainImage: validImages[0]?.file_Url,
        thumbnailImages: validImages.slice(1).map((img) => img.file_Url),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // API call to create product
      const response = await axiosInstance.post(
        '/product/api/create',
        productData
      );

      if (response.data.success) {
        setSubmitMessage('🎉 Product created successfully!');

        // Reset form after success
        setTimeout(() => {
          reset();
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to create product');
      }
    } catch (error: any) {
      console.error('Error creating product:', error);

      if (error.response?.data?.error) {
        setSubmitMessage(`Error: ${error.response.data.error}`);
      } else if (error.message) {
        setSubmitMessage(error.message);
      } else {
        setSubmitMessage('Error creating product. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add error handling for image operations in your JSX
  {
    submitMessage && (
      <div
        className={`p-3 rounded-md ${
          submitMessage.includes('Error') ||
          submitMessage.includes('error') ||
          submitMessage.includes('failed')
            ? 'bg-red-100 text-red-700 border border-red-300'
            : 'bg-green-100 text-green-700 border border-green-300'
        }`}
      >
        {submitMessage}
      </div>
    );
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto rounded-lg text-white"
      >
        <h2 className="text-2xl py-2 font-bold text-white font-poppins">
          Create New Product
        </h2>

        <div className="flex items-center">
          <span className="text-sm font-medium text-[#80deea] cursor-pointer">
            dashboard
          </span>
          <ChevronRight size={20} className="opacity-[.8]" />
          <span>Create Product</span>
        </div>

        <div className="py-4 w-full gap-6 flex flex-col lg:flex-row">
          {/* LEFT — ALL FORM INPUTS */}
          <div className="lg:w-1/2 w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="md:col-span-2">
                <Input
                  type="text"
                  label="Product Name"
                  placeholder="Product Name"
                  {...register('name', {
                    required: 'Product name is required',
                  })}
                />
                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </div>

              {/* Brand */}
              <div>
                <Input
                  type="text"
                  label="Brand"
                  placeholder="Product Brand"
                  {...register('brand', {
                    required: 'Brand is required',
                    minLength: {
                      value: 2,
                      message: 'Brand must be at least 2 characters',
                    },
                  })}
                />
                {errors.brand && (
                  <span className="text-red-500">{errors.brand.message}</span>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category *
                </label>
                {isLoading ? (
                  <p>Loading categories...</p>
                ) : isError ? (
                  <p className="text-red-500">Error loading categories</p>
                ) : (
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Category</option>
                        {Categories.map((category: string) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                )}
                {errors.category && (
                  <span className="text-red-500">
                    {errors.category.message}
                  </span>
                )}
              </div>

              {/* SubCategory */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  SubCategory *
                </label>
                <Controller
                  name="subCategory"
                  control={control}
                  rules={{ required: 'Subcategory is required' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      disabled={!selectedCategory}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <option value="">
                        {!selectedCategory
                          ? 'Select category first'
                          : 'Select subCategory'}
                      </option>
                      {subcategories.map((sub: string) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.subCategory && (
                  <span className="text-red-500">
                    {errors.subCategory.message}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    required: 'Description is required',
                    validate: (value) => {
                      const plainText = (value || '')
                        .replace(/<[^>]+>/g, ' ')
                        .trim();
                      const wordCount = plainText
                        ? plainText.split(/\s+/).length
                        : 0;
                      return (
                        wordCount >= 10 ||
                        'Description must be at least 10 words'
                      );
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.description && (
                  <span className="text-red-500">
                    {errors.description.message}
                  </span>
                )}
              </div>

              {/* Video URL */}
              <div>
                <Input
                  label="Video URL (Optional)"
                  placeholder="https://example.com/video"
                  {...register('video_Url', {
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\-\.\?=&%]*)*\/?$/,
                      message: 'Enter a valid URL',
                    },
                  })}
                />
                {errors.video_Url && (
                  <span className="text-red-500">
                    {errors.video_Url.message}
                  </span>
                )}
              </div>

              {/* Regular Price */}
              <div>
                <Input
                  label="Regular Price"
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                  {...register('regular_price', {
                    required: 'Regular Price is required',
                    min: {
                      value: 0,
                      message: 'Regular Price must be positive',
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.regular_price && (
                  <span className="text-red-500">
                    {errors.regular_price.message}
                  </span>
                )}
              </div>

              {/* Sale Price */}
              <div>
                <Input
                  label="Sale Price"
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                  {...register('sale_price', {
                    required: 'Sale Price is required',
                    min: { value: 0, message: 'Sale Price must be positive' },
                    valueAsNumber: true,
                  })}
                />
                {errors.sale_price && (
                  <span className="text-red-500">
                    {errors.sale_price.message}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div>
                <Input
                  label="Stock"
                  placeholder="0"
                  type="number"
                  {...register('stock', {
                    required: 'Stock is required',
                    min: { value: 0, message: 'Stock cannot be negative' },
                    valueAsNumber: true,
                  })}
                />
                {errors.stock && (
                  <span className="text-red-500">{errors.stock.message}</span>
                )}
              </div>

              {/* Sizes */}
              <div className="mt-4">
                <label className="block font-semibold mb-1 text-gray-300">
                  Sizes
                </label>
                <SizeSelector control={control} error={errors.sizes?.message} />
              </div>

              {/* Slug */}
              <div className="md:col-span-2">
                <Input
                  type="text"
                  label="Slug"
                  placeholder="product-slug"
                  {...register('slug', {
                    required: 'Slug is required',
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message: 'Slug must be lowercase and may contain hyphens',
                    },
                  })}
                />
                {errors.slug && (
                  <span className="text-red-500">{errors.slug.message}</span>
                )}
              </div>
            </div>

            {/* Tags and Warranty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Product Tags"
                  placeholder="tag1, tag2, tag3"
                  {...register('tags', {
                    required: 'Product tags are required',
                  })}
                />
                {errors.tags && (
                  <span className="text-red-500">{errors.tags.message}</span>
                )}
              </div>

              <div>
                <Input
                  label="Warranty"
                  placeholder="1 year/no warranty"
                  {...register('warranty', {
                    required: 'Warranty information is required',
                  })}
                />
                {errors.warranty && (
                  <span className="text-red-500">
                    {errors.warranty.message}
                  </span>
                )}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <ColorSelector control={control} error={errors.colors?.message} />
            </div>

            {/* Specifications */}
            <div>
              <CustomSpecifications
                control={control}
                error={errors.specifications?.message as string}
              />
            </div>

            {/* Cash on Delivery */}
            <div className="mt-2">
              <label className="block font-semibold mb-1 text-gray-300">
                Cash on Delivery *
              </label>
              <select
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('cashOnDelivery', {
                  required: 'Cash on Delivery is required',
                })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.cashOnDelivery && (
                <span className="text-red-500">
                  {errors.cashOnDelivery.message}
                </span>
              )}
            </div>

            {/* Discount Codes */}
            <div>
              <label className="block font-semibold mb-1 text-gray-300">
                Discount Code (optional)
              </label>
              {isDiscountCodeLoading ? (
                <p>Loading discount codes...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {disccountCodeData?.map((code: any) => (
                    <button
                      key={code.id}
                      type="button"
                      className={`px-4 py-2 rounded-md ${
                        watch('discount_code')?.includes(code.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                      onClick={() => {
                        const currentSelection = watch('discount_code') || [];
                        const updatedSelection = currentSelection.includes(
                          code.id
                        )
                          ? currentSelection.filter(
                              (id: string) => id !== code.id
                            )
                          : [...currentSelection, code.id];
                        setValue('discount_code', updatedSelection);
                      }}
                    >
                      {code?.public_name} ({code?.discount_value}
                      {code?.discount_type === 'percentage' ? '%' : ' EGP'})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end pt-4 gap-4">
              {isChanged && (
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
                >
                  Save Draft
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Product...' : 'Create Product'}
              </button>
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`p-3 rounded-md ${
                  submitMessage.includes('Error') ||
                  submitMessage.includes('error')
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {submitMessage}
              </div>
            )}
          </div>

          {/* RIGHT — IMAGE PREVIEW SECTION */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-gray-800 rounded-lg p-4 sticky top-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Image Preview
              </h3>

              {/* Image Modal */}
    
              {openImageModel && (
                <ImageModal
                  selectedImage={selectedImage}
                  onClose={() => setOpenImageModel(false)}
                />
              )}

              {/* Main Image */}
              <div className="mb-4">
                <ImagePlaceholder
                  setOpenImageModel={setOpenImageModel}
                  size="275 * 850"
                  small={false}
                  images={images}
                  index={0}
                  onImageChange={handleImageChange}
                  onRemoveImage={handleRemoveImage}
                  openImageModel={openImageModel}
                  uploading={isUploading(0)}
                  // onEditImage={handleEditImage}
                />
              </div>

              {/* Thumbnails + Dynamic Placeholders */}
<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2">
  {images.slice(1).map((image, index) => {
    const idx = index + 1;
    return (
      <div key={idx} className="relative">
        <ImagePlaceholder
          size="275 * 850"
          small={false}
          images={images}
          openImageModel={openImageModel}
          setOpenImageModel={setOpenImageModel}
          index={idx}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
          uploading={isUploading(idx)}
        />
      </div>
    );
  })}
</div>

              {/* Upload Info */}
              <ImageUploadInfo />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
