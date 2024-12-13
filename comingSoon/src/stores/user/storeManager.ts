import { useSettings } from './settings'

export default function storeManager(responseData: any) {

  if (responseData?.settings) {
    const settings = useSettings()
    settings.set(responseData.settings)
  }

}