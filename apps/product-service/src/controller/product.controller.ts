import {
  AuthError,
  NotFoundError,
  ValidationError,
} from '@packages/error-handler';
import prisma from '../../../../packages/libs/prisma';
import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';

import { imagekit } from '@packages/libs/imagekit';

export const getCategories = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const config = await prisma.site_config.findFirst();
    if (!config) {
      res.status(400).json({ message: 'No category found' });
      return;
    }

    res.status(200).json({
      categories: config.categories,
      subcategories: config.subCategory,
    });
  } catch (error) {
    next(error);
  }
};

// Create Discount Code
export const createDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { public_name, discount_type, discount_value, discount_code } =
      req.body;

    const isDiscountCodeExist = await prisma.discount_codes.findUnique({
      where: { discount_code },
    });

    if (isDiscountCodeExist) {
      return next(new ValidationError('Discount code already exists'));
    }

    const newDiscount = await prisma.discount_codes.create({
      data: {
        public_name,
        discount_type,
        discount_value: parseFloat(discount_value),
        discount_code,
        sellerId: req.seller.id,
      },
    });

    res.status(201).json({
      success: true,
      newDiscount,
    });
  } catch (error: any) {
    next(error);
  }
};

// Get all discount codes for a seller
export const getDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sellerId } = req.seller.id;

    const codes = await prisma.discount_codes.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(codes);
  } catch (error: any) {
    next(error); // pass error to Express error handler
  }
};

// Delete discount code

// Delete discount code
export const deleteDiscountCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const sellerId = (req as any).seller.id;

    // Find the discount code
    const discountCode = await prisma.discount_codes.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });

    if (!discountCode) {
      return next(new NotFoundError('Discount code not found'));
    }

    if (discountCode.sellerId !== sellerId) {
      return next(
        new ValidationError('Unauthorized to delete this discount code')
      );
    }

    // Delete the discount code
    await prisma.discount_codes.delete({
      where: { id },
    });

    res.json({ message: 'Discount code deleted' });
  } catch (error: any) {
    next(error);
  }
};

export const uploadProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fileName } = req.body; // base64 string

    if (!fileName) {
      res.status(400).json({ message: 'No image received' });
      return;
    }

    const response = await imagekit.upload({
      file: fileName, // base64
      fileName: 'product-image-' + Date.now(),
      folder: '/products/',
    });

    res.status(200).json({
      success: true,
      file_url: response.url,
      fileId: response.fileId, // FIX: you wrote "fileName" earlier
      message: 'Image uploaded successfully',
    });
  } catch (error: any) {
    console.error(error);
    next({ status: 500, message: 'Image upload failed' });
  }
};

export const deleteProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fileId } = req.body;

    if (!fileId) {
      res.status(400).json({ message: 'fileId is required' });
      return;
    }

    const response = await imagekit.deleteFile(fileId);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      response,
    });
  } catch (error: any) {
    console.error(error);
    next({ status: 500, message: 'Image deletion failed' });
  }
};

export interface UploadImage {
  fileId: string;
  file_Url: string;
}

