<script setup lang="ts">
import { useSettings } from '/@userStores/settings';
import { useSession } from '/@userStores/session';
import { useApiAccount } from '/@src/api/apiAccount'
import { useCookies } from '@vueuse/integrations/useCookies'

const { get } = useCookies()
const api = useApiAccount()

const settings = useSettings()
const session = useSession()
const colorSchema = ref(settings?.colorSchema ? settings?.colorSchema : get('colorSchema'))

const updateColorSchema = async (event: MouseEvent) => {
  const newColorSchema = settings?.colorSchema === 'light' ? 'dark' : 'light';
  await toggleSchema(event)
  settings.set({ colorSchema: newColorSchema });
  colorSchema.value = newColorSchema

  if (session.loggedIn) {
    api.post('user/update-settings', { colorSchema: newColorSchema })
    .then((response) => {
    })
    .catch((error) => {
    })
  }
}

watchEffect(() => {
  if(settings.colorSchema){
    colorSchema.value = settings.colorSchema
  }
})
</script>

<template>
  <div class="navbar-item">
      <label 
        class="theme-toggle"  
        tabindex="0"
        role="button"
        @keydown.enter.prevent="(e) => (e.target as HTMLLabelElement).click()"
      >
        <input
          id="navbar-night-toggle--daynight"
          data-cy="dark-mode-toggle"
          type="checkbox"
          :checked = "colorSchema === 'dark'"
          @click="updateColorSchema"
        >
        <span class="toggler">
          <span class="dark">
            <VIcon icon="lucide:moon"/>
          </span>
          <span class="light">     
            <VIcon  icon="lucide:sun"/>
          </span>
        </span>
      </label>
  </div>
</template>

<style scoped lang="scss">
.theme-toggle {
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  transform: scale(0.9);

  &:focus-within {
    border-radius: 50px;
    outline-offset: var(--accessibility-focus-outline-offset);
    outline-width: var(--accessibility-focus-outline-width);
    outline-style: var(--accessibility-focus-outline-style);
    outline-color: var(--accessibility-focus-outline-color);
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;

    &:checked ~ .toggler {
      border-color: var(--primary);

      .dark,
      .light {
        transform: translateX(100%)
          rotate(360deg);
      }

      .dark {
        opacity: 1 !important;
      }

      .light {
        opacity: 0 !important;
      }
    }
  }

  .toggler {
    position: relative;
    display: block;
    height: 31px;
    width: 53px;
    border: 2px solid var(--primary);
    border-radius: 100px;
    transition:
      color 0.3s,
      background-color 0.3s,
      border-color 0.3s,
      height 0.3s,
      width 0.3s;

    .dark,
    .light {
      position: absolute;
      top: 4px;
      inset-inline-start: 2px;
      height: 22px;
      width: 22px;
      border-radius: var(--radius-rounded);
      background: black;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: translateX(0)
        rotate(0);
      transition: all 0.3s ease;

      .iconify {
        color: var(--white) !important;
        height: 14px !important;
        width: 14px !important;
        opacity: 1 !important;
      }
    }

    .light {
      background: var(--primary);
      border-color: var(--primary);
      opacity: 1;
      z-index: 1;
    }

    .dark {
      background: var(--primary);
      border-color: var(--primary);
      opacity: 0;
      z-index: 0;

      .iconify {
        color: var(--white) !important;
      }
    }
  }
}

@media (width <= 767px) {
  .theme-toggle {
    margin: 0 auto;
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .theme-toggle {
    margin: 0 auto;
  }
}
</style>
