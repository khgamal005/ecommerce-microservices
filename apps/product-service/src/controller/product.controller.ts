import { NotFoundError, ValidationError } from '@packages/error-handler';
import prisma from '../../../../packages/libs/prisma';
import { NextFunction, Request, Response } from 'express';

export const getCategories = async (
  req: Request,
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
    const {
      public_name,
      discount_type,
      discount_value,
      discount_code,
      sellerId,
    } = req.body;

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
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sellerId } = req.params;

    const codes = await prisma.discount_codes.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(codes);
  } catch (error: any) {
    next(error); // pass error to Express error handler
  }
};


// Update discount code
export const updateDiscountCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { public_name, discount_type, discount_value, discount_code } =
      req.body;

    const updated = await prisma.discount_codes.update({
      where: { id },
      data: { public_name, discount_type, discount_value, discount_code },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
    const sellerId = (req as any).seller.id; // assuming seller info is added to req

    // Find the discount code
    const discountCode = await prisma.discount_codes.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });

    if (!discountCode) {
      return next(new NotFoundError("Discount code not found"));
    }

    if (discountCode.sellerId !== sellerId) {
      return next(
        new ValidationError("Unauthorized to delete this discount code")
      );
    }

    // Delete the discount code
    await prisma.discount_codes.delete({
      where: { id },
    });

    res.json({ message: "Discount code deleted" });
  } catch (error: any) {
    next(error); 
  }
};