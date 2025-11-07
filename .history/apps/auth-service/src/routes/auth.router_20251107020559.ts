import express from 'express';
import { userRegistration } from '../controller/auth.controller';

const router: express.Router = express.Router();

// POST /api/register
router.post('/register', userRegistration);

router.post('/verify', verifyUserRegistration);




export default router;