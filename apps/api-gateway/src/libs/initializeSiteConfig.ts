import { PrismaClient } from '@prisma/client';


const prisma =new PrismaClient();
const initializeSiteConfig = async () => {
    try {
       const existingConfig = await prisma.site_config.findFirst();
       if (!existingConfig) {
        await prisma.site_config.create({
            data: {
                categories: [
                    "Electronics",
                    "fashion",
                    "home&kitchen",
                    "sports",
                    "grocery",
        
                ],
                subCategory: {
                    "Electronics": ["mobile", "tablet", "camera", "laptop", "tv", "gaming", "audio", "accessories"],
                    "fashion": ["women", "men", "kids", "beauty", "home", "accessories"],
                    "home&kitchen": ["kitchen", "dining", "bedroom", "living", "kitchen", "bathroom"],
                    "sports": ["cricket", "football", "basketball", "tennis", "gym", "boxing"],
                    "grocery": ["fruits", "vegetables", "dairy", "meat", "bakery", "snacks"],
                }
             
            },
        })
         return;
       }
    } catch (error) {
        console.error('Error creating site config:', error);
    }   
}
export default initializeSiteConfig