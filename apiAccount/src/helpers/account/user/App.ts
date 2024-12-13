import { UserApp } from '../../../database/models/account/UserApp';

export async function get (appId: string){
    const userApp = await UserApp.findOne({
        where: 
            {    
            id: appId,
            active : true   
            }
        });
        
    return {app: userApp};
}
