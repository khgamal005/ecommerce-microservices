import express from 'express';
import { createDiscountCode, createProduct, deleteDiscountCode, deleteProduct, deleteProductImage, getCategories, getDiscountCodes, getShopProducts, restoreProduct, uploadProductImage } from '../controller/product.controller';
import { isSeller } from '@packages/middelware/authorizeRole';
import { isAuthenticated } from '@packages/middelware/isAuthenticated';

const router = express.Router();

router.get('/get-categories', isAuthenticated,getCategories);
router.post("/create-discount-code/", isAuthenticated, createDiscountCode);
router.get("/get-discount-codes", isAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isAuthenticated, deleteDiscountCode);

router.post('/upload-image',isAuthenticated, uploadProductImage);

router.post('/delete-image',isAuthenticated, deleteProductImage);
router.post('/create-product', isAuthenticated, createProduct);
router.post('/create-product', isAuthenticated, createProduct);
router.get('/shop-products', isAuthenticated, getShopProducts);
router.delete(
  "/delete-product/:productId",
  isAuthenticated,
  deleteProduct
);

// RESTORE
router.patch(
  "/restore-product/:productId",
  isAuthenticated,
  restoreProduct
);


export default router;
