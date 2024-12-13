import { useSession } from './session'
import { useSecondFactor } from './secondFactor'
import { useUser } from './user'
import { useApp } from './app'
import { useEmailAddress } from './emailAddress'
import { usePhoneNumber } from './phoneNumber'
import { usePending } from './pending'
import { useWarning } from './warning'
import { useWallet } from './wallet'
import { useSettings } from './settings'
import { useNotifications } from './notifications'

export default function storeManager(responseData: any) {
  if (responseData?.session) {
    const session = useSession()
    session.set(responseData.session)
  }

  if (responseData?.secondFactor) {
    const secondFactor = useSecondFactor()
    secondFactor.set(responseData.secondFactor)
  }

  if (responseData?.user) {
    const user = useUser()
    user.set(responseData.user)
  }


  if (responseData?.emailAddress) {
    const emailAddress = useEmailAddress()
    emailAddress.set(responseData.emailAddress)
  }

  if (responseData?.phoneNumber) {
    const phoneNumber = usePhoneNumber()
    phoneNumber.set(responseData.phoneNumber)
  }

  if (responseData?.app) {
    const app = useApp()
    app.set(responseData.app)
  }

  if (responseData?.wallet) {
    const wallet = useWallet()
    wallet.set(responseData.wallet)
  }

  if (responseData?.pending) {
    const pending = usePending()
    pending.set(responseData.pending)
  }

  if (responseData?.warning) {
    const warning = useWarning()
    warning.set(responseData.warning)
  }

  if (responseData?.settings) {
    const settings = useSettings()
    settings.set(responseData.settings)
  }

  if (responseData?.notifications) {
    const notifications = useNotifications()
    notifications.set(responseData.notifications)
  }
}