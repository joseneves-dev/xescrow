<script setup lang="ts">
import { useWallet } from "solana-wallets-vue";

import { useWallet as useWalletStore } from "/@userStores/wallet";

const router = useRouter();
const route = useRoute();
const modal = ref(false);
const prompt = ref(false);
const WalletPublicKey = ref<string>();
const isLoading = ref(true);
const closePrompt = async () => {
  prompt.value = false;
};

const closeModal = async () => {
  modal.value = false;
};

const addPublicKey = async () => {
  prompt.value = false;
  modal.value = true;
};

const Wallet = useWallet();
const walletStore = useWalletStore();

const selectedAccountPublicKey = ref<String | undefined>(undefined);
const selectedPublicKey = ref<String | undefined>(undefined);

const defaultAccount = ref<String>(walletStore?.defaultAccount);
const accounts = computed(() => {
  if (
    !walletStore?.accounts ||
    Object.keys(walletStore.accounts).length === 0
  ) {
    return {};
  }

  return Object.values(walletStore.accounts).reduce((index, account) => {
    const tokenAccounts = Object.entries(account.tokenAccounts).reduce(
      (acc, [key, tokenAccount]) => {
        acc[key] = { ...tokenAccount };
        return acc;
      },
      {},
    );

    index[account.publicKey] = {
      ...account,
      tokenAccounts: tokenAccounts,
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
  if (account) {
    if (!selectedPublicKey.value) {
      if (Object.values(account.tokenAccounts).length == 0) {
        selectedPublicKey.value = account.publicKey;
      } else {
        const tokenAccount = Object.values(account.tokenAccounts)[0];
        selectedPublicKey.value = tokenAccount.publicKey;
      }
    }
  }

  return account;
});

const setselectedAccount = (publicKey: string) => {
  selectedPublicKey.value = undefined;
  selectedAccountPublicKey.value = publicKey;
  router.push({
    name: route.name,
    params: {
      ...route.params, // Keep all the existing params (accountId, etc.)
      account: publicKey, // Update just the publicKey
    },
  });
};

const setSelectedPublicKey = (publicKey: string) => {
  selectedPublicKey.value = publicKey;
  let params = { ...route.params, publicKey: publicKey };
  if (publicKey != selectedAccountPublicKey.value) {
    params = { ...route.params, publicKey: publicKey };
  } else {
    params = { ...route.params, publicKey: undefined };
  }
  router.push({
    name: route.name,
    params,
  });
};

onBeforeMount(async () => {
  if (Object.keys(walletStore.accounts).length === 0) {
    router.push({ name: "create-wallet" });
  } else {
    if (!route.params.account) {
      router.push({
        name: "wallet",
        params: { account: walletStore.defaultAccount },
      });
    } else {
      setselectedAccount(route.params.account);
      if (
        (route.params.publicKey &&
          accounts.value[selectedAccountPublicKey.value].tokenAccounts[
            route.params.publicKey
          ]) ||
        accounts.value[route.params.publicKey]
      ) {
        setSelectedPublicKey(route.params.publicKey);
      } else {
        setSelectedPublicKey(route.params.account);
      }
    }

    isLoading.value = false;
  }
});
watchEffect(() => {
  if (Wallet.publicKey) {
    const pubKey = Wallet.publicKey.value?.toString();
    if (
      Wallet.connected &&
      pubKey != undefined &&
      accounts.value[pubKey] == undefined
    ) {
      prompt.value = true;
      WalletPublicKey.value = pubKey;
    } else {
      prompt.value = false;
      WalletPublicKey.value = undefined;
    }
  }
});
</script>
<template>
  <VMessage color="primary">
    <div>
      <strong>XEscrow US Dollar</strong>
      <br />
      <span
        >To test an escrow transaction select xeUSD(this is a spl-token-2022)
        and transfer in the submenu,
      </span>
    </div>
  </VMessage>
  <div class="page-content-inner">
    <VLoader :active="isLoading">
      <div class="account-wrapper">
        <div class="banking-dashboard banking-dashboard-v2">
          <ResumeWallet
            :accounts="accounts"
            :selectedPublicKey="selectedPublicKey"
            :selectedAccount="selectedAccount"
            @account="setselectedAccount"
            @publicKey="setSelectedPublicKey"
          />
          <div class="columns">
            <div class="column">
              <RouterView
                v-slot="{ Component }"
                :accounts="accounts"
                :selectedPublicKey="selectedPublicKey"
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
      <VModal
        :open="modal"
        size="none"
        actions="center"
        noheader
        nofooter
        noclose
        @close="!modal"
      >
        <template #content>
          <ImportAccount
            :publicKey="Wallet.publicKey.value?.toString()"
            @close="closeModal"
          />
        </template>
      </VModal>
      <VPublicKeyPrompt
        v-if="prompt"
        :publicKey="WalletPublicKey"
        @closePrompt="closePrompt"
        @addPublicKey="addPublicKey"
      />
    </VLoader>
  </div>
</template>
