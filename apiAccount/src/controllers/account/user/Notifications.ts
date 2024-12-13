import { Request, Response, NextFunction } from 'express';

import { UserNotificationsAccount } from '../../../database/models/account/UserNotificationsAccount';
import { UserNotificationsMarketing } from '../../../database/models/account/UserNotificationsMarketing';

import { errorHandler } from '../../../errors/ErrorHandling';


export default class Notifications {

    static async get (req:Request, res: Response, next: NextFunction){
        try{
            const userNotificationsAccount = await UserNotificationsAccount.findOne({
                where:{
                    userId: req.user.id
                },
                attributes: ['verifications', 'login', 'updates'],
            });

            const userNotificationsMarketing = await UserNotificationsMarketing.findOne({
                where:{
                    userId: req.user.id
                },
                attributes: ['email', 'phone', 'app', 'partners'],
            });
    
            res.send({
                notifications : {
                    account: userNotificationsAccount,
                    marketing: userNotificationsMarketing
                }
                
            });   
        } catch (error) {
           errorHandler(error, next)
        }           
    }
    
    static async updateAccount (req:Request, res: Response, next: NextFunction){
        try {
            const userNotificationsAccount = await UserNotificationsAccount.findOne({
                where:{
                    userId: req.user.id
                },
                attributes: ['id','verifications', 'login', 'updates'],
            });

            const columnToUpdate = req.body.property;
        
            const currentColumnValue = userNotificationsAccount[columnToUpdate];
            const newColumnValue = !currentColumnValue; 

            await userNotificationsAccount.update({
                [columnToUpdate]: newColumnValue,
            });

            const notificationsAccount = userNotificationsAccount?.get({plain:true})
            delete notificationsAccount.id

            res.send({
                notifications : { 
                    account: notificationsAccount
                },
                message: "pages.notifications.account.updated"
            });  
        } catch (error) {
           errorHandler(error, next)
        }             
    }

    static async updateMarketing (req:Request, res: Response, next: NextFunction){
        try{
            const userNotificationsMarketing = await UserNotificationsMarketing.findOne({
                where:{
                    userId: req.user.id
                },
                attributes: ['id','email', 'phone', 'app', 'partners'],
            });

            const columnToUpdate = req.body.property;

            const currentColumnValue = userNotificationsMarketing[columnToUpdate];
            const newColumnValue = !currentColumnValue;

            await userNotificationsMarketing.update({
                [columnToUpdate]: newColumnValue,
            });     

            const notificationsMarketing = userNotificationsMarketing?.get({plain:true})
            delete notificationsMarketing.id

            res.send({
                notifications : { 
                    marketing: notificationsMarketing
                },
                message: "pages.notifications.marketing.updated"
            });     
        } catch (error) {
           errorHandler(error, next)
        }    
    }
}