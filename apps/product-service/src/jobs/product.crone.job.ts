import prisma from '@packages/libs/prisma';
import crone from 'node-cron';

crone.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    await prisma.product.deleteMany({
      where: {
        isDeleted: true,
        deletedAt: {
          lte: now,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
});
