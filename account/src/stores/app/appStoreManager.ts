import { useAppColorSchemas } from './appColorSchemas'
import { useAppCountries } from './appCountries'
import { useAppLanguages } from './appLanguages'
import { useAppBlockchains } from './appBlockchains'
import { useAppCurrencies } from './appCurrencies'
import { useAppTimezones } from './appTimezones'
import { useAppVersions } from './appVersions'
import { useAppConfigurations } from './appConfigurations'

export default function appStoreManager(responseData: any) {
  
  if (responseData?.csrf) {
    const configurations = useAppConfigurations()
    configurations.setCsrf(responseData.csrf)
  }

  if (responseData?.colorSchemas) {
    const colorSchemas = useAppColorSchemas()
    colorSchemas.set(responseData.colorSchemas)
  }

  if (responseData?.countries) {
    const countries = useAppCountries()
    countries.set(responseData.countries)
  }

  if (responseData?.languages) {
    const languages = useAppLanguages()
    languages.set(responseData.languages)
  }

  if (responseData?.currencies) {
    const currencies = useAppCurrencies()
    currencies.set(responseData.currencies)
  }

  if (responseData?.blockchains) {
    const blockchains = useAppBlockchains()
    blockchains.set(responseData.blockchains)
  }

  if (responseData?.timezones) {
    const timezones = useAppTimezones()
    timezones.set(responseData.timezones)
  }

  if (responseData?.versions) {
    const versions = useAppVersions()
    versions.set(responseData.versions)
  }
}