export const createProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    const {
      title,
      short_description,
      detailed_description,
      warranty,
      cashOnDelivery,
      custom_specifications,
      slug,
      tags,
      video_Url,
      brand,
      category,
      subCategory,
      stock,
      colors = [],
      sale_price,
      regular_price,
      discountCodes = [],
      sizes = [],
      images = [],
      customProperties = {},
    } = body;

    // -----------------------------
    // Validate Required Fields
    // -----------------------------
    if (
      !title ||
      !category ||
      !slug ||
      !sale_price ||
      !regular_price ||
      !stock ||
      !images ||
      !short_description ||
      !subCategory
    ) {
      return next(new ValidationError('Missing required fields'));
    }

    if (!req.seller?.id) {
      return next(new AuthError('Seller information is missing'));
    }

    // -----------------------------
    // Check Duplicate Slug
    // -----------------------------
    const slugExists = await prisma.product.findUnique({
      where: { slug },
    });

    if (slugExists) {
      return next(new ValidationError('Product slug already exists'));
    }

    // -----------------------------
    // Validate Images
    // -----------------------------
    const validImages = images.filter(
      (img: any): img is UploadImage => img && img.file_Url && img.fileId
    );

    // -----------------------------
    // CREATE PRODUCT WITH IMAGES
    // -----------------------------
    let product;

    try {
      product = await prisma.product.create({
        data: {
          title,
          short_description,
          detailed_description,
          warranty,
          cashOnDelivery,
          slug,
          tags: Array.isArray(tags)
            ? tags
            : tags.split(',').map((tag: string) => tag.trim()),

          colors,
          category,
          subCategory,
          brand,
          video_Url,
          sale_price: parseFloat(sale_price),
          regular_price: parseFloat(regular_price),
          stock: parseInt(stock),
          sizes,
          discount_codes: discountCodes,
          customProperties,
          custom_specifications,

          starting_date: new Date(),
          ending_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

          shop: {
            connect: { id: req.seller.shop.id },
          },

          images: {
            create: validImages.map((img: UploadImage) => ({
              file_id: img.fileId,
              url: img.file_Url,
            })),
          },
        },
        include: { images: true },
      });
    } catch (err: any) {
      console.error('❌ Prisma createProduct error:', err);

      if (err.code === 'P2002') {
        return res
          .status(400)
          .json({ message: 'Duplicate image file_id detected' });
      }

      return res
        .status(500)
        .json({ message: 'Error while creating product. Try again later.' });
    }

    // -----------------------------
    // SUCCESS RESPONSE
    // -----------------------------
    return res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error: any) {
    console.error('❌ Unexpected createProduct error:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getShopProducts = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: { shopId: req?.seller?.shop?.id },
      include: { images: true },
    });

    // ✅ just send the response without 'return'
    res.status(200).json({
      message: 'Products fetched successfully',
      products,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const sellerId = (req as any).seller?.shop?.id;
    const Product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, shopId: true, isDeleted: true },
    });

    if (!Product) {
      return next(new ValidationError('Product not found'));
    }

    if (Product.isDeleted) {
      return res.status(400).json({ message: 'Product already deleted' });
    }
    if (Product.shopId !== sellerId) {
      return next(new ValidationError('Unauthorized to delete this product'));
    }

    const deletedProduct = await prisma.product.update({
      where: { id: productId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    if (!deletedProduct) {
      return res.status(500).json({ message: 'Failed to delete product' });
    }
    return res.status(200).json({
      message: 'Product deleted successfully',
      deletedProduct,
    });
  } catch (error: any) {
    console.error('❌ Unexpected deleteProduct error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const restoreProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const sellerId = (req as any).seller?.shop?.id;

    const Product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, shopId: true, isDeleted: true },
    });

    if (!Product) {
      return next(new ValidationError('Product not found'));
    }

    if (!Product.isDeleted) {
      return res.status(400).json({ message: 'Product not deleted' });
    }

    if (Product.shopId !== sellerId) {
      return next(new ValidationError('Unauthorized to restore this product'));
    }

    const restoredProduct = await prisma.product.update({
      where: { id: productId },
      data: { isDeleted: false, deletedAt: null },
    });

    return res.status(200).json({
      message: 'Product restored successfully',
      restoredProduct,
    });
  } catch (error: any) {
    console.error('❌ Unexpected restoreProduct error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// export const getAllProducts = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// )=>{
//   try {
//     const page= parseInt(req.query.page as string) || 1;
//     const limit= parseInt(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;
//     const type= req.query.type as string;

//     const baseFilter={
//       OR:[
//         {
//           starting_date: null,
//         },
//         {
//           ending_date: null,
//         }
//       ]
//     };

//     const orderBy=prisma.productsOrderByWithRelationInput=type==="latest"?{
//       createdAt:"desc" as prisma.SortOrder
//     }:{
//       totalSales:"asc" as prisma.SortOrder
//     };
//     }
//     const [products, top10Products, total,]=await promiseHooks.all([
//       prisma.product.findMany({
//         where: {
//           ...baseFilter,
//           orderBy: {
//             totalSales: "asc",
//           },
//         },
//         skip,
//         take: limit,
//         orderBy,
//         include: {
//           images: true,
//           shop: true,
//         },
//       }),

//       }),
//     ]);

//     prisma.product.count({
//       where: {
//         ...baseFilter,
//       },
//     }),
//     prisma.product.findMany({
//       where: baseFilter,
//       orderBy

//       take: 10,

//     }),

//     return res.status(200).json({
//       message: "Products fetched successfully",
//       products,
//       top10By: type==="latest"?"latest":"topSales",
//       top10Products,
//       total,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//     });

//   } catch (error: any) {
//     console.error("❌ Unexpected getAllProducts error:", error);
//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// }

// export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;
//     const type = req.query.type as string;

//     const orderBy: Prisma.ProductOrderByWithRelationInput =
//       type === "latest"
//         ? { createdAt: "desc" }
//         : { rating: "desc" };

//     const [products, total, top10Products] = await Promise.all([
//       prisma.product.findMany({
//         where: { isDeleted: false },
//         skip,
//         take: limit,
//         orderBy,
//         include: { images: true, shop: true },
//       }),

//       prisma.product.count({ where: { isDeleted: false } }),

//       prisma.product.findMany({
//         where: { isDeleted: false },
//         orderBy,
//         take: 10,
//         include: { images: true, shop: true },
//       }),
//     ]);

//     res.status(200).json({
//       message: "Products fetched successfully",
//       products,
//       top10By: type === "latest" ? "latest" : "rating",
//       top10Products,
//       total,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//     });

//   } catch (error: any) {
//     console.error("❌ Unexpected getAllProducts error:", error);
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

export const getAllProducts = async (
  req: Request,
  res: Response,
) => {
  try {
    // 1️⃣ Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // 2️⃣ Sorting type
    const type = req.query.type as string;

    let orderBy: Prisma.ProductOrderByWithRelationInput;
    if (type === 'rating') {
      orderBy = { rating: 'desc' };
    } else {
      // default: latest
      orderBy = { createdAt: 'desc' };
    }

    // 3️⃣ Base filter
    const baseFilter: Prisma.ProductWhereInput = {
      OR: [{ starting_date: null }, { ending_date: null }],
      isDeleted: false,
    };

    // 4️⃣ Run queries in parallel
    const [products, total, top10Products] = await Promise.all([
      prisma.product.findMany({
        where: baseFilter,
        skip,
        take: limit,
        orderBy,
        include: { images: true, shop: true },
      }),

      prisma.product.count({ where: baseFilter }),

      prisma.product.findMany({
        where: baseFilter,
        orderBy,
        take: 10,
        include: { images: true, shop: true },
      }),
    ]);

    // 5️⃣ Response
    res.status(200).json({
      message: 'Products fetched successfully',
      products,
      top10By: type === 'rating' ? 'rating' : 'latest',
      top10Products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('❌ Unexpected getAllProducts error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};


// routes/product.ts (Backend)
export const getProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { slug } = req.params; // Changed from productId to slug

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
    },
  });

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  return res.status(200).json({
    message: 'Product fetched successfully',
    product,
  });
};

// controllers/product.controller.ts

export const getFilteredProducts = async (req: Request, res: Response) => {
  try {
    const {
      priceRange = [0, 10000],
      page = 1,
      limit = 12,
      categories = [],
      colors = [],
      sizes = [],
    } = req.query;

    const parsedPriceRange =
      typeof priceRange === 'string'
        ? priceRange.split(',').map(Number)
        : [0, 10000];

    const parsedPage = typeof page === 'string' ? parseInt(page) : 1;
    const parsedLimit = typeof limit === 'string' ? parseInt(limit) : 12;
    const skip = (parsedPage - 1) * parsedLimit;

const filters: any = {
  sale_price: {
    gte: parsedPriceRange[0],
    lte: parsedPriceRange[1],
  },
  starting_date: null, // ✅ EXCLUDE events
  isDeleted: false,
};

    if (categories && (categories as string[]).length > 0)
      filters.category = {
        in: Array.isArray(categories)
          ? categories
          : String(categories).split(','),
      };

    if (sizes && (sizes as string[]).length > 0)
      filters.sizes = {
        hasSome: Array.isArray(sizes) ? sizes : [sizes],
      };

    if (colors && (colors as string[]).length > 0)
      filters.colors = {
        hasSome: Array.isArray(colors) ? colors : [colors],
      };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        skip,
        take: parsedLimit,
        include: {
          images: true,
          shop: true,
        },
      }),
      prisma.product.count({
        where: filters,
      }),
    ]);

    const totalPages = Math.ceil(total / parsedLimit);

    return res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        limit: parsedLimit,
        page: parsedPage,
        totalPages,
      },
    });
  } catch (error) {
    console.error('getFilteredProducts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch filtered products',
    });
  }
};

