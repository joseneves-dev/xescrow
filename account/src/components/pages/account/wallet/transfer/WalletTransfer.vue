<script setup lang="ts">
import { useWallet, WalletIcon } from "solana-wallets-vue";
import { useApiAccount } from "/@src/api/apiAccount";

import { useAppNotification } from "/@appStores/appNotification";
const api = useApiAccount();

const props = defineProps({
  transaction: {
    type: Object,
    default: null,
  },
});

const emits = defineEmits(["close"]);
const appNotification = useAppNotification();
const isLoading = ref<Boolean>(false);
const { wallet, signTransaction } = useWallet();

const send = async () => {
  isLoading.value = true;
  try {
    const tx = props.transaction.tx;
    const signedTx = await signTransaction.value(tx);

    let txSerialized = signedTx.serialize({ requireAllSignatures: false });
    const base64Tx = txSerialized.toString("base64");

    if (props.transaction.data.escrowAccount) {
      await api
        .post("wallet/transfer/escrow", {
          transaction: props.transaction.data,
          tx: base64Tx,
        })
        .then(async (response) => {
          console.log("transaction success");
        })
        .catch((error) => {});
    } else {
      await api
        .post("wallet/transfer/normal", {
          transaction: props.transaction.data,
          tx: base64Tx,
        })
        .then(async (response) => {
          console.log("transaction success");
        })
        .catch((error) => {});
    }
  } catch (error) {
    appNotification.set({ type: "error", message: "Transaction error!" });
  }
  isLoading.value = false;
  emits("close");
};
</script>
<template>
  <VLoader :active="isLoading">
    <div class="wallet-action">
      <div class="item-row">
        <VButton
          color="primary"
          raised
          tabindex="0"
          outlined
          class="m-2"
          @click="send()"
        >
          <wallet-icon :wallet="wallet" class="wallet-icon" />
          <span class="status">Confirm</span>
        </VButton>
        <VButton
          color="primary"
          raised
          tabindex="0"
          outlined
          class="m-2"
          @click="
            () => {
              emits('close');
            }
          "
        >
          CANCEL
        </VButton>
      </div>
    </div>
  </VLoader>
</template>
<style lang="scss">
.wallet-action {
  .item-row {
    display: contents;
    .wallet-icon {
      display: inline-flex !important;

      img {
        width: 22px !important; // This will only apply in this component
        margin: 0 10px 0 0 !important;
      }
    }
    .status {
      vertical-align: super !important;
    }
  }
}
</style>
