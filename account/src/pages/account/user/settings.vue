<script setup lang="ts">
import { useApiAccount } from '/@src/api/apiAccount'

import { useSettings } from '/@userStores/settings'
import { useAppTimezones } from '/@appStores/appTimezones';
import { useAppLanguages } from '/@appStores/appLanguages';
import { useAppColorSchemas } from '/@appStores/appColorSchemas';

const { t } = useI18n()
const apiAccount = useApiAccount()

const settings = useSettings()
const appTimezones = useAppTimezones()
const appLanguages = useAppLanguages()
const appColorSchemas = useAppColorSchemas()

const isLoading = ref(false)
const isLoadingFields = ref(false)

const timezones = computed(() => {
  const timezones = appTimezones.timezones
  if (Array.isArray(timezones)) {
    return timezones.map(timezone => ({
      value: timezone.name, // Original name
      label: timezone.name + ' ' + timezone.offset // Formatted name
    }));
  } else {
    return [];
  }
});

const languages = computed(() => {
  const languages = appLanguages.languages
  if (Array.isArray(languages)) {
    return languages.map(language => ({
      value: language.iso, // Original name
      label: language.name // Formatted name
    }));
  } else {
    return [];
  }
});

const colorSchemas = computed(() => {
  const colorSchemas = appColorSchemas.colorSchema
  if (Array.isArray(colorSchemas)) {
    return colorSchemas.map(colorSchema => ({
      value: colorSchema.type, // Original name
      label: colorSchema.label // Formatted name
    }));
  } else {
    return [];
  }
});

const handleLanguage = async (value:string) => {
  if(settings?.language != value){
    await apiAccount.post('user/update-settings', {language : value})
            .then((response) => {
            })
            .catch((error) => {
            })
  }
}

const handleTimezone = async (value:string) => {
  if (settings?.timezone != value) {
    await apiAccount.post('user/update-settings', { timezone: value })
            .then((response) => {
            })
            .catch((error) => {
            })
  }
}
const colorSchema = ref(settings.colorSchema)

const handleColorSchema = async (value:any ,event: MouseEvent) => {
  event.stopPropagation(); // Stop the event from bubbling up
  
  if(settings?.colorSchema != value){
    await toggleSchema(event)
    await apiAccount.post('user/update-settings', {colorSchema : value})
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
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header">
      <div class="form-head-inner">
        <div class="left">
          <h3>{{ t('pages.settings.title') }}</h3>
          <p>{{ t('pages.settings.subtitle') }}</p>
        </div>
      </div>
    </div>
    <div class="form-body" >
      <VLoader :active="isLoadingFields">
        <div class="fieldset">
          <div class="columns">
            <div class="column is-4">
              <VField v-slot="{ id }" class="is-autocomplete-select">
                <VLabel>{{ t('pages.settings.language') }}</VLabel>
                <VControl icon="lucide:search">
                  <Multiselect
                    v-model="settings.language"
                    :attrs="{ id }"
                    :options="languages"
                    :placeholder="t('listLanguage.placeholder')"
                    label="label"
                    valueProp="value"
                    :searchable="true"
                    :canClear="false"
                    @change="handleLanguage"
              />
                </VControl>
              </VField>
            </div>
            <div class="column is-7">
              <VField v-slot="{ id }" class="is-autocomplete-select">
                <VLabel>{{ t('pages.settings.timezones') }}</VLabel>
                <VControl icon="lucide:search">
                  <Multiselect
                    v-model="settings.timezone"
                    :attrs="{ id }"
                    :options="timezones"
                    :placeholder="t('listTimezones.placeholder')"
                    label="label"
                    valueProp="value"
                    :searchable="true"
                    :canClear="false"
                    @change="handleTimezone"
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
        <div class="fieldset">
          <div class="columns is-multiline">
            <div class="column is-6">
              <VField>
                <VLabel>{{ t('pages.settings.colorSchema') }}</VLabel>
                <VControl>
                  <VRadio
                  v-for="(color, key) in colorSchemas"
                    :key="key"
                    v-model="colorSchema"
                    :value=color.value
                    :label="t(`colorSchema.${color.value}`)"
                    name="outlined_squared_radio"
                    color="primary"
                    square
                    @click="(event: MouseEvent) => handleColorSchema(color.value, event)"
                  />
                 </VControl>
              </VField>
            </div>
          </div>
        </div>
      </VLoader>
    </div>
  </div>
</template>

<style lang="scss">
.multiselect-wrapper{
  margin-left: 30px;
}
</style>