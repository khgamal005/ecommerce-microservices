import express from 'express';
import { createDiscountCode, getCategories } from '../controller/product.controller';

const router = express.Router();

router.get('/get-categories', getCategories);
router.post("/", createDiscountCode);
// router.get("/:sellerId", getDiscountCodes);
// router.get("/code/:id", getDiscountCodeById);
// router.put("/:id", updateDiscountCode);
// router.delete("/:id", deleteDiscountCode);






export default router;
