<script setup lang="ts">
import { useApiAccount } from "/@src/api/apiAccount";

import { useSettings } from "/@userStores/settings";
import { useSession } from "/@userStores/session";

import { useAppLanguages } from "/@appStores/appLanguages";

const { locale } = useI18n();
const apiAccount = useApiAccount();

const session = useSession();
const settings = useSettings();
const appLanguages = useAppLanguages();

const language = ref<string | undefined>(settings?.language);

const languages = computed(() => {
  return appLanguages.languages.map((language) => ({
    value: language.iso, // Original name
    label: language.name, // Formatted name
  }));
});

const open = ref(false);
const target = ref(null);

const toggleDropdown = () => {
  open.value = !open.value;
};

onClickOutside(target, () => (open.value = false));

const changeLanguage = (value) => {
  if (session.loggedIn) {
    apiAccount
      .post("user/update-settings", { language: value })
      .then((response) => {})
      .catch((error) => {});
  }
  settings.set({ language: value });
  open.value = false;
};

watchEffect(() => {
  if (settings?.language) {
    locale.value = settings?.language;
    language.value = settings.language;
  }
});
</script>
<template>
  <div class="navbar-item">
    <div
      ref="target"
      class="dropdown lang-dropdown is-right"
      :class="open ? 'is-active' : ''"
    >
      <VButton
        color="primary"
        class="dropdown-trigger"
        @click.prevent="toggleDropdown"
        outlined
        raised
        >{{ language.toUpperCase() }}</VButton
      >
      <div class="dropdown-menu">
        <div class="dropdown-content">
          <a
            v-for="language in languages"
            href="#"
            role="button"
            class="dropdown-item"
            @click="changeLanguage(language.value)"
          >
            <span>{{ language.label }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lang-dropdown {
  position: static !important;

  h2 {
    font-size: large;
  }

  .dropdown-menu {
    .dropdown-content {
      padding: 0.75rem;
      width: auto !important;
    }

    .dropdown-item {
      width: auto !important;
      display: flex;
      align-items: center;
      padding-inline-start: 0.75rem;
      padding-inline-end: 0.75rem;

      span {
        display: block;
        margin-inline-start: 10px;
      }
    }
  }
}

.is-dark {
  .lang-dropdown {
    .dropdown-menu {
      .dropdown-content {
        background: var(--dark-sidebar) !important;
        border-color: color-mix(
          in oklab,
          var(--dark-sidebar),
          white 8%
        ) !important;

        .dropdown-item {
          color: var(--light-text);

          &:hover {
            background: color-mix(
              in oklab,
              var(--dark-sidebar),
              white 10%
            ) !important;
          }
        }

        .dropdown-divider {
          background-color: color-mix(in oklab, var(--dark-sidebar), white 12%);
        }
      }
    }
  }
}
</style>
