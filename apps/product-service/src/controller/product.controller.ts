import { NotFoundError, ValidationError } from '@packages/error-handler';
import prisma from '../../../../packages/libs/prisma';
import { NextFunction, Request, Response } from 'express';

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
      return; // ❗ must return or code continues
    }

    const response = await imagekit.upload({
      file: fileName, // base64
      fileName: 'product-image-' + Date.now(),
      folder: '/products/',
    });

    res.status(200).json({
      success: true,
      file_url: response.url,
      fileId: response.fileId,   // FIX: you wrote "fileName" earlier
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

