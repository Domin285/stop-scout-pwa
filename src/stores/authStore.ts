import { defineStore } from "pinia";
import bcrypt from "bcryptjs";
import { db, type User } from "../services/db";

interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    currentUser: null,
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.currentUser,
  },

  actions: {
    async register(email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const existingUser = await db.users
          .where("email")
          .equals(email)
          .first();

        if (existingUser) {
          throw new Error("Użytkownik z takim e-mailem już istnieje.");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const id = await db.users.add({
          email,
          passwordHash,
          createdAt: new Date().toISOString(),
        });

        this.currentUser = {
          id,
          email,
          passwordHash,
          createdAt: new Date().toISOString(),
        };

        sessionStorage.setItem("currentUserId", String(id));
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Błąd rejestracji.";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const user = await db.users.where("email").equals(email).first();

        if (!user) {
          throw new Error("Nieprawidłowy e-mail lub hasło.");
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.passwordHash,
        );

        if (!isPasswordValid) {
          throw new Error("Nieprawidłowy e-mail lub hasło.");
        }

        this.currentUser = user;

        sessionStorage.setItem("currentUserId", String(user.id));
      } catch (error) {
        this.error = error instanceof Error ? error.message : "Błąd logowania.";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.currentUser = null;
      sessionStorage.removeItem("currentUserId");
    },

    async loadUserFromSession() {
      const userId = sessionStorage.getItem("currentUserId");

      if (!userId) return;

      const user = await db.users.get(Number(userId));

      if (user) {
        this.currentUser = user;
      }
    },
  },
});
