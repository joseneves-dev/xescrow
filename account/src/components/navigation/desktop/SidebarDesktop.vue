<script setup lang="ts">
const { t } = useI18n()
</script>
<template>
  <div class="account-box is-navigation">
    <div class="account-menu">
      <RouterLink :to="{ name: 'personal' }" class="account-menu-item">
        <VIcon icon="lucide:user"/>
        <span> {{ t('subMenu.details') }}</span>
        <span class="end">
          <i aria-hidden="true" class="fas fa-arrow-right"></i>
        </span>
      </RouterLink>
      <RouterLink :to="{ name: 'contacts' }" class="account-menu-item">
        <VIcon icon="lucide:send"/>
        <span>{{ t('subMenu.contacts') }} </span>
        <span class="end">
          <i aria-hidden="true" class="fas fa-arrow-right"></i>
        </span>
      </RouterLink>
      <RouterLink :to="{ name: 'security' }" class="account-menu-item">
        <VIcon icon="lucide:lock"/>
        <span>{{ t('subMenu.security') }}</span>
        <span class="end">
          <i aria-hidden="true" class="fas fa-arrow-right"></i>
        </span>
      </RouterLink>
      <RouterLink :to="{ name: 'settings' }" class="account-menu-item">
        <VIcon icon="lucide:settings" />
        <span>{{ t('subMenu.settings') }}</span>
        <span class="end">
          <i aria-hidden="true" class="fas fa-arrow-right"></i>
        </span>
      </RouterLink>
      <RouterLink :to="{ name: 'user-notifications' }" class="account-menu-item">
        <VIcon icon="lucide:bell"/>
        <span>{{ t('subMenu.notifications') }}</span>
        <span class="end">
          <i aria-hidden="true" class="fas fa-arrow-right"></i>
        </span>
      </RouterLink>
    </div>
  </div>
</template>
