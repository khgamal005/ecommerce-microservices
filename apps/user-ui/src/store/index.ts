import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sendKafkaEvent } from '../actions/track.user';
import { CartProduct, CleanLocationInfo } from '../types/Product';

// --------------------------
// TYPES
// --------------------------
interface Product {
  id: string;
  title: string;
  stock: number;
  regular_price: number;
  sale_price: number;
  rating: number;
  colors: string[];
  images: string;
  shopId: string;
  quantity?: number;
}

interface TrackingInfo {
  addedAt: Date;
  deviceInfo: string;
  location:CleanLocationInfo ;
  user: any;
}





interface StoreState {
  cart: CartProduct[];
  wishlist: CartProduct[];

  addToCart: (
    product: CartProduct,
    user: any,
  location:CleanLocationInfo ,
    deviceInfo: string
  ) => void;
  removeFromCart: (
    id: string,
    user: any,
  location: CleanLocationInfo,
    deviceInfo: string
  ) => void;
  decreaseQuantity: (
    id: string,
    user: any,
  location:CleanLocationInfo,
    deviceInfo: string
  ) => void;
  clearCart: (user?: any) => void;

  addToWishlist: (
    product: CartProduct,
    user: any,
  location: CleanLocationInfo,
    deviceInfo: string
  ) => void;
  removeFromWishlist: (
    id: string,
    user: any,
  location: CleanLocationInfo,
    deviceInfo: string
  ) => void;
  clearWishlist: () => void;
}

// --------------------------
// STORE
// --------------------------
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      // --------------------------
      // CART
      // --------------------------

addToCart: (
  product: CartProduct,
  user,
  location: CleanLocationInfo,
  deviceInfo: string
) =>
  set((state) => {
    const exists = state.cart.find((p) => p.id === product.id);

    const trackingInfo: TrackingInfo = {
      addedAt: new Date(),
      deviceInfo,
      location,
      user,
    };

    // Kafka event
    if (location && deviceInfo) {
      sendKafkaEvent({
        userId: user?.id || 'guest',
        productId: product.id,
        action: 'add_to_cart',
        shopId: product.shopId,
        country: location.country,
        city: location.city,
        device: deviceInfo,
      });
    }

    if (exists) {
      return {
        cart: state.cart.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        ),
      };
    }

    return {
      cart: [
        ...state.cart,
        {
          ...product,
          trackingInfo,
        },
      ],
    };
  }),


      decreaseQuantity: (id, user, location, deviceInfo) =>
        set((state) => ({
          cart: state.cart
            .map((product) => {
              if (product.id !== id) return product;

              const newQuantity = product.quantity - 1;

              if (newQuantity <= 0) return null;

              // // Kafka: decrease quantity
              // if (location && deviceInfo) {
              //   sendKafkaEvent({
              //     userId: user?.id || 'guest',
              //     productId: product.id,
              //     action: 'decrease_cart_quantity',
              //     shopId: product.shopId,
              //     country: user?.country || 'unknown',
              //     city: location || 'unknown',
              //     device: deviceInfo || 'unknown',
              //   });
              // }

              return {
                ...product,
                quantity: newQuantity,
                trackingInfo: {
                  ...product,
                  user,
                  location,
                  deviceInfo,
                },
              };
            })
            .filter(Boolean) as CartProduct[],
        })),

      removeFromCart: (id, user, location, deviceInfo) =>
        set((state) => {
          const removed = state.cart.find((p) => p.id === id);

          if (removed && location && deviceInfo) {
            sendKafkaEvent({
              userId: user?.id || 'guest',
              productId: removed.id,
              action: 'remove_from_cart',
              shopId: removed.shopId,
              country: location?.country || 'unknown',
              city: location.city || 'unknown',
              device: deviceInfo || 'unknown',
            });
          }

          return {
            cart: state.cart.filter((p) => p.id !== id),
          };
        }),

      clearCart: () => {
        set({ cart: [] });
      },

      // --------------------------
      // WISHLIST
      // --------------------------
      addToWishlist: (product, user, location, deviceInfo) =>
        set((state) => {
          if (state.wishlist.some((p) => p.id === product.id)) {
            return { wishlist: state.wishlist };
          }

          const trackingInfo: TrackingInfo = {
            addedAt: new Date(),
            deviceInfo,
            location,
            user,
          };

          // Kafka: add to wishlist
          if (location && deviceInfo) {
            sendKafkaEvent({
              userId: user?.id || 'guest',
              productId: product.id,
              action: 'add_to_wishlist',
              shopId: product.shopId,
              country: location?.country || 'unknown',
              city: location.city || 'unknown',
              device: deviceInfo || 'unknown',
            });
          }

          return {
            wishlist: [...state.wishlist, { ...product, trackingInfo }],
          };
        }),

      removeFromWishlist: (id, user, location, deviceInfo) =>
        set((state) => {
          const removedProduct = state.wishlist.find((p) => p.id === id);

          if (removedProduct && location && deviceInfo) {
            sendKafkaEvent({
              userId: user?.id || 'guest',
              productId: removedProduct.id,
              action: 'remove_from_wishlist',
              shopId: removedProduct.shopId,
              country: location?.country || 'unknown',
              city: location.city || 'unknown',
              device: deviceInfo || 'unknown',
            });
          }

          return {
            wishlist: state.wishlist.filter((p) => p.id !== id),
          };
        }),

      clearWishlist: () => set({ wishlist: [] }),
    }),
    { name: 'user-storage' }
  )
);
