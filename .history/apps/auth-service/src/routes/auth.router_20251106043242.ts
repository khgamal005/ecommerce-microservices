import express from 'express';
import { userRegistration } from '../controller/auth.controller';

const router: express.Router = express.Router();

// POST /api/register
router.post('/register', userRegistration);

// GET /api/test
router.get('/test', (req, res) => {
  console.log('✅ Auth routes test called');
  res.json({ message: 'Auth routes are working!' });
});

export default router;