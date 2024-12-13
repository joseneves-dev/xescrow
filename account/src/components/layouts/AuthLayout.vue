<template>
  <div class="auth-wrapper-inner is-single">
    <div class="auth-nav">
        <RouterLink to="/" class="brand">
          <Logo width="48px" height="48px" />
        </RouterLink>
      <div class="right">
        <ColorSchema /> 
        <LanguageDropdown />
      </div>
    </div>
    <slot></slot>
    <AppFooter />
  </div>
</template>
<style scoped lang="scss">
 .brand {
    margin-left: 10px;
 }
</style>
