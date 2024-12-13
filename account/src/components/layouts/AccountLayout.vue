<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";
import { useAppConfigurations } from "/@appStores/appConfigurations";
import { useUser } from "/@src/stores/user/user";

const { t } = useI18n();

const appConfigurations = useAppConfigurations();
const user = useUser();
const route = useRoute();

const userSection = ref(false);
const userSubMenu = ref(false);

const { width } = useWindowSize();

watchEffect(() => {
  const isInsideUserSection = route.path.includes("/user/");
  if (isInsideUserSection) {
    userSection.value = true;
  } else {
    userSection.value = false;
  }
});
</script>

<template>
  <div class="view-wrapper">
    <NavDesktop v-if="width >= 1024">
      <template #left>
        <router-link to="/" class="brand">
          <Logo width="48px" height="48px" />
        </router-link>

        <div class="separator"></div>

        <h1 class="title is-5">{{ appConfigurations.pageTitle }}</h1>
      </template>

      <template #center>
        <div class="centered-links">
          <router-link
            :to="{ name: 'dashboard' }"
            class="centered-link centered-link-toggle"
          >
            <VIcon icon="lucide:activity" />
            <span>{{ t("menu.dashboard") }}</span>
          </router-link>
          <router-link
            :to="{ name: 'wallet' }"
            class="centered-link centered-link-toggle"
          >
            <VIcon icon="lucide:credit-card" />
            <span>{{ t("menu.wallet") }}</span>
          </router-link>
          <router-link
            v-if="user.role == 'escrow'"
            :to="{ name: 'escrow' }"
            class="centered-link centered-link-toggle"
          >
            <VIcon icon="lucide:x" />
            <span>{{ t("menu.escrow") }}</span>
          </router-link>
          <router-link
            :to="{ name: 'user' }"
            class="centered-link centered-link-toggle"
          >
            <VIcon icon="lucide:box" />
            <span>{{ t("menu.account") }}</span>
          </router-link>
          <router-link
            :to="{ name: 'help' }"
            class="centered-link centered-link-toggle"
          >
            <VIcon icon="lucide:life-buoy" />
            <span>{{ t("menu.helpCenter") }}</span>
          </router-link>
        </div>
      </template>

      <template #right>
        <ColorSchema />
        <LanguageDropdown />
        <Logout />
      </template>
    </NavDesktop>
    <NavMobile v-else>
      <template #top>
        <div class="top">
          <div class="left">
            <router-link to="/" class="brand">
              <Logo width="48px" height="48px" />
            </router-link>
            <div class="separator"></div>

            <h1 class="title is-5">...</h1>
          </div>
          <div class="right">
            <ColorSchema />
            <LanguageDropdown />
          </div>
        </div>
      </template>

      <template #center>
        <div class="multiline-links" v-if="!userSubMenu">
          <router-link
            :to="{ name: 'dashboard' }"
            class="multiline-link multiline-link-toggle"
          >
            <VIcon icon="lucide:activity" />
            <span>{{ t("menu.dashboard") }}</span>
          </router-link>
          <router-link
            :to="{ name: 'wallet' }"
            class="multiline-link multiline-link-toggle"
          >
            <VIcon icon="lucide:credit-card" />

            <span>{{ t("menu.wallet") }}</span>
          </router-link>
          <div
            class="multiline-link multiline-link-toggle"
            :class="[userSection && 'router-link-active']"
            @click="
              () => {
                userSubMenu = true;
              }
            "
          >
            <VIcon icon="lucide:box" />
            <span>{{ t("menu.account") }}</span>
          </div>
          <router-link
            :to="{ name: 'help' }"
            class="multiline-link multiline-link-toggle"
          >
            <VIcon icon="lucide:cpu" />
            <span>{{ t("menu.helpCenter") }}</span>
          </router-link>
        </div>
        <div class="multiline-links" v-if="userSubMenu">
          <div
            class="multiline-link multiline-link-toggle"
            @click="
              () => {
                userSubMenu = false;
              }
            "
          >
            <VIcon icon="lucide:box" />
            <span>{{ t("menu.back") }}</span>
          </div>
        </div>
        <div class="multiline-links" v-if="userSubMenu">
          <router-link
            :to="{ name: 'personal' }"
            class="multiline-link multiline-link-toggle"
          >
            <VIcon icon="lucide:user" />
            <span>{{ t("subMenu.details") }}</span>
          </router-link>
          <router-link
            :to="{ name: 'contacts' }"
            class="multiline-link multiline-link-toggle"
          >
            <VIcon icon="lucide:send" />

            <span>{{ t("subMenu.contacts") }}</span>
          </router-link>
          <router-link
            :to="{ name: 'security' }"
            class="multiline-link multiline-link-toggle"
          >
            <VIcon icon="lucide:lock" />
            <span>{{ t("subMenu.security") }}</span>
          </router-link>
          <router-link
            :to="{ name: 'settings' }"
            class="multiline-link multiline-link-toggle"
          >
            <VIcon icon="lucide:settings" />
            <span>{{ t("subMenu.settings") }}</span>
          </router-link>
          <router-link
            :to="{ name: 'user-notifications' }"
            class="multiline-link multiline-link-toggle"
          >
            <VIcon icon="lucide:bell" />
            <span>{{ t("subMenu.notifications") }}</span>
          </router-link>
        </div>
      </template>
      <template #bottom>
        <Logout />
      </template>
    </NavMobile>

    <div class="page-content-wrapper">
      <slot></slot>
    </div>
    <AppFooter />
  </div>
</template>
