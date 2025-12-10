import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  location: string;
  user: any;
}

interface CartItem extends Product {
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
    location: string,
    deviceInfo: string
  ) => void;

  removeFromCart: (
    id: string,
    user: any,
    location: string,
    deviceInfo: string
  ) => void;

  clearCart: () => void;

  addToWishlist: (
    product: Product,
    user: any,
    location: string,
    deviceInfo: string
  ) => void;

  removeFromWishlist: (
    id: string,
    user: any,
    location: string,
    deviceInfo: string
  ) => void;

  clearWishlist: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      // --------------------------
      // CART
      // --------------------------
      addToCart: (product, user, location, deviceInfo) =>
        set((state) => {
          const exists = state.cart.find((p) => p.id === product.id);

          const trackingInfo: TrackingInfo = {
            addedAt: new Date(),
            deviceInfo,
            location,
            user
          };

          if (exists) {
            return {
              cart: state.cart.map((p) =>
                p.id === product.id
                  ? { 
                      ...p, 
                      quantity: (p.quantity || 1) + 1,
                      trackingInfo // Update tracking info on each add
                    }
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
                trackingInfo
              }
            ],
          };
        }),

      removeFromCart: (id, user, location, deviceInfo) =>
        set((state) => ({
          cart: state.cart.filter((product) => product.id !== id),
        })),

      clearCart: () => set({ cart: [] }),

      // --------------------------
      // WISHLIST
      // --------------------------
      addToWishlist: (product, user, location, deviceInfo) =>
        set((state) => {
          const exists = state.wishlist.some((p) => p.id === product.id);
          if (exists) return { wishlist: state.wishlist };

          const trackingInfo: TrackingInfo = {
            addedAt: new Date(),
            deviceInfo,
            location,
            user
          };

          return { 
            wishlist: [
              ...state.wishlist, 
              { 
                ...product,
                trackingInfo
              }
            ] 
          };
        }),

      removeFromWishlist: (id, user, location, deviceInfo) =>
        set((state) => ({
          wishlist: state.wishlist.filter((product) => product.id !== id),
        })),

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: 'user-storage',
    }
  )
);