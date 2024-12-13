
import {Response, Request, NextFunction } from 'express';

import { errorHandler } from '../../errors/ErrorHandling';

import { AppSettings } from '../../database/models/app/AppSettings';

export default class Settings {
    
    static async get (req: Request, res: Response, next: NextFunction){
        try {
            const appSettings = await AppSettings.findAll({
                                            include:[{
                                                association: 'contact',
                                                attributes:['emailAddress', 'phoneNumber', 'app']
                                            },{
                                                association: 'authentication',
                                                attributes:['signup', 'login', 'secondFactor']
                                            }],
                                            
                                        })

            res.send({ appSettings });

        } catch (error) {
           errorHandler(error, next)
        }

    }
    
}