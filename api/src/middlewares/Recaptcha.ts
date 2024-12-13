import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

import { AppError } from '../errors/ErrorHandling';

const verifyRecaptcha = async (req: Request, res: Response, next: NextFunction) => {
  const reCaptcha = req.body.reCaptcha; // assuming the token is sent in the body

  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY, // Your reCAPTCHA secret key
        response: reCaptcha,
      },
    });

    const { success } = response.data;

    if (success) {  
      next(); // Proceed to the next middleware or route handler
    } else {
      throw new AppError({message:'reCAPTCHA.fail', statusCode: 400}) 
    }
  } catch (error) {
    throw new AppError() 
  }
};

export default verifyRecaptcha;