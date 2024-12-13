import { useApiAccount } from '/@src/api/apiAccount'

const apiAccount = useApiAccount()
export const settings = async (to: any, from: any, next: any) => {
    await apiAccount.get('user/settings')
                .then((response) => {
                })
                .catch((error) => {
                })
    next() // Proceed to the route 
}
