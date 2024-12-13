<script setup lang="ts">
export interface VOfflinePromptProps {
  publicKey: String;
}

const emits = defineEmits(["closePrompt", "addPublicKey"]);

const props = defineProps<VOfflinePromptProps>();
const publicKey = ref<string | undefined>(
  props.publicKey.slice(0, 15) + "..." + props.publicKey.slice(-10),
);

watchEffect(() => {
  if (props.publicKey)
    publicKey.value =
      props.publicKey.slice(0, 15) + "..." + props.publicKey.slice(-10);
});
const { t } = useI18n();
</script>
<template>
  <transition name="from-bottom">
    <VCard v-if="publicKey" class="popup-toast" role="alert" radius="smooth">
      <div class="popup-message">
        <span>
          {{ publicKey }}
          {{ t("components.publickey.detected") }}
        </span>
      </div>
      <VButtons align="right">
        <div
          class="button v-button is-primary raised action-button"
          color="primary"
          icon="ion:reload-outline"
          @click="emits('addPublicKey')"
        >
          {{ t("action.wallet.add") }}
        </div>
        <div
          class="button v-button raised action-button"
          icon="lucide:x"
          @click="emits('closePrompt')"
        >
          {{ t("action.close") }}
        </div>
      </VButtons>
    </VCard>
  </transition>
</template>

<style lang="scss">
.popup-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  max-width: 350px;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 10;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
}

.popup-message {
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}
</style>
