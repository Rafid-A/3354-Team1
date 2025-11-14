import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  jwt: localStorage.getItem("jwt") || null,

  login: (userData) => {
    set({
      user: { userId: userData.userId, name: userData.name },
      jwt: userData.jwt,
    });
    localStorage.setItem(
      "user",
      JSON.stringify({ userId: userData.userId, name: userData.name })
    );
    localStorage.setItem("jwt", userData.jwt);
  },

  logout: () => {
    set({ user: null, jwt: null });
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
  },
}));
