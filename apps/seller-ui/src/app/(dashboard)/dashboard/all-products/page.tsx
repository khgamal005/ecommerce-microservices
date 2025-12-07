'use client';

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Search,
  Pencil,
  Trash,
  Eye,
  Star,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, useCallback } from 'react';

interface ProductImage {
  id: string;
  file_id: string;
  url: string;
  userId: string | null;
  shopId: string | null;
  productId: string;
}

interface Product {
  id: string;
  name: string;
  title: string;
  category: string;
  rating: number;
  sale_price: number;
  stock: number;
  images: ProductImage[];
  ratings?: number;
  isDeleted?: boolean;
}

// Fetch products
const fetchProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get('product/api/shop-products');
  return response.data.products || [];
};

// Delete product
const deleteProduct = async (productId: string) => {
  const response = await axiosInstance.delete(
    `/product/api/delete-product/${productId}`
  );
  return response.data;
};

// Restore product
const restoreProduct = async (productId: string) => {
  const response = await axiosInstance.patch(
    `/product/api/restore-product/${productId}`
  );
  return response.data;
};

const ProductList = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'active' | 'deleted'>('active');

  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ['shop-products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const filteredProducts = useMemo(() => {
    return activeTab === 'active'
      ? products.filter((p) => !p.isDeleted)
      : products.filter((p) => p.isDeleted);
  }, [products, activeTab]);

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['shop-products'] }),
  });

  const restoreMutation = useMutation<any, Error, string>({
    mutationFn: restoreProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      setShowRestoreModal(false);
      setSelectedProduct(null);
    },
  });

  // Image handlers
  const handleImageError = useCallback((src: string) => {
    setImageErrors((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  const handleImageLoad = useCallback((src: string) => {
    setImageErrors((prev) => {
      if (!prev.has(src)) return prev;
      const next = new Set(prev);
      next.delete(src);
      return next;
    });
  }, []);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: 'images',
        header: 'Image',
        cell: ({ row }: { row: { original: Product } }) => {
          const { images, name } = row.original;
          const firstImage = images?.[0]?.url || '';
          const hasError = imageErrors.has(firstImage) || !firstImage;

          return (
            <div className="flex items-center justify-center">
              <div className="relative w-14 h-14">
                {hasError ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700">
                    <ImageIcon size={24} className="text-gray-600" />
                  </div>
                ) : (
                  <>
                    <img
                      src={firstImage}
                      alt={name}
                      className="w-full h-full object-cover rounded-lg border border-gray-700"
                      loading="lazy"
                      onError={() => handleImageError(firstImage)}
                      onLoad={() => handleImageLoad(firstImage)}
                    />
                    {images && images.length > 1 && (
                      <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        +{images.length - 1}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'name',
        header: 'Product Name',
        cell: ({ row }: { row: { original: Product } }) => {
          const truncatedTitle =
            row.original.title?.length > 25
              ? `${row.original.title.substring(0, 25)}...`
              : row.original.title;
          return (
            <div className="min-w-[200px]">
              <div className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer">
                {truncatedTitle}
              </div>
              <p className="text-sm text-gray-400 mt-1">{row.original.name}</p>
              {row.original.isDeleted && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-red-900/30 text-red-400 text-xs rounded-full">
                  Deleted
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: 'Category',
        accessorKey: 'category',
        cell: ({ row }: { row: { original: Product } }) => (
          <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">
            {row.original.category || 'Uncategorized'}
          </span>
        ),
      },
      {
        header: 'Rating',
        accessorKey: 'rating',
        cell: ({ row }: { row: { original: Product } }) => (
          <div className="flex items-center gap-1">
            <Star className="text-yellow-500 fill-yellow-500" size={16} />
            <span className="text-white font-medium">
              {row.original.ratings || row.original.rating || 0}
            </span>
          </div>
        ),
      },
      {
        header: 'Price',
        accessorKey: 'sale_price',
        cell: ({ row }: { row: { original: Product } }) => (
          <span className="text-green-400 font-semibold">
            ${row.original.sale_price.toFixed(2) || '0.00'}
          </span>
        ),
      },
      {
        header: 'Stock',
        accessorKey: 'stock',
        cell: ({ row }: { row: { original: Product } }) => (
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                row.original.stock > 10
                  ? 'bg-green-900/30 text-green-400'
                  : row.original.stock > 0
                  ? 'bg-yellow-900/30 text-yellow-400'
                  : 'bg-red-900/30 text-red-400'
              }`}
            >
              {row.original.stock > 0
                ? `${row.original.stock} units`
                : 'Out of Stock'}
            </span>
          </div>
        ),
      },
    ];

    // Actions
    if (activeTab === 'active') {
      return [
        ...baseColumns,
        {
          header: 'Actions',
          cell: ({ row }: { row: { original: Product } }) => (
            <div className="flex gap-3">
              <Link
                href={`/product/${row.original.id}`}
                className="p-2 bg-blue-900/30 hover:bg-blue-800/40 rounded-lg transition-colors"
                title="View Details"
              >
                <Eye size={18} className="text-blue-400" />
              </Link>
              <Link
                href={`/product/edit/${row.original.id}`}
                className="p-2 bg-yellow-900/30 hover:bg-yellow-800/40 rounded-lg transition-colors"
                title="Edit Product"
              >
                <Pencil size={18} className="text-yellow-400" />
              </Link>
              <button
                onClick={() => openDeleteModal(row.original)}
                className="p-2 bg-red-900/30 hover:bg-red-800/40 rounded-lg transition-colors"
                title="Delete Product"
              >
                <Trash size={18} className="text-red-400" />
              </button>
            </div>
          ),
        },
      ];
    } else {
      return [
        ...baseColumns,
        {
          header: 'Actions',
          cell: ({ row }: { row: { original: Product } }) => (
            <div className="flex gap-3">
              <button
                onClick={() => openRestoreModal(row.original)}
                className="p-2 bg-green-900/30 hover:bg-green-800/40 rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw size={18} className="text-green-400" />
                <span className="text-green-400 text-sm">Restore</span>
              </button>
              {/* <button
                onClick={() => openDeleteModal(row.original)}
                className="p-2 bg-red-900/30 hover:bg-red-800/40 rounded-lg transition-colors"
              >
                <Trash size={18} className="text-red-400" />
              </button> */}
            </div>
          ),
        },
      ];
    }
  }, [imageErrors, activeTab]);

  const table = useReactTable({
    data: filteredProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const openRestoreModal = (product: Product) => {
    setSelectedProduct(product);
    setShowRestoreModal(true);
  };

  const activeProductsCount = products.filter((p) => !p.isDeleted).length;
  const deletedProductsCount = products.filter((p) => p.isDeleted).length;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-red-400">
        <AlertCircle className="w-8 h-8" />
        <p>Failed to load products.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-6">
      {/* Tabs and Search */}
      <div className="flex gap-4 mb-4 items-center flex-wrap">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'active' ? 'bg-blue-600' : 'bg-gray-700'
          }`}
          onClick={() => setActiveTab('active')}
        >
          Active ({activeProductsCount})
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'deleted' ? 'bg-red-600' : 'bg-gray-700'
          }`}
          onClick={() => setActiveTab('deleted')}
        >
          Deleted ({deletedProductsCount})
        </button>
        <div className="ml-auto flex items-center gap-2">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="px-3 py-1 rounded bg-gray-700 text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-4 py-2 border-b border-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-800/50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 border-b border-gray-700"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {activeTab === 'active'
                ? 'Delete Product'
                : 'Permanently Delete Product'}
            </h3>
            <p className="mb-6">
              {activeTab === 'active'
                ? `Move "${selectedProduct.title}" to deleted products?`
                : `Permanently delete "${selectedProduct.title}"? This cannot be undone.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 bg-gray-700 rounded-lg py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(selectedProduct.id)}
                className="flex-1 bg-red-600 rounded-lg py-2"
              >
                {deleteMutation.isPending
                  ? 'Processing...'
                  : activeTab === 'active'
                  ? 'Delete'
                  : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Restore Product</h3>
            <p className="mb-6">
              Are you sure you want to restore "{selectedProduct.name}"? It will
              appear in active products.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 bg-gray-700 rounded-lg py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => restoreMutation.mutate(selectedProduct.id)}
                className="flex-1 bg-green-600 rounded-lg py-2"
              >
                {restoreMutation.isPending ? 'Restoring...' : 'Restore'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
