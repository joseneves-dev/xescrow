import { Request, Response, NextFunction } from "express";

import { AuthSession } from '../../../database/models/account/AuthSession';

export default class Sessions {

    static async get (req:Request, res: Response, next: NextFunction){
       
        const authSessions = await AuthSession.findAll({
            include:[
                {
                    association: 'data',
                    attributes : ['ipv4','browser','os'],
                },
                {
                    association: 'auth',
                    where: {
                        userId: req.user.id
                    },
                }
            ],
            attributes:['success','createdAt'],  
            limit:6,
            order: [
                ['createdAt', 'DESC' ]
            ],
        });

        res.send({
            sessions: authSessions
            });

    }
    
    static async report (req:Request, res: Response, next: NextFunction){           
       
    }

}