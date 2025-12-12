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
    location: string,
    deviceInfo: string
  ) => void;

  removeFromCart: (
    id: string,
    user: any,
    location: string,
    deviceInfo: string
  ) => void;

  decreaseQuantity: (
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
        set((state: StoreState) => {
          const exists = state.cart.find((p) => p.id === product.id);

          const trackingInfo: TrackingInfo = {
            addedAt: new Date(),
            deviceInfo,
            location,
            user,
          };

          if (exists) {
            return {
              cart: state.cart.map((p) =>
                p.id === product.id
                  ? {
                      ...p,
                      quantity: (p.quantity || 1) + 1,
                      trackingInfo, // Update tracking info on each add
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
        set((state) => {
          return {
            cart: state.cart
              .map((product) => {
                if (product.id !== id) return product;

                // Build tracking info on quantity change
                const trackingInfo = {
                  addedAt: product.trackingInfo.addedAt,
                  updatedAt: new Date(),
                  user,
                  location,
                  deviceInfo,
                  change: "decrease",
                };

                // Reduce quantity
                const newQuantity = (product.quantity || 1) - 1;

                // If quantity becomes 0 → remove later (filter handles it)
                if (newQuantity <= 0) {
                  return null;
                }

                return {
                  ...product,
                  quantity: newQuantity,
                  trackingInfo,
                };
              })
              .filter((p) => p !== null), // remove products with 0 qty
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
            user,
          };

          return {
            wishlist: [
              ...state.wishlist,
              {
                ...product,
                trackingInfo,
              },
            ],
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