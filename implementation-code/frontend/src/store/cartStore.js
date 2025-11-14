import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (product) => {
        const existingItem = get().cartItems.find((item) => item.productId === product.productId);

        if (existingItem) {
          if (existingItem.quantity >= product.stockQuantity) {
            return false;
          }

          set({
            cartItems: get().cartItems.map((item) =>
              item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({
            cartItems: [...get().cartItems, { ...product, quantity: 1 }],
          });
        }

        return true;
      },

      addToCartWithQuantity: (product, quantity) => {
        const existingItem = get().cartItems.find((item) => item.productId === product.productId);
        let newQuantity = quantity;

        if (existingItem) {
          if (existingItem.quantity >= product.stockQuantity) {
            return 0;
          }

          if (existingItem.quantity + quantity > product.stockQuantity) {
            newQuantity = product.stockQuantity - existingItem.quantity;
          }

          set({
            cartItems: get().cartItems.map((item) =>
              item.productId === product.productId
                ? { ...item, quantity: item.quantity + newQuantity }
                : item
            ),
          });

          return newQuantity;
        } else {
          if (quantity > product.stockQuantity) {
            newQuantity = product.stockQuantity;
          }

          set({
            cartItems: [...get().cartItems, { ...product, quantity: newQuantity }],
          });
        }

        return newQuantity;
      },

      removeFromCart: (productId) => {
        set({
          cartItems: get().cartItems.filter((item) => item.productId !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cartItems: get().cartItems.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        });
      },

      getQuantity: (productId) =>
        get().cartItems.find((item) => item.productId === productId)?.quantity,

      clearCart: () => set({ cartItems: [] }),

      totalItems: () => get().cartItems.reduce((acc, item) => acc + item.quantity, 0),

      totalPrice: () => get().cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
    }
  )
);
