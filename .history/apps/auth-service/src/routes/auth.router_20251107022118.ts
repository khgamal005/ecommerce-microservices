import express from 'express';
import { userRegistration, verifyUserRegistration } from '../controller/auth.controller';

const router: express.Router = express.Router();

// POST /api/register
/*  
#swagger.tags = ['Auth']
#swagger.description = 'Register a new user'
#swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      $name: "khaled",
      $email: "khgamal005@gmail.com",
      $password: "password123"
    }
}
#swagger.responses[201] = {
  description: "OTP sent to user email"
}
*/
router.post('/register', userRegistration);


/*
#swagger.tags = ['Auth']
#swagger.description = 'Verify account using OTP'
#swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      $name: "khaled",
      $email: "khgamal005@gmail.com",
      $password: "password123",
      $otp: "1234"
    }
}
#swagger.responses[201] = {
  description: "Account verified successfully"
}
*/

router.post('/verify', verifyUserRegistration);




export default router;