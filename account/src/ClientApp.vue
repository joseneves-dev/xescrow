<script setup lang="ts">
import { useAppNotification } from "/@appStores/appNotification";

import { useSettings } from "/@userStores/settings";

import { useCookies } from "@vueuse/integrations/useCookies";

const notyf = useNotyf();
const { t } = useI18n();
const { get } = useCookies();

const appNotification = useAppNotification();

const settings = useSettings();

watchEffect(() => {
  if (get("language")) {
    settings.set({ language: get("language") });
  }
  if (get("colorSchema")) {
    settings.set({ colorSchema: get("colorSchema") });
  }

  if (appNotification.type && appNotification.message) {
    if (appNotification.type == "error") {
      notyf.error(t(appNotification.message));
    }
    if (appNotification.type == "success") {
      notyf.success(t(appNotification.message));
    }
    appNotification.clear();
  }
});

useHead(() => ({
  title: "Xescrow - P2P transactions",
  link: [
    {
      rel: "icon",
      href: "/favicon.svg",
      type: "image/svg+xml",
    },
    {
      rel: "alternate icon",
      href: "/favicon.ico",
      type: "image/x-icon",
      sizes: "16x16",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      type: "image/png",
      sizes: "180x180",
    },
    {
      rel: "mask-icon",
      href: "/favicon.svg",
      type: "image/svg+xml",
      color: "#FFFFFF",
    },
  ],
  meta: [
    // Critical Tags
    { charset: "utf-8" },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, shrink-to-fit=no",
    },
    // PWA theme color
    {
      name: "theme-color",
      content: "#ffffff",
    },
    {
      name: "msapplication-TileColor",
      content: "#232326",
    },
    // SEO
    {
      name: "robots",
      content: "index,follow,max-image-preview:large",
    },
    {
      name: "description",
      content: "P2P safe transactions.",
    },
    // Open Graph
    {
      property: "og:site_name",
      content: "Xescrow",
    },
    {
      property: "og:locale",
      content: "en_US",
    },
    {
      property: "og:type",
      content: "article",
    },
    {
      property: "og:url",
      content: "https://Xescrow.app/",
    },
    {
      property: "og:image:type",
      content: "image/png",
    },
    {
      property: "og:image:width",
      content: "1200",
    },
    {
      property: "og:image:height",
      content: "630",
    },
    // Twitter
    {
      name: "twitter:site",
      content: "@Xescrow",
    },
  ],
  htmlAttrs: {
    lang: settings.language,
    dir: "ltr",
  },
}));
</script>
<template>
  <Suspense>
    <RouterView v-slot="{ Component }">
      <Transition name="fade-slow" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </Suspense>
</template>
