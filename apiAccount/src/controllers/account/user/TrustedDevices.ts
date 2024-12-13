import { Request, Response, NextFunction } from "express";

import { AuthTrustedDevice } from '../../../database/models/account/AuthTrustedDevice';
import { errorHandler } from '../../../errors/ErrorHandling';


export default class TrustedDevices {

    static async get (req:Request, res: Response, next: NextFunction){
        try {
            const authTrustedDevices = await AuthTrustedDevice.findAll({
                where:{
                    active: true
                },
                include:{
                    association: 'auth',
                    where: {
                        userId: req.user.id,
                    },
                },
                attributes: ['id', 'browser','os', 'ipv4', ['createdAt', 'date']],  
            });
            
            res.send({
                trustedDevices: authTrustedDevices
            });
        } catch (error) {
            errorHandler(error, next)
        }
    }
       
    static async remove (req:Request, res: Response, next: NextFunction){    
        try {
            const { device: deviceId } = req.body;
            const { id: userId } = req.user;

            const authTrustedDevice = await AuthTrustedDevice.findAll({
                where: { 
                    active: true
                },
                include:{
                    association: 'UserAuth',
                    where: {
                        userId: userId
                    }
                },
            });

            const trustedDevice = authTrustedDevice.find(device => device.id === deviceId);
            if (trustedDevice) {
                trustedDevice.active = false;
                await trustedDevice.save();
            }

            const trustedDevices = authTrustedDevice
                .filter(device => device.id !== deviceId)
                .map(device => ({
                    id: device.id,
                    browser: device.browser,
                    os: device.os,
                    date: device.createdAt
                }));

            res.send({
                trustedDevices
            });

        }catch(error){
            errorHandler(error, next)
        }
    }

}