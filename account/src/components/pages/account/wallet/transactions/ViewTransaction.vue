<script setup lang="ts">
const props = defineProps({
  transaction: {
    type: Array,
    default: () => [],
  },
  action: {
    type: String,
    default: null,
  },
});
const emits = defineEmits(["close"]);
</script>
<template>
  <div
    v-for="(txn, index) in props.transaction"
    :key="index"
    class="transaction-details"
  >
    <h3>Transaction {{ txn.data.status }}</h3>
    <p>Signature :</p>
    <p>
      <a
        :href="`https://explorer.solana.com/tx/${txn.signature}?cluster=devnet`"
        target="_blank"
        >{{ txn.signature }}</a
      >
    </p>
    <p>Date - {{ new Date(txn.blockTime * 1000).toLocaleString() }}</p>

    <div v-if="!txn.err">
      <p>Receiver - {{ txn.data?.receiver }}</p>
      <p>Sender - {{ txn.data?.sender }}</p>
      <p>Instruction - {{ txn.data?.instruction }}</p>
      <p v-if="txn.data?.escrow">Status - {{ txn.data?.escrow_status }}</p>
      <p>Amount - {{ txn.data?.amount }} {{ txn.data?.metaData?.symbol }}</p>
    </div>
  </div>
  <VButton
    v-if="props.action == null"
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
</template>
