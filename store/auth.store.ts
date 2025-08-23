import { create } from "zustand";
import { getCurrentUser } from "@/lib/appwrite";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: any) => void;
  setIsLoading: (value: boolean) => void;
  fetchAuthenticatedUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => {
    console.log("Setting user in store:", user); // Add this debug log
    set({ user });
  },
  setIsLoading: (value) => set({ isLoading: value }),
  fetchAuthenticatedUser: async () => {
    try {
      const user = await getCurrentUser();
      console.log("Fetched user:", user); // Add this debug log
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.log("Error fetching user:", error); // Add this debug log
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

export default useAuthStore;