import { useApiAuth } from '/@src/api/apiAuth'
import { useSession } from '/@userStores/session'
const apiAuth = useApiAuth() 
let autorizeAttemp = false

export const authorize = async (to: any, from: any, next: any) => {
  const session = useSession()

  let loggedIn: Boolean = session.loggedIn
  let parameters;

  if (loggedIn == false && autorizeAttemp == false) {
     
      await apiAuth.get('authorize')
      .then((response) => {
        if (!to.meta.requiresAuth) {
          parameters = { name: 'dashboard' }
        }
      })
      .catch((error) => {
        if (to.meta.requiresAuth && from.name != 'login') {
          parameters = { name: 'login', query: { redirect: to.fullPath } }
        }
      })
      
      autorizeAttemp = true
    }

    next(parameters)
}
