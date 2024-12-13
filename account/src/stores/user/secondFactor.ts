import { defineStore } from "pinia";
import { useCookies } from "@vueuse/integrations/useCookies";

import { emailAddress } from "/@userStores/emailAddress";
import { phoneNumber } from "/@userStores/phoneNumber";
import { app } from "/@userStores/app";

interface secondFactor {
  method: method;
  methods: methods;
  expires: number;
}

interface method {
  type?: string;
  nextRequest?: number;
}

interface methods {
  emailAddress?: emailAddress;
  phoneNumber?: phoneNumber;
  app?: app;
}

export const useSecondFactor = defineStore("secondFactor", () => {
  const method = ref<method | undefined>();
  const methods = ref<methods | undefined>();
  const expires = ref<number | undefined>();

  function set(data: Partial<secondFactor>) {
    const { set } = useCookies();

    const currentDate = ref(new Date());

    if (data.expires > 0) {
      expires.value = data.expires;
      const expiresDate = new Date(
        currentDate.value.getTime() + data.expires * 1000,
      );

      set("secondFactorExpires", expiresDate.toString(), {
        domain: import.meta.env.VITE_SUB_DOMAIN,
        path: "/",
      });
    }

    if (data.method) {
      method.value = data.method as method;
      if (data.method.nextRequest > 0) {
        const nextRequestDate = new Date(
          currentDate.value.getTime() + data.method.nextRequest * 1000,
        );

        set("secondFactorNextRequest", nextRequestDate, {
          domain: import.meta.env.VITE_SUB_DOMAIN,
          path: "/",
        });
      }
    }

    if (data.methods) {
      methods.value = data.methods as methods;
    }
  }

  function updateNextRequest(value: number) {
    method.value = { ...method.value, nextRequest: value };

    if (value == 0) {
      const { remove } = useCookies();

      remove("secondFactorNextRequest", {
        domain: import.meta.env.VITE_SUB_DOMAIN,
        path: "/",
      });
    }
  }

  function updateExpires(value: number) {
    expires.value = value;

    if (value == 0) {
      const { remove } = useCookies();

      remove("secondFactorExpires", {
        domain: import.meta.env.VITE_SUB_DOMAIN,
        path: "/",
      });
    }
  }

  function clear() {
    const { remove } = useCookies();

    method.value = undefined;
    methods.value = undefined;
    expires.value = undefined;

    remove("secondFactorExpires", {
      domain: import.meta.env.VITE_SUB_DOMAIN,
      path: "/",
    });
    remove("secondFactorNextRequest", {
      domain: import.meta.env.VITE_SUB_DOMAIN,
      path: "/",
    });
  }

  return {
    method,
    methods,
    expires,
    set,
    updateNextRequest,
    updateExpires,
    clear,
  } as const;
});
