// import prisma from '@packages/libs/prisma';
// import crone from 'node-cron';

// crone.schedule('* * * * *', async () => {
//   try {
//     const now = new Date();
//     await prisma.product.deleteMany({
//       where: {
//         isDeleted: true,
//         deletedAt: {
//           lte: now,
//         },
//       },
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

import prisma from '@packages/libs/prisma';
import cron from 'node-cron';
import ImageKit from 'imagekit';

// ⬇️ init imagekit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

cron.schedule('0 * * * *', async () => { // runs every hour
  try {
    const now = new Date();
    const gracePeriodMs = 7 * 24 * 60 * 60 * 1000; // 7 days
    const threshold = new Date(now.getTime() - gracePeriodMs);

    // 1️⃣ Get all soft-deleted products whose grace period passed
    const products = await prisma.product.findMany({
      where: {
        isDeleted: true,
        deletedAt: { lte: threshold },
      },
      include: { images: true }, // fetch their images
    });

    if (products.length === 0) return;

    console.log(`Found ${products.length} products to permanently delete...`);

    // 2️⃣ Delete images from ImageKit
    for (const product of products) {
      for (const image of product.images) {
        try {
          await imagekit.deleteFile(image.file_id);
          console.log(`Deleted image from ImageKit: ${image.file_id}`);
        } catch (err) {
          console.log(`Failed to delete image ${image.file_id}:`, err);
        }
      }
    }

    // 3️⃣ Delete the products from DB
    const deletedProducts = await prisma.product.deleteMany({
      where: {
        id: { in: products.map((p) => p.id) },
      },
    });

    console.log(`Permanently deleted ${deletedProducts.count} products.`);
  } catch (error) {
    console.log(error);
  }
});
