
import { get as getPhone } from './user/PhoneNumber';
import { get as getApp } from './user/App';
import { get as getUser } from './user/User';

export async function identification (userId: string){
    
    const warning = {};

    const getUserData = await getUser(userId);

    if (getUserData.warning?.identification) {
      warning['identification'] = true;
    }

    const identification =  Object.keys(warning).length ? warning : undefined

    return {
      ...identification 
    }
  }

  export async function contacts (userId) {    
   
      const warning = {};

      const {phoneNumber} = await getPhone(userId);

      if (!phoneNumber) {
        warning['phoneNumber'] = true;
      }
      
      const {app} = await getApp(userId);

      if (!app) {
        warning['app'] = true;
      }

      const contacts =  Object.keys(warning).length ? warning : undefined

    return {
      ...contacts 
    }

  }
