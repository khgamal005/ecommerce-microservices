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
  Plus,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, useCallback, useEffect } from 'react';

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

  // Mutations - FIXED: Added onSuccess handlers
  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      setShowDeleteModal(false);
      setSelectedProduct(null);
    },
    onError: (error) => {
      console.error('Delete error:', error);
      // You might want to show an error toast here
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      setShowRestoreModal(false);
      setSelectedProduct(null);
    },
    onError: (error) => {
      console.error('Restore error:', error);
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
              <Link
                href={`/product/${row.original.id}`}
                className="text-blue-400 hover:text-blue-300 hover:underline font-medium cursor-pointer"
              >
                {truncatedTitle}
              </Link>
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
            ${row.original.sale_price?.toFixed(2) || '0.00'}
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
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && selectedProduct?.id === row.original.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                ) : (
                  <Trash size={18} className="text-red-400" />
                )}
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
                disabled={restoreMutation.isPending}
              >
                {restoreMutation.isPending && selectedProduct?.id === row.original.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-green-400" />
                ) : (
                  <RefreshCw size={18} className="text-green-400" />
                )}
                <span className="text-green-400 text-sm">Restore</span>
              </button>
            </div>
          ),
        },
      ];
    }
  }, [imageErrors, activeTab, deleteMutation.isPending, restoreMutation.isPending, selectedProduct]);

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

  const handleDelete = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id);
    }
  };

  const handleRestore = () => {
    if (selectedProduct) {
      restoreMutation.mutate(selectedProduct.id);
    }
  };

  const activeProductsCount = products.filter((p) => !p.isDeleted).length;
  const deletedProductsCount = products.filter((p) => p.isDeleted).length;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="flex flex-col items-center gap-4 text-red-400">
          <AlertCircle className="w-8 h-8" />
          <p>Failed to load products.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={16} />
          <span className="text-white font-medium">Product Management</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {activeTab === 'active' ? 'Active Products' : 'Deleted Products'}
            </h1>
            <p className="text-gray-400 mt-2">
              {activeTab === 'active' 
                ? 'Manage your active product listings' 
                : 'View and restore deleted products'}
            </p>
          </div>
          
          {activeTab === 'active' && (
            <Link
              href="/dashboard/create-product"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-medium transition-all hover:scale-105 shadow-lg"
            >
              <Plus size={20} />
              <span>Create Product</span>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'active' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active ({activeProductsCount})
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'deleted' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('deleted')}
          >
            Deleted ({deletedProductsCount})
          </button>
        </div>
        
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/30 border-b border-gray-700">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left px-6 py-3 text-sm font-semibold text-gray-300 uppercase tracking-wider"
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
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-gray-800/50 rounded-full">
                        <AlertCircle className="w-8 h-8 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-lg">
                          {activeTab === 'active' ? 'No active products found' : 'No deleted products found'}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          {globalFilter ? 'Try adjusting your search' : 
                           activeTab === 'active' ? 'Create your first product' : 'All deleted products will appear here'}
                        </p>
                      </div>
                      {activeTab === 'active' && !globalFilter && (
                        <Link
                          href="/dashboard/create-product"
                          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          Create Product
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr 
                    key={row.id} 
                    className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-900/30 rounded-lg">
                <Trash className="text-red-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Product</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Product will be moved to deleted section
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="text-gray-300">
                Are you sure you want to move "{selectedProduct.title}" to deleted products? You can restore it later.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Move to Deleted'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-green-900/30 rounded-lg">
                <RefreshCw className="text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Restore Product</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Product will be moved back to active products
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="text-gray-300">
                Are you sure you want to restore "{selectedProduct.title}"? It will appear in active products.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
                disabled={restoreMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleRestore}
                disabled={restoreMutation.isPending}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                {restoreMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  'Restore Product'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;