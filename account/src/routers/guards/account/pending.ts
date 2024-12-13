import { useApiAccount } from '/@src/api/apiAccount'

const apiAccount = useApiAccount()

export const pending = async (to: any, from: any, next: any) => {
    await apiAccount.get('pending')
    .then((response) => {
    })
    .catch((error) => {
    })
    next() // Proceed to the route
}