import { useSettings } from '/@userStores/settings'
import { useCookies } from '@vueuse/integrations/useCookies'

const { get } = useCookies()
      
const settings = useSettings()

const preferredDark = usePreferredDark()

const colorSchema = ref(settings?.colorSchema ? settings?.colorSchema : get('colorSchema'))

const enableTransitions = () =>
  'startViewTransition' in document
  && window.matchMedia('(prefers-reduced-motion: no-preference)').matches

const isDark = computed({
    get() {
      return colorSchema.value === 'auto'
        ? preferredDark.value
        : colorSchema.value === 'dark'
    },
    set(v: boolean) {
      // disable transitions
      if (document.documentElement) {
        document.documentElement.classList.add('no-transition')
      }

      if (v === preferredDark.value) colorSchema.value = 'auto'
        else colorSchema.value = v ? 'dark' : 'light'

      if (document.documentElement) {
        setTimeout(() => {
          document.documentElement.classList.remove('no-transition')
        }, 0)
      }
    },
})

export async function toggleSchema (event: MouseEvent) {
  const target = event.target as HTMLInputElement
      
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  event.preventDefault()

  const clipPath = [
    `circle(0px at ${event.clientX}px ${event.clientY}px)`,
    `circle(${Math.hypot(
      Math.max(event.clientX, target.clientWidth - event.clientX),
      Math.max(event.clientY, target.clientHeight - event.clientY),
    )}px at ${event.clientX}px ${event.clientY}px)`,
  ]

  await (document as any).startViewTransition(async () => {
      isDark.value = !isDark.value
      await nextTick()
  }).ready
  
  document.documentElement.animate(
      { clipPath: isDark.value ? clipPath.reverse() : clipPath },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
      },
    )
  }