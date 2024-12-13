<script setup lang="ts">
import { useApiAccount } from "/@src/api/apiAccount";

import { useWallet as useWalletStore } from "/@userStores/wallet";

const router = useRouter();
const route = useRoute();
const api = useApiAccount();
const isLoading = ref(true);

const walletStore = useWalletStore();

const selectedAccountPublicKey = ref<String | undefined>(undefined);

const defaultAccount = ref<String>(walletStore?.defaultAccount);
const accounts = computed(() => {
  if (
    !walletStore?.accounts ||
    Object.keys(walletStore.accounts).length === 0
  ) {
    return {};
  }

  return Object.values(walletStore.accounts).reduce((index, account) => {
    index[account.publicKey] = {
      ...account,
    };
    return index;
  }, {});
});

const selectedAccount = computed(() => {
  let account = {};
  if (selectedAccountPublicKey.value) {
    account = accounts.value[selectedAccountPublicKey.value];
  } else if (defaultAccount) {
    account = accounts.value[defaultAccount.value];
  }
  return account;
});

const setselectedAccount = (publicKey: string) => {
  selectedAccountPublicKey.value = publicKey;
  router.push({
    name: route.name,
    params: {
      ...route.params, // Keep all the existing params (accountId, etc.)
      account: publicKey, // Update just the publicKey
    },
  });
};

await api
  .get("escrow")
  .then((response) => {})
  .catch((error) => {});

onBeforeMount(async () => {
  if (Object.keys(walletStore.accounts).length === 0) {
    router.push({ name: "create-wallet" });
  } else {
    if (!route.params.account) {
      router.push({
        name: "escrow",
        params: { account: walletStore.defaultAccount },
      });
    } else {
      setselectedAccount(route.params.account);
    }

    isLoading.value = false;
  }
});
</script>
<template>
  <VMessage color="primary">
    <div>
      <strong>HM1xPVk5x7C9sBgdBRSZCNQdh4m9RrkXncG9gCAzZttG</strong>
      <br />
      <span
        >This is the only address allowed to handle disputes! Note that only
        disputed transaction can be handle by <strong>HM1..ZttG</strong
        ><br />This pubkey is stored in token account at solana.</span
      >
    </div>
  </VMessage>
  <VMessage color="primary">
    <div>
      <span>
        Don't forget to change to this addess in the dropdown menu and select
        transactions in the submenu.
      </span>
      <br />
      <span
        >Note that you can sign transactions because the secretkey is saved in
        the APP.</span
      >
    </div>
  </VMessage>
  <div class="page-content-inner">
    <VLoader :active="isLoading">
      <div class="account-wrapper">
        <div class="banking-dashboard banking-dashboard-v2">
          <ResumeEscrow
            :accounts="accounts"
            :selectedAccount="selectedAccount"
            @account="setselectedAccount"
          />
          <div class="columns">
            <div class="column">
              <RouterView
                v-slot="{ Component }"
                :accounts="accounts"
                :selectedAccount="selectedAccount"
              >
                <transition name="fade-slow" mode="out-in">
                  <component :is="Component" />
                </transition>
              </RouterView>
            </div>
          </div>
        </div>
      </div>
    </VLoader>
  </div>
</template>
