import {Response, Request, NextFunction } from 'express';

import { verification } from '../../helpers/account/Pending';

export default class Pending {

    static async get (req:Request, res: Response, next: NextFunction){
     
        const pendingVerification = await verification(req.user.id)

        const pending = {
            ...pendingVerification,
        }
        

        res.send({
            pending,
        });   
    }

}