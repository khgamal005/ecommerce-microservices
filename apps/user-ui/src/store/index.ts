import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sendKafkaEvent } from '../actions/track.user';

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
  location: { country: string; city: string };
  user: any;
}

interface CartItem extends Product {
  slug: string;
  category: string;
  brand: any;
  warranty: any;
  sizes: boolean;
  quantity: number;
  trackingInfo: TrackingInfo;
}

interface WishlistItem extends Product {
  trackingInfo: TrackingInfo;
}

interface StoreState {
  cart: CartItem[];
  wishlist: WishlistItem[];

  addToCart: (
    product: Product,
    user: any,
  location: { country: string; city: string },
    deviceInfo: string
  ) => void;
  removeFromCart: (
    id: string,
    user: any,
  location: { country: string; city: string },
    deviceInfo: string
  ) => void;
  decreaseQuantity: (
    id: string,
    user: any,
  location: { country: string; city: string },
    deviceInfo: string
  ) => void;
  clearCart: (user?: any) => void;

  addToWishlist: (
    product: Product,
    user: any,
  location: { country: string; city: string },
    deviceInfo: string
  ) => void;
  removeFromWishlist: (
    id: string,
    user: any,
  location: { country: string; city: string },
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
addToCart: (product: Product, user: any, location: { country: string; city: string }, deviceInfo: string) =>
    set((state) => {
      const exists = state.cart.find((p) => p.id === product.id);

      const trackingInfo: TrackingInfo = {
        addedAt: new Date(),
        deviceInfo,
        location,  // Now matches the expected type
        user,
      };

      // Kafka: add to cart
      if (location && deviceInfo) {
        sendKafkaEvent({
          userId: user?.id || 'guest',
          productId: product.id,
          action: 'add_to_cart',
          shopId: product.shopId,
          country: location.country || 'unknown',
          city: location.city || 'unknown',
          device: deviceInfo || 'unknown',
        });
      }

          if (exists) {
            return {
              cart: state.cart.map((p) =>
                p.id === product.id
                  ? { ...p, quantity: p.quantity + 1, trackingInfo }
                  : p
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                ...product,
                quantity: 1,
                slug: '',
                category: '',
                brand: null,
                warranty: null,
                sizes: false,
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
                  ...product.trackingInfo,
                  user,
                  location,
                  deviceInfo,
                },
              };
            })
            .filter(Boolean) as CartItem[],
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
