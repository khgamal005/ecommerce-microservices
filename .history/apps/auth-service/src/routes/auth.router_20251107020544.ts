import express from 'express';
import { userRegistration } from '../controller/auth.controller';

const router: express.Router = express.Router();

// POST /api/register
router.post('/register', userRegistration);

export const verifyUserRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, otp } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !password || !otp) {
      throw new ValidationError("Missing required fields for verification");
    }

    // ✅ 1. Get OTP stored in Redis
    const savedOtp = await redis.get(`otp:${email}`);
    if (!savedOtp) {
      throw new ValidationError("OTP expired or not found");
    }

    // ✅ 2. Compare OTP
    if (savedOtp !== otp) {
      throw new ValidationError("Invalid OTP");
    }

    // ✅ 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 4. Create user in MongoDB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // ✅ 5. Delete OTP after successful verification
    await redis.del(`otp:${email}`);
    await redis.del(`otp_cooldown:${email}`);

    // ✅ 6. Send response
    return res.status(201).json({
      status: "success",
      message: "Account verified successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("❌ Error in verifyUserRegistration:", error);
    next(error);
  }
};



export default router;