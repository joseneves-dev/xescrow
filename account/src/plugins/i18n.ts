import { definePlugin } from '/@src/utils/plugins'
import { useAppLanguages } from '/@appStores/appLanguages'
import { useSettings } from '/@userStores/settings'
import { useCookies } from '@vueuse/integrations/useCookies'

import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'

export default definePlugin(async ({ app, pinia }) => {
  const { get } = useCookies()

  const appLanguages = useAppLanguages(pinia)
  const settings = useSettings(pinia)

  var defaultLanguages:any = []

  if(appLanguages.languages){
    defaultLanguages =   appLanguages?.languages.map((language: { iso: string }) => language.iso);
  }
 
  // Client language
  const clientLanguage = navigator?.language.substr(0, 2)

  // Check if a language is stored in local storage
  const storedLanguage = get('language')

  // Determine the language to use, fallback to clientLanguage or 'en'
  const language =
    storedLanguage && defaultLanguages.includes(storedLanguage)
      ? storedLanguage
      : defaultLanguages.includes(clientLanguage)
      ? clientLanguage
      : 'en'

  if (!settings?.language) {
    settings.set({ language })
  }

  const i18n = createI18n({
    locale: language,
    messages,
  })

  app.use(i18n)
})
