'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';

import { toast } from 'react-hot-toast';




// types/discount.ts
export type DiscountType = 'percentage' | 'fixed';

export interface DiscountCode {
  id: string;
  public_name: string;
  discount_type: DiscountType;
  discount_value: number;
  discount_code: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountFormData {
  public_name: string;
  discount_type: DiscountType;
  discount_value: string;
  discount_code: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
// API functions using axiosInstance
const discountApi = {
  createDiscount: async (data: DiscountFormData): Promise<DiscountCode> => {
    const res = await axiosInstance.post('product/api/create-discount-code/', data);
    return res.data.newDiscount;
  },


  getDiscounts: async (): Promise<DiscountCode[]> => {
    const res = await axiosInstance.get(`product/api/get-discount-codes`);
    return res.data;
  },

  deleteDiscount: async (id: string): Promise<{ message: string }> => {
    const res = await axiosInstance.delete(`product/api/delete-discount-code/${id}`);
    return res.data;
  },
};

const DiscountPage: React.FC = () => {
  const sellerId = 'your-seller-id'; // Get from auth context or props
  const queryClient = useQueryClient();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<DiscountFormData>({
    defaultValues: {
      discount_type: 'percentage',
    },
  });

  const watchDiscountType = watch('discount_type');

  // React Query for fetching discounts
  const {
    data: discounts = [],
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['discounts', sellerId],
    queryFn: () => discountApi.getDiscounts(),
    enabled: !!sellerId,
  });

  // React Query for creating discount
  const createMutation = useMutation({
    mutationFn: discountApi.createDiscount,
   onSuccess: (response) => {
    // Invalidate queries to refetch
    queryClient.invalidateQueries({ queryKey: ['discounts'] });
    // Reset your form if needed
    reset();
    // Show toast
    toast.success('Discount created successfully');
  },
  onError: (error: AxiosError<{ message: string }>) => {
    toast.error(error.response?.data?.message || 'Failed to create discount');
  },
  });

  // React Query for deleting discount
  const deleteMutation = useMutation({
    mutationFn: discountApi.deleteDiscount,
    onSuccess: (response) => {
    queryClient.invalidateQueries({ queryKey: ['discounts', sellerId] });
    toast.success(response.message || 'Discount deleted successfully');
  },
  onError: (error: AxiosError<{ message: string }>) => {
    toast.error(error.response?.data?.message || 'Failed to delete discount');
  },
  });

  const onSubmit = (data: DiscountFormData) => {
    createMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this discount code?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Discount Codes</h1>

      {/* Create Discount Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Create New Discount Code
        </h2>

        {createMutation.isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {(createMutation.error as AxiosError<{ message: string }>)?.response?.data?.message || 'Failed to create discount'}
          </div>
        )}

        {createMutation.isSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            Discount code created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Public Name */}
            <div>
              <label htmlFor="public_name" className="block text-sm font-medium text-gray-700 mb-1">
                Public Name *
              </label>
              <input
                type="text"
                id="public_name"
                {...register('public_name', {
                  required: 'Public name is required',
                  minLength: {
                    value: 2,
                    message: 'Public name must be at least 2 characters',
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Summer Sale 2024"
              />
              {errors.public_name && (
                <p className="mt-1 text-sm text-red-600">{errors.public_name.message}</p>
              )}
            </div>

            {/* Discount Code */}
            <div>
              <label htmlFor="discount_code" className="block text-sm font-medium text-gray-700 mb-1">
                Discount Code *
              </label>
              <input
                type="text"
                id="discount_code"
                {...register('discount_code', {
                  required: 'Discount code is required',
                  pattern: {
                    value: /^[A-Z0-9_-]+$/i,
                    message: 'Discount code can only contain letters, numbers, hyphens, and underscores',
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SUMMER24"
              />
              {errors.discount_code && (
                <p className="mt-1 text-sm text-red-600">{errors.discount_code.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount Type */}
            <div>
              <label htmlFor="discount_type" className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type *
              </label>
              <select
                id="discount_type"
                {...register('discount_type', {
                  required: 'Discount type is required',
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              {errors.discount_type && (
                <p className="mt-1 text-sm text-red-600">{errors.discount_type.message}</p>
              )}
            </div>

            {/* Discount Value */}
            <div>
              <label htmlFor="discount_value" className="block text-sm font-medium text-gray-700 mb-1">
                Discount Value *
                {watchDiscountType === 'percentage' ? ' (%)' : ' ($)'}
              </label>
              <input
                type="number"
                id="discount_value"
                step="0.01"
                min="0"
                max={watchDiscountType === 'percentage' ? '100' : undefined}
                {...register('discount_value', {
                  required: 'Discount value is required',
                  min: {
                    value: 0,
                    message: 'Discount value must be positive',
                  },
                  max: watchDiscountType === 'percentage' ? {
                    value: 100,
                    message: 'Percentage discount cannot exceed 100%',
                  } : undefined,
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={watchDiscountType === 'percentage' ? '10' : '25'}
              />
              {errors.discount_value && (
                <p className="mt-1 text-sm text-red-600">{errors.discount_value.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createMutation.isPending || isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Discount'}
            </button>
          </div>
        </form>
      </div>

      {/* Discount Codes List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Discount Codes
        </h2>

        {fetchError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            Failed to load discount codes
          </div>
        )}

        {discounts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No discount codes created yet
          </div>
        ) : (
          <div className="space-y-4">
            {discounts.map((discount) => (
              <div
                key={discount.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {discount.public_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Code: <span className="font-mono">{discount.discount_code}</span>
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {discount.discount_type === 'percentage'
                          ? `${discount.discount_value}%`
                          : `$${discount.discount_value}`}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {new Date(discount.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(discount.id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountPage;