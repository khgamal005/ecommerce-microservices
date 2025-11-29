'use client';

import { Controller, useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import ImagePlaceholder from 'apps/seller-ui/src/shared/components/image-placeholder';
import Input from 'packages/components/input';
import ColorSelector from 'packages/components/color-selector';
import CustomSpecifications from 'packages/components/custom-spacification';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import RichTextEditor from 'packages/components/rich-text-editor';
import SizeSelector from 'packages/components/size-selector';
// import CustomProperties from 'packages/components/custom-properties';

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
  images: (File | null)[];
  colors: string[];
  specifications: { key: string; value: string }[];
  customProperties: { label: string; values: string[] }[];
  cashOnDelivery: string;
}

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [openImageModel, setOpenImageModel] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [images, setImages] = useState<(File | null)[]>([null]);
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
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('product/api/get-categories');
        const data = await res.data;
        console.log(data);
        return data;
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const Categories = data?.categories || [];
  const subcategoriesData = data?.subcategories || {};

  const selectedCategory = watch('category');
  const regularPrices = watch('regular_price');

  const subcategories = useMemo(() => {
    return selectedCategory ? subcategoriesData[selectedCategory] || [] : [];
  }, [selectedCategory, subcategoriesData]);

  const handleImageChange = (file: File, index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = file;

      if (index === prev.length - 1 && prev.length < 8) {
        updated.push(null);
      }

      setValue('images', updated);
      return updated;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      let updated = [...prev];

      if (index === 0) {
        updated[0] = null;
      } else {
        updated.splice(index, 1);
      }

      if (!updated.includes(null) && updated.length < 8) {
        updated.push(null);
      }

      setValue('images', updated);
      return updated;
    });
  };

  const HandelSaveDraft = () => {
    setIsChange(false);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitMessage('Product created successfully!');
      reset();
      setImages([null]);
    } catch (error) {
      setSubmitMessage('Error creating product. Please try again.');
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
                  {...register('name', { required: true })}
                />
                {errors.name && (
                  <span className="text-red-500">Product name is required</span>
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
                    maxLength: {
                      value: 50,
                      message: 'Brand must be less than 50 characters',
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
                  Category
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
                  SubCategory
                </label>
                {isLoading ? (
                  <p>Loading categories...</p>
                ) : isError ? (
                  <p className="text-red-500">Error loading categories</p>
                ) : (
                  <Controller
                    name="subCategory"
                    control={control}
                    rules={{ required: 'subcategory is required' }}
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
                )}
                {errors.subCategory && (
                  <span className="text-red-500">
                    {errors.subCategory.message}
                  </span>
                )}
              </div>

              {/* Description */}
              <Controller
                name="description"
                control={control}
                rules={{
                  required: 'Description is required',
                  validate: (value) => {
                    const plainText = value.replace(/<[^>]+>/g, ' ').trim();
                    const wordCount = plainText.split(/\s+/).length;
                    return (
                      wordCount >= 10 || 'Description must be at least 10 words'
                    );
                  },
                }}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.description && (
                <span className="text-red-500">
                  {errors.description.message}
                </span>
              )}

              {/* Video URL */}
              <div>
                <Input
                  label="Video URL"
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
                    validate: (value) =>
                      !isNaN(Number(value)) || 'Only numbers are allowed',
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
                    validate: (value, formValues) => {
                      if (isNaN(Number(value)))
                        return 'Only numbers are allowed';
                      if (Number(value) >= Number(formValues.regular_price)) {
                        return 'Sale Price must be less than Regular Price';
                      }
                      return true;
                    },
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
                    min: { value: 1, message: 'Stock cannot be negative' },
                    max: { value: 10000, message: 'Stock is too large' },
                    validate: (value) => {
                      const num = Number(value);
                      if (isNaN(num)) return 'Only numbers are allowed';
                      if (!Number.isInteger(num))
                        return 'Stock must be an integer';
                      return true;
                    },
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
                <SizeSelector control={control} error={errors} />
              </div>

              {/* Slug */}
              <div className="md:col-span-2">
                <Input
                  type="text"
                  label="Slug"
                  placeholder="product-slug"
                  {...register('slug', {
                    required: 'Slug is required',
                    minLength: {
                      value: 3,
                      message: 'Slug must be at least 3 characters',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Slug must be less than 50 characters',
                    },
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
                  {...register('tags', { required: true })}
                />
                {errors.tags && (
                  <span className="text-red-500">Product tags is required</span>
                )}
              </div>

              <div>
                <Input
                  label="Warranty"
                  placeholder="1 year/no warranty"
                  {...register('warranty', { required: true })}
                />
                {errors.warranty && (
                  <span className="text-red-500">
                    Product warranty is required
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
            {/* CustomProperties */}

            <div>
              {/* <CustomProperties
                control={control}
                error={errors.customProperties?.message}
              /> */}
            </div>

            {/* Cash on Delivery */}
            <div className="mt-2">
              <label className="block font-semibold mb-1 text-gray-300">
                Cash on Delivery *
              </label>
              <select
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('cashOnDelivery', { required: true })}
                defaultValue="yes"
              >
                <option value="yes" className="bg-black">
                  Yes
                </option>
                <option value="no" className="bg-black">
                  No
                </option>
              </select>
              {errors.cashOnDelivery && (
                <span className="text-red-500">
                  Cash on Delivery is required
                </span>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end pt-4 gap-4">
              {/* Save Draft */}
              {isChanged && (
                <button
                  type="button"
                  onClick={HandelSaveDraft}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
                >
                  Save Draft
                </button>
              )}

              {/* Create Product */}
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
                  submitMessage.includes('Error')
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

              {/* Main Image */}
              <div className="mb-4">
                {images[0] && (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(images[0])}
                      alt="Main product"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(0)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                )}
                <ImagePlaceholder
                  setOpenImageModel={setOpenImageModel}
                  size="275 * 850"
                  small={false}
                  index={0}
                  onImageChange={handleImageChange}
                  onRemoveImage={handleRemoveImage}
                  defaultImage={null}
                />
              </div>

              {/* Thumbnail Images Grid */}
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2">
                {images.slice(1).map((image, index) => (
                  <div key={index} className="relative">
                    {image && (
                      <>
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index + 1)}
                          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </>
                    )}
                    <ImagePlaceholder
                      setOpenImageModel={setOpenImageModel}
                      size="275 * 850"
                      small={true}
                      index={index + 1}
                      onImageChange={handleImageChange}
                      onRemoveImage={handleRemoveImage}
                      defaultImage={image ? URL.createObjectURL(image) : null}
                    />
                  </div>
                ))}
              </div>

              {/* Image Upload Info */}
              <div className="mt-4 text-sm text-gray-400">
                <p>• Upload up to 8 images</p>
                <p>• First image will be the main display</p>
                <p>• Supported formats: JPG, PNG, WebP</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
