import express from 'express';
import { loginUser, resetUserPassword, userForgetPassword, userRegistration, verifyUserRegistration } from '../controller/auth.controller';

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
#swagger.description = 'Reset user password using OTP'
#swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      $email: "khgamal005@gmail.com",
      $otp: "1234",
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


export default router;
