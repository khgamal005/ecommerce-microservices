'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import ImagePlaceholder from 'apps/seller-ui/src/shared/components/image-placeholder';
import Input from 'packages/components/input';
import ColorSelector from 'packages/components/color-selector';
import CustomSpecifications from 'packages/components/custom-spacification';
// import CustomProperties from 'packages/components/custom-properties';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
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

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      tags: '',
      images: [null],
      colors: [],
      specifications: [],
    },
  });

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

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Beauty',
    'Toys',
    'Other',
  ];

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

              {/* Category Select */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <select
                  {...register('category', { required: true })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="text-red-500">Category is required</span>
                )}
              </div>

              {/* Price */}
              <div>
                <Input
                  type="number"
                  label="Price"
                  placeholder="0.00"
                  step="0.01"
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' },
                  })}
                />
                {errors.price && (
                  <span className="text-red-500">{errors.price.message}</span>
                )}
              </div>

              {/* Stock */}
              <div>
                <Input
                  type="number"
                  label="Stock"
                  placeholder="0"
                  {...register('stock', {
                    required: 'Stock is required',
                    min: { value: 0, message: 'Stock cannot be negative' },
                  })}
                />
                {errors.stock && (
                  <span className="text-red-500">{errors.stock.message}</span>
                )}
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

            {/* Product Description */}
            <div>
              <Input
                type="textarea"
                rows={4}
                label="Product Description"
                placeholder="Product description must be less than 150 words"
                {...register('description', {
                  validate: (value) => {
                    const countWord = value.trim().split(/\s+/).length;
                    return (
                      countWord <= 150 ||
                      'Product description must be less than 150 words'
                    );
                  },
                })}
              />
              {errors.description && (
                <span className="text-red-500">
                  {errors.description.message ||
                    'Product description is required'}
                </span>
              )}
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
            {/* spacification  */}

            <div>
              <CustomSpecifications
                control={control}
                error={errors.specifications?.message as string}
              />
            </div>

            <div>
              {/* <CustomProperties
                control={control}
                error={errors.customProperties?.message}
              /> */}
            </div>
            {/* cash on delivery  */}
            <div className="mt-2">
              <label className="block font-semibold mb-1 text-gray-300">
                Cash on Delivery *
              </label>

              <select
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md 
    text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
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
