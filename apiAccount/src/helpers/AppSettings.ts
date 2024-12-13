import { AppSettingsAuthentication } from "../database/models/app/AppSettingsAuthentication";
import { AppSettingsContact } from "../database/models/app/AppSettingsContact";
import { AppError } from "../errors/ErrorHandling";

export async function checkContact(type: 'emailAddress' | 'phoneNumber' | 'app') {
    const appSettingsContact = await AppSettingsContact.findOne()

    if(type == 'app'){
       return appSettingsContact.app
    }else if(type == 'emailAddress'){
        return appSettingsContact.emailAddress
    }else if(type == 'phoneNumber'){
        return appSettingsContact.phoneNumber
    }else{
        throw new AppError()
    }
}

export async function checkAuthentication(type: 'login' | 'signup' | 'secondFactor') {
    const appSettingsAuthentication = await AppSettingsAuthentication.findOne()

    if(type == 'login'){
       return appSettingsAuthentication.login
    }else if(type == 'signup'){
        return appSettingsAuthentication.signup
    }else if(type == 'secondFactor'){
        return appSettingsAuthentication.secondFactor
    }else{
        throw new AppError()
    }
}