<script setup lang="ts">
import { useWallet, WalletIcon } from "solana-wallets-vue";
import { WalletDisconnectedError } from "@solana/wallet-adapter-base";

import sleep from "/@src/utils/sleep";

const props = defineProps({
  accounts: {
    type: Object,
    default: null,
  },
  selectedAccount: {
    type: Object,
    default: null,
  },
});

const emits = defineEmits(["account", "publicKey"]);

const isLoading = ref<Boolean>(true);

const modal = ref(false);
const active = ref<string | undefined>();
const dropdown = ref(false);
const target = ref(null);
const copied = ref<boolean>(false);

const accounts = ref<Object>(props.accounts);
const toggleDropdown = () => {
  dropdown.value = !dropdown.value;
};

onClickOutside(target, () => (dropdown.value = false));

const closeModal = async () => {
  modal.value = false;
  active.value = undefined;
};

const { t } = useI18n();
const route = useRoute();

const Wallet = useWallet();
const WalletConnected = ref(Wallet.connected);
const WalletPublicKey = ref(Wallet.publicKey.value?.toString());

const accountTitle = ref<String>("");

const setSelectedAccountPublicKey = (publicKey: string) => {
  emits("account", publicKey);
};

const connectedWallet = async (value: string) => {
  if (!props.accounts[value]) {
    WalletPublicKey.value = value;
    active.value = "import";
  } else {
    modal.value = false;
    active.value = undefined;
  }
};

const copyPublicKey = async () => {
  await navigator.clipboard.writeText(props.selectedAccount.publicKey);
  copied.value = true;
  await sleep(2000);
  copied.value = false;
};

const disconnectWallet = async (event: MouseEvent) => {
  if (event.defaultPrevented) return;
  try {
    await Wallet.disconnect();
    toggleDropdown();
  } catch (error) {
    if (error instanceof WalletDisconnectedError) {
      // Handle user rejection here, such as displaying a message to the user
      console.log(
        "Handle user rejection here, such as displaying a message to the user",
      );
    } else {
      await disconnectWallet(event);
    }
  }
};

watch(Wallet.connected, (connected) => {
  WalletConnected.value = connected;
});

watchEffect(() => {
  if (props.selectedAccount) {
    const shortPublicKey = `${props.selectedAccount.publicKey.substr(0, 10)}...${props.selectedAccount.publicKey.substr(-15)}`;
    const rename = props.selectedAccount?.rename
      ? ` | ${props.selectedAccount?.rename}`
      : "";
    accountTitle.value = shortPublicKey + rename;
  }

  if (props.accounts) {
    accounts.value = props.accounts;
  }

  if (Wallet.publicKey) {
    WalletPublicKey.value = Wallet.publicKey.value?.toString();
  }
});

