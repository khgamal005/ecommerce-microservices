import express from 'express';
import { userRegistration } from '../controller/auth.controller';

const router: express.Router = express.Router();

// POST /api/register
router.post('/register', userRegistration);





export default router;