<script setup lang="ts">
const emits = defineEmits(['close', 'method'])

const props = defineProps({
  methods: {
    type: Object ,
    default: null,
  },
})

</script>
<template>
  <VButtons >
    <VButton @click="()=> { emits('method', 'secretKey')}">
      Use PrivateKey
    </VButton>
    <VButton v-if="props.methods.wallet == true" @click="()=> { emits('method', 'wallet')}">
      Use Wallet
    </VButton>
    <VButton v-if="props.methods.app == true" @click="()=> { emits('method', 'app')}">
      Use App 
    </VButton>
  </VButtons>
  <VButton
    color="primary"
    raised
    tabindex="0"
    outlined
    class="m-2"
    @click="()=> { emits('close')}"
  >
    CANCEL
  </VButton>          
</template>