import express from 'express';
import { userRegistration } from '../controller/controller.user';

const router: express.Router = express.Router();

router.post('/register', userRegistration);
export default router;
