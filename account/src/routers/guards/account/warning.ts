import { useApiAccount } from '/@src/api/apiAccount'

const apiAccount = useApiAccount()

export const warning = async (to: any, from: any, next: any) => {
    await apiAccount.get('warning')
    .then((response) => {
    })
    .catch((error) => {
    })
    next() // Proceed to the route
}