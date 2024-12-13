
import { UserResidence } from '../../../database/models/account/UserResidence';
import { UserIdentity } from '../../../database/models/account/UserIdentity';

interface warning {
    identification: boolean
}

interface pending {
    identity: identity
    residence: residence
}

interface identity {
    upload?: boolean
    review?: boolean
    verified?: boolean
    fullName?: string
    dob?: Date
    nationalaty?: string
}
interface residence {
    upload?: boolean
    review?: boolean
    verified?: boolean
    contry?: string
    address1?: string,
    address2?: string,
    areaLvl1?: string,
    areaLvl2?: string,
    areaLvl3?: string,
    zipCode?: string,
}
export async function get (userId: string){
        try {
           
            const userResidence = await UserResidence.findOne({
                where: {
                    userId: userId,
                    active: true
                }, 
                include: 
                    {
                        association: 'verification',
                    },
                    order: [
                        ['verification','createdAt', 'DESC']
                    ]
            });

            const userIdentity = await UserIdentity.findOne({
                where: {
                    userId: userId,
                    active: true
                }, 
                include:[{
                        association: 'verification',
                    },{
                        association: 'country'
                    }],
                    order: [
                        ['verification','createdAt', 'DESC']
                    ]
            });

            let identity:identity, residence:residence, warning:warning, pending:pending;

            if(userIdentity && userIdentity.verification &&  userResidence && userResidence.verification)  {
           
                
                if(userIdentity.verification){
                    identity = { 
                        upload: userIdentity.verification.upload,
                        review : userIdentity.verification.review,
                        verified: userIdentity.verified, 
                    }
                }

                if(userResidence.verification){
                    residence = { 
                        upload: userResidence.verification.upload,
                        review : userResidence.verification.review,
                        verified: userResidence.verified,
                    }
                }
               
                    pending = {
                        identity,
                        residence
                    }

                if(userIdentity){                
                    identity = {
                        fullName: userIdentity.fullName,
                        dob: userIdentity.dob,
                        nationalaty: userIdentity.country.name,
                        verified: userIdentity.verified,
                    }   
                }
                
                if(userResidence)  {
                    residence =  {
                        contry: userResidence.country.name,
                        address1: userResidence.address1,
                        address2: userResidence.address2,
                        areaLvl1: userResidence.address1,
                        areaLvl2: userResidence.areaLvl2,
                        areaLvl3: userResidence.areaLvl3,
                        zipCode: userResidence.zipCode,
                        verified: userResidence.verified,
                    }    
                }

            }else{            
                warning = {identification : true}
            }
    
            return { identity, residence, pending, warning };

        } catch (error) {
            throw error
        }
    }