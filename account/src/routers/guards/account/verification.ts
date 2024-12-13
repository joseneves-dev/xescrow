import { usePending } from '/@userStores/pending'

export const email = async (to: any, from: any, next: any) => {
  const pending = usePending()
  try {
    if (pending?.emailAddress) {
      if (!to.meta.verification) {
        next({ name: 'verification-email', query: { redirect: to.fullPath } }) // Redirect to email verification
      }else{
        next()
      }
    } else if (!pending?.emailAddress && to.name === 'verification-email') {
      next({ name: 'dashboard' }) // Redirect to dashboard
    }else{
      next() // Proceed to the route
    }

    
  } catch (error) {
    // Handle the error
    console.error(error)
    next(false) // Abort navigation
  }
}

export const phone = async (to: any, from: any, next: any) => {
  const pending = usePending()
  try {
    if (pending?.phoneNumber) {
      if (!to.meta.verification) {
        next({ name: 'verification-phone', query: { redirect: to.fullPath } }) // Redirect to phone verification
      }else{
        next()
      }
    } else if (!pending?.phoneNumber && to.name === 'verification-phone') {
      next({ name: 'dashboard' }) // Redirect to dashboard
    }else{
      next() // Proceed to the route
    }
     
  } catch (error) {
    // Handle the error
    console.error(error)
    next(false) // Abort navigation
  }
}

export const identification = async (to: any, from: any, next: any) => {
  const pending = usePending()
  try {
    if (!pending.identification && to.meta.verificationIdentification) {
      next({ name: 'personal' }) // Redirect to personal area
    }else{
      next() // Proceed to the route
    }
  } catch (error) {
    // Handle the error
    console.error(error)
    next(false) // Abort navigation
  }
}
