import { useApiAccount } from '/@src/api/apiAccount'

const apiAccount = useApiAccount()
export const session = async (to: any, from: any, next: any) => {
    await apiAccount.get('session')
    .then((response) => {
    })
    .catch((error) => {
    })
    next() // Proceed to the route
}