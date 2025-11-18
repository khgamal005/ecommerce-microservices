import express from 'express';
import {
  createShop,
  createStripeConnectLink,
  getSeller,
  getUser,
  loginSeller,
  loginUser,
  logoutUser,
  refreshToken,
  resendRegistrationOtp,
  resetUserPassword,
  sellerRegistration,
  userForgetPassword,
  userRegistration,
  verifySellerRegistration,
  verifyUserForgetPassword,
  verifyUserRegistration,
} from '../controller/auth.controller';
import { isAuthenticated } from '@packages/middelware/isAuthenticated';
import { isSeller, isUser } from '@packages/middelware/authorizeRole';

const router = express.Router();

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
router.post('/register-user', userRegistration);

/*  
#swagger.tags = ['Auth']
#swagger.description = 'Verify user with OTP'
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
  description: "User verified successfully"
}
*/
router.post('/verify-user', verifyUserRegistration);

/*
#swagger.tags = ['Auth']
#swagger.description = 'Login with Email & Password'
#swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      $email: "khgamal005@gmail.com",
      $password: "password123"
    }
}
#swagger.responses[200] = {
  description: "User logged in successfully"
}
*/
router.post('/login-user', loginUser);

/*  
#swagger.tags = ['Auth']
#swagger.description = 'Send OTP for password reset'
#swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      $email: "khgamal005@gmail.com"
    }
}
#swagger.responses[200] = {
  description: "OTP sent to user's email"
}
*/
router.post('/forget-password', userForgetPassword);

/*  
#swagger.tags = ['Auth']
#swagger.description = 'Verify OTP sent for password reset'
#swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      $email: "khgamal005@gmail.com",
      $otp: "1234"
    }
}
#swagger.responses[200] = {
  description: "OTP verified successfully, user can reset password"
}
#swagger.responses[400] = {
  description: "Validation error / OTP invalid"
}
#swagger.responses[404] = {
  description: "User not found"
}
*/
router.post('/verify-forget-password', verifyUserForgetPassword);

/*
#swagger.tags = ['Auth']
#swagger.description = 'Reset user password using OTP'
#swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      $email: "khgamal005@gmail.com",
      $newPassword: "newPassword123"
    }
}
#swagger.responses[200] = {
  description: "Password reset successfully"
}
*/
router.post('/reset-password', resetUserPassword);

/* 
#swagger.tags = ['Auth']
#swagger.description = 'Resend OTP to user's email'
#swagger.parameters['body'] = {
  in: 'body',
  required: true,
  schema: {
    $email: "khgamal005@gmail.com",
    name: "Khaled"
  }
}
#swagger.responses[200] = {
  description: "OTP re-sent successfully"
}
*/
router.post('/resend-otp', resendRegistrationOtp);

/*  
#swagger.tags = ['Auth']
#swagger.description = "Get the currently logged-in user's profile using JWT from cookie or Authorization header"
#swagger.security = [{"bearerAuth": []}]
#swagger.responses[200] = {
  description: "Successfully fetched the logged-in user's profile",
  schema: {
    success: true,
    message: "User profile fetched successfully",
    user: {
      id: "654f13c29a71a8d74b57d8e2",
      name: "Khaled Gamal",
      email: "khgamal005@gmail.com",
      role: "user",
      createdAt: "2025-11-13T00:00:00.000Z"
    }
  }
}
#swagger.responses[401] = {
  description: "Unauthorized — Missing or invalid token",
  schema: {
    message: "Unauthorized: No token provided"
  }
}
*/

router.get('/logged-in-user', isAuthenticated, isUser, getUser);
/*  
#swagger.tags = ['Auth']
#swagger.description = "Refresh access and refresh tokens using the refreshToken cookie"
#swagger.security = [{"bearerAuth": []}]
#swagger.responses[200] = {
  description: "Tokens refreshed successfully",
  schema: {
    message: "Tokens refreshed successfully"
  }
}
#swagger.responses[401] = {
  description: "Unauthorized — No refresh token provided or invalid token",
  schema: {
    message: "Unauthorized: no refresh token"
  }
}
#swagger.responses[403] = {
  description: "Forbidden — Invalid refresh token",
  schema: {
    message: "Forbidden: invalid refresh token"
  }
}
*/
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);

router.post('/register-seller', sellerRegistration);

router.post('/verify-seller', verifySellerRegistration);

router.post('/create-shop', createShop);
router.post('/create-stripe-connect-account', createStripeConnectLink);
router.post('/login-seller', loginSeller);
router.get('/logged-in-seller', isAuthenticated, isSeller, getSeller);

export default router;
