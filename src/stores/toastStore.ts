import { defineStore } from "pinia";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

export const useToastStore = defineStore("toast", {
  state: () => ({
    toasts: [] as Toast[],
  }),

  actions: {
    show(type: ToastType, message: string) {
      const id = Date.now();

      this.toasts.push({ id, type, message });

      setTimeout(() => {
        this.toasts = this.toasts.filter((toast) => toast.id !== id);
      }, 3000);
    },
  },
});
