import { defineStore } from "pinia";
import { useCookies } from "@vueuse/integrations/useCookies";

import { useUser } from "./user";
import { useEmailAddress } from "./emailAddress";
import { usePhoneNumber } from "./phoneNumber";
import { useApp } from "./app";
import { useSecondFactor } from "./secondFactor";
import { useNotifications } from "./notifications";
import { usePending } from "./pending";
import { useWarning } from "./warning";

interface session {
  expires: number;
}

export const useSession = defineStore("session", () => {
  const loggedIn = ref<Boolean>(false);
  const expires = ref<number | undefined>(undefined);
  const isRefreshing = ref<Boolean>(false);

  function set(data: Partial<session>) {
    const currentDate = ref(new Date());

    expires.value = data;
    if (data.expires > 0) {
      const secondFactor = useSecondFactor();
      secondFactor.clear();

      loggedIn.value = true;
      const sessionExpires = new Date(
        currentDate.value.getTime() + data.expires * 1000,
      );

      const { set } = useCookies();
      set("sessionExpires", sessionExpires.toString(), {
        domain: import.meta.env.VITE_SUB_DOMAIN,
        path: "/",
      });
    }
  }

  function updateExpires(value: any) {
    expires.value = value;

    const { remove } = useCookies();

    if (value == 0) {
      remove("sessionExpires", {
        domain: import.meta.env.VITE_SUB_DOMAIN,
        path: "/",
      });
    }
    refreshing();
  }

  function refreshing() {
    isRefreshing.value = !isRefreshing.value;
  }

  function clear() {
    const { remove } = useCookies();

    loggedIn.value = false;

    expires.value = undefined;
    remove("sessionExpires", {
      domain: import.meta.env.VITE_SUB_DOMAIN,
      path: "/",
    });
  }

  function logout() {
    const user = useUser();
    const emailAddress = useEmailAddress();
    const phoneNumber = usePhoneNumber();
    const app = useApp();
    const secondFactor = useSecondFactor();
    const notifications = useNotifications();
    const pending = usePending();
    const warning = useWarning();

    clear();
    user.clear();
    emailAddress.clear();
    phoneNumber.clear();
    app.clear();
    secondFactor.clear();
    notifications.clear();
    pending.clear();
    warning.clear();
  }

  return {
    loggedIn,
    expires,
    isRefreshing,
    set,
    updateExpires,
    refreshing,
    logout,
  } as const;
});
