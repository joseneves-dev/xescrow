import { definePlugin } from '/@src/utils/plugins'
import { defineAsyncComponent } from 'vue'

export default definePlugin(({ app }) => {
  // here we are defining a lazy loaded component
  // that will be imported on demand
  app.component(
    'Multiselect',
    defineAsyncComponent({
      loader: () => import('@vueform/multiselect').then((mod) => mod.default),
      delay: 0,
      suspensible: false,
    })
  )

  app.component(
    'Slider',
    defineAsyncComponent({
      loader: () => import('@vueform/slider').then((mod) => mod.default),
      delay: 0,
      suspensible: false,
    })
  )
})
