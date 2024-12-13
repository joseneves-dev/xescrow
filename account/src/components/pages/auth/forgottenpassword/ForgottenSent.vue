<script setup lang="ts">
const { t } = useI18n()
</script>
<template>
  <div class="inner-wrap">
    <div class="auth-head">
          <h2>{{ t('pages.forgotPassword.sent.title') }}</h2>
          <p>{{ t('pages.forgotPassword.sent.subtitle') }}</p>
          <RouterLink :to="{ name: 'login' }">
            {{ t('action.login') }}
          </RouterLink>
        </div>
  </div>
</template>