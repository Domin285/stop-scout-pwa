import type { App } from "vue";
import { useToastStore } from "../stores/toastStore";

export const toastPlugin = {
  install(app: App) {
    app.config.globalProperties.$toast = {
      success(message: string) {
        useToastStore().show("success", message);
      },
      error(message: string) {
        useToastStore().show("error", message);
      },
      info(message: string) {
        useToastStore().show("info", message);
      },
    };
  },
};
