import { useApi } from '/@src/api/api'
const api = useApi()

export const languages = async (to: any, from: any, next: any) => {
  try {
    await api.get('data/languages')
    next() // Proceed to the route
  } catch (error) {
    // Handle the error
    next() 
  }
}


