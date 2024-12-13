<script setup lang="ts">
import { useAppConfigurations } from '/@src/stores/app/appConfigurations';

const appConfigurations = useAppConfigurations()

const { t } = useI18n()

const close = ref<boolean>(false)

const update = async () => {
  window.location.reload()
}
const href = async () => {
  window.location.reload()
}
</script>
<template>
  <transition name="from-bottom">
    <VCard v-if="appConfigurations.isOffline && close == false" class="popup-toast" role="alert" radius="smooth">
      <div class="popup-message">
        <span>
          {{ t('components.v-reload-prompt.offline', { appName: appConfigurations.appName }) }}
        </span>
      </div>
      <VButtons align="right">
        <div
          class="button v-button is-primary raised action-button"
          color="primary"
          icon="ion:reload-outline"
          @click="() => update()"
        >
          {{ t('components.v-reload-prompt.need-refresh') }}
        </div>
        <div class="button v-button raised action-button" icon="lucide:x" @click="close = true">
          {{ t('components.v-reload-prompt.close-button') }}
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






















