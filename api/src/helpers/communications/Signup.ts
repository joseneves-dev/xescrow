import nodemailer from 'nodemailer'
import i18next from '../../utils/i18n'; 

import { AppError } from '../../errors/ErrorHandling';

const transporter = nodemailer.createTransport({
    host: process.env.AWS_SES_ENDPOINT, // Replace with your SES region's SMTP endpoint
    port: 465, // Use port 587 or 465
    secure: true, // True for port 465, false for others
    auth: {
      user: process.env.AWS_SES_SMTP_USER,
      pass: process.env.AWS_SES_SMTP_PASS,
    }
  });


  
export async function subscribe (to: string, language: string, token: string){
    
    i18next.changeLanguage(language);

    const mailOptions = {
        from: 'no-reply@xescrow.app', 
        to: to, 
        subject: i18next.t('email.subscribe.subject'),
        html: `
            <h1>${i18next.t('email.subscribe.welcome')}</h1>
            <p>${i18next.t('email.subscribe.thankYou')}</p>
            <p>${i18next.t('email.subscribe.ignore')}</p>
            <a href="https://xescrow.app/unsubscribe/${token}"><small>${i18next.t('email.subscribe.unsubscribe')}</small></a>
            `
      };
    
      try {
        const info = await transporter.sendMail(mailOptions);
        return info.response;
      } catch (error) {
        throw new AppError() 
      }
}

export async function unsubscribe (to: string, language: string){
    
    i18next.changeLanguage(language);

    const mailOptions = {
        from: 'no-reply@xescrow.app',
        to: to, 
        subject: i18next.t('email.unsubscribe.subject'),
        html : `
                <h1>${i18next.t('email.unsubscribe.goodbye')}</h1>
                <p>${i18next.t('email.unsubscribe.successfully')}</p>
                <p>${i18next.t('email.unsubscribe.contactUs')}</p>
            `
      };
    
      try {
        const info = await transporter.sendMail(mailOptions);
        return info.response;
      } catch (error) {
        throw new AppError() 
      }
}