import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto'

import { SessionToken } from '../database/models/account/SessionToken';
import { OneTimeToken } from '../database/models/account/OneTimeToken';
import { set } from '../helpers/Redis';
import { OneTimeNotification } from '../database/models/account/OneTimeNotification';

export async function access(userId: string, sessionId: string) {

        const sessionToken = randomBytes(32).toString('hex');
    
        await SessionToken.create({
            sessionId: sessionId,
            type: 'access',
            token: sessionToken,
            active: true
        });

        const jwtSign = jwt.sign(
            {
                sessionId,
                userId,
                sessionToken,
            },
            process.env.CLIENT_ACCESS_JWT,
            { expiresIn: '5m' } // 5min    
        );

        const jwtToken = await set(jwtSign, 300);

        return { jwtToken };
    }

export async function refresh(sessionId: string) {

        const sessionToken = randomBytes(32).toString('hex');
       
        await SessionToken.create({
            sessionId: sessionId,
            type: 'refresh',
            token: sessionToken,
            active: true
        });

        const jwtSign = jwt.sign(
            {
                sessionId,
                sessionToken
            },
            process.env.CLIENT_REFRESH_JWT,
            { expiresIn: '2h' } // 2h  
        );

        const jwtToken = await set(jwtSign, 7200);

        return { jwtToken };
    }

    export async function secondFactor(sessionId: string, method: 'emailAddress' | 'phoneNumber' | 'app', expiresIn: number = 600) {
        const sessionToken = randomBytes(32).toString('hex');

        await SessionToken.create({
            sessionId: sessionId,
            type: 'secondFactor',
            token: sessionToken,
            active: true
        });

        let token: string

        if (method == 'app') {
            await OneTimeNotification.create({
                dataId: sessionId,
            });

        }else if(method == 'emailAddress'){
            token = (Math.floor(Math.random() * 900000) + 100000).toString();
            
            await OneTimeToken.create({
                dataId: sessionId,
                token: token.toString()
            });
        }else if(method =='phoneNumber'){
            token = (Math.floor(Math.random() * 900000) + 100000).toString();

            await OneTimeToken.create({
                dataId: sessionId,
                token: token.toString()
            });
        }

        const jwtSign = jwt.sign(
            {
                sessionId,
                sessionToken,
            },
            process.env.CLIENT_OTP_JWT,
            { expiresIn: expiresIn + 's' } //5min
        );

        const jwtToken = await set(jwtSign, expiresIn);

        return { jwtToken, token };
    }

    export async function trustDevice(trusteDeviceId: string, expiresIn = 2592000000) {
        //30days token

        const jwtSign = jwt.sign(
            {
                trustDeviceId: trusteDeviceId,
            },
            process.env.CLIENT_TRUSTDEVICE_JWT,
            { expiresIn: expiresIn + 's' } //30 days
        );

        const jwtToken = await set(jwtSign, expiresIn);

        return { jwtToken };
    }