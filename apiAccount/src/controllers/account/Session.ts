import  {Response, Request, NextFunction } from 'express';

export default class Session {

    static async get (req:Request, res: Response, next: NextFunction){
        try {

        const session = {
               expires: 300
            };

        res.send({
            session,
        });   

    } catch (error) {
    }
}

}