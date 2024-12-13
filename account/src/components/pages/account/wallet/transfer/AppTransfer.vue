<script setup lang="ts">
const props = defineProps({
  transaction: {
    type: Object,
    default: null,
  },
});

const emits = defineEmits(["close"]);

const appRequest = ref<Boolean>(false);

const closeModal = async () => {
  appRequest.value = false;
  emits("close");
};

const handleRequest = async () => {
  appRequest.value = true;
};

const handleConfirm = async () => {
  appRequest.value = false;
  emits("close");
};
</script>
<template>
  <!-- 
  <h3 class="dark-inverted">Send verification token</h3>
  APP REQUEST NOT REDY
  <AppRequest
    v-if="appRequest == false"
    :publicKey="props.transaction.data.fromAccount"
    @close="closeModal"
    @success="handleRequest"
  />
  -->
  <h3 class="dark-inverted">USE TOKEN 0 0 0 0 0 0</h3>
  <AppConfirmation
    :transaction="props.transaction"
    @close="closeModal"
    @success="handleConfirm"
  />
</template>
