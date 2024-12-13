import {Response, Request, NextFunction } from 'express';

import { get } from '../../../helpers/account/user/User';

export default class Identification {

    static async personal (req:Request, res: Response, next: NextFunction) {

        const { pending, warning, identity, residence} = await get(req.user.id);

        res.send({
            pending,
            user:{
                identity,
                residence,
                warning
            }   
        });
    }
}