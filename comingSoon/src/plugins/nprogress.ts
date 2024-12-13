import { definePlugin } from '/@src/utils/plugins'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default definePlugin(({ router }) => {
  NProgress.configure({ showSpinner: false })
  router.beforeEach(() => {
    NProgress.start()
  })
  router.afterEach(() => {
    NProgress.done()
  })
})
