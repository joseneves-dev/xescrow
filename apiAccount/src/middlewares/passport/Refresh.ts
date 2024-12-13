import passport from 'passport';
import { Strategy as JWTstrategy } from 'passport-jwt';
import bcryptjs from 'bcryptjs';
import { DateTime } from 'luxon';

import { Op } from '@sequelize/core';
import { UserAuth } from '../../database/models/account/UserAuth';

import { AppError } from '../../errors/ErrorHandling';

const JwtToken = function(req) {
    if (req && req.jwtToken && req.jwtToken != null) {
        const token = req.jwtToken;
        return token;
    } else {
        throw new AppError({message:'authentication.notLoggedIn', statusCode:  401});
    }
};

export const refreshStrategy = () => {
    passport.use(
        'refresh',
        new JWTstrategy(
            {
                secretOrKey: process.env.CLIENT_REFRESH_JWT,
                jwtFromRequest: JwtToken
            },
            async (payload, done) => {
                try {
                    // Check payload
                    if (!payload.sessionId && !payload.sessionToken) {
                        return done(new AppError({ message:'server.payload.invalid', statusCode: 401}));
                    }

                    const currentDateTime = DateTime.local().toJSDate();

                    const userAuth = await UserAuth.findOne({
                        include: {
                            association: 'session',
                            required:true,
                            where: {
                                id: payload.sessionId,
                                active: true,
                                success: true,
                            },
                            include: {
                                association: 'token',
                                required:true,
                                where: {
                                    type: 'refresh',
                                    expires: {
                                        [Op.gte]: currentDateTime
                                    },
                                    active: true
                                }
                            }
                        }
                    });

                    if (!userAuth) {
                        return done(new AppError({ message:'authentication.invalid', statusCode: 401}));
                    }

                    if (userAuth.status != 'active') {
                        return done(new AppError({ message:'authentication.blocked', statusCode: 401}));
                    }
                    
                    const { compareSync } = bcryptjs

                    if (!compareSync(payload.sessionToken, userAuth.session.token.token)) {
                        return done(new AppError({ message:'authentication.invalid', statusCode: 401}));
                    }

                    const data = {
                        user: {
                            id : userAuth.userId
                        },
                        session:{
                            id: payload.sessionId
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