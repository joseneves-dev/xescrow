<script setup lang="ts">
import { useApiAuth } from "../api/apiAuth";

import { useApiAccount } from "/@src/api/apiAccount";

import { useUser } from "/@userStores/user";
import { useSession } from "/@userStores/session";

import { useAppConfigurations } from "/@appStores/appConfigurations";

import { sessionExpiresWorker, sessionExpires } from "../utils/countdown";

const router = useRouter();
const route = useRoute();

const session = useSession();

const appConfigurations = useAppConfigurations();

const api = useApiAccount();

const user = useUser();
if (!user.identity) {
  await api
    .get("user")
    .then((response) => {})
    .catch((error) => {});
}
const apiAuth = useApiAuth();

onBeforeMount(async () => {
  sessionExpires();
});

onBeforeUnmount(async () => {
  if (sessionExpiresWorker) {
    sessionExpiresWorker.terminate();
  }
});

watchEffect(async () => {
  if (session.expires && session.expires <= 60) {
    session.refreshing();
    apiAuth.post("session/refresh").finally(() => {
      sessionExpires();
    });
  }

  if (appConfigurations.statusCode == 200 && !session.loggedIn) {
    router.push({ name: "login" });
  }
  if (
    appConfigurations.statusCode === 401 ||
    appConfigurations.statusCode >= 500
  ) {
    session.logout();
    router.push({ name: "login", query: { redirect: route.fullPath } });
  }
});
</script>
<template>
  <AccountLayout>
    <RouterView />
  </AccountLayout>
</template>
