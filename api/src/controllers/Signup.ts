
import {Response, Request, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';

import { randomBytes } from 'crypto';

import { errorHandler, AppError } from './../errors/ErrorHandling';
import { SignUpEmailAddress } from '../database/models/SignUpEmailAddress';
import { Languages } from '../database/models/Languages';

import { subscribe, unsubscribe } from '../helpers/communications/Signup';

export default class SignUp {
    
    static async subscribe (req: Request, res: Response, next: NextFunction){
        try {
            const language = await Languages.findOne({  
                                    where:{
                                        iso:req.body.language
                                    },
                                    attributes:['iso']
                                })

            if(!language){
                throw new AppError({message:'language.invalid', statusCode: 400}) 
            }
            

            const token = randomBytes(32).toString('hex');
            
            await SignUpEmailAddress.create({
                email: req.body.email,
                token
            })         

            subscribe(req.body.email, language.iso, token)

            res.send({ message: 'signup.subscribe.success' });

        } catch (error) {
           errorHandler(error, next)
        }
    }  

    static async unsubscribe (req: Request, res: Response, next: NextFunction){
        try {

            const language = await Languages.findOne({  
                where:{
                    iso:req.body.language
                },
                attributes:['iso']
            })

            if(!language){
            throw new AppError({message:'language.invalid', statusCode: 400}) 
            }

            const emailAddress = await SignUpEmailAddress.findOne({
                where:{
                    email: req.body.email,
                    active: true
                }
            })

            const { compareSync } = bcryptjs

            if(!emailAddress || !compareSync(req.body.token, emailAddress.token)){
                throw new AppError({message:'token.invalid', statusCode: 400}) 
            }

            if(emailAddress){
                emailAddress.active = false
                await emailAddress?.save()
            }

            unsubscribe(req.body.email, language.iso)

            res.send({ message: 'signup.unsubscribe.success' });

        } catch (error) {
           errorHandler(error, next)
        }
    }  
}