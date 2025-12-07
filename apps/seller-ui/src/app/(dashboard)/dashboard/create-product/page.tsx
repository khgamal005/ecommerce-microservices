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
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface UploadImage {
  fileId: string;
  file_Url: string;
}

interface ProductFormData {
  title: string;
  short_description: string;
  detailed_description: string;
  warranty: string | number | null;
  cashOnDelivery: string;
  custom_specifications?:
    | { key: string; value: string }[]
    | Record<string, any>;
  slug: string;
  tags: string | string[];
  video_Url?: string;
  brand?: string;
  category: string;
  subCategory: string;
  stock: number | string;
  colors?: string[];
  sale_price: number | string;
  regular_price: number | string;
  discountCodes?: string[];
  sizes?: string[];
  images?: (UploadImage | null)[];
  customProperties?:
    | { label: string; values: string[] }[]
    | Record<string, any>;
}

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isChanged, setIsChanged] = useState(true);
    const router = useRouter();


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
      title: '',
      short_description: '',
      detailed_description: '',
      category: '',
      subCategory: '',
      video_Url: '',
      regular_price: 0,
      sale_price: 0,
      sizes: [],
      discountCodes: [],
      cashOnDelivery: 'yes',
      brand: '',
      slug: '',
      warranty: '',
      stock: 0,
      tags: '',
      images: [],
      colors: [],
      customProperties: [],
      custom_specifications: [],
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
  isUploading,
} = useImageManagement(watch('images'), (newImages: (UploadImage | null)[]) => {
  setValue('images', newImages, { shouldValidate: true });
});
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('product/api/get-categories');
        console.log('Categories response:', res.data);
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
  };

  // In your main component, update the onSubmit and error handling
  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const json = await axiosInstance.post(
        '/product/api/create-product',
        data
      );
      console.log(json.data);
      toast.success(json.data.message);
      router.push('/dashboard/all-products'); // navigate client-side
      setSubmitMessage('');
    } catch (err: any) {
      toast.error(` ${err.message} || 'created failed`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  {...register('title', {
                    required: 'Product name is required',
                  })}
                />
                {errors.title && (
                  <span className="text-red-500">{errors.title.message}</span>
                )}
              </div>

              {/* Short Description */}
              <div className="md:col-span-2">
                <Input
                  type="text"
                  label="Short Description"
                  placeholder="Enter a brief description of the product"
                  {...register('short_description', {
                    required: 'Short description is required',
                    minLength: {
                      value: 5,
                      message:
                        'Short description must be at least 10 characters',
                    },
                    maxLength: {
                      value: 200,
                      message: 'Short description cannot exceed 200 characters',
                    },
                  })}
                />
                {errors.short_description && (
                  <span className="text-red-500">
                    {errors.short_description.message}
                  </span>
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

              {/* detailed Description */}
              <div className="md:col-span-2">
                <Controller
                  name="detailed_description"
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
                        wordCount >= 5 ||
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
                {errors.detailed_description && (
                  <span className="text-red-500">
                    {errors.detailed_description.message}
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
                error={errors.custom_specifications?.message as string}
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
                        watch('discountCodes')?.includes(code.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                      onClick={() => {
                        const currentSelection = watch('discountCodes') || [];
                        const updatedSelection = currentSelection.includes(
                          code.id
                        )
                          ? currentSelection.filter(
                              (id: string) => id !== code.id
                            )
                          : [...currentSelection, code.id];
                        setValue('discountCodes', updatedSelection);
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
                  setSelectedImage={setSelectedImage}
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
                        setSelectedImage={setSelectedImage}
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