export const getFilteredEvents = async (req: Request, res: Response) => {
  try {
    const {
      priceRange = '0,10000',
      page = '1',
      limit = '12',
      categories,
      colors,
      sizes,
    } = req.query;

    const [minPrice, maxPrice] = String(priceRange)
      .split(',')
      .map(Number);

    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    const skip = (parsedPage - 1) * parsedLimit;

    const filters: any = {
      sale_price: {
        gte: minPrice,
        lte: maxPrice,
      },
      starting_date: {
        not: null,
      },
      isDeleted: false,
    };

    if (categories) {
      filters.category = {
        in: String(categories).split(','),
      };
    }

    if (colors) {
      filters.colors = {
        hasSome: String(colors).split(','),
      };
    }

    if (sizes) {
      filters.sizes = {
        hasSome: String(sizes).split(','),
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        skip,
        take: parsedLimit,
        include: {
          images: true,
          shop: true,
        },
      }),
      prisma.product.count({
        where: filters,
      }),
    ]);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    console.error('getFiltered events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filtered events',
    });
  }
};

// export const getFilteredShops = async (req: Request, res: Response) => {
//   try {
//     const { countries = [], page = 1, limit = 12, categories = [] } = req.query;

//     const parsedPage = typeof page === 'string' ? parseInt(page) : 1;
//     const parsedLimit = typeof limit === 'string' ? parseInt(limit) : 12;
//     const skip = (parsedPage - 1) * parsedLimit;

