import express from 'express';
import { createDiscountCode, deleteDiscountCode, deleteProductImage, getCategories, getDiscountCodes, uploadProductImage } from '../controller/product.controller';
import { isSeller } from '@packages/middelware/authorizeRole';
import { isAuthenticated } from '@packages/middelware/isAuthenticated';

const router = express.Router();

router.get('/get-categories', isAuthenticated,getCategories);
router.post("/create-discount-code/", isAuthenticated, createDiscountCode);
router.get("/get-discount-codes", isAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isAuthenticated, deleteDiscountCode);

router.post('/upload-image',isAuthenticated, uploadProductImage);

router.post('/delete-image', deleteProductImage);

export default router;
