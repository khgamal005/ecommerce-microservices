// components/CreateShopForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shopCategories } from 'apps/seller-ui/src/utils/categories';

interface CreateShopFormProps {
  sellerId: string;
  onSuccess?: () => void;
  setActiveStep: (step: number) => void;
}

interface CreateShopData {
  name: string;
  bio?: string;
  category: string;
  address: string;
  opining_hours: string;
  webSite?: string;
  socialLinks: string;
  sellerId: string;
}

interface Shop {
  id: string;
  name: string;
  bio?: string;
  category: string;
  address: string;
  opining_hours: string;
  webSite?: string;
  socialLinks: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  sellerData: string;
}

interface CreateShopResponse {
  success: boolean;
  message: string;
  shop: Shop;
}

const CreateShopForm: React.FC<CreateShopFormProps> = ({
  sellerId,
  onSuccess,
  setActiveStep,
}) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const queryClient = useQueryClient();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  console.log('sellerId', sellerId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateShopData>({
    defaultValues: {
      sellerId,
    },
  });

  // Create shop mutation - using the same pattern as your registerMutation
  const createShopMutation = useMutation({
    mutationFn: async (data: CreateShopData) => {
      const res = await fetch(`${API_URL}/api/create-shop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to create shop');
      return { json, data };
    },

    onSuccess: ({ json, data }) => {
      setSuccessMessage(json.message);
      // Invalidate and refetch any related queries
      queryClient.invalidateQueries({ queryKey: ['shops'] });

      reset();

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },

    onError: (err: Error) => {
      setServerError(err.message);
    },
  });

  const onSubmit = (data: CreateShopData) => {
    const shopData = { ...data, sellerId };
    createShopMutation.mutate(shopData);
    setServerError(null);
    setSuccessMessage(null);
    setActiveStep(3); // Move to bank setup
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create Your Shop
      </h2>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Server Error Message */}
      {serverError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Hidden sellerId field */}
        <input type="hidden" {...register('sellerId', { required: true })} />

        {/* Shop Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop Name *
          </label>
          <input
            type="text"
            {...register('name', {
              required: 'Shop name is required',
              minLength: {
                value: 2,
                message: 'Shop name must be at least 2 characters',
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your shop name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>

            {shopCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            {...register('bio')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about your shop..."
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <textarea
            {...register('address', {
              required: 'Address is required',
            })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your shop address"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Opening Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opening Hours *
          </label>
          <input
            type="text"
            {...register('opining_hours', {
              required: 'Opening hours are required',
              pattern: {
                value:
                  /^[0-9]{1,2}:[0-9]{2}\s*(?:AM|PM)?\s*-\s*[0-9]{1,2}:[0-9]{2}\s*(?:AM|PM)?$/i,
                message: 'Please use format: 9:00 AM - 6:00 PM',
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 9:00 AM - 6:00 PM"
          />
          {errors.opining_hours && (
            <p className="text-red-500 text-sm mt-1">
              {errors.opining_hours.message}
            </p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            {...register('webSite', {
              pattern: {
                value: /^https?:\/\/.+\..+/,
                message: 'Please enter a valid URL',
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
          {errors.webSite && (
            <p className="text-red-500 text-sm mt-1">
              {errors.webSite.message}
            </p>
          )}
        </div>

        {/* Social Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Social Links *
          </label>
          <input
            type="text"
            {...register('socialLinks', {
              required: 'Social links are required',
              pattern: {
                value: /^https?:\/\/.+\..+/,
                message: 'Please enter a valid URL',
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://facebook.com/yourpage"
          />
          {errors.socialLinks && (
            <p className="text-red-500 text-sm mt-1">
              {errors.socialLinks.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={createShopMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {createShopMutation.isPending ? 'Creating Shop...' : 'Create Shop'}
          </button>
        </div>
      </form>

      {/* Loading State */}
      {createShopMutation.isPending && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <p className="text-blue-700">Creating your shop, please wait...</p>
        </div>
      )}
    </div>
  );
};

export default CreateShopForm;
