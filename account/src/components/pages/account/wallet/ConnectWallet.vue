<script setup lang="ts">
import { useWallet, WalletIcon } from "solana-wallets-vue";
import {
  WalletReadyState,
  WalletConnectionError,
  WalletNotReadyError,
  Adapter,
} from "@solana/wallet-adapter-base";

const { t } = useI18n();

type Wallet = {
  adapter: Adapter;
  readyState: WalletReadyState;
};

const router = useRouter();

const emits = defineEmits(["close", "connected"]);

const selectedWalletName = ref();
const setWalletName = async (name: string) => {
  connectWallet(name);
  selectedWalletName.value = name;
};

const { wallets, select, publicKey, connect, connected } = useWallet();

const orderedWallets = computed(() => {
  const installed: Wallet[] = [];
  const notDetected: Wallet[] = [];
  const loadable: Wallet[] = [];

  wallets.value.forEach((wallet) => {
    if (wallet.readyState === WalletReadyState.NotDetected) {
      notDetected.push(wallet);
    } else if (wallet.readyState === WalletReadyState.Loadable) {
      loadable.push(wallet);
    } else if (wallet.readyState === WalletReadyState.Installed) {
      installed.push(wallet);
    }
  });

  return [...installed, ...loadable, ...notDetected];
});

const displayWallets = computed(() => orderedWallets.value);

const connectWallet = async (name: any) => {
  select(name);

  try {
    await connect();
  } catch (error) {
    if (
      error instanceof WalletConnectionError &&
      error.message === "User rejected the request."
    ) {
      // Handle user rejection here, such as displaying a message to the user
      console.log(
        "Handle user rejection here, such as displaying a message to the user",
      );
    } else if (error instanceof WalletNotReadyError) {
    } else {
      await connectWallet(name);
    }
  }
};

watchEffect(() => {
  if (connected.value) {
    emits("connected", publicKey.value?.toBase58());
  }
});
</script>

<template>
  <div class="action-page-wrapper">
    <div class="wrapper-inner">
      <div class="action-box">
        <div class="box-content">
          <h3 class="dark-inverted">
            {{ t("components.wallet.connect.connect") }}
          </h3>
          <form novalidate class="form-layout is-separate">
            <div class="form-outer">
              <div class="form-body">
                <div class="form-section">
                  <h4 class="has-text-centered">
                    {{ t("components.wallet.connect.wallet") }}
                  </h4>
                  <div class="form-section-inner">
                    <div class="radio-boxes">
                      <VControl
                        v-for="wallet in displayWallets"
                        :key="wallet.adapter.name"
                        class="radio-box"
                        subcontrol
                      >
                        <VInput
                          type="radio"
                          name="blockchain"
                          :checked="selectedWalletName === wallet.adapter.name"
                          @click="selectedWalletName = wallet.adapter.name"
                        />
                        <div class="radio-box-inner">
                          <wallet-icon
                            class="wallet-icon"
                            :wallet="wallet"
                          ></wallet-icon>
                          <span>{{ wallet.adapter.name }}</span>
                          <p v-if="wallet.readyState === 'Installed'">
                            {{ t("components.wallet.connect.detected") }}
                          </p>
                          <p v-else>&nbsp;</p>
                        </div>
                      </VControl>
                    </div>
                  </div>

                  <div class="form-section-outer">
                    <div class="button-wrap">
                      <VButton
                        color="primary"
                        raised
                        tabindex="0"
                        outlined
                        class="ml-2"
                        @click="setWalletName(selectedWalletName)"
                      >
                        {{ t("action.submit") }}
                      </VButton>
                      <VButton
                        color="primary"
                        raised
                        tabindex="0"
                        outlined
                        class="ml-2"
                        @click="
                          () => {
                            emits('close');
                          }
                        "
                      >
                        {{ t("action.cancel") }}
                      </VButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.radio-boxes {
  .wallet-icon {
    img {
      width: 36px !important;
    }
  }
}
</style>
