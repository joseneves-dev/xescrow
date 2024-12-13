import { Request, Response, NextFunction } from "express";

import { contacts, identification } from '../../helpers/account/Warning';

export default class Warning {

    static async get (req:Request, res: Response, next: NextFunction){
       
        const warningContacts = await contacts(req.user.id)
        const warningIdentification = await identification(req.user.id)

        const warning = {
            ...warningContacts,
            ...warningIdentification
        }
        
        res.send({
            warning,
        });   
    }
}