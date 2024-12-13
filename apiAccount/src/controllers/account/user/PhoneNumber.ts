import { Request, Response, NextFunction } from "express";

import { 
    get, 
    create,
    update, 
    verification, 
    createVerification, 
    remove, 
    createRemove 
} from '../../../helpers/account/user/PhoneNumber';

import { errorHandler } from '../../../errors/ErrorHandling';


export default class PhoneNumber {

    static async get (req:Request, res: Response, next: NextFunction){
        try {
            const { phoneNumber } = await get(req.user.id);
            
            res.send({
                phoneNumber,
            });
        } catch (error) {
            errorHandler(error, next)
        }
    }
    
    static async create (req:Request, res: Response, next: NextFunction){
        try {
            
            const { phoneNumber } = await create(req.user.id, req.body.number, req.body.code);

            res.send({
                phoneNumber,
                message: 'phoneNumber.create'
            });

        } catch (error) {
            errorHandler(error, next)
        } 
    }

    static async update (req:Request, res: Response, next: NextFunction){
        try {
            
            const { phoneNumber } = await update(req.user.id, req.body.number, req.body.code);

            res.send({
                phoneNumber,
                message: 'phoneNumber.update'
            });

        } catch (error) {
            errorHandler(error, next)
        } 
    }

    //Verification
    static async verification (req:Request, res: Response, next: NextFunction){     
        try {
            
            const { phoneNumber } = await verification(req.user.id, req.body.token);
              
            res.send({
                message: 'phoneNumber.verified',
                phoneNumber,
            });
            
        } catch (error) {
            errorHandler(error, next)
        }                        
    }
     
    //Generate token verification
    static async newVerification (req:Request, res: Response, next: NextFunction){
        try {
            const { phoneNumber } = await createVerification(req.user.id);
           
            res.send({
                message: 'token.sent',
                phoneNumber,
            });
        } catch (error) {
            errorHandler(error, next)
        }       
    }

    //Remove
    static async remove (req:Request, res: Response, next: NextFunction){     
        try {         
            
            const { phoneNumber } = await remove(req.user.id, req.body.token)
          
            res.send({
                phoneNumber,
                message: "phoneNumber.removed"
            });

        } catch (error) {
            errorHandler(error, next)
        }   
                                 
    }

    //Generate token remove
    static async newRemove (req:Request, res: Response, next: NextFunction) {
        try {
            const { phoneNumber } = await createRemove(req.user.id);
            
            res.send({
                message:'token.sent',
                phoneNumber,
            });
            
        } catch (error) {
            errorHandler(error, next)
        }       
    }
}