import express from 'express';
import { createDiscountCode, createProduct, deleteDiscountCode, deleteProduct, deleteProductImage, getAllProducts, getCategories, getDiscountCodes, getFilteredEvents, getFilteredProducts, getFilteredShops, getProductDetails, getShopProducts, restoreProduct, searchProducts, topShops, uploadProductImage } from '../controller/product.controller';
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
router.get("/get-all-products", getAllProducts);
router.get('/get-product/:slug', getProductDetails); 
router.get('/get-filtered-products', getFilteredProducts);
router.get('/get-filtered-offers', getFilteredEvents);
router.get('/get-filtered-shops', getFilteredShops);
router.get('/search-products', searchProducts);
router.get('/top-shops', topShops);





export default router;
