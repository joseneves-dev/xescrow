import passport from 'passport';
import { Strategy as JWTstrategy } from 'passport-jwt';
import bcryptjs from 'bcryptjs';
import { DateTime } from 'luxon';

import { Op } from '@sequelize/core';

import { AuthSession } from '../../database/models/account/AuthSession';

import { AppError } from '../../errors/ErrorHandling';

const cookieExtractorTfa = function(req) {
    if (req && req.jwtToken && req.jwtToken != null) {
        const token = req.jwtToken;
        return token;
    } else {
        throw new AppError({message:'authentication.notLoggedIn', statusCode:  401});
    }
};

export const secondFactorStrategy = () => {
    passport.use(
        'secondFactor',
        new JWTstrategy(
            {
                secretOrKey: process.env.CLIENT_OTP_JWT,
                jwtFromRequest: cookieExtractorTfa,
            },
            async (payload, done) => {
                try {
                    if (!payload.sessionId || !payload.sessionToken) {
                        return done(new AppError({message: 'server.payload.invalid', statusCode:  401}));
                    }

                    const currentDateTime = DateTime.local()

                    const authSession = await AuthSession.findOne({
                        where: {
                            id: payload.sessionId,
                            active: true
                        },
                        include:{
                            association: 'token',
                            where:{
                                type: 'secondFactor',
                                expires: {
                                    [Op.gte]: currentDateTime
                                },
                                active: true
                            }
                        }
                    });

                    if (!authSession) {
                        return done(new AppError({ message:'authentication.invalid', statusCode: 401}));
                    }
                    
                    const { compareSync } = bcryptjs
            
                    if (!compareSync(payload.sessionToken, authSession.token.token)) {
                        return done(new AppError({ message:'token.invalid', statusCode: 401}));
                    }

                    const data = {
                        session :{
                            id: payload.sessionId,
                        } 
                    }
              
                    return done(null, data);

                } catch (error) {
                    return done(new AppError());
                }
            }
        )
    );
}

export default passport;
