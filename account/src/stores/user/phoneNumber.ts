import { defineStore } from "pinia";
import { useCookies } from "@vueuse/integrations/useCookies";

import { usePending } from "./pending";
import { useWarning } from "./warning";

interface phoneNumber {
  number: number;
  country: country;
  verified: boolean;
  verification?: verificationPhoneNumberNumber;
  remove?: removePhoneNumberNumber;
}

interface country {
  name: string;
  code: string;
}

interface verificationPhoneNumberNumber {
  nextRequest?: number;
  expires?: number;
}

interface removePhoneNumberNumber {
  nextRequest?: number;
  expires?: number;
}

export const usePhoneNumber = defineStore("phoneNumber", () => {
  const number = ref<number>();
  const country = ref<country>();
  const verified = ref<boolean>();
  const verification = ref<verificationPhoneNumberNumber>();
  const remove = ref<removePhoneNumberNumber>();

  function set(data: Partial<phoneNumber>) {
    const { set } = useCookies();

    const currentDate = ref(new Date());
    const warning = useWarning();
    const pending = usePending();

    number.value = data.number;
    country.value = data.country;
    verified.value = data.verified;

    if (data.verification && data.verification.nextRequest > 0) {
      verification.value = data.verification;

      const nextRequest = new Date(
        currentDate.value.getTime() + data.verification.nextRequest * 1000,
      );

      set("phoneNumberNextRequest", nextRequest.toString(), {
        domain: import.meta.env.VITE_SUB_DOMAIN,
        path: "/",
      });
    }

    if (data.remove && data.remove.nextRequest > 0) {
      remove.value = data.remove;

      const nextRequest = new Date(
        currentDate.value.getTime() + data.remove.nextRequest * 1000,
      );

      set("phoneNumberNextRequest", nextRequest.toString(), {
        domain: import.meta.env.VITE_SUB_DOMAIN,
        path: "/",
      });
    }

    if (data.verified === false) {
      pending.updatePhoneNumber(true);
    } else {
      pending.updatePhoneNumber(false);
    }

    if (data.phone) {
      if (warning.phoneNumber) {
        warning.updatePhoneNumber(false);
      }
    } else {
      warning.updatePhoneNumber(true);
    }
  }

  function updateNextRequest(value: number) {
    if (verification) {
      verification.value = { ...verification.value, nextRequest: value };

      if (value == 0) {
        const cookies = useCookies();
        cookies.remove("phoneNumberNextRequest", {
          domain: import.meta.env.VITE_SUB_DOMAIN,
          path: "/",
        });
      }
    }

    if (remove) {
      remove.value = { ...remove.value, nextRequest: value };

      if (value == 0) {
        const cookies = useCookies();
        cookies.remove("phoneNumberNextRequest", {
          domain: import.meta.env.VITE_SUB_DOMAIN,
          path: "/",
        });
      }
    }
  }

  function clear() {
    const cookies = useCookies();

    number.value = undefined;
    country.value = undefined;
    verified.value = undefined;
    verification.value = undefined;
    remove.value = undefined;
    cookies.remove("phoneNumberNextRequest", {
      domain: import.meta.env.VITE_SUB_DOMAIN,
      path: "/",
    });
  }

  return {
    number,
    country,
    verified,
    verification,
    remove,
    set,
    updateNextRequest,
    clear,
  } as const;
});
