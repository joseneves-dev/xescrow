<script setup lang="ts">
import  { useAppConfigurations } from '/@appStores/appConfigurations'  

const appConfigurations = useAppConfigurations()

</script>
<template>
  <div class="view-wrapper">
    <Navigation  />
    <div class="hero section-hero is-center is-fullheight">
      <div class="hero-body is-flex is-justify-content-center is-align-items-center">
        <slot></slot>  
      </div>
    </div>
    <VOfflinePrompt v-if="appConfigurations.isOffline"/>
  </div>
</template>

<style scoped lang="scss">
.is-fullheight{
  min-height: 90vh;
}
</style>
