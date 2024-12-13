import { Request, Response, NextFunction } from "express";

import { UserSettings } from '../../../database/models/account/UserSettings';
import { UserAuth } from '../../../database/models/account/UserAuth';
import { AppTimezones } from '../../../database/models/app/AppTimezones';
import { AppLanguages } from '../../../database/models/app/AppLanguages';

interface settings {
    timezone?: string
    language?: string
    colorSchema?: string
}
export default class Settings {

    static async get (req:Request, res: Response, next: NextFunction){

        const userSettings = await UserSettings.findOne({
            where:{
                userId: req.user.id
            },
            include:[{
                association: 'timezone',
            },{
                association: 'language',
            }],
            order: [
                ['createdAt', 'DESC']
            ] 
        });
                

        const settings = {
                timezone: userSettings.timezone?.name,
                colorSchema: userSettings.colorSchema,
                language: userSettings.language?.iso,
            }   
            
        res.send({
            settings
        });         
    }
    
    static async update (req:Request, res: Response, next: NextFunction){

        const userSettings = await UserSettings.findOne({
                                                where:{
                                                    userId:req.user.id
                                                },
                                                order: [
                                                    ['createdAt', 'DESC']
                                                ] 
                                        })

        let settings:settings = {};

        if (req.body?.timezone !== undefined && userSettings) {
            const timezone = await AppTimezones.findOne({ where: { name: req.body.timezone }});
            if (timezone) {
                userSettings.timezoneId = timezone.id
                userSettings.save()
                settings.timezone = timezone.name;
            }   
        }
       
        if (req.body?.language !== undefined && userSettings) {
            const language = await AppLanguages.findOne({ where: { iso: req.body.language }});
            if (language) {
                userSettings.languageId = language.id
                userSettings.save()
                settings.language = language.iso;
            }
        }

        if (req.body?.colorSchema !== undefined && userSettings) {
            userSettings.colorSchema = req.body.colorSchema
            userSettings.save()
            settings.colorSchema = req.body.colorSchema;
        }
       

        res.send({
            settings
        });
    }

    static async closeAccount (req:Request, res: Response, next: NextFunction){
        const userAuth = await UserAuth.findOne({
            where: { userId: req.user.id }
        });

        userAuth.status = 'close';
        await userAuth.save();

        res.send();
    }
}