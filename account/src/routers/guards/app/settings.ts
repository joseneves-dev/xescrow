import { useApi } from '/@src/api/api'
const api = useApi()

export const settings = async (to: any, from: any, next: any) => {
    await api.get('app/settings')
    .then((response) => {
    }).catch((error) => {
    })
    next()
}

export const languages = async (to: any, from: any, next: any) => {
    await api.get('app/languages')
    .then((response) => {
    }).catch((error) => {
    })
    next()
}

export const countries = async (to: any, from: any, next: any) => {
    await api.get('app/countries')
    .then((response) => {
    }).catch((error) => {
    })
    next()
}

export const timezones = async (to: any, from: any, next: any) => {
    await api.get('app/timezones')
    .then((response) => {
    }).catch((error) => {
    })
    next()
}

export const currencies = async (to: any, from: any, next: any) => {
    await api.get('app/currencies')
    .then((response) => {
    }).catch((error) => {
    })
    next()
}

export const blockchain = async (to: any, from: any, next: any) => {
    await api.get('app/blockchains')
    .then((response) => {
    }).catch((error) => {
    })
    next()
}

