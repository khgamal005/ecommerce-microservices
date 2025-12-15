// import prisma from '@packages/libs/prisma';
// import { timeStamp } from 'console';
// import e from 'express';

// export const updateUserAnalytics = async (event: any) => {
//   try {
//     const existingData = await prisma.userAnalytics.findUnique({
//       where: {
//         userId: event.userId,
//       },
//     });

//     let updatedActions: any = existingData?.action || [];
//     updatedActions.push(event.action);
//     const actionExists = updatedActions.some(
//       (entry: any) =>
//         entry.productId === event.productId && event.action === event.action
//     );
//     if (event.action == 'product_view') {
//       updatedActions.push({
//         productId: event?.productId,
//         shopId: event?.shopId,
//         action: event.action,
//         timeStamp: Date.now(),
//       });
//     } else if (
//       ['add_to_cart', 'add_to_wishlist'].includes(event.action) &&
//       !actionExists
//     ) {
//       updatedActions.push({
//         productId: event?.productId,
//         shopId: event?.shopId,
//         action: event.action,
//         timeStamp: Date.now(),
//       });
//     } else if (event.action == 'remove_from_cart') {
//       updatedActions.filter(
//         (entry: any) =>
//           !(
//             entry.productId === event.productId &&
//             entry.action === 'add_to_cart'
//           )
//       );
//     }
//     if (updatedActions.length > 100) {
//       updatedActions.shift();
//     }
//     const extraFields: Record<string, any> = {};
//     if (event.country) {
//       extraFields.country = event.country;
//     }
//     if (event.city) {
//       extraFields.city = event.city;
//     }
//     if (event.latitude) {
//       extraFields.latitude = event.latitude;
//     }
//     if (event.longitude) {
//       extraFields.longitude = event.longitude;
//     }
//     await prisma.userAnalytics.upsert({
//       where: {
//         userId: event.userId,
//       },
//       update: {
//         lastVisited: Date.now(),
//         actions: updatedActions,
//         ...extraFields,
//       },
//       create: {
//         userId: event.userId,
//         lastVisited: Date.now(),
//         actions: updatedActions,
//         ...extraFields,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

// const updateProductAnalytics = async (event: any) => {
//   try {
//     if(!event.productId){
//       return
//     }   
//     const updatedFields: Record<string, any> = {};
//     if(event.action=='product_view'){
//       updatedFields.views ={
//         increment: 1
//       }
//     }
//     if(event.action=='add_to_cart'){
//       updatedFields.cartAdds = {
//         increment: 1
//       }
//     }
//     if(event.action=='add_to_wishlist'){
//       updatedFields.add_to_wishlist = {
//         increment: 1
//       }
//     }
//     if(event.action=='remove_from_cart'){
//       updatedFields.remove_from_cart = {
//         increment: 1
//       }
//     }
//     if(event.action=='remove_from_wishlist'){
//       updatedFields.remove_from_wishlist = {
//         increment: 1
//       }
//     }
//     if(event.action=='purchase'){
//       updatedFields.purchases = {
//         increment: 1
//       }
//     }
        
//     };
//     }   

//     await prisma.productAnalytics.upsert({
//       where: {
//         productId: event.productId,
//       },
//       update: {
//         lastVisited: Date.now(),
//         ...updatedFields,
//       },
//       create: {
//         productId: event.productId,
//         shopId: event.shopId||null,
//         views: event.actions=='product_view'? 1:0,
//         cartAdds: event.actions=='add_to_cart'? 1:0,
//         wishlistAdds: event.actions=='add_to_wishlist'? 1:0,
//         purchases: event.actions=='purchase'? 1:0,

//         lastVisited: Date.now(),
//       },
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };


import prisma from '@packages/libs/prisma';

export const updateUserAnalytics = async (event: any) => {
  try {
    const existingData = await prisma.userAnalytics.findUnique({
      where: {
        userId: event.userId,
      },
    });

    let updatedActions: any = existingData?.actions || [];
    
    // Create the action entry
    const actionEntry = {
      productId: event?.productId,
      shopId: event?.shopId,
      action: event.action,
      timeStamp: Date.now(),
    };

    // Handle different action types
    if (event.action === 'product_view') {
      updatedActions.push(actionEntry);
    } else if (['add_to_cart', 'add_to_wishlist'].includes(event.action)) {
      // Check if this exact action already exists for the product
      const actionExists = updatedActions.some(
        (entry: any) =>
          entry.productId === event.productId && 
          entry.action === event.action
      );
      if (!actionExists) {
        updatedActions.push(actionEntry);
      }
    } else if (event.action === 'remove_from_cart') {
      // Remove add_to_cart entries for this product
      updatedActions = updatedActions.filter(
        (entry: any) =>
          !(entry.productId === event.productId && entry.action === 'add_to_cart')
      );
    } else if (event.action === 'remove_from_wishlist') {
      // Remove add_to_wishlist entries for this product
      updatedActions = updatedActions.filter(
        (entry: any) =>
          !(entry.productId === event.productId && entry.action === 'add_to_wishlist')
      );
    } else {
      // For other actions like 'purchase'
      updatedActions.push(actionEntry);
    }

    // Keep only the last 100 actions
    if (updatedActions.length > 100) {
      updatedActions = updatedActions.slice(-100);
    }

    // Prepare extra fields
    const extraFields: Record<string, any> = {};
    if (event.country) {
      extraFields.country = event.country;
    }
    if (event.city) {
      extraFields.city = event.city;
    }
    if (event.latitude) {
      extraFields.latitude = event.latitude;
    }
    if (event.longitude) {
      extraFields.longitude = event.longitude;
    }

    await prisma.userAnalytics.upsert({
      where: {
        userId: event.userId,
      },
      update: {
        lastVisited: new Date(),
        actions: updatedActions,
        ...extraFields,
      },
      create: {
        userId: event.userId,
        lastVisited: new Date(),
        actions: updatedActions,
        ...extraFields,
      },
    });
  } catch (error) {
    console.error('Error updating user analytics:', error);
  }
};

export const updateProductAnalytics = async (event: any) => {
  try {
    if (!event.productId) {
      return;
    }

    const updatedFields: Record<string, any> = {};
    
    // Set increment fields based on action
    if (event.action === 'product_view') {
      updatedFields.views = { increment: 1 };
    } else if (event.action === 'add_to_cart') {
      updatedFields.cartAdds = { increment: 1 };
    } else if (event.action === 'add_to_wishlist') {
      updatedFields.wishlistAdds = { increment: 1 };
    } else if (event.action === 'remove_from_cart') {
      updatedFields.removeFromCart = { increment: 1 };
    } else if (event.action === 'remove_from_wishlist') {
      updatedFields.removeFromWishlist = { increment: 1 };
    } else if (event.action === 'purchase') {
      updatedFields.purchases = { increment: 1 };
    }

    // Create the data for upsert
    await prisma.productAnalytics.upsert({
      where: {
        productId: event.productId,
      },
      update: {
        lastVisited: new Date(),
        ...updatedFields,
      },
      create: {
        productId: event.productId,
        shopId: event.shopId || null,
        lastVisited: new Date(),
        // Set initial values based on action
        views: event.action === 'product_view' ? 1 : 0,
        cartAdds: event.action === 'add_to_cart' ? 1 : 0,
        wishlistAdds: event.action === 'add_to_wishlist' ? 1 : 0,
        purchases: event.action === 'purchase' ? 1 : 0,
      },
    });
  } catch (error) {
    console.error('Error updating product analytics:', error);
  }
};