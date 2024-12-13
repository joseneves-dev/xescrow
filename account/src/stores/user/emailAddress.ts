import { defineStore } from "pinia";
import { useCookies } from "@vueuse/integrations/useCookies";

import { usePending } from "./pending";

interface emailAddress {
  email: string;
  verified: boolean;
  verification?: verificationEmailAddress;
}

interface verificationEmailAddress {
  nextRequest?: number;
  expires?: number;
}

export const useEmailAddress = defineStore("emailAddress", () => {
  const email = ref<string>();
  const verified = ref<boolean>();
  const verification = ref<verificationEmailAddress>();

  function set(data: Partial<emailAddress>) {
    const currentDate = ref(new Date());

    email.value = data.email;
    verified.value = data.verified;

    if (data.verification) {
      verification.value = data.verification;
      const verificationDate = new Date(
        currentDate.value.getTime() + data?.verification?.nextRequest * 1000,
      );

      const { set } = useCookies();
      set("emailAddressNextRequest", verificationDate.toString(), {
        domain: import.meta.env.VITE_SUB_DOMAIN,
        path: "/",
      });
    } else {
      verification.value = undefined;
    }

    const pending = usePending();

    if (data.verified === false) {
      pending.updateEmailAddress(true);
    } else {
      pending.updateEmailAddress(false);
    }
  }

  function updateNextRequest(value: number) {
    verification.value = { ...verification.value, nextRequest: value };
    if (value == 0) {
      const { remove } = useCookies();

      remove("emailAddressNextRequest", {
        domain: import.meta.env.VITE_SUB_DOMAIN,
        path: "/",
      });
    }
  }

  function clear() {
    const { remove } = useCookies();

    email.value = undefined;
    verified.value = undefined;
    verification.value = undefined;

    remove("emailAddressNextRequest", {
      domain: import.meta.env.VITE_SUB_DOMAIN,
      path: "/",
    });
  }

  return {
    email,
    verified,
    verification,
    set,
    updateNextRequest,
    clear,
  } as const;
});
