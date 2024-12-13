import { Request, Response, NextFunction } from 'express';
import { verification } from '../../helpers/account/Pending';
import { AppError } from '../../errors/ErrorHandling';

export const pendingVerification = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const { emailAddress, phoneNumber } = await verification(req.user.id);
        if (emailAddress || phoneNumber) {
            throw new AppError({message:'pending.verifications'});
        }
        next();
    } catch (err) {
        next(err);
    }
};
