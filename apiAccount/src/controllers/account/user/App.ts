import {Response, Request, NextFunction } from 'express';

export default class App {

    static async get (req:Request, res: Response, next: NextFunction){
        /*
        const app = await AppHelper.get(req.user.id);

        */
        res.send();
    }
    
    static async update (req:Request, res: Response, next: NextFunction){           
       
    }

}