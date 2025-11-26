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
               
