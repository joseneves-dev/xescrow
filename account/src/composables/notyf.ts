import type { INotyfNotificationOptions, Notyf, NotyfNotification } from 'notyf'
import type { Plugin } from 'vue'

interface NotyfContext {
  dismiss: (notification: NotyfNotification) => void
  dismissAll: () => void
  success: (payload: string | Partial<INotyfNotificationOptions>) => void
  error: (payload: string | Partial<INotyfNotificationOptions>) => void
  info: (payload: string | Partial<INotyfNotificationOptions>) => void
  warning: (payload: string | Partial<INotyfNotificationOptions>) => void
  primary: (payload: string | Partial<INotyfNotificationOptions>) => void
  purple: (payload: string | Partial<INotyfNotificationOptions>) => void
  blue: (payload: string | Partial<INotyfNotificationOptions>) => void
  green: (payload: string | Partial<INotyfNotificationOptions>) => void
  orange: (payload: string | Partial<INotyfNotificationOptions>) => void
}

export const useNotyf = () => {
  return inject(notyfSymbol)!
}

const notyfSymbol: InjectionKey<NotyfContext>
  = Symbol('notyf')

export function createNotyf(): Plugin {
  return {
    async install(app) {
      
      const themeColors = useThemeColors()
      const { Notyf } = await import('notyf')
        
      const notyf = new Notyf({
          duration: 5000,
          position: {
            x: 'center',
            y: 'bottom',
          },
          dismissible: true,
          types: [
            {
              type: 'warning',
              background: themeColors.warning,
              icon: false
            },
            {
              type: 'info',
              background: themeColors.info,
              icon: false
            },
            {
              type: 'primary',
              background: themeColors.primary,
              icon: false
            },
            {
              type: 'accent',
              background: themeColors.purple,
              icon: false
            },
            {
              type: 'purple',
              background: themeColors.purple,
              icon: false
            },
            {
              type: 'blue',
              background: themeColors.blue,
              icon: false
            },
            {
              type: 'green',
              background: themeColors.lime,
              icon: false
            },
            {
              type: 'orange',
              background: themeColors.orange,
              icon: false
            },
          ],
        })
      
      const context = {
        dismiss: (notification: NotyfNotification) => {
          notyf?.dismiss(notification)
        },
        dismissAll: () => {
          notyf?.dismissAll()
        },
        success: (payload: string | Partial<INotyfNotificationOptions>) => {
          return notyf?.success(payload)
        },
        error: (payload: string | Partial<INotyfNotificationOptions>) => {
          return notyf?.error(payload)
        },
        info: (payload: string | Partial<INotyfNotificationOptions>) => {
          const options: Partial<INotyfNotificationOptions> = {
            type: 'info',
          }

          if (typeof payload === 'string') {
            options.message = payload
          }
          else {
            Object.assign(options, payload)
          }

          return notyf?.open(options)
        },
        warning: (payload: string | Partial<INotyfNotificationOptions>) => {
          const options: Partial<INotyfNotificationOptions> = {
            type: 'warning',
          }

          if (typeof payload === 'string') {
            options.message = payload
          }
          else {
            Object.assign(options, payload)
          }

          return notyf?.open(options)
        },
        primary: (payload: string | Partial<INotyfNotificationOptions>) => {
          const options: Partial<INotyfNotificationOptions> = {
            type: 'primary',
            icon: false
          }

          if (typeof payload === 'string') {
            options.message = payload
          }
          else {
            Object.assign(options, payload)
          }

          return notyf?.open(options)
        },
        purple: (payload: string | Partial<INotyfNotificationOptions>) => {
          const options: Partial<INotyfNotificationOptions> = {
            type: 'purple',
          }

          if (typeof payload === 'string') {
            options.message = payload
          }
          else {
            Object.assign(options, payload)
          }

          return notyf?.open(options)
        },
        blue: (payload: string | Partial<INotyfNotificationOptions>) => {
          const options: Partial<INotyfNotificationOptions> = {
            type: 'blue',
          }

          if (typeof payload === 'string') {
            options.message = payload
          }
          else {
            Object.assign(options, payload)
          }

          return notyf?.open(options)
        },
        green: (payload: string | Partial<INotyfNotificationOptions>) => {
          const options: Partial<INotyfNotificationOptions> = {
            type: 'green',
          }

          if (typeof payload === 'string') {
            options.message = payload
          }
          else {
            Object.assign(options, payload)
          }

          return notyf?.open(options)
        },
        orange: (payload: string | Partial<INotyfNotificationOptions>) => {
          const options: Partial<INotyfNotificationOptions> = {
            type: 'orange',
          }

          if (typeof payload === 'string') {
            options.message = payload
          }
          else {
            Object.assign(options, payload)
          }

          return notyf?.open(options)
        },
      } satisfies NotyfContext

      app.provide(notyfSymbol, context)
    },
  }
}
