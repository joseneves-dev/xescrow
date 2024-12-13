<script setup lang="ts">
import { useWallet } from "solana-wallets-vue";
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { txTokenDisputeActionEscrow } from "/@src/utils/wallet/transaction";

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

const schema = toTypedSchema(
  z.object({
    send: z
      .string({ required_error: "auth.errors.password.required" })
      .min(32, { message: "Publickey to short" }),
  }),
);

const { handleSubmit } = useForm({
  validationSchema: schema,
});

const emits = defineEmits(["close", "success"]);

const Wallet = useWallet();
const walletConnected = ref(Wallet.connected);
const walletPublicKey = ref(Wallet.publicKey);

const method = ref<String>();
const receiver = ref<String>();
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
  handleTx();
  method.value = data;
};
const transaction = ref<Object>();
const handleTx = async () => {
  if (!receiver.value || receiver.value == "") {
    return false;
  }
  const transactionInstance = await txTokenDisputeActionEscrow(
    props.selectedAccount.publicKey,
    props.transaction.data,
    receiver.value,
  );

  transaction.value = {
    data: {
      request: props.selectedAccount.publicKey,
      receiver: receiver.value,
      mint: props.transaction.data.mint,
      escrowAccount: props.transaction.data.escrowAccount,
    },
    tx: transactionInstance.tx,
  };
};

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
  <h3 class="dark-inverted">Dispute transaction</h3>
  Insert the PublicKey witch the funds will be transferd
  <VField id="receiver">
    <VControl>
      <VInput type="text" v-model="receiver" />
    </VControl>
  </VField>
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
