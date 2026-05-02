import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  user_id: number;
  email: string;
  name:string
};

type authStore = {
  user: User | null;
  type: string | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (
    user: User | null,
    token: string | null,
    usertype: string | null,
  ) => void;
  logOut: () => void;
  getAccessToken: () => string | null;
};


export const useAuthStore = create<authStore>()(
  persist(
    (set,get) => ({
      user: null,
      type: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token, type) => {
        set({ user, isAuthenticated: true, type: type, token: token });
      },
      logOut: () => {
        toast.success("User logged out successfully.");
        set({ user: null, isAuthenticated: false, type: null, token: null });
      },
      getAccessToken: () => get().token,
    }),
    {
      name: "auth-value-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        type: state.type,
        token: state.token,
      }),
    },
  ),
);
