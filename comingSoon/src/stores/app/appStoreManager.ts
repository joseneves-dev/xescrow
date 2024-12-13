import { useAppColorSchemas } from './appColorSchemas'
import { useAppLanguages } from './appLanguages'

import { useAppConfigurations } from './appConfigurations'

export default function storeManager(responseData: any) {
  if (responseData?.csrf) {
    const configurations = useAppConfigurations()
    configurations.setCsrf(responseData.csrf)
  }

  if (responseData?.colorSchemas) {
    const colorSchemas = useAppColorSchemas()
    colorSchemas.set(responseData.colorSchemas)
  }

  if (responseData?.languages) {
    const languages = useAppLanguages()
    languages.set(responseData.languages)
  }

}