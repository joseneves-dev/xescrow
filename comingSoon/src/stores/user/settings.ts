import { defineStore } from "pinia";
import { useCookies } from "@vueuse/integrations/useCookies";

interface settings {
  language?: string;
  colorSchema?: string;
  timezone?: string;
}

export const useSettings = defineStore("settings", () => {
  const language = ref<string>();
  const colorSchema = ref<string>();
  const timezone = ref<string>();

  function set(data: Partial<settings>) {
    const { set } = useCookies();

    if (data.colorSchema) {
      colorSchema.value = data.colorSchema;

      set("colorSchema", data.colorSchema, {
        domain: import.meta.env.VITE_DOMAIN,
        path: "/",
      });
    }

    if (data.timezone) {
      timezone.value = data.timezone;

      set("timezone", data.timezone, {
        domain: import.meta.env.VITE_DOMAIN,
        path: "/",
      });
    }

    if (data.language) {
      language.value = data.language;

      set("language", data.language, {
        domain: import.meta.env.VITE_DOMAIN,
        path: "/",
      });
    }
  }

  return {
    language,
    colorSchema,
    timezone,
    set,
  } as const;
});
