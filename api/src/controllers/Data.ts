
import {Response, Request, NextFunction } from 'express';

import { errorHandler } from './../errors/ErrorHandling';

import { Languages } from '../database/models/Languages';
import { Timezones } from '../database/models/Timezones';
import { Countries } from '../database/models/Countries';
import { Currencies } from '../database/models/Currencies';
import { Blockchains } from '../database/models/Blockchains';

export default class Data {
    
    static async countries (req: Request, res: Response, next: NextFunction){
        try {
            const countries = await Countries.findAll({attributes:['name', 'code']})

            res.send({ countries });

        } catch (error) {
           errorHandler(error, next)
        }

    }
        
    static async timezones (req: Request, res: Response, next: NextFunction){
        try {
            
            const timezones = await Timezones.findAll({
                                        attributes:['name', 'abbreviation', 'offset']
                                    })
              
            res.send({timezones});

        } catch (error) {
           errorHandler(error, next)
        }

    }

    static async languages (req: Request, res: Response, next: NextFunction){
       
        const languages = await Languages.findAll({attributes:['name', 'iso']})

        try {
             
            res.send({languages});

        } catch (error) {
           errorHandler(error, next)
        }

    }

    static async blockchains (req: Request, res: Response, next: NextFunction){

        const blockchains = await Blockchains.findAll({
                                        attributes:['programId','decimals'],
                                        include:[{
                                            association: 'metaData',
                                            attributes:['name', 'symbol'],
                                        },{
                                            association: 'tokens',
                                            attributes:['mint', 'programId', 'mintAutority','decimals'],
                                            as: 'tokens',
                                            include:{
                                                association: 'metaData',
                                                attributes:['name', 'symbol'],
                                            }
                                        }]
                                    })

        try {
            res.send({blockchains});

        } catch (error) {
           errorHandler(error, next)
        }

    }
    
    static async currencies (req: Request, res: Response, next: NextFunction){

        const currencies = await Currencies.findAll({
                                    attributes:['id', 'name', 'symbol']
                                })

        try {
         
            res.send({currencies});

        } catch (error) {
           errorHandler(error, next)
        }

    }
}