import { Request, Response, NextFunction } from "express";

import {get, update, createVerification, verification,} from '../../../helpers/account/user/EmailAddress';
import { errorHandler } from '../../../errors/ErrorHandling';

export default class EmailAddress {

    static async get (req:Request, res: Response, next: NextFunction){
        try {
            const { emailAddress } = await get(req.user.id);

            res.send({
                 emailAddress  
            });

        } catch (error) {
            errorHandler(error, next)
        }
        
    }
    
    static async update (req:Request, res: Response, next: NextFunction){       
        try {

            const { emailAddress } = await update(req.user.id, req.body.email);
            
            res.send({
                emailAddress,
                message: 'emailAddress.update'
            });

        } catch (error) {
            errorHandler(error, next)
        }
    }

    static async verification (req:Request, res: Response, next: NextFunction){
        try {
            const { emailAddress }  = await verification(req.user.id, req.body.token);
                  
            res.send({
                emailAddress,
                message: 'emailAddress.verified'
            });
                         
        } catch (error) {
            errorHandler(error, next)
        }          
    }
 
    static async newVerification (req:Request, res: Response, next: NextFunction){
        try {
            const { emailAddress } = await createVerification(req.user.id);
            
            res.send({
                message: 'token.sent',
                emailAddress,
            });
        } catch (error) {
            errorHandler(error, next)
        }
    }

}