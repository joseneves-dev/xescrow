<script setup lang="ts">
import { useWallet } from "solana-wallets-vue";

import { txTokenConfirmEscrow } from "/@src/utils/wallet/transaction";

const props = defineProps({
  transaction: {
    type: Object,
    default: null,
  },
  selectedAccount: {
    type: Object,
    default: null,
  },
});

// Define your interface
interface TransactionsData {
  signature: string;
  blockTime: number;
  receiver: string;
  request: string;
  program_id: string;
  instruction: string;
  amount: string;
  fee: string;
}

const emits = defineEmits(["close", "success"]);

const Wallet = useWallet();
const walletConnected = ref(Wallet.connected);
const walletPublicKey = ref(Wallet.publicKey);

const method = ref<String>();

const methods = computed(() => {
  const secretKey = true; // Always true
  const wallet =
    props.selectedAccount?.publicKey == walletPublicKey.value &&
    walletConnected.value; // true if conditions are met
  const app = props.selectedAccount?.secretKey == true; // true if selectedAccount.secretKey is true
  return {
    secretKey,
    wallet,
    app,
  };
});

const closeModal = async () => {
  emits("close");
};

const confirmMethod = async (data: string) => {
  method.value = data;
};
const transaction = ref<Object>();

const handleTx = async () => {
  const transactionInstance = await txTokenConfirmEscrow(
    props.selectedAccount.publicKey,
    props.transaction.data,
  );

  console.log(transactionInstance);
  transaction.value = {
    data: {
      request: props.selectedAccount.publicKey,
      mint: props.transaction.data.mint,
      escrowAccount: props.transaction.data.escrowAccount,
    },
    tx: transactionInstance.tx,
  };
};
handleTx();
watch(Wallet.publicKey, (publicKey) => {
  if (publicKey) {
    walletPublicKey.value = publicKey.toString();
  }
});

watch(Wallet.connected, (connected) => {
  walletConnected.value = connected;
});
</script>
<template>
  <h3 class="dark-inverted">Cofirm transaction</h3>
  <MethodTransfer
    v-if="!method"
    :methods="methods"
    @method="confirmMethod"
    @close="closeModal"
  />
  <ManualTransfer
    v-else-if="method == 'secretKey'"
    :transaction="transaction"
    @close="closeModal"
  />
  <WalletTransfer
    v-else-if="method == 'wallet'"
    :transaction="transaction"
    @close="closeModal"
  />
  <AppTransfer
    v-else-if="method == 'app'"
    :transaction="transaction"
    @close="closeModal"
  />
</template>