//     const filters: any = {};

//     if (categories && (categories as string[]).length > 0)
//       filters.category = {
//         in: Array.isArray(categories)
//           ? categories
//           : String(categories).split(','),
//       };
//     if (countries && (countries as string[]).length > 0)
//       filters.country = {
//         in: Array.isArray(countries) ? countries : String(countries).split(','),
//       };

//     const [shops, total] = await Promise.all([
//       prisma.shops.findMany({
//         where: {
//           ...filters,
//           isDeleted: false,
//         },
//         skip,
//         take: parsedLimit,
//         include: {
//           followers: true,
//           seller: true,
//           products: true,
//         },
//       }),
//       prisma.shops.count({
//         where: filters,
//       }),
//     ]);
//     const totalPages = Math.ceil(total / parsedLimit);

//     res.status(200).json({
//       success: true,
//       shops,
//       pagination: {
//         total,
//         page: parsedPage,
//         totalPages,
//       },
//     });
//   } catch (error) {
//     console.error('getFiltered shops error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch shops events',
//     });
//   }
// };

export const searchProducts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const query = req.query.q as string;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query',
      });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            short_description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('searchProducts error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to search products',
    });
  }
};

export const topShops = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const topShopsData = await prisma.orders.groupBy({
      by: ['shopId'],
      _sum: {
        total: true,
      },
      orderBy: {
        _sum: {
          total: 'desc', 
        },
      },
      take: 10,
    });

    const shopIds = topShopsData.map((shop) => shop.shopId);

    const topShops = await prisma.shops.findMany({
      where: {
        id: {
          in: shopIds,
        },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        coverBanner: true,
        address: true,
        ratings: true,
        category: true,
        // followers: true, // ⚠️ keep ONLY if exists in Prisma model
      },
    });

    const enrichedShops = topShops.map((shop) => {
      const shopData = topShopsData.find(
        (data) => data.shopId === shop.id
      );

      return {
        ...shop,
        totalOrders: shopData?._sum.total ?? 0,
      };
    });

    const top10Shops = enrichedShops
      .sort((a, b) => b.totalOrders - a.totalOrders)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      top10Shops,
    });
  } catch (error) {
    console.error('topShops error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch top shops',
    });
  }
};




export const getFilteredShops = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 12,
      categories = [],
      countries = [],
      minRating,
    } = req.query;

    const parsedPage = typeof page === "string" ? parseInt(page) : 1;
    const parsedLimit = typeof limit === "string" ? parseInt(limit) : 12;
    const skip = (parsedPage - 1) * parsedLimit;

    const filters: any = {};

    // ✅ Category filter
    if (categories && String(categories).length > 0) {
      filters.category = {
        in: Array.isArray(categories)
          ? categories
          : String(categories).split(","),
      };
    }

    // ✅ Country filter
    if (countries && String(countries).length > 0) {
      filters.country = {
        in: Array.isArray(countries)
          ? countries
          : String(countries).split(","),
      };
    }

    // ✅ Rating filter (optional)
    if (minRating) {
      filters.ratings = {
        gte: Number(minRating),
      };
    }

    const [shops, total] = await Promise.all([
      prisma.shops.findMany({
        where: filters,
        skip,
        take: parsedLimit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          products: {
            select: { id: true },
          },
          followers: {
            select: { id: true },
          },
        },
      }),
      prisma.shops.count({
        where: filters,
      }),
    ]);

    const totalPages = Math.ceil(total / parsedLimit);

    return res.status(200).json({
      success: true,
      shops,
      pagination: {
        total,
        limit: parsedLimit,
        page: parsedPage,
        totalPages,
      },
    });
  } catch (error) {
    console.error("getFilteredShops error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shops",
    });
  }
};



export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // 1️⃣ Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const now = new Date();

    // 2️⃣ Query events
    const [events, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          isDeleted: false,
          status: 'active',
          starting_date: { not: null },
          ending_date: { not: null },
          // Optional: only active/ongoing events
          // ending_date: { gte: now },
        },
        orderBy: {
          starting_date: 'asc',
        },
        skip,
        take: limit,
        include: {
          images: true,
          shop: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      }),

      prisma.product.count({
        where: {
          isDeleted: false,
          status: 'active',
          starting_date: { not: null },
          // ending_date: { not: null },
        },
      }),
    ]);

    // 3️⃣ Pagination info
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('getAllEvents error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
    });
  }
};

