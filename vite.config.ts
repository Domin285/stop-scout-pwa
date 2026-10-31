/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",

      manifest: {
        name: "Stop Scout",
        short_name: "StopScout",
        description: "PWA do monitorowania odjazdów ZTM Gdańsk",
        theme_color: "#0f172a",
        background_color: "#f3f4f6",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/ckan\.multimediagdansk\.pl\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "ztm-stops-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            urlPattern: /^https:\/\/ckan2\.multimediagdansk\.pl\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "ztm-departures-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 10,
              },
            },
          },
        ],
      },

      devOptions: {
        enabled: true,
      },
    }),
  ],

  test: {
    environment: "jsdom",
  },
});
