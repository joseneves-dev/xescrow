import { definePlugin } from '/@src/utils/plugins'
import { AppPreloadLink } from '/@src/directives/preload-link'
import { AppTooltip } from '/@src/directives/tooltip'
import { AppBackground } from '/@src/directives/background'

export default definePlugin(({ app }) => {
  // register global v-preload-link directive
  app.directive('preload-link', AppPreloadLink)

  // register global v-tootltip directive
  app.directive('tooltip', AppTooltip)

  // register global v-background directive
  app.directive('background', AppBackground)
})