onBeforeMount(async () => {
  if (props.accounts != null) {
    isLoading.value = false;
  }
});
</script>
<template>
  <div>
    <VLoader :active="isLoading">
      <div class="dashboard-card is-card-panel">
        <div class="dashboard-header columns is-centered is-vcentered">
          <div class="column is-narrow">
            <div class="copie" v-if="!copied" @click="copyPublicKey()">
              <VIcon icon="lucide:copy" />
            </div>
            <VIcon v-else icon="lucide:square-check-big" />
          </div>
          <div
            v-if="Object.keys(accounts).length == 1"
            class="column is-narrow"
          >
            <VField>
              <VControl>
                <VInput type="text" v-model="accountTitle" />
              </VControl>
            </VField>
          </div>
          <div v-else class="column is-narrow">
            <VDropdown class="wallet-dropdown" :title="accountTitle" modern>
              <template #content="{ toggle }">
                <div v-for="account in accounts">
                  <div
                    v-if="
                      account.publicKey !== props.selectedAccount?.publicKey
                    "
                    @click="
                      toggle();
                      setSelectedAccountPublicKey(account.publicKey);
                    "
                    class="dropdown-item"
                  >
                    <div class="item-row">
                      <wallet-icon
                        v-if="
                          WalletConnected &&
                          WalletPublicKey == account.publicKey
                        "
                        :wallet="Wallet.wallet"
                        class="wallet-icon"
                      />
                      {{ account.publicKey.substr(0, 10) }}...{{
                        account.publicKey.substr(-15)
                      }}
                      {{ account?.rename ? " | " + account.rename : "" }}
                    </div>
                  </div>
                </div>
              </template>
            </VDropdown>
          </div>
          <div v-if="WalletConnected" class="column is-narrow">
            <div
              ref="target"
              class="dropdown action-wallet-dropdown"
              :class="dropdown ? 'is-active' : ''"
            >
              <VButton
                class="dropdown-trigger is-flex"
                @click.prevent="toggleDropdown"
                color="primary"
              >
                <wallet-icon :wallet="Wallet.wallet" class="wallet-icon" />
                <span class="status">
                  {{ t("pages.wallet.resume.connected") }}
                </span>
              </VButton>
              <div class="dropdown-menu">
                <div class="dropdown-content">
                  <a
                    v-if="!accounts[WalletPublicKey]"
                    href="#"
                    role="button"
                    class="dropdown-item"
                    @click="(modal = true), (active = 'import')"
                  >
                    <span>{{ t("action.wallet.import") }}</span>
                  </a>
                  <a
                    href="#"
                    role="button"
                    class="dropdown-item"
                    @click="(modal = true), (active = 'connect')"
                  >
                    <span>{{ t("action.wallet.change") }}</span>
                  </a>
                  <a
                    href="#"
                    role="button"
                    class="dropdown-item"
                    @click="disconnectWallet($event)"
                  >
                    <span>{{ t("action.wallet.disconnect") }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="column is-narrow">
            <div
              ref="target"
              class="dropdown action-wallet-dropdown"
              :class="dropdown ? 'is-active' : ''"
            >
              <VButton class="dropdown-trigger" @click.prevent="toggleDropdown">
                <VIcon icon="lucide:unplug" />
                <span class="ml-2">
                  {{ t("pages.wallet.resume.disconnected") }}
                </span>
              </VButton>
              <div class="dropdown-menu">
                <div class="dropdown-content">
                  <a
                    href="#"
                    role="button"
                    class="dropdown-item"
                    @click="(modal = true), (active = 'connect')"
                  >
                    <span> {{ t("action.wallet.connect") }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dashboard-body columns is-gapless is-centered is-vcentered">
          <div class="column is-12">
            <VButtons class="is-justify-content-center">
              <VButton
                :to="
                  route.name !== 'transactions-escrow'
                    ? {
                        name: 'transactions-escrow',
                        params: {
                          account: selectedAccount.publicKey,
                        },
                      }
                    : { name: 'escrow', params: { ...route.params } }
                "
                color="primary"
                :raised="route.name == 'transactions-escrow' ? true : false"
                :outlined="route.name == 'transactions-escrow' ? false : true"
                bold
              >
                <span class="menu">{{ t("walletMenu.transactions") }}</span>
              </VButton>
              <VButton
                :to="
                  route.name !== 'settings-escrow'
                    ? { name: 'settings-escrow' }
                    : { name: 'escrow', params: { ...route.params } }
                "
                color="primary"
                :raised="route.name == 'settings-escrow' ? true : false"
                :outlined="route.name == 'settings-escrow' ? false : true"
                bold
              >
                <span class="menu">{{ t("walletMenu.settings") }}</span>
              </VButton>
              <VButton
                :to="
                  route.name !== 'manage-escrow'
                    ? { name: 'manage-escrow' }
                    : { name: 'escrow', params: { ...route.params } }
                "
                color="primary"
                :raised="route.name == 'manage-escrow' ? true : false"
                :outlined="route.name == 'manage-escrow' ? false : true"
                bold
              >
                <span class="menu">{{ t("walletMenu.manage") }}</span>
              </VButton>
            </VButtons>
          </div>
        </div>
      </div>
    </VLoader>
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
        <ConnectWallet
          v-if="active == 'connect'"
          @close="closeModal"
          @connected="connectedWallet"
        />
        <ImportAccount
          v-if="active == 'import'"
          :publicKey="WalletPublicKey"
          @close="closeModal"
        />
      </template>
    </VModal>
  </div>
</template>
<style lang="scss" scoped>
.menu {
  text-transform: uppercase;
}
</style>
