import { definePlugin } from '/@src/utils/plugins'
import { useSettings } from '/@userStores/settings'

export default definePlugin(async ({ pinia }) => {
  const settings = useSettings(pinia)

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  settings.set({ timezone: timezone })
})
