import express from 'express';
import { createDiscountCode, deleteDiscountCode, getCategories, getDiscountCodes } from '../controller/product.controller';
import { isSeller } from '@packages/middelware/authorizeRole';
import { isAuthenticated } from '@packages/middelware/isAuthenticated';

const router = express.Router();

router.get('/get-categories', isAuthenticated,getCategories);
router.post("/create-discount-code/", isAuthenticated, createDiscountCode);
router.get("/get-discount-codes", isAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isAuthenticated, deleteDiscountCode);


export default router;